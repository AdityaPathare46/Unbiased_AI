import React, { useState } from 'react';
import axios from 'axios';
import { motion, AnimatePresence } from 'framer-motion';
import { Mail, Lock, User, Shield, ChevronRight, Loader2 } from 'lucide-react';

interface AuthViewProps {
  onLogin: (userData: any, token: string) => void;
}

const API_BASE = "http://localhost:8000";

const AuthView: React.FC<AuthViewProps> = ({ onLogin }) => {
  const [isLogin, setIsLogin] = useState(true);
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [fullName, setFullName] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError(null);

    const formData = new FormData();
    formData.append('email', email);
    formData.append('password', password);
    if (!isLogin) formData.append('full_name', fullName);

    try {
      const endpoint = isLogin ? '/auth/login' : '/auth/register';
      const res = await axios.post(`${API_BASE}${endpoint}`, formData);
      
      if (res.data.error) {
        setError(res.data.error);
      } else {
        onLogin(res.data.user, res.data.access_token);
      }
    } catch (err) {
      setError("Connection to security gateway failed.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div style={{ 
      display: 'flex', 
      alignItems: 'center', 
      justifyContent: 'center', 
      minHeight: '80vh' 
    }}>
      <motion.div 
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="glass-card"
        style={{ width: '100%', maxWidth: '400px', padding: '40px' }}
      >
        <div style={{ textAlign: 'center', marginBottom: '32px' }}>
          <div style={{ 
            display: 'inline-flex', 
            padding: '12px', 
            background: 'var(--apple-vibrant-blue)', 
            borderRadius: '12px',
            marginBottom: '16px',
            boxShadow: '0 8px 16px rgba(10, 132, 255, 0.3)'
          }}>
            <Shield size={24} color="white" />
          </div>
          <h2 style={{ fontSize: '24px', fontWeight: 700 }}>
            {isLogin ? "Welcome Back" : "Create Account"}
          </h2>
          <p style={{ color: 'var(--apple-text-muted)', fontSize: '14px', marginTop: '8px' }}>
            {isLogin ? "Access your ethical intelligence hub" : "Join the frontier of unbiased AI"}
          </p>
        </div>

        <form onSubmit={handleSubmit} style={{ display: 'flex', flexDirection: 'column', gap: '20px' }}>
          <AnimatePresence mode="wait">
            {!isLogin && (
              <motion.div 
                initial={{ opacity: 0, height: 0 }}
                animate={{ opacity: 1, height: 'auto' }}
                exit={{ opacity: 0, height: 0 }}
              >
                <div style={{ position: 'relative' }}>
                  <User size={18} style={{ position: 'absolute', left: '12px', top: '50%', transform: 'translateY(-50%)', color: 'var(--apple-text-muted)' }} />
                  <input 
                    type="text" 
                    placeholder="Full Name"
                    className="input-apple"
                    value={fullName}
                    onChange={(e) => setFullName(e.target.value)}
                    required
                    style={{ paddingLeft: '40px', width: '100%' }}
                  />
                </div>
              </motion.div>
            )}
          </AnimatePresence>

          <div style={{ position: 'relative' }}>
            <Mail size={18} style={{ position: 'absolute', left: '12px', top: '50%', transform: 'translateY(-50%)', color: 'var(--apple-text-muted)' }} />
            <input 
              type="email" 
              placeholder="Email Address"
              className="input-apple"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
              style={{ paddingLeft: '40px', width: '100%' }}
            />
          </div>

          <div style={{ position: 'relative' }}>
            <Lock size={18} style={{ position: 'absolute', left: '12px', top: '50%', transform: 'translateY(-50%)', color: 'var(--apple-text-muted)' }} />
            <input 
              type="password" 
              placeholder="Password"
              className="input-apple"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required
              style={{ paddingLeft: '40px', width: '100%' }}
            />
          </div>

          {error && (
            <p style={{ color: '#ff453a', fontSize: '12px', textAlign: 'center' }}>{error}</p>
          )}

          <button 
            type="submit" 
            className="btn-apple" 
            disabled={loading}
            style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '8px', marginTop: '12px' }}
          >
            {loading ? <Loader2 className="animate-spin" size={18} /> : (isLogin ? "Sign In" : "Register")}
            {!loading && <ChevronRight size={18} />}
          </button>
        </form>

        <div style={{ textAlign: 'center', marginTop: '32px' }}>
          <button 
            onClick={() => setIsLogin(!isLogin)}
            style={{ background: 'none', border: 'none', color: 'var(--apple-vibrant-blue)', fontSize: '13px', cursor: 'pointer' }}
          >
            {isLogin ? "New to Unbiased? Create an account" : "Already have an account? Sign In"}
          </button>
        </div>
      </motion.div>
    </div>
  );
};

export default AuthView;
