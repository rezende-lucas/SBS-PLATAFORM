import React from 'react';
import { Dumbbell, Home, Settings, BarChart2 } from 'lucide-react';

export default function Navbar({ currentView, setView }) {
  return (
    <nav style={{
      background: 'var(--bg-card)',
      borderBottom: '1px solid var(--border-color)',
      padding: '16px 24px',
      position: 'sticky',
      top: 0,
      zIndex: 10
    }}>
      <div className="flex justify-between items-center" style={{ maxWidth: '800px', margin: '0 auto' }}>
        <div className="flex items-center gap-2" style={{ cursor: 'pointer' }} onClick={() => setView('dashboard')}>
          <Dumbbell color="var(--accent-primary)" size={28} />
          <h2 style={{ fontSize: '20px' }} className="text-gradient">SBS Platform</h2>
        </div>
        
        <div className="flex gap-2">
          <button 
            className="btn btn-outline" 
            style={{ padding: '8px', border: 'none', color: currentView === 'dashboard' ? 'var(--accent-primary)' : 'var(--text-muted)' }}
            onClick={() => setView('dashboard')}
          >
            <Home size={20} />
          </button>
          <button 
            className="btn btn-outline" 
            style={{ padding: '8px', border: 'none', color: currentView === 'progress' ? 'var(--accent-primary)' : 'var(--text-muted)' }}
            onClick={() => setView('progress')}
          >
            <BarChart2 size={20} />
          </button>
          <button 
            className="btn btn-outline"
            style={{ padding: '8px', border: 'none', color: currentView === 'settings' ? 'var(--accent-primary)' : 'var(--text-muted)' }}
            onClick={() => setView('settings')}
          >
            <Settings size={20} />
          </button>
        </div>
      </div>
    </nav>
  );
}
