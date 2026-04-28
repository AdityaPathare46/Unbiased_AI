import React, { useState } from 'react';
import axios from 'axios';

import { Zap, Code, CheckCircle, Loader2 } from 'lucide-react';
import ComparisonLab from './ComparisonLab';

interface ActiveMitigationLabProps {
  auditContext: any;
}

const ActiveMitigationLab: React.FC<ActiveMitigationLabProps> = ({ auditContext }) => {
  const [strategy, setStrategy] = useState('Reweighting');
  const [loading, setLoading] = useState(false);
  const [code, setCode] = useState<string | null>(null);

  const strategies = [
    { id: 'Reweighting', desc: 'Adjusts instance weights to eliminate correlation between protected attributes and target.' },
    { id: 'Adversarial Debiasing', desc: 'Trains a discriminator network to remove protected attribute signals from the hidden layers.' },
    { id: 'Threshold Optimization', desc: 'Calibrates decision thresholds dynamically per demographic group to ensure equal opportunity.' }
  ];

  const handleGenerate = async () => {
    if (!auditContext) return;
    setLoading(true);
    setCode(null);

    const formData = new FormData();
    formData.append('strategy', strategy);
    // Determine protected feature
    const protectedAttr = auditContext.metadata?.protected || 'race';
    const target = auditContext.metadata?.target || 'outcome';
    formData.append('features', `${protectedAttr},${target}`);

    try {
      const res = await axios.post('http://localhost:8000/remediate', formData);
      setCode(res.data.code);
    } catch (err) {
      setCode("# Failed to generate mitigation code. Please check your Gemini API key.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="glass-card animate-slide-up" style={{ minHeight: '500px' }}>
      <div style={{ display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '24px' }}>
         <Zap size={20} color="var(--apple-blue)" />
         <h2 style={{ fontSize: '20px' }}>Active Mitigation Engine</h2>
      </div>

      <div style={{ display: 'grid', gridTemplateColumns: '1fr 2fr', gap: '24px' }}>
        {/* Left Col: Strategy Selection */}
        <div>
          <h3 style={{ fontSize: '14px', marginBottom: '16px', color: 'var(--apple-text-muted)' }}>Select Algorithm</h3>
          <div style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
            {strategies.map((s) => (
              <div 
                key={s.id} 
                onClick={() => setStrategy(s.id)}
                style={{ 
                  padding: '16px', 
                  borderRadius: '12px', 
                  border: `1px solid ${strategy === s.id ? 'var(--apple-blue)' : 'var(--glass-border)'}`,
                  background: strategy === s.id ? 'rgba(10, 132, 255, 0.1)' : 'rgba(255,255,255,0.02)',
                  cursor: 'pointer',
                  transition: 'all 0.2s ease'
                }}
              >
                <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '8px' }}>
                   <span style={{ fontSize: '14px', fontWeight: 600, color: strategy === s.id ? 'var(--apple-blue)' : 'white' }}>{s.id}</span>
                   {strategy === s.id && <CheckCircle size={14} color="var(--apple-blue)" />}
                </div>
                <p style={{ fontSize: '11px', color: 'var(--apple-text-muted)', lineHeight: 1.4 }}>{s.desc}</p>
              </div>
            ))}
          </div>

          <button 
            className="btn-apple" 
            onClick={handleGenerate}
            disabled={loading || !auditContext}
            style={{ 
              marginTop: '24px', 
              width: '100%', 
              background: 'var(--apple-blue)',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              gap: '8px'
            }}
          >
            {loading ? <Loader2 size={16} className="spin" /> : <Code size={16} />}
            Generate Remediation Code
          </button>
        </div>

        {/* Right Col: Code Output & Comparison */}
        <div style={{ display: 'flex', flexDirection: 'column', gap: '24px' }}>
          
          {/* Comparison Graph */}
          {auditContext && auditContext.metrics && (
             <div style={{ background: 'rgba(0,0,0,0.3)', padding: '16px', borderRadius: '12px', border: '1px solid var(--glass-border)' }}>
                 <ComparisonLab originalMetrics={auditContext.metrics} />
             </div>
          )}

          {/* Generated Code */}
          <div style={{ flex: 1, background: '#1c1c1e', borderRadius: '12px', border: '1px solid var(--glass-border)', display: 'flex', flexDirection: 'column', overflow: 'hidden' }}>
             <div style={{ background: '#2c2c2e', padding: '12px 16px', borderBottom: '1px solid #3a3a3c', display: 'flex', alignItems: 'center', gap: '8px' }}>
                <div style={{ display: 'flex', gap: '6px' }}>
                   <div style={{ width: 10, height: 10, borderRadius: '50%', background: '#ff453a' }} />
                   <div style={{ width: 10, height: 10, borderRadius: '50%', background: '#ffd60a' }} />
                   <div style={{ width: 10, height: 10, borderRadius: '50%', background: '#30d158' }} />
                </div>
                <span style={{ fontSize: '12px', color: 'var(--apple-text-muted)', marginLeft: '12px', fontFamily: 'monospace' }}>mitigation_pipeline.py</span>
             </div>
             <div style={{ padding: '16px', overflowY: 'auto', flex: 1, maxHeight: '300px' }}>
               {loading ? (
                  <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', height: '100%', color: 'var(--apple-text-muted)' }}>
                     <Loader2 size={24} className="spin" style={{ marginBottom: '12px' }} />
                     <p style={{ fontSize: '13px' }}>Synthesizing PyTorch/Scikit-Learn implementation...</p>
                  </div>
               ) : code ? (
                  <pre style={{ margin: 0, whiteSpace: 'pre-wrap', wordBreak: 'break-word', fontFamily: 'monospace', fontSize: '12px', color: '#30d158', lineHeight: 1.5 }}>
                     {code}
                  </pre>
               ) : (
                  <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', height: '100%', color: 'var(--apple-text-muted)', opacity: 0.5 }}>
                     <Code size={32} style={{ marginBottom: '12px' }} />
                     <p style={{ fontSize: '13px' }}>Select an algorithm to generate integration code.</p>
                  </div>
               )}
             </div>
          </div>
          
        </div>
      </div>
    </div>
  );
};

export default ActiveMitigationLab;
