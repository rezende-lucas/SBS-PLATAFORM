import React, { useState } from 'react';
import { Play, TrendingUp, Edit2, Check } from 'lucide-react';
import { LIFT_PROGRAMS } from '../data/programsData';

export default function Dashboard({ maxes, setMaxes, selectedPrograms, onStartWorkout }) {
  const [editing, setEditing] = useState(false);
  const [tempMaxes, setTempMaxes] = useState(maxes);

  const handleSave = () => {
    setMaxes(tempMaxes);
    setEditing(false);
  };

  const getProgramInfo = (lift) => {
    const progId = selectedPrograms[lift];
    return LIFT_PROGRAMS[lift].find(p => p.id === progId);
  };

  return (
    <div className="flex flex-col gap-6">
      <header className="flex justify-between items-center mb-4">
        <div>
          <h1 style={{ fontSize: '32px' }}>Welcome back.</h1>
          <p className="text-muted" style={{ color: 'var(--text-muted)' }}>Ready to get stronger today?</p>
        </div>
      </header>

      <section className="glass-panel">
        <div className="flex justify-between items-center mb-4">
          <h2 className="flex items-center gap-2 text-gradient" style={{ fontSize: '20px' }}><TrendingUp size={20} /> Training Maxes</h2>
          {editing ? (
            <button className="btn btn-outline" style={{ padding: '6px 12px' }} onClick={handleSave}>
              <Check size={16} /> Save
            </button>
          ) : (
            <button className="btn btn-outline" style={{ padding: '6px 12px' }} onClick={() => setEditing(true)}>
              <Edit2 size={16} /> Edit
            </button>
          )}
        </div>
        
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(140px, 1fr))', gap: '16px' }}>
          {Object.entries(maxes).map(([lift, weight]) => (
            <div key={lift} style={{ background: 'rgba(0,0,0,0.2)', padding: '16px', borderRadius: '12px', border: '1px solid var(--border-color)' }}>
              <div style={{ textTransform: 'capitalize', color: 'var(--text-muted)', fontSize: '14px', marginBottom: '8px' }}>{lift}</div>
              {editing ? (
                <input 
                  type="number" 
                  className="input-field" 
                  style={{ width: '100%', padding: '8px' }}
                  value={tempMaxes[lift]}
                  onChange={e => setTempMaxes({...tempMaxes, [lift]: Number(e.target.value)})}
                />
              ) : (
                <div style={{ fontSize: '24px', fontWeight: 'bold', fontFamily: 'var(--font-display)' }}>
                  {weight} <span style={{ fontSize: '14px', color: 'var(--text-muted)' }}>kg</span>
                </div>
              )}
            </div>
          ))}
        </div>
      </section>

      <section className="flex flex-col gap-4 mt-4">
        <h2 style={{ fontSize: '20px' }}>Today's Workouts</h2>
        <div style={{ display: 'grid', gridTemplateColumns: '1fr', gap: '12px' }}>
          {['squat', 'bench', 'deadlift'].map(lift => {
            const prog = getProgramInfo(lift);
            if (!prog) return null;
            
            const days = [];
            for(let i = 1; i <= prog.daysPerWeek; i++) {
              days.push(
                <div key={`${lift}-d${i}`} className="glass-panel flex justify-between items-center" style={{ padding: '16px 20px' }}>
                  <div>
                    <h3 style={{ fontSize: '18px', marginBottom: '4px', textTransform: 'capitalize' }}>{lift} Day {i}</h3>
                    <p style={{ color: 'var(--text-muted)', fontSize: '14px' }}>{prog.name}</p>
                  </div>
                  <button className="btn btn-primary" onClick={() => onStartWorkout({ lift, programId: prog.id, dayIndex: i })}>
                    <Play size={18} fill="currentColor" /> Start
                  </button>
                </div>
              );
            }
            return days;
          })}
        </div>
      </section>
    </div>
  );
}
