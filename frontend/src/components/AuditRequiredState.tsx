import React from 'react';
import { motion } from 'framer-motion';
import { Search, ShieldAlert, ChevronRight } from 'lucide-react';

interface AuditRequiredStateProps {
  onStartAudit: () => void;
  title: string;
  description: string;
  icon?: React.ElementType;
}

const AuditRequiredState: React.FC<AuditRequiredStateProps> = ({ onStartAudit, title, description, icon: Icon = ShieldAlert }) => {
  return (
    <motion.div 
      initial={{ opacity: 0, scale: 0.95 }}
      animate={{ opacity: 1, scale: 1 }}
      className="glass-card"
      style={{ 
        maxWidth: '600px', 
        margin: '100px auto', 
        textAlign: 'center', 
        padding: '60px 40px',
        border: '1px dashed var(--glass-border)'
      }}
    >
      <div style={{ 
        display: 'inline-flex', 
        padding: '16px', 
        background: 'rgba(10, 132, 255, 0.1)', 
        borderRadius: '50%', 
        marginBottom: '24px' 
      }}>
        <Icon size={48} color="var(--apple-vibrant-blue)" />
      </div>
      
      <h2 style={{ fontSize: '28px', fontWeight: 800, marginBottom: '12px' }}>{title}</h2>
      <p style={{ color: 'var(--apple-text-muted)', marginBottom: '40px', lineHeight: 1.6 }}>
        {description}
      </p>
      
      <button 
        className="btn-apple" 
        style={{ display: 'flex', alignItems: 'center', gap: '8px', margin: '0 auto' }}
        onClick={onStartAudit}
      >
        <Search size={18} /> Initiate New Deep Audit <ChevronRight size={18} />
      </button>
    </motion.div>
  );
};

export default AuditRequiredState;
