import React, { useState } from 'react';
import { LIFT_PROGRAMS } from '../data/programsData';
import { Save } from 'lucide-react';

export default function ProgramSelector({ selectedPrograms, onSave }) {
  const [selections, setSelections] = useState(selectedPrograms);

  const handleChange = (lift, programId) => {
    setSelections(prev => ({ ...prev, [lift]: programId }));
  };

  const handleSave = () => {
    onSave(selections);
  };

  return (
    <div className="flex flex-col gap-6">
      <header className="mb-4">
        <h1 style={{ fontSize: '32px' }}>Programs</h1>
        <p className="text-muted" style={{ color: 'var(--text-muted)' }}>Select your SBS 28 programs</p>
      </header>

      {Object.entries(LIFT_PROGRAMS).map(([lift, programs]) => (
        <section key={lift} className="glass-panel">
          <h2 style={{ textTransform: 'capitalize', fontSize: '20px', marginBottom: '16px' }} className="text-gradient">
            {lift} Routine
          </h2>
          <div className="input-group">
            <select 
              className="input-field" 
              value={selections[lift]} 
              onChange={e => handleChange(lift, e.target.value)}
              style={{ cursor: 'pointer' }}
            >
              {programs.map(p => (
                <option key={p.id} value={p.id} style={{ background: 'var(--bg-dark)' }}>
                  {p.name}
                </option>
              ))}
            </select>
          </div>
        </section>
      ))}

      <button className="btn btn-primary mt-4" style={{ padding: '16px', fontSize: '16px' }} onClick={handleSave}>
        <Save size={20} /> Save Configuration
      </button>
    </div>
  );
}
