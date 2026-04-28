import { useState, useEffect } from 'react';
import axios from 'axios';
import { motion, AnimatePresence } from 'framer-motion';
import { Lock, Cpu, Award, AlertTriangle, CheckCircle, Info, Shield, Users } from 'lucide-react';
import Sidebar from './components/Sidebar';
import AuditWizard from './components/AuditWizard';
import BiasChart from './components/BiasChart';
import ConversationalAuditor from './components/ConversationalAuditor';
import ScenarioSimulator from './components/ScenarioSimulator';
import MissionStatement from './components/MissionStatement';
import AuditReportView from './components/AuditReportView';
import EthicalFingerprint from './components/EthicalFingerprint';
import ComparisonLab from './components/ComparisonLab';
import FuturePotential from './components/FuturePotential';
import ActiveMitigationLab from './components/ActiveMitigationLab';
import AuditRequiredState from './components/AuditRequiredState';
import PrivacyShieldView from './components/PrivacyShieldView';
import DemographicsView from './components/DemographicsView';
import AuditMetadataBar from './components/AuditMetadataBar';
import AuthView from './components/AuthView';

const API_BASE = "http://localhost:8000";

function App() {
  const [activeTab, setActiveTab] = useState('home');
  const [jobId, setJobId] = useState<string | null>(null);
  const [status, setStatus] = useState<string>('');
  const [data, setData] = useState<any>(null);
  const [, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  
  // Auth State
  const [currentUser, setCurrentUser] = useState<any>(null);
  const [, setToken] = useState<string | null>(null);

  useEffect(() => {
    const savedUser = localStorage.getItem('user');
    const savedToken = localStorage.getItem('token');
    if (savedUser && savedToken) {
      setCurrentUser(JSON.parse(savedUser));
      setToken(savedToken);
    }
  }, []);

  const handleLogin = (userData: any, token: string) => {
    setCurrentUser(userData);
    setToken(token);
    localStorage.setItem('user', JSON.stringify(userData));
    localStorage.setItem('token', token);
  };

  const handleLogout = () => {
    setCurrentUser(null);
    setToken(null);
    localStorage.removeItem('user');
    localStorage.removeItem('token');
  };

  const startAudit = async (file: File | null, dbUrl: string, query: string, target: string, protectedAttr: string, industry: string) => {
    setLoading(true);
    setJobId(null);
    setData(null);
    setError(null);
    
    const formData = new FormData();
    if (file) formData.append('file', file);
    if (dbUrl) formData.append('db_url', dbUrl);
    if (query) formData.append('query', query);
    
    formData.append('target', target);
    formData.append('protected_attribute', protectedAttr);
    formData.append('industry', industry);

    try {
      const res = await axios.post(`${API_BASE}/audit/start`, formData);
      if (res.data.error) {
        setError(res.data.error);
        setLoading(false);
      } else {
        setJobId(res.data.job_id);
      }
    } catch (err: any) {
      setError("Failed to initiate audit pipeline.");
      setLoading(false);
    }
  };

  useEffect(() => {
    if (!jobId || data) return;

    const interval = setInterval(async () => {
      try {
        const res = await axios.get(`${API_BASE}/audit/status/${jobId}`);
        setStatus(res.data.status);
        if (res.data.status === 'Completed') {
          setData(res.data.result);
          setLoading(false);
          setActiveTab('home');
          clearInterval(interval);
        } else if (res.data.status === 'Failed') {
          setError(res.data.error || "Auditing process failed.");
          setLoading(false);
          clearInterval(interval);
        }
      } catch (err) {
        clearInterval(interval);
      }
    }, 2000);

    return () => clearInterval(interval);
  }, [jobId, data]);

  return (
    <div className="app-layout">
      {!currentUser ? (
        <div style={{ width: '100%', padding: '40px' }}>
          <MissionStatement />
          <AuthView onLogin={handleLogin} />
        </div>
      ) : (
        <>
          <Sidebar activeTab={activeTab} setActiveTab={setActiveTab} user={currentUser} onLogout={handleLogout} />
          
          <main className="main-content">
        {error && (
          <div className="glass-card" style={{ color: '#ff453a', borderColor: '#ff453a', margin: '20px auto', maxWidth: '600px', textAlign: 'center' }}>
              {error}
          </div>
        )}

        <AnimatePresence mode="wait">
          {!data && activeTab === 'audit' && (
            <div key="audit-setup">
              <MissionStatement />
              <AuditWizard onStart={startAudit} status={status} />
            </div>
          )}

          {/* Protected Tabs: Require Audit Data */}
          {['home', 'privacy', 'users', 'certification'].includes(activeTab) && !data && (
            <div key="audit-required-fallback">
              <MissionStatement />
              <AuditRequiredState 
                onStartAudit={() => setActiveTab('audit')} 
                title={
                  activeTab === 'home' ? "Intelligence Locked" :
                  activeTab === 'privacy' ? "Privacy Shield Locked" :
                  activeTab === 'users' ? "Demographic Vault Locked" :
                  "Certification Locked"
                }
                description={
                  activeTab === 'home' ? "This layer of ethical intelligence requires a processed dataset. Initiate a Deep Audit to unlock these insights." :
                  activeTab === 'privacy' ? "Secure PII analysis and anonymization signatures are generated during the audit pipeline." :
                  activeTab === 'users' ? "Statistical drift and group representation analysis requires a processed dataset." :
                  "Formal ethics certification is issued upon completion of a full dataset biopsy."
                }
                icon={
                  activeTab === 'home' ? Lock :
                  activeTab === 'privacy' ? Shield :
                  activeTab === 'users' ? Users :
                  Award
                }
              />
            </div>
          )}

          {data && activeTab === 'home' && (
            <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} key="home">
               <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '32px' }}>
                <div>
                   <h1 className="section-title">Audit Intelligence Hub</h1>
                   <p style={{ color: 'var(--apple-text-muted)', fontSize: '14px' }}>Industry Standard: <b>{data.metrics.applied_standard}</b></p>
                </div>
                 <div style={{ display: 'flex', gap: '8px' }}>
                    <div className="btn-apple" style={{ background: 'var(--apple-grey-800)', display: 'flex', alignItems: 'center', gap: '8px', fontSize: '13px' }}>
                       <Lock size={14} color="#30d158" /> Privacy Secured
                    </div>
                    <button className="btn-apple" style={{ background: 'var(--apple-purple)', display: 'flex', alignItems: 'center', gap: '8px', fontSize: '13px' }} onClick={() => setActiveTab('certification')}>
                       <Award size={14} /> View Certificate
                    </button>
                 </div>
               </div>

               {data.metadata && <AuditMetadataBar metadata={data.metadata} />}

               {data.metrics.compliance_status === 'Fail' ? (
                 <div className="risk-banner critical animate-slide-up">
                    <AlertTriangle size={20} />
                    <div>
                      <span style={{ fontWeight: 700 }}>Critical Policy Violation:</span> The model exceeds fairness thresholds for the {data.metadata?.protected || 'protected'} group. Mitigation is highly recommended.
                    </div>
                 </div>
               ) : (
                 <div className="risk-banner pass animate-slide-up">
                    <CheckCircle size={20} />
                    <div>
                      <span style={{ fontWeight: 700 }}>Compliant:</span> Model behavior aligns with {data.metrics.applied_standard} standards.
                    </div>
                 </div>
               )}

              <div style={{ display: 'grid', gridTemplateColumns: '2fr 1fr', gap: '24px' }}>
                 <div style={{ display: 'flex', flexDirection: 'column', gap: '24px' }}>
                    <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr 1fr', gap: '24px' }}>
                      <div className="glass-card">
                         <p style={{ fontSize: '12px', color: 'var(--apple-text-muted)', marginBottom: '8px', textTransform: 'uppercase' }}>Fairness Score</p>
                         <h2 style={{ fontSize: '36px', fontWeight: 800, color: 'var(--apple-vibrant-blue)' }}>{data.metrics.fairness_score}%</h2>
                      </div>
                      <div className="glass-card">
                         <p style={{ fontSize: '12px', color: 'var(--apple-text-muted)', marginBottom: '8px', textTransform: 'uppercase' }}>Compliance</p>
                         <h2 style={{ fontSize: '24px', fontWeight: 700, color: data.metrics.compliance_status === 'Pass' ? '#30d158' : '#ff453a' }}>{data.metrics.compliance_status}</h2>
                      </div>
                      <div className="glass-card">
                         <p style={{ fontSize: '12px', color: 'var(--apple-text-muted)', marginBottom: '8px', textTransform: 'uppercase' }}>Proxy Integrity</p>
                         <h2 style={{ fontSize: '24px', fontWeight: 700 }}>{data.proxies.robustness_score}%</h2>
                      </div>
                    </div>
                    <ComparisonLab originalMetrics={data.metrics} />
                     <div className="glass-card">
                        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '24px' }}>
                           <h3 style={{ fontSize: '18px' }}>Benchmark Analysis</h3>
                           <div className="tooltip-container">
                              <Info size={16} color="var(--apple-text-muted)" />
                              <div className="tooltip-text">
                                 <strong>Demographic Parity (DP Diff):</strong> Difference in selection rates between groups.<br/><br/>
                                 <strong>Equal Opportunity (EO Diff):</strong> Difference in true positive rates.<br/><br/>
                                 <strong>Disparate Impact:</strong> Ratio of selection rates (80% rule).
                              </div>
                           </div>
                        </div>
                        <BiasChart data={[
                          { name: 'DP Diff', value: data.metrics.demographic_parity_diff },
                          { name: 'EO Diff', value: data.metrics.equal_opportunity_diff },
                          { name: 'Disp Impact', value: data.metrics.disparate_impact }
                        ]} />
                       <div style={{ marginTop: '32px', padding: '20px', background: 'rgba(255,255,255,0.02)', borderRadius: '12px', borderLeft: '4px solid var(--apple-vibrant-blue)' }}>
                          <div style={{ display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '12px', color: 'var(--apple-vibrant-blue)' }}>
                             <Cpu size={18} />
                             <span style={{ fontWeight: 600 }}>Gemini Auditor Insight</span>
                          </div>
                          <p style={{ fontSize: '14px', lineHeight: 1.6, color: 'var(--apple-text-muted)' }}>{data.ai_report}</p>
                       </div>
                    </div>
                 </div>
                 <div style={{ display: 'flex', flexDirection: 'column', gap: '24px' }}>
                    <EthicalFingerprint metrics={data.metrics} proxies={data.proxies} privacy={data.privacy} />
                    <ConversationalAuditor auditContext={data} />
                    <ScenarioSimulator auditContext={data} />
                 </div>
              </div>
            </motion.div>
          )}

          {data && activeTab === 'privacy' && (
            <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} key="privacy">
               <PrivacyShieldView privacyData={data.privacy} />
            </motion.div>
          )}

          {data && activeTab === 'users' && (
            <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} key="users">
               <DemographicsView metrics={data.metrics} />
            </motion.div>
          )}

          {data && activeTab === 'certification' && (
            <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} key="certification">
               <div style={{ marginBottom: '32px' }}>
                  <button className="btn-apple" style={{ background: 'var(--apple-grey-800)' }} onClick={() => setActiveTab('home')}>← Back to Hub</button>
               </div>
               <AuditReportView summary={data.summary} />
            </motion.div>
          )}

          {activeTab === 'mitigation' && (
            <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} key="mitigation">
               <h1 className="section-title">Mitigation & Roadmap</h1>
               <div style={{ display: 'grid', gridTemplateColumns: '1fr', gap: '24px' }}>
                  <ActiveMitigationLab auditContext={data} />
                  <FuturePotential />
               </div>
            </motion.div>
          )}
        </AnimatePresence>
      </main>
        </>
      )}
    </div>
  );
}

export default App;
