import React from 'react';
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer } from 'recharts';

export default function ProgressChart({ history }) {
  if (!history || history.length === 0) {
    return (
      <div className="flex flex-col gap-6">
        <header className="mb-4">
          <h1 style={{ fontSize: '32px' }}>Evolution</h1>
          <p className="text-muted" style={{ color: 'var(--text-muted)' }}>Track your Training Max progress over time</p>
        </header>
        <div className="flex justify-center items-center glass-panel" style={{ height: '300px', color: 'var(--text-muted)' }}>
          No training history available yet. Finish a workout to start tracking!
        </div>
      </div>
    );
  }

  return (
    <div className="flex flex-col gap-6">
      <header className="mb-4">
        <h1 style={{ fontSize: '32px' }}>Evolution</h1>
        <p className="text-muted" style={{ color: 'var(--text-muted)' }}>Track your Training Max progress over time</p>
      </header>

      <section className="glass-panel" style={{ height: '400px', padding: '24px 24px 24px 0' }}>
        <ResponsiveContainer width="100%" height="100%">
          <LineChart data={history} margin={{ top: 5, right: 30, left: 0, bottom: 5 }}>
            <CartesianGrid strokeDasharray="3 3" stroke="rgba(255,255,255,0.05)" vertical={false} />
            <XAxis dataKey="date" stroke="var(--text-muted)" tick={{ fill: 'var(--text-muted)' }} axisLine={false} tickLine={false} />
            <YAxis stroke="var(--text-muted)" tick={{ fill: 'var(--text-muted)' }} axisLine={false} tickLine={false} />
            <Tooltip 
              contentStyle={{ background: 'var(--glass-bg)', border: '1px solid var(--glass-border)', borderRadius: '12px', color: 'white' }}
              itemStyle={{ fontWeight: 'bold' }}
            />
            <Legend wrapperStyle={{ paddingTop: '20px' }} />
            <Line type="monotone" dataKey="squat" name="Squat" stroke="#3b82f6" strokeWidth={3} dot={{ r: 4 }} activeDot={{ r: 6 }} />
            <Line type="monotone" dataKey="bench" name="Bench" stroke="#f97316" strokeWidth={3} dot={{ r: 4 }} activeDot={{ r: 6 }} />
            <Line type="monotone" dataKey="deadlift" name="Deadlift" stroke="#22c55e" strokeWidth={3} dot={{ r: 4 }} activeDot={{ r: 6 }} />
          </LineChart>
        </ResponsiveContainer>
      </section>
    </div>
  );
}
