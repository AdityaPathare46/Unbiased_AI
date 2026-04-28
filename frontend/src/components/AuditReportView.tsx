import React from 'react';
import { ShieldCheck, Download, Share2, Award } from 'lucide-react';

interface AuditReportViewProps {
  summary: any;
}

const AuditReportView: React.FC<AuditReportViewProps> = ({ summary }) => {
  if (!summary) return null;

  return (
    <div className="glass-card animate-slide-up" style={{ textAlign: 'center', padding: '60px 40px', border: '2px solid var(--apple-vibrant-blue)', position: 'relative', overflow: 'hidden' }}>
      {/* Background Decorative Element */}
      <div style={{ position: 'absolute', top: '-50px', right: '-50px', width: '200px', height: '200px', borderRadius: '50%', background: 'rgba(10, 132, 255, 0.05)', filter: 'blur(30px)' }} />
      
      <div style={{ display: 'inline-flex', padding: '12px', background: 'rgba(48, 209, 88, 0.1)', borderRadius: '50%', marginBottom: '24px' }}>
         <Award size={48} color="#30d158" />
      </div>

      <h1 style={{ fontSize: '32px', fontWeight: 800, marginBottom: '8px' }}>Certificate of Fairness</h1>
      <p style={{ color: 'var(--apple-text-muted)', marginBottom: '40px' }}>UNBIASED AI COMPLIANCE REGISTRY</p>
      
      <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '32px', textAlign: 'left', marginBottom: '40px' }}>
         <div style={{ background: 'rgba(255,255,255,0.02)', padding: '20px', borderRadius: '12px' }}>
            <p style={{ fontSize: '11px', textTransform: 'uppercase', color: 'var(--apple-text-muted)', marginBottom: '8px' }}>Certification ID</p>
            <p style={{ fontWeight: 600, fontFamily: 'monospace' }}>{summary.certification_id}</p>
         </div>
         <div style={{ background: 'rgba(255,255,255,0.02)', padding: '20px', borderRadius: '12px' }}>
            <p style={{ fontSize: '11px', textTransform: 'uppercase', color: 'var(--apple-text-muted)', marginBottom: '8px' }}>Compliance Level</p>
            <p style={{ fontWeight: 600, color: summary.compliance_status === 'Pass' ? '#30d158' : '#ff453a' }}>
               {summary.compliance_status} ({summary.applied_standard})
            </p>
         </div>
      </div>

      <div style={{ borderTop: '1px solid var(--glass-border)', paddingTop: '40px', marginBottom: '40px' }}>
         <div style={{ display: 'flex', justifyContent: 'center', gap: '40px' }}>
            <div style={{ textAlign: 'center' }}>
               <h3 style={{ fontSize: '28px', fontWeight: 800 }}>{summary.fairness_score}%</h3>
               <p style={{ fontSize: '12px', color: 'var(--apple-text-muted)' }}>Integrity Score</p>
            </div>
            <div style={{ textAlign: 'center' }}>
               <h3 style={{ fontSize: '28px', fontWeight: 800 }}>{summary.adversarial_integrity.robustness_score}%</h3>
               <p style={{ fontSize: '12px', color: 'var(--apple-text-muted)' }}>Robustness</p>
            </div>
         </div>
      </div>

      <div style={{ display: 'flex', gap: '16px', justifyContent: 'center' }}>
         <button className="btn-apple" style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
            <Download size={18} /> Export PDF
         </button>
         <button className="btn-apple" style={{ background: 'var(--apple-grey-800)', display: 'flex', alignItems: 'center', gap: '8px' }}>
            <Share2 size={18} /> Share Registry
         </button>
      </div>

      <div style={{ marginTop: '40px', display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '8px', color: 'var(--apple-text-muted)', fontSize: '12px' }}>
         <ShieldCheck size={14} />
         <span>Digital Signature Verified: Unbiased.io v2.4</span>
      </div>
    </div>
  );
};

export default AuditReportView;
