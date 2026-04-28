import React, { useState } from 'react';
import { Sliders, TrendingDown, Loader2, Code } from 'lucide-react';
import axios from 'axios';

interface ScenarioSimulatorProps {
  auditContext?: any;
}

const ScenarioSimulator: React.FC<ScenarioSimulatorProps> = ({ auditContext }) => {
  const [alpha, setAlpha] = useState(0.5);
  const [loading, setLoading] = useState(false);
  const [generatedCode, setGeneratedCode] = useState<string | null>(null);

  const handleGenerateCode = async () => {
    setLoading(true);
    setGeneratedCode(null);
    try {
      const formData = new FormData();
      formData.append('strategy', `Threshold Optimizer (Alpha=${alpha})`);
      formData.append('features', auditContext?.metadata?.protected || 'protected_attribute');
      
      const API_BASE = import.meta.env.VITE_API_BASE_URL || "http://localhost:8000";
      const res = await axios.post(`${API_BASE}/remediate`, formData);
      setGeneratedCode(res.data.code);
    } catch (err) {
      setGeneratedCode("# Failed to connect to remediation engine.");
    } finally {
      setLoading(false);
    }
  };


  return (
    <div className="glass card animate-fade">
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '16px' }}>
        <h3 style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
          <Sliders size={18} color="var(--accent-cyan)" />
          Scenario & Policy Simulator
        </h3>
        <span style={{ fontSize: '0.75rem', background: '#334155', padding: '2px 8px', borderRadius: '12px' }}>V2.0 Beta</span>
      </div>

      <p style={{ color: 'var(--text-muted)', fontSize: '0.85rem', marginBottom: '20px' }}>
        Adjust the 'Mitigation Strength' (Alpha) to simulate how removing underlying correlations affects model performance vs. fairness.
      </p>

      <div style={{ marginBottom: '24px' }}>
        <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '10px' }}>
          <span style={{ fontSize: '0.9rem' }}>Mitigation Force</span>
          <span style={{ fontWeight: 700, color: 'var(--accent-cyan)' }}>{alpha.toFixed(2)}</span>
        </div>
        <input 
          type="range" 
          min="0" 
          max="1" 
          step="0.05" 
          value={alpha}
          onChange={(e) => setAlpha(parseFloat(e.target.value))}
          style={{ width: '100%', cursor: 'pointer' }}
        />
      </div>

      <div style={{ background: '#0f172a', padding: '16px', borderRadius: '12px', border: '1px solid #334155' }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '12px', color: 'var(--text-muted)' }}>
          <TrendingDown size={16} />
          <span style={{ fontSize: '0.85rem' }}>Simulated Impact Projection</span>
        </div>
        
        <div style={{ display: 'flex', justifyContent: 'space-around', textAlign: 'center' }}>
          <div>
            <div style={{ fontSize: '1.25rem', fontWeight: 700, color: 'var(--success)' }}>
              +{Math.round(alpha * 15)}%
            </div>
            <div style={{ fontSize: '0.7rem', opacity: 0.7 }}>Fairness Gain</div>
          </div>
          <div style={{ width: '1px', background: '#334155' }} />
          <div>
            <div style={{ fontSize: '1.25rem', fontWeight: 700, color: 'var(--danger)' }}>
              -{Math.round(alpha * 3)}%
            </div>
            <div style={{ fontSize: '0.7rem', opacity: 0.7 }}>Utility Loss</div>
          </div>
        </div>
      </div>

      <button 
        className="btn-apple" 
        style={{ width: '100%', marginTop: '20px', justifyContent: 'center', fontSize: '13px', display: 'flex', alignItems: 'center', gap: '8px' }}
        onClick={handleGenerateCode}
        disabled={loading}
      >
        {loading ? <Loader2 size={14} className="animate-spin" /> : <Code size={14} />}
        {loading ? "Generating..." : "Generate Remediation Code"}
      </button>

      {generatedCode && (
        <div className="animate-slide-up" style={{ marginTop: '16px', padding: '12px', background: '#000', borderRadius: '8px', border: '1px solid var(--glass-border)' }}>
          <pre style={{ fontSize: '11px', color: '#30d158', overflowX: 'auto', whiteSpace: 'pre-wrap', fontFamily: 'monospace' }}>
            {generatedCode}
          </pre>
        </div>
      )}
    </div>
  );
};

export default ScenarioSimulator;
