import React from 'react';
import { Calendar, Hash, Shield, Database } from 'lucide-react';

interface AuditMetadataBarProps {
  metadata: {
    rows: number;
    cols: number;
    target: string;
    protected: string;
    timestamp: string;
    audit_id: string;
    industry: string;
  };
}

const AuditMetadataBar: React.FC<AuditMetadataBarProps> = ({ metadata }) => {
  return (
    <div className="metadata-grid animate-slide-up">
      <div className="metadata-item">
        <div className="metadata-label">
          <Hash size={10} style={{ marginRight: '4px' }} /> Audit ID
        </div>
        <div className="metadata-value">{metadata.audit_id}</div>
      </div>
      
      <div className="metadata-item">
        <div className="metadata-label">
          <Calendar size={10} style={{ marginRight: '4px' }} /> Timestamp
        </div>
        <div className="metadata-value">{metadata.timestamp}</div>
      </div>

      <div className="metadata-item">
        <div className="metadata-label">Dataset Scale</div>
        <div className="metadata-value" style={{ display: 'flex', gap: '8px', alignItems: 'center' }}>
          <span className="badge">{metadata.rows} Rows</span>
          <span className="badge">{metadata.cols} Columns</span>
        </div>
      </div>

      <div className="metadata-item">
        <div className="metadata-label">
          <Shield size={10} style={{ marginRight: '4px' }} /> Bias Target
        </div>
        <div className="metadata-value" style={{ color: 'var(--apple-vibrant-blue)' }}>{metadata.target}</div>
      </div>

      <div className="metadata-item">
        <div className="metadata-label">
          <Database size={10} style={{ marginRight: '4px' }} /> Protected Attr
        </div>
        <div className="metadata-value">{metadata.protected}</div>
      </div>
    </div>
  );
};

export default AuditMetadataBar;
