import React from 'react';
import { Target, Handshake } from 'lucide-react';

const MissionStatement: React.FC = () => {
  return (
    <div className="glass-card animate-slide-up" style={{ background: 'linear-gradient(135deg, rgba(10, 132, 255, 0.1), rgba(0,0,0,0.5))', marginBottom: '32px' }}>
      <h2 style={{ fontSize: '24px', fontWeight: 800, marginBottom: '16px', color: 'var(--apple-vibrant-blue)' }}>Why Unbiased AI?</h2>
      <p style={{ fontSize: '15px', color: 'var(--apple-text-muted)', lineHeight: 1.6, marginBottom: '24px' }}>
        Algorithmic bias isn't just a technical flaw; it's a real-world crisis affecting hiring, lending, and healthcare. 
        Unbiased AI transforms the "Black Box" into a transparent ecosystem where ethical outcomes are measured, 
        audited, and certified for compliance.
      </p>
      
      <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '20px' }}>
        <div style={{ display: 'flex', gap: '12px' }}>
           <Target size={20} color="var(--apple-purple)" />
           <div>
              <p style={{ fontWeight: 600, fontSize: '14px' }}>The Problem</p>
              <p style={{ fontSize: '12px', color: 'var(--apple-text-muted)' }}>Historical bias in data leads to discriminatory AI decisions.</p>
           </div>
        </div>
        <div style={{ display: 'flex', gap: '12px' }}>
           <Handshake size={20} color="#30d158" />
           <div>
              <p style={{ fontWeight: 600, fontSize: '14px' }}>The Impact</p>
              <p style={{ fontSize: '12px', color: 'var(--apple-text-muted)' }}>Fair models build trust and ensure legal compliance.</p>
           </div>
        </div>
      </div>
    </div>
  );
};

export default MissionStatement;
