import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Upload, ArrowRight, ShieldCheck, FileSpreadsheet } from 'lucide-react';

interface AuditWizardProps {
  onStart: (file: File | null, dbUrl: string, query: string, target: string, protectedAttr: string, industry: string) => void;
  status: string;
}

const AuditWizard: React.FC<AuditWizardProps> = ({ onStart, status }) => {
  const [step, setStep] = useState(1);
  const [inputType, setInputType] = useState<'file' | 'db'>('file');
  const [file, setFile] = useState<File | null>(null);
  const [dbUrl, setDbUrl] = useState('');
  const [query, setQuery] = useState('');
  const [target, setTarget] = useState('');
  const [protectedAttr, setProtectedAttr] = useState('');
  const [industry, setIndustry] = useState('generic');

  const handleFile = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files?.[0]) setFile(e.target.files[0]);
  };

  const nextStep = () => {
    const isDataReady = inputType === 'file' ? !!file : (!!dbUrl && !!query);
    if (step === 2 && isDataReady && target && protectedAttr) {
      onStart(file, dbUrl, query, target, protectedAttr, industry);
      setStep(3);
    } else {
      setStep(step + 1);
    }
  };

  return (
    <div className="glass-card animate-slide-up" style={{ maxWidth: '600px', margin: '60px auto', padding: '40px' }}>
      <AnimatePresence mode="wait">
        {step === 1 && (
          <motion.div key="step1" initial={{ opacity: 0, x: 20 }} animate={{ opacity: 1, x: 0 }} exit={{ opacity: 0, x: -20 }}>
            <div style={{ textAlign: 'center', marginBottom: '32px' }}>
               <FileSpreadsheet size={48} color="var(--apple-vibrant-blue)" style={{ marginBottom: '16px' }} />
               <h2 style={{ fontSize: '24px', fontWeight: 700 }}>Choose your dataset</h2>
               <p style={{ color: 'var(--apple-text-muted)' }}>Securely ingest data for ethical auditing.</p>
            </div>

            <div style={{ display: 'flex', background: 'rgba(255,255,255,0.05)', padding: '4px', borderRadius: '12px', marginBottom: '24px' }}>
               <button 
                onClick={() => setInputType('file')}
                style={{ flex: 1, padding: '10px', borderRadius: '8px', border: 'none', background: inputType === 'file' ? 'var(--apple-grey-700)' : 'transparent', color: 'white', cursor: 'pointer', transition: 'all 0.2s' }}
               >
                 File Upload
               </button>
               <button 
                onClick={() => setInputType('db')}
                style={{ flex: 1, padding: '10px', borderRadius: '8px', border: 'none', background: inputType === 'db' ? 'var(--apple-grey-700)' : 'transparent', color: 'white', cursor: 'pointer', transition: 'all 0.2s' }}
               >
                 Database
               </button>
            </div>
            
            {inputType === 'file' ? (
              <div 
                style={{ border: '1px dashed var(--glass-border)', padding: '60px', borderRadius: '12px', textAlign: 'center', cursor: 'pointer', background: 'rgba(255,255,255,0.02)' }}
                onClick={() => document.getElementById('auditor-upload')?.click()}
              >
                <Upload size={32} color="var(--apple-text-muted)" style={{ marginBottom: '12px' }} />
                <p style={{ fontWeight: 500 }}>{file ? file.name : 'Select Dataset (.csv, .xlsx, .json, .parquet)'}</p>
                <input type="file" id="auditor-upload" hidden accept=".csv,.xlsx,.xls,.json,.parquet" onChange={handleFile} />
              </div>
            ) : (
              <div style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
                <div style={{ marginBottom: '4px' }}>
                   <label style={{ display: 'block', fontSize: '13px', color: 'var(--apple-text-muted)', marginBottom: '8px' }}>Connection URI</label>
                   <input 
                     className="glass-card" 
                     style={{ width: '100%', padding: '12px', background: 'rgba(255,255,255,0.05)' }} 
                     placeholder="postgresql://user:pass@host:port/db"
                     value={dbUrl}
                     onChange={(e) => setDbUrl(e.target.value)}
                   />
                </div>
                <div>
                   <label style={{ display: 'block', fontSize: '13px', color: 'var(--apple-text-muted)', marginBottom: '8px' }}>SQL Query</label>
                   <textarea 
                     className="glass-card" 
                     style={{ width: '100%', padding: '12px', background: 'rgba(255,255,255,0.05)', minHeight: '100px', resize: 'vertical' }} 
                     placeholder="SELECT * FROM my_table LIMIT 1000"
                     value={query}
                     onChange={(e) => setQuery(e.target.value)}
                   />
                </div>
              </div>
            )}

            <button 
              className="btn-apple" 
              style={{ width: '100%', marginTop: '32px', display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '8px' }}
              onClick={nextStep}
              disabled={inputType === 'file' ? !file : (!dbUrl || !query)}
            >
              Continue <ArrowRight size={18} />
            </button>
          </motion.div>
        )}

        {step === 2 && (
          <motion.div key="step2" initial={{ opacity: 0, x: 20 }} animate={{ opacity: 1, x: 0 }} exit={{ opacity: 0, x: -20 }}>
            <h2 style={{ fontSize: '20px', fontWeight: 700, marginBottom: '24px' }}>Define Audit Context</h2>
            
            <div style={{ marginBottom: '20px' }}>
               <label style={{ display: 'block', fontSize: '13px', color: 'var(--apple-text-muted)', marginBottom: '8px' }}>Target Variable (y)</label>
               <input 
                 className="glass-card" 
                 style={{ width: '100%', padding: '12px', background: 'rgba(255,255,255,0.05)' }} 
                 placeholder="e.g., hired, loan_approved"
                 value={target}
                 onChange={(e) => setTarget(e.target.value)}
               />
            </div>

            <div style={{ marginBottom: '20px' }}>
               <label style={{ display: 'block', fontSize: '13px', color: 'var(--apple-text-muted)', marginBottom: '8px' }}>Protected Attribute</label>
               <input 
                 className="glass-card" 
                 style={{ width: '100%', padding: '12px', background: 'rgba(255,255,255,0.05)' }} 
                 placeholder="e.g., gender, race, age"
                 value={protectedAttr}
                 onChange={(e) => setProtectedAttr(e.target.value)}
               />
            </div>

            <div style={{ marginBottom: '32px' }}>
               <label style={{ display: 'block', fontSize: '13px', color: 'var(--apple-text-muted)', marginBottom: '8px' }}>Industry Context</label>
               <select 
                 className="glass-card" 
                 style={{ width: '100%', padding: '12px', background: 'rgba(255,255,255,0.05)', color: 'white' }} 
                 value={industry}
                 onChange={(e) => setIndustry(e.target.value)}
               >
                  <option value="generic">General Purpose</option>
                  <option value="hiring">Corporate Hiring / HR</option>
                  <option value="finance">Banking & Lending</option>
                  <option value="healthcare">Healthcare & Patient Outcomes</option>
               </select>
            </div>

            <div style={{ display: 'flex', gap: '12px' }}>
               <button className="btn-apple" style={{ flex: 1, background: 'var(--apple-grey-700)' }} onClick={() => setStep(1)}>Back</button>
               <button className="btn-apple" style={{ flex: 2 }} onClick={nextStep} disabled={!target || !protectedAttr}>
                  Initiate Deep Audit
               </button>
            </div>
          </motion.div>
        )}

        {step === 3 && (
          <motion.div key="step3" initial={{ opacity: 0 }} animate={{ opacity: 1 }} style={{ textAlign: 'center', padding: '40px 0' }}>
             <motion.div 
               animate={{ rotate: 360 }} 
               transition={{ repeat: Infinity, duration: 2, ease: "linear" }}
               style={{ width: '64px', height: '64px', border: '4px solid var(--apple-vibrant-blue)', borderTopColor: 'transparent', borderRadius: '50%', margin: '0 auto 24px' }}
             />
             <h2 style={{ fontSize: '24px', fontWeight: 700, marginBottom: '12px' }}>{status}</h2>
             <p style={{ color: 'var(--apple-text-muted)' }}>Securely processing ethical boundaries...</p>
             <div style={{ marginTop: '32px', display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '8px', color: 'var(--apple-vibrant-blue)', fontSize: '14px' }}>
                <ShieldCheck size={18} />
                <span>Privacy Shield Active</span>
             </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
};

export default AuditWizard;
