import React, { useState } from 'react';
import axios from 'axios';
import { Send, MessageSquare, Loader2 } from 'lucide-react';

interface ConversationalAuditorProps {
  auditContext: any;
}

const ConversationalAuditor: React.FC<ConversationalAuditorProps> = ({ auditContext }) => {
  const [messages, setMessages] = useState<{role: 'user' | 'bot', text: string}[]>([]);
  const [input, setInput] = useState('');
  const [loading, setLoading] = useState(false);

  const handleSend = async () => {
    if (!input.trim()) return;

    const userMsg = { role: 'user' as const, text: input };
    setMessages([...messages, userMsg]);
    setInput('');
    setLoading(true);

    const formData = new FormData();
    formData.append('user_id', 'demo_user');
    formData.append('message', input);
    formData.append('context', JSON.stringify(auditContext));

    try {
      const API_BASE = import.meta.env.VITE_API_BASE_URL || "http://localhost:8000";
      const res = await axios.post(`${API_BASE}/chat`, formData);
      setMessages(prev => [...prev, { role: 'bot', text: res.data.response }]);
    } catch (err) {
      setMessages(prev => [...prev, { role: 'bot', text: "Service connection lost." }]);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="glass-card" style={{ height: '400px', display: 'flex', flexDirection: 'column', padding: '20px' }}>
      <div style={{ display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '20px' }}>
         <MessageSquare size={18} color="var(--apple-vibrant-blue)" />
         <h3 style={{ fontSize: '15px' }}>Auditor Consultant</h3>
      </div>
      
      <div style={{ flex: 1, overflowY: 'auto', marginBottom: '16px', display: 'flex', flexDirection: 'column', gap: '12px', paddingRight: '4px' }}>
        {messages.length === 0 && (
          <div style={{ textAlign: 'center', marginTop: '40px', color: 'var(--apple-text-muted)', fontSize: '13px' }}>
            Consult Gemini on the ethical implications of this audit.
          </div>
        )}
        {messages.map((m, i) => (
          <div key={i} style={{
            alignSelf: m.role === 'user' ? 'flex-end' : 'flex-start',
            maxWidth: '90%',
            background: m.role === 'user' ? 'var(--apple-blue)' : 'rgba(255,255,255,0.05)',
            padding: '10px 14px',
            borderRadius: '16px',
            fontSize: '13px',
            lineHeight: 1.5,
          }}>
            {m.text}
          </div>
        ))}
        {loading && <Loader2 className="animate-spin" size={16} color="var(--apple-text-muted)" />}
      </div>

      <div style={{ display: 'flex', gap: '8px', position: 'relative' }}>
        <input 
          type="text" 
          value={input}
          onChange={(e) => setInput(e.target.value)}
          onKeyDown={(e) => e.key === 'Enter' && handleSend()}
          placeholder="Ask a follow-up..."
          style={{
            flex: 1,
            padding: '10px 12px',
            borderRadius: '12px',
            background: 'var(--apple-grey-900)',
            border: '1px solid var(--glass-border)',
            color: 'white',
            fontSize: '13px'
          }}
        />
        <button 
          onClick={handleSend} 
          disabled={loading} 
          style={{ background: 'none', border: 'none', color: 'var(--apple-blue)', cursor: 'pointer' }}
          aria-label="Send message"
        >
          <Send size={18} />
        </button>
      </div>
    </div>
  );
};

export default ConversationalAuditor;
