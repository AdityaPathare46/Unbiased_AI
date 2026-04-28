import React from 'react';
import { Telescope, Zap, ShieldAlert, Globe, ArrowUpRight } from 'lucide-react';

const FuturePotential: React.FC = () => {
  const roadmap = [
    { title: 'Real-time Drift Shield', icon: Zap, desc: 'Live monitoring for model performance decay.' },
    { title: 'Federated Privacy', icon: ShieldAlert, desc: 'Auditing data without moving it from its source.' },
    { title: 'Global Ethics Node', icon: Globe, desc: 'Cross-border compliance for EU/US/UK laws.' },
  ];

  return (
    <div className="glass-card animate-slide-up" style={{ marginTop: '24px', background: 'linear-gradient(135deg, rgba(88, 86, 214, 0.1), rgba(0,0,0,0.5))' }}>
      <div style={{ display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '16px' }}>
         <Telescope size={18} color="var(--apple-purple)" />
         <h3 style={{ fontSize: '15px' }}>Future Evolution</h3>
      </div>
      
      <div style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
        {roadmap.map((item, i) => (
          <div key={i} style={{ display: 'flex', gap: '12px', padding: '10px', borderRadius: '8px', background: 'rgba(255,255,255,0.03)' }}>
             <item.icon size={20} color="var(--apple-text-muted)" />
             <div style={{ flex: 1 }}>
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                   <span style={{ fontSize: '13px', fontWeight: 600 }}>{item.title}</span>
                   <ArrowUpRight size={12} color="var(--apple-text-muted)" />
                </div>
                <p style={{ fontSize: '11px', color: 'var(--apple-text-muted)' }}>{item.desc}</p>
             </div>
          </div>
        ))}
      </div>
      
      <div style={{ marginTop: '20px', textAlign: 'center' }}>
         <button className="btn-apple" style={{ background: 'none', border: '1px solid var(--apple-purple)', color: 'var(--apple-purple)', fontSize: '12px', width: '100%' }}>
            Join the Governance Network
         </button>
      </div>
    </div>
  );
};

export default FuturePotential;
