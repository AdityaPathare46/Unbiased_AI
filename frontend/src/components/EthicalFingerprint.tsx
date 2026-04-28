import React from 'react';

interface EthicalFingerprintProps {
  metrics: any;
  proxies: any;
  privacy: any;
}

const EthicalFingerprint: React.FC<EthicalFingerprintProps> = ({ metrics, proxies, privacy }) => {
  const fairness = metrics.fairness_score || 50;
  const robustness = proxies.robustness_score || 50;
  const privacyCount = privacy.length || 0;
  
  const pathData = `M 10,50 Q ${fairness},${robustness} 90,50 T 170,50`;
  const strokeColor = fairness > 80 ? 'var(--apple-vibrant-blue)' : 'var(--apple-purple)';
  const opacity = 0.3 + (fairness / 200);

  return (
    <div className="glass-card" style={{ padding: '24px', textAlign: 'center' }}>
      <h3 style={{ fontSize: '11px', color: 'var(--apple-text-muted)', marginBottom: '20px', textTransform: 'uppercase', letterSpacing: '0.1em' }}>Ethical Signature</h3>
      
      <div style={{ position: 'relative', height: '140px', display: 'flex', alignItems: 'center', justifyContent: 'center', overflow: 'hidden', background: 'radial-gradient(circle, rgba(28,28,30,0.8) 0%, rgba(0,0,0,1) 100%)', borderRadius: '16px', border: '1px solid var(--glass-border)' }}>
        <svg width="200" height="100" viewBox="0 0 200 100" style={{ filter: 'drop-shadow(0 0 8px ' + strokeColor + '55)' }}>
          <circle cx="100" cy="50" r={30 + privacyCount * 3} stroke={strokeColor} fill="none" strokeWidth="1" opacity={opacity} />
          <circle cx="100" cy="50" r={45} stroke="var(--apple-text-muted)" fill="none" strokeWidth="0.5" strokeDasharray="3,3" opacity="0.1" />
          
          <path 
            d={pathData} 
            fill="none" 
            stroke={strokeColor} 
            strokeWidth="2.5" 
            strokeLinecap="round"
          >
            <animate attributeName="d" values={`M 10,50 Q ${fairness},${robustness} 90,50 T 170,50; M 10,50 Q ${robustness},${fairness} 90,50 T 170,50; M 10,50 Q ${fairness},${robustness} 90,50 T 170,50`} dur="10s" repeatCount="indefinite" />
          </path>
        </svg>
        
        <div style={{ position: 'absolute', bottom: '12px', right: '16px', fontSize: '9px', color: 'var(--apple-text-muted)', fontFamily: 'monospace', letterSpacing: '1px' }}>
          VER_0x{Math.abs(fairness * robustness).toString(16).toUpperCase()}
        </div>
      </div>
      
      <div style={{ display: 'flex', justifyContent: 'center', gap: '8px', marginTop: '20px' }}>
         <div className="badge" style={{ background: 'rgba(10, 132, 255, 0.1)', color: 'var(--apple-vibrant-blue)', border: '1px solid rgba(10, 132, 255, 0.2)' }}>Equity: {fairness}%</div>
         <div className="badge" style={{ background: 'rgba(191, 90, 242, 0.1)', color: 'var(--apple-purple)', border: '1px solid rgba(191, 90, 242, 0.2)' }}>Stability: {robustness}%</div>
      </div>

      <p style={{ marginTop: '16px', fontSize: '11px', lineHeight: '1.5', color: 'var(--apple-text-muted)' }}>
        Generative verification signature derived from dataset ethical boundaries.
      </p>
    </div>
  );
};

export default EthicalFingerprint;
