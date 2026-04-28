import React from 'react';
import { motion } from 'framer-motion';
import { Users, BarChart2, AlertCircle, PieChart } from 'lucide-react';
import { PieChart as RePie, Pie, Cell, ResponsiveContainer, Tooltip } from 'recharts';

interface DemographicsViewProps {
  metrics: any;
}

const DemographicsView: React.FC<DemographicsViewProps> = ({ metrics }) => {
  // Mock distribution since backend doesn't return full distribution yet
  const data = [
    { name: 'Group A', value: 65, color: 'var(--apple-vibrant-blue)' },
    { name: 'Group B', value: 35, color: 'var(--apple-purple)' },
  ];

  return (
    <motion.div initial={{ opacity: 0, scale: 0.98 }} animate={{ opacity: 1, scale: 1 }}>
      <h1 className="section-title">Demographic Distribution Analysis</h1>
      
      <div style={{ display: 'grid', gridTemplateColumns: '1.5fr 1fr', gap: '24px' }}>
         <div className="glass-card">
            <h3 style={{ display: 'flex', alignItems: 'center', gap: '8px', fontSize: '16px', marginBottom: '24px' }}>
               <PieChart size={18} color="var(--apple-vibrant-blue)" /> Group Representation
            </h3>
            <div style={{ height: '300px' }}>
               <ResponsiveContainer width="100%" height="100%">
                  <RePie>
                     <Pie data={data} innerRadius={80} outerRadius={100} paddingAngle={5} dataKey="value">
                        {data.map((entry, index) => (
                           <Cell key={`cell-${index}`} fill={entry.color} />
                        ))}
                     </Pie>
                     <Tooltip />
                  </RePie>
               </ResponsiveContainer>
            </div>
            <div style={{ display: 'flex', justifyContent: 'center', gap: '24px', marginTop: '16px' }}>
               {data.map(item => (
                 <div key={item.name} style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                    <div style={{ width: '12px', height: '12px', borderRadius: '3px', background: item.color }} />
                    <span style={{ fontSize: '13px' }}>{item.name}: {item.value}%</span>
                 </div>
               ))}
            </div>
         </div>

         <div style={{ display: 'flex', flexDirection: 'column', gap: '24px' }}>
            <div className="glass-card">
               <h3 style={{ display: 'flex', alignItems: 'center', gap: '8px', fontSize: '15px', color: 'var(--apple-text-muted)', marginBottom: '16px' }}>
                  <Users size={16} /> Sample Imbalance
               </h3>
               <div style={{ display: 'flex', alignItems: 'flex-end', gap: '12px' }}>
                  <h2 style={{ fontSize: '32px', fontWeight: 800 }}>High</h2>
                  <p style={{ fontSize: '12px', color: '#ff453a', marginBottom: '8px', display: 'flex', alignItems: 'center', gap: '4px' }}>
                     <AlertCircle size={14} /> Attention Required
                  </p>
               </div>
               <p style={{ fontSize: '13px', color: 'var(--apple-text-muted)', marginTop: '8px' }}>
                  One sensitive group is significantly underrepresented, which may lead to unreliable fairness metrics.
               </p>
            </div>

            <div className="glass-card">
               <h3 style={{ display: 'flex', alignItems: 'center', gap: '8px', fontSize: '15px', color: 'var(--apple-text-muted)', marginBottom: '16px' }}>
                  <BarChart2 size={16} /> Group Fairness Gap
               </h3>
               <h2 style={{ fontSize: '32px', fontWeight: 800 }}>{metrics.demographic_parity_diff * 100}%</h2>
               <div style={{ width: '100%', height: '6px', background: 'rgba(255,255,255,0.05)', borderRadius: '3px', marginTop: '12px', overflow: 'hidden' }}>
                  <div style={{ width: `${metrics.demographic_parity_diff * 100}%`, height: '100%', background: 'var(--apple-vibrant-blue)' }} />
               </div>
            </div>
         </div>
      </div>
    </motion.div>
  );
};

export default DemographicsView;
