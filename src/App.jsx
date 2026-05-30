import { useState, useEffect } from 'react'
import Dashboard from './components/Dashboard'
import WorkoutSession from './components/WorkoutSession'
import ProgramSelector from './components/ProgramSelector'
import ProgressChart from './components/ProgressChart'
import Navbar from './components/Navbar'

const getSavedState = (key, defaultVal) => {
  const saved = localStorage.getItem(key);
  return saved ? JSON.parse(saved) : defaultVal;
};

const formatDate = (date) => {
  return `${date.getDate().toString().padStart(2, '0')}/${(date.getMonth() + 1).toString().padStart(2, '0')}`;
};

function App() {
  const [currentView, setCurrentView] = useState('dashboard')
  
  // States with localStorage persistence
  const [maxes, setMaxes] = useState(() => getSavedState('sbs_maxes', {
    squat: 100,
    bench: 80,
    deadlift: 120
  }))

  const [selectedPrograms, setSelectedPrograms] = useState(() => getSavedState('sbs_programs', {
    squat: 'sq_1x_beg',
    bench: 'bn_2x_beg',
    deadlift: 'dl_1x_beg'
  }))

  const [maxHistory, setMaxHistory] = useState(() => {
    const saved = localStorage.getItem('sbs_history');
    if (saved) {
      let parsed = JSON.parse(saved);
      // Migration: se tiver os dados fictícios "Week 1", "Current", etc, convertemos para datas reais passadas
      if (parsed.some(item => typeof item.date === 'string' && (item.date.includes('Week') || item.date === 'Current'))) {
        const now = new Date();
        parsed = parsed.map((item, index) => {
          const d = new Date(now);
          d.setDate(now.getDate() - (parsed.length - 1 - index) * 7); // Volta 7 dias para cada item anterior
          return { ...item, date: formatDate(d) };
        });
      }
      return parsed;
    }

    // Default history com datas reais de semanas anteriores
    const now = new Date();
    const w3 = new Date(now); w3.setDate(now.getDate() - 21);
    const w2 = new Date(now); w2.setDate(now.getDate() - 14);
    const w1 = new Date(now); w1.setDate(now.getDate() - 7);

    return [
      { date: formatDate(w3), squat: 85, bench: 70, deadlift: 105 },
      { date: formatDate(w2), squat: 90, bench: 75, deadlift: 110 },
      { date: formatDate(w1), squat: 95, bench: 75, deadlift: 115 },
      { date: formatDate(now), squat: 100, bench: 80, deadlift: 120 },
    ];
  })

  const [activeWorkout, setActiveWorkout] = useState(null)

  // Save to localStorage whenever these states change
  useEffect(() => { localStorage.setItem('sbs_maxes', JSON.stringify(maxes)) }, [maxes])
  useEffect(() => { localStorage.setItem('sbs_programs', JSON.stringify(selectedPrograms)) }, [selectedPrograms])
  useEffect(() => { localStorage.setItem('sbs_history', JSON.stringify(maxHistory)) }, [maxHistory])

  const startWorkout = (workoutType) => {
    setActiveWorkout(workoutType)
    setCurrentView('workout')
  }

  const finishWorkout = (newMaxes) => {
    if (newMaxes) {
      const updatedMaxes = { ...maxes, ...newMaxes }
      setMaxes(updatedMaxes)
      
      const now = new Date()
      setMaxHistory(prev => [...prev, { date: formatDate(now), ...updatedMaxes }])
    }
    setActiveWorkout(null)
    setCurrentView('dashboard')
  }

  return (
    <div className="app-container">
      <Navbar currentView={currentView} setView={setCurrentView} />
      
      <main style={{ padding: '24px', maxWidth: '800px', margin: '0 auto' }}>
        {currentView === 'dashboard' && (
          <Dashboard 
            maxes={maxes} 
            setMaxes={setMaxes} 
            selectedPrograms={selectedPrograms}
            onStartWorkout={startWorkout} 
          />
        )}

        {currentView === 'progress' && (
          <ProgressChart history={maxHistory} />
        )}

        {currentView === 'settings' && (
          <ProgramSelector 
            selectedPrograms={selectedPrograms}
            onSave={(newProgs) => {
              setSelectedPrograms(newProgs)
              setCurrentView('dashboard')
            }}
          />
        )}
        
        {currentView === 'workout' && (
          <WorkoutSession 
            workoutType={activeWorkout} 
            maxes={maxes} 
            selectedPrograms={selectedPrograms}
            onFinish={finishWorkout} 
            onCancel={() => {
              setActiveWorkout(null)
              setCurrentView('dashboard')
            }}
          />
        )}
      </main>
    </div>
  )
}

export default App
