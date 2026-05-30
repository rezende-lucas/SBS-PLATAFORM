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

  const defaultHistory = [
    { date: 'Week 1', squat: 85, bench: 70, deadlift: 105 },
    { date: 'Week 2', squat: 90, bench: 75, deadlift: 110 },
    { date: 'Week 3', squat: 95, bench: 75, deadlift: 115 },
    { date: 'Current', squat: 100, bench: 80, deadlift: 120 },
  ];
  
  const [maxHistory, setMaxHistory] = useState(() => getSavedState('sbs_history', defaultHistory))

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
      
      // Add a new history entry if we've completed a cycle/session that changes maxes
      const now = new Date()
      const dateString = `${now.getDate()}/${now.getMonth() + 1}`
      setMaxHistory(prev => [...prev, { date: dateString, ...updatedMaxes }])
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
