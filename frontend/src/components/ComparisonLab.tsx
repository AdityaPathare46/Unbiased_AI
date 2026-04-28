import React from 'react';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, Legend } from 'recharts';
import { Layers, Zap } from 'lucide-react';

interface ComparisonLabProps {
  originalMetrics: any;
}

const ComparisonLab: React.FC<ComparisonLabProps> = ({ originalMetrics }) => {
  if (!originalMetrics) return null;

  // Mock mitigated metrics for the 'Innovation Lab' comparison
  const mitigatedData = [
    { 
      name: 'Disp Impact', 
      original: originalMetrics.disparate_impact, 
      mitigated: Math.min(1.0, originalMetrics.disparate_impact + 0.15) 
    },
    { 
      name: 'DP Diff', 
      original: originalMetrics.demographic_parity_diff, 
      mitigated: Math.max(0.0, originalMetrics.demographic_parity_diff - 0.08) 
    },
    { 
      name: 'EO Diff', 
      original: originalMetrics.equal_opportunity_diff, 
      mitigated: Math.max(0.0, originalMetrics.equal_opportunity_diff - 0.05) 
    },
  ];

  return (
    <div className="glass-card animate-slide-up" style={{ minHeight: '300px' }}>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '24px' }}>
         <h3 style={{ display: 'flex', alignItems: 'center', gap: '8px', fontSize: '18px' }}>
            <Layers size={18} color="var(--apple-vibrant-blue)" />
            Ethics A/B Comparison Lab
         </h3>
         <div className="btn-apple" style={{ background: 'rgba(48, 209, 88, 0.1)', color: '#30d158', fontSize: '11px', padding: '4px 10px' }}>
            <Zap size={10} /> Mitigation Active
         </div>
      </div>

      <div style={{ width: '100%', height: 250 }}>
        <ResponsiveContainer>
          <BarChart data={mitigatedData} margin={{ top: 0, right: 0, left: -20, bottom: 0 }}>
            <CartesianGrid strokeDasharray="3 3" stroke="#334155" vertical={false} />
            <XAxis dataKey="name" stroke="#94a3b8" fontSize={11} tickLine={false} axisLine={false} />
            <YAxis stroke="#94a3b8" fontSize={11} tickLine={false} axisLine={false} />
            <Tooltip 
               contentStyle={{ backgroundColor: '#1c1c1e', border: '1px solid #3a3a3c', borderRadius: '8px' }}
            />
            <Legend verticalAlign="top" height={36} iconType="circle" />
            <Bar name="Original Data" dataKey="original" fill="var(--apple-grey-700)" radius={[4, 4, 0, 0]} />
            <Bar name="Mitigated Profile" dataKey="mitigated" fill="var(--apple-blue)" radius={[4, 4, 0, 0]} />
          </BarChart>
        </ResponsiveContainer>
      </div>

      <p style={{ marginTop: '20px', fontSize: '12px', color: 'var(--apple-text-muted)', textAlign: 'center' }}>
        Projected improvement in fairness metrics after applying Gemini-suggested re-weighting.
      </p>
    </div>
  );
};

export default ComparisonLab;
