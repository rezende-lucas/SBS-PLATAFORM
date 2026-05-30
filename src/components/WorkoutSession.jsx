import React, { useState, useEffect } from 'react';
import { calculateNextMax, calculateWeight } from '../utils/sbsLogic';
import { getWorkoutSchema } from '../data/programsData';
import { CheckCircle, X, ChevronRight } from 'lucide-react';

export default function WorkoutSession({ workoutType, maxes, onFinish, onCancel }) {
  const { lift, programId, dayIndex } = workoutType;
  const currentMax = maxes[lift] || 100;
  
  const [sets, setSets] = useState([]);

  useEffect(() => {
    const schema = getWorkoutSchema(programId, dayIndex);
    const populatedSets = schema.map(s => ({
      ...s,
      weight: calculateWeight(currentMax, s.percentage),
      completed: false,
      repsDone: 0
    }));
    setSets(populatedSets);
  }, [programId, dayIndex, currentMax]);

  const completeSet = (id, reps) => {
    setSets(sets.map(s => s.id === id ? { ...s, completed: true, repsDone: reps } : s));
  };

  const handleFinish = () => {
    const amapSet = sets.find(s => s.type === 'amap');
    
    // If the program had an AMAP set, we calculate the next max.
    // If it didn't, the max stays the same for next week.
    let nextMax = currentMax;
    if (amapSet && amapSet.completed) {
      nextMax = calculateNextMax(currentMax, amapSet.percentage, amapSet.repsDone);
    }
    
    onFinish({ [lift]: nextMax });
  };

  if (sets.length === 0) return <div>Loading...</div>;

  return (
    <div className="flex flex-col gap-6">
      <header className="flex justify-between items-center mb-4">
        <div>
          <h1 style={{ fontSize: '28px', textTransform: 'capitalize' }}>{lift} Day {dayIndex}</h1>
          <p style={{ color: 'var(--accent-secondary)', fontWeight: 600 }}>Training Max: {currentMax} kg</p>
        </div>
        <button className="btn btn-outline" onClick={onCancel} style={{ padding: '8px', border: 'none' }}>
          <X size={24} />
        </button>
      </header>

      <div className="flex flex-col gap-4">
        {sets.map(set => (
          <div key={set.id} className="glass-panel flex items-center justify-between" style={{ padding: '16px', background: set.completed ? 'rgba(34, 197, 94, 0.1)' : 'var(--glass-bg)', borderColor: set.completed ? 'var(--accent-success)' : 'var(--glass-border)' }}>
            
            <div className="flex items-center gap-4">
              <div style={{ 
                width: '40px', height: '40px', borderRadius: '50%', 
                background: set.type === 'amap' ? 'var(--accent-secondary)' : 'rgba(255,255,255,0.05)',
                display: 'flex', alignItems: 'center', justifyContent: 'center',
                fontWeight: 'bold', fontSize: '18px', color: set.type === 'amap' ? 'white' : 'var(--text-muted)'
              }}>
                {set.id}
              </div>
              <div>
                <div style={{ fontSize: '20px', fontWeight: 'bold' }}>{set.weight} <span style={{fontSize: '14px', color:'var(--text-muted)'}}>kg</span></div>
                <div style={{ color: 'var(--text-muted)' }}>{set.targetReps} reps @ {Math.round(set.percentage * 100)}%</div>
              </div>
            </div>

            {set.completed ? (
              <div className="flex items-center gap-2" style={{ color: 'var(--accent-success)', fontWeight: 'bold' }}>
                <CheckCircle size={20} /> {set.repsDone} reps
              </div>
            ) : (
              <div className="flex items-center gap-2">
                {set.type === 'amap' ? (
                  <input 
                    type="number" 
                    placeholder="Reps?" 
                    className="input-field" 
                    style={{ width: '80px', padding: '8px', textAlign: 'center' }}
                    id={`reps-${set.id}`}
                  />
                ) : null}
                <button 
                  className="btn btn-primary" 
                  style={{ padding: '8px 16px', background: set.type === 'amap' ? 'var(--accent-secondary)' : '' }}
                  onClick={() => {
                    const repsInput = document.getElementById(`reps-${set.id}`);
                    const reps = set.type === 'amap' ? (repsInput ? Number(repsInput.value) : 0) : set.targetReps;
                    if (set.type === 'amap' && (!reps || reps <= 0)) {
                      alert("Please enter the number of reps you completed.");
                      return;
                    }
                    completeSet(set.id, reps);
                  }}
                >
                  <CheckCircle size={18} /> {set.type === 'amap' ? 'Done' : 'Complete'}
                </button>
              </div>
            )}
          </div>
        ))}
      </div>

      <div className="mt-8 flex justify-center">
        <button 
          className="btn btn-primary" 
          style={{ 
            width: '100%', padding: '16px', fontSize: '18px', 
            background: sets.every(s => s.completed) ? 'var(--accent-success)' : 'var(--glass-bg)',
            color: sets.every(s => s.completed) ? 'white' : 'var(--text-muted)',
            cursor: sets.every(s => s.completed) ? 'pointer' : 'not-allowed',
            border: sets.every(s => s.completed) ? 'none' : '1px solid var(--border-color)'
          }}
          onClick={handleFinish}
          disabled={!sets.every(s => s.completed)}
        >
          Finish Workout & Update Maxes <ChevronRight size={20} />
        </button>
      </div>
    </div>
  );
}
