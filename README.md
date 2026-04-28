# Unbiased AI

<div align="center">
  <img src="frontend/src/assets/hero.png" alt="Unbiased AI Banner" width="800"/>
</div>

<p align="center">
  <strong>Enterprise-Grade Bias Detection, Mitigation, and Certification Platform</strong>
</p>

## 📖 Overview

**Unbiased AI** is a powerful platform engineered to detect, analyze, and mitigate algorithmic biases in machine learning datasets and models. Designed with a premium, Apple-inspired interface, the platform offers an intuitive Auditor Hub where data scientists and compliance officers can securely analyze hiring datasets, visualize demographic disparities, and apply state-of-the-art mitigation techniques.

The platform provides an end-to-end audit workflow—from data ingestion and bias quantification (using Fairlearn & AIF360) to explainability (SHAP & LIME) and conversational insights powered by a Gemini-based AI Auditor.

## ✨ Key Features

- **Automated Bias Detection:** Quantify disparate impact, demographic parity, and equal opportunity differences across sensitive attributes.
- **Intelligent Mitigation Engine:** Apply cutting-edge bias mitigation algorithms to transform datasets while preserving model utility.
- **Explainable AI (XAI):** Deep dive into model decisions using integrated SHAP and LIME visual explanations.
- **Conversational Auditor:** Interact with an intelligent Gemini-powered chatbot to interpret complex bias metrics and get actionable recommendations.
- **Secure Auditor Hub:** Persistent, secure user authentication (JWT) and audit history tracking powered by a PostgreSQL database.
- **Premium Apple-Style UI:** A highly polished, responsive interface built with React, Vite, Framer Motion, and Recharts, featuring immersive glassmorphism and smooth micro-animations.

## 🛠️ Technology Stack

### Frontend
- **Framework:** React 19 (TypeScript) + Vite
- **Styling:** CSS Modules / Vanilla CSS (Glassmorphism & Dark Mode)
- **Animations:** Framer Motion
- **Data Visualization:** Recharts
- **Icons:** Lucide React

### Backend
- **Framework:** FastAPI (Python)
- **Bias & Fairness:** Fairlearn, AIF360
- **Explainability:** SHAP, LIME
- **Data Processing:** Pandas, NumPy, Scikit-Learn
- **LLM Integration:** Google Generative AI (Gemini API)
- **Database:** SQLAlchemy (PostgreSQL / MySQL)
- **Security:** JWT (python-jose, passlib)

---

## 🚀 Getting Started

### Prerequisites
- **Node.js** (v18 or higher)
- **Python** (v3.10 or higher)
- **PostgreSQL** database instance
- **Gemini API Key** from Google AI Studio

### 1. Clone the Repository
```bash
git clone https://github.com/AdityaPathare46/Unbiased_AI.git
cd Unbiased_AI
```

### 2. Backend Setup
Navigate to the backend directory and set up your Python environment:
```bash
cd backend
python -m venv venv
source venv/bin/activate  # On Windows: venv\Scripts\activate
pip install -r requirements.txt
```

Create a `.env` file in the `backend` directory with the following configuration:
```env
# Database Configuration
DATABASE_URL=postgresql://user:password@localhost/unbiased_db

# Security
SECRET_KEY=your_super_secret_key
ALGORITHM=HS256
ACCESS_TOKEN_EXPIRE_MINUTES=30

# LLM Configuration
GEMINI_API_KEY=your_gemini_api_key
```

Run the FastAPI server:
```bash
uvicorn main:app --reload --port 8000
```

### 3. Frontend Setup
Open a new terminal, navigate to the frontend directory, and install dependencies:
```bash
cd frontend
npm install
```

Start the Vite development server:
```bash
npm run dev
```
The frontend should now be running on `http://localhost:5173`.

---

## 🏗️ Project Architecture
```text
Unbiased_AI/
├── backend/                  # FastAPI Application
│   ├── api/                  # API Routers (Auth, Data, Audit)
│   ├── engines/              # Core Logic (Bias Engine, Mitigation Engine)
│   ├── services/             # Integrations (Gemini Service, Auth Service)
│   ├── models.py             # SQLAlchemy DB Models
│   └── main.py               # Application Entrypoint
├── frontend/                 # React UI
│   ├── src/
│   │   ├── components/       # Reusable UI Components (AuthView, AuditWizard, etc.)
│   │   ├── assets/           # Static Assets
│   │   └── index.css         # Global Styles & Design System Tokens
│   └── package.json
└── .gitignore
```

## 📜 License

This project is proprietary and confidential. Unauthorized copying, distribution, or use is strictly prohibited.
