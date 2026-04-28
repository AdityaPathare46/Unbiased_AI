import React from 'react';
import { Shield, LayoutDashboard, Search, Users, BarChart3, LogOut } from 'lucide-react';

interface SidebarProps {
  activeTab: string;
  setActiveTab: (tab: string) => void;
  user?: any;
  onLogout?: () => void;
}

const Sidebar: React.FC<SidebarProps> = ({ activeTab, setActiveTab, user, onLogout }) => {
  const navItems = [
    { title: 'Auditor Home', icon: LayoutDashboard, id: 'home' },
    { title: 'Deep Audit', icon: Search, id: 'audit' },
    { title: 'Privacy Shield', icon: Shield, id: 'privacy' },
    { title: 'Demographics', icon: Users, id: 'users' },
    { title: 'Mitigation Lab', icon: BarChart3, id: 'mitigation' },
  ];

  return (
    <aside className="sidebar">
      <div style={{ display: 'flex', alignItems: 'center', gap: '10px', marginBottom: '32px', padding: '0 8px' }}>
        <div style={{ 
          background: 'var(--apple-vibrant-blue)', 
          padding: '6px', 
          borderRadius: '10px',
          boxShadow: '0 4px 12px rgba(10, 132, 255, 0.3)'
        }}>
          <Shield size={20} color="white" />
        </div>
        <span style={{ fontWeight: 700, fontSize: '18px' }}>Unbiased</span>
      </div>

      <nav style={{ flex: 1 }}>
        <p style={{ fontSize: '11px', color: 'var(--apple-text-muted)', fontWeight: 600, textTransform: 'uppercase', marginBottom: '12px', paddingLeft: '12px' }}>
          Intelligence
        </p>
        {navItems.map((item) => (
          <a
            key={item.id}
            href="#"
            className={`nav-item ${activeTab === item.id ? 'active' : ''}`}
            onClick={() => setActiveTab(item.id)}
          >
            <item.icon size={18} />
            {item.title}
          </a>
        ))}
      </nav>

      <div style={{ marginTop: 'auto', borderTop: '1px solid var(--glass-border)', paddingTop: '16px' }}>
        {user && (
          <div style={{ 
            marginBottom: '16px', 
            padding: '12px', 
            background: 'rgba(255,255,255,0.05)', 
            borderRadius: '12px',
            display: 'flex',
            alignItems: 'center',
            gap: '12px'
          }}>
            <div style={{ 
              width: '32px', 
              height: '32px', 
              borderRadius: '50%', 
              background: 'var(--apple-vibrant-blue)', 
              display: 'flex', 
              alignItems: 'center', 
              justifyContent: 'center',
              fontSize: '12px',
              fontWeight: 700,
              color: 'white'
            }}>
              {user.full_name?.substring(0, 2).toUpperCase()}
            </div>
            <div style={{ flex: 1, minWidth: 0 }}>
              <div style={{ fontSize: '13px', fontWeight: 600, whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis' }}>
                {user.full_name}
              </div>
              <div style={{ fontSize: '11px', color: 'var(--apple-text-muted)', whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis' }}>
                {user.email}
              </div>
            </div>
          </div>
        )}
        
        <a href="#" className="nav-item" onClick={onLogout} style={{ color: '#ff453a' }}>
          <LogOut size={18} />
          Logout
        </a>
        
        <div style={{ 
          marginTop: '12px', 
          padding: '12px', 
          background: 'rgba(255,255,255,0.03)', 
          borderRadius: '8px',
          display: 'flex',
          alignItems: 'center',
          gap: '8px'
        }}>
          <div style={{ width: '8px', height: '8px', background: '#30d158', borderRadius: '50%' }} />
          <span style={{ fontSize: '11px', color: 'var(--apple-text-muted)' }}>Security Shield Active</span>
        </div>
      </div>
    </aside>
  );
};

export default Sidebar;
