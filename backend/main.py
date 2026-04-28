from fastapi import FastAPI, UploadFile, File, Form, BackgroundTasks, Depends, HTTPException, status
from fastapi.middleware.cors import CORSMiddleware
from sqlalchemy.orm import Session
import pandas as pd
import io
import uuid
from typing import Dict
from engines.bias_engine import BiasDetectionEngine
from engines.xai_engine import XAIEngine
from engines.mitigation_engine import MitigationEngine
from engines.adversarial_engine import AdversarialEngine
from services.gemini_service import GeminiService
from services.privacy_service import PrivacyService
from services.report_service import ReportService
from services.data_service import DataService
from services.auth_service import AuthService
from database import engine, get_db, Base
import models
from sklearn.ensemble import RandomForestClassifier
from typing import Optional
from datetime import datetime
import uvicorn
import json

# Initialize database tables
models.Base.metadata.create_all(bind=engine)

app = FastAPI(title="Unbiased AI 2.0")

app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_methods=["*"],
    allow_headers=["*"],
)

# Global state for background jobs
jobs: Dict[str, dict] = {}

bias_engine = BiasDetectionEngine()
xai_engine = XAIEngine()
mitigation_engine = MitigationEngine()
adversarial_engine = AdversarialEngine()
gemini_service = GeminiService()
privacy_service = PrivacyService()
report_service = ReportService()
data_service = DataService()
auth_service = AuthService()

# Auth Helpers
async def get_current_user(db: Session = Depends(get_db), token: str = Form(...)):
    payload = auth_service.decode_token(token)
    if not payload:
        raise HTTPException(status_code=status.HTTP_401_UNAUTHORIZED, detail="Invalid session")
    user = db.query(models.User).filter(models.User.email == payload.get("sub")).first()
    if not user:
        raise HTTPException(status_code=status.HTTP_401_UNAUTHORIZED, detail="User not found")
    return user

@app.post("/auth/register")
async def register(
    full_name: str = Form(...),
    email: str = Form(...),
    password: str = Form(...),
    db: Session = Depends(get_db)
):
    db_user = db.query(models.User).filter(models.User.email == email).first()
    if db_user:
        return {"error": "Email already registered"}
    
    hashed_password = auth_service.get_password_hash(password)
    new_user = models.User(full_name=full_name, email=email, hashed_password=hashed_password)
    db.add(new_user)
    db.commit()
    db.refresh(new_user)
    
    token = auth_service.create_access_token(data={"sub": new_user.email})
    return {
        "access_token": token,
        "token_type": "bearer",
        "user": {"email": new_user.email, "full_name": new_user.full_name}
    }

@app.post("/auth/login")
async def login(
    email: str = Form(...),
    password: str = Form(...),
    db: Session = Depends(get_db)
):
    user = db.query(models.User).filter(models.User.email == email).first()
    if not user or not auth_service.verify_password(password, user.hashed_password):
        return {"error": "Incorrect email or password"}
    
    token = auth_service.create_access_token(data={"sub": user.email})
    return {
        "access_token": token,
        "token_type": "bearer",
        "user": {"email": user.email, "full_name": user.full_name}
    }

@app.get("/")
async def root():
    return {"message": "Unbiased AI 2.0 Backend is active."}

async def process_audit(job_id: str, df: pd.DataFrame, target: str, protected_attribute: str, industry: str):
    try:
        jobs[job_id]["status"] = "Privacy Screening..."
        df_masked, privacy_info = privacy_service.anonymize_dataset(df)
        
        jobs[job_id]["status"] = "Calculating Fairness Metrics..."
        metrics = bias_engine.check_structured_bias(df_masked, target, protected_attribute, industry)
        
        jobs[job_id]["status"] = "Detecting Adversarial Proxies..."
        proxies = adversarial_engine.detect_proxy_variables(df_masked, protected_attribute)
        
        jobs[job_id]["status"] = "Generating AI Auditor Insights..."
        report = await gemini_service.generate_bias_report(metrics, target)
        
        jobs[job_id]["status"] = "Finalizing Recommendations..."
        suggestions = mitigation_engine.suggest_strategies(metrics)
        
        jobs[job_id]["result"] = {
            "metrics": metrics,
            "privacy": privacy_info,
            "proxies": proxies,
            "ai_report": report,
            "recommendations": suggestions,
            "metadata": {
                "rows": len(df),
                "cols": len(df.columns),
                "target": target,
                "protected": protected_attribute,
                "timestamp": datetime.now().strftime("%Y-%m-%d %H:%M:%S"),
                "audit_id": job_id[:8].upper(),
                "industry": industry
            }
        }
        
        # Add high-integrity summary
        jobs[job_id]["result"]["summary"] = report_service.generate_summary(jobs[job_id]["result"])
        
        jobs[job_id]["status"] = "Completed"
    except Exception as e:
        jobs[job_id]["status"] = "Failed"
        jobs[job_id]["error"] = str(e)

@app.post("/audit/start")
async def start_audit(
    background_tasks: BackgroundTasks,
    file: Optional[UploadFile] = File(None), 
    db_url: Optional[str] = Form(None),
    query: Optional[str] = Form(None),
    target: str = Form(...), 
    protected_attribute: str = Form(...),
    industry: str = Form("generic")
):
    job_id = str(uuid.uuid4())
    
    try:
        if file:
            contents = await file.read()
            df = data_service.load_from_file(contents, file.filename)
        elif db_url and query:
            df = data_service.load_from_sql(db_url, query)
        else:
            return {"error": "Missing data source. Provide a file or database connection details."}
        
        jobs[job_id] = {"status": "Queued", "result": None}
        background_tasks.add_task(process_audit, job_id, df, target, protected_attribute, industry)
        return {"job_id": job_id}
        
    except Exception as e:
        return {"error": f"Data Loading Failed: {str(e)}"}

@app.get("/audit/status/{job_id}")
async def get_status(job_id: str):
    return jobs.get(job_id, {"status": "Not Found"})

@app.post("/chat")
async def chat_with_auditor(user_id: str = Form(...), message: str = Form(...), context: str = Form(...)):
    audit_ctx = json.loads(context)
    response = await gemini_service.get_conversational_response(user_id, message, audit_ctx)
    return {"response": response}

@app.post("/remediate")
async def generate_code(strategy: str = Form(...), features: str = Form(...)):
    feature_list = features.split(",")
    code = await gemini_service.generate_mitigation_code(strategy, feature_list)
    return {"code": code}

if __name__ == "__main__":
    uvicorn.run(app, host="0.0.0.0", port=8000)
