import React, { useState } from 'react';
import { Upload } from 'lucide-react';

interface UploadSectionProps {
  onUpload: (file: File, target: string, protectedAttr: string) => void;
  loading: boolean;
}

const UploadSection: React.FC<UploadSectionProps> = ({ onUpload, loading }) => {
  const [file, setFile] = useState<File | null>(null);
  const [target, setTarget] = useState('');
  const [protectedAttr, setProtectedAttr] = useState('');

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      setFile(e.target.files[0]);
    }
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (file && target && protectedAttr) {
      onUpload(file, target, protectedAttr);
    }
  };

  return (
    <form onSubmit={handleSubmit} className="glass card animate-fade">
      <h2 style={{ marginBottom: '20px', fontSize: '1.25rem' }}>Upload Dataset for Audit</h2>
      
      <div style={{ marginBottom: '20px' }}>
        <label style={{ display: 'block', marginBottom: '8px', color: 'var(--text-muted)' }}>CSV File</label>
        <div style={{
          border: '2px dashed #334155',
          borderRadius: '12px',
          padding: '40px',
          textAlign: 'center',
          cursor: 'pointer',
          transition: 'border-color 0.3s'
        }} onClick={() => document.getElementById('file-upload')?.click()}>
          <Upload size={32} color="var(--primary)" style={{ marginBottom: '12px' }} />
          <p>{file ? file.name : "Click or drag CSV here"}</p>
          <input 
            type="file" 
            id="file-upload" 
            hidden 
            accept=".csv" 
            onChange={handleFileChange} 
          />
        </div>
      </div>

      <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '16px', marginBottom: '24px' }}>
        <div>
          <label style={{ display: 'block', marginBottom: '8px', color: 'var(--text-muted)' }}>Target Variable (y)</label>
          <input 
            type="text" 
            placeholder="e.g., salary_high" 
            value={target}
            onChange={(e) => setTarget(e.target.value)}
            style={{
              width: '100%',
              padding: '12px',
              borderRadius: '8px',
              background: '#1e293b',
              border: '1px solid #334155',
              color: 'white'
            }}
          />
        </div>
        <div>
          <label style={{ display: 'block', marginBottom: '8px', color: 'var(--text-muted)' }}>Protected Attribute (Protected)</label>
          <input 
            type="text" 
            placeholder="e.g., gender" 
            value={protectedAttr}
            onChange={(e) => setProtectedAttr(e.target.value)}
            style={{
              width: '100%',
              padding: '12px',
              borderRadius: '8px',
              background: '#1e293b',
              border: '1px solid #334155',
              color: 'white'
            }}
          />
        </div>
      </div>

      <button 
        type="submit" 
        className="btn btn-primary" 
        style={{ width: '100%', justifyContent: 'center' }}
        disabled={loading || !file || !target || !protectedAttr}
      >
        {loading ? "Analyzing..." : "Start Bias Audit"}
      </button>
    </form>
  );
};

export default UploadSection;
