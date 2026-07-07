import { useState } from 'react'
import { AnimatePresence, motion } from 'framer-motion'
import DynamicBackground from './components/DynamicBackground'
import Sidebar from './components/Sidebar'
import TopNav from './components/TopNav'
import Dashboard from './components/Dashboard'
import TodoList from './components/TodoList'
import DailyPlanner from './components/DailyPlanner'
import DailyGoals from './components/DailyGoals'
import PomodoroTimer from './components/PomodoroTimer'
import MotivationQuote from './components/MotivationQuote'
import WeatherWidget from './components/WeatherWidget'

const features = {
  todo: { component: TodoList, title: 'Todo List', icon: 'CheckSquare' },
  planner: { component: DailyPlanner, title: 'Daily Planner', icon: 'Calendar' },
  goals: { component: DailyGoals, title: 'Daily Goals', icon: 'Target' },
  pomodoro: { component: PomodoroTimer, title: 'Focus Timer', icon: 'Timer' },
  motivation: { component: MotivationQuote, title: 'Motivation', icon: 'Sparkles' },
  weather: { component: WeatherWidget, title: 'Weather', icon: 'CloudSun' },
}

export default function App() {
  const [activeFeature, setActiveFeature] = useState(null)
  const [sidebarCollapsed, setSidebarCollapsed] = useState(false)

  const openFeature = (key) => setActiveFeature(key)
  const closeFeature = () => setActiveFeature(null)

  const FeatureComponent = activeFeature ? features[activeFeature].component : null
  const featureTitle = activeFeature ? features[activeFeature].title : ''

  return (
    <div className="min-h-screen flex" style={{ background: 'var(--bg)' }}>
      <DynamicBackground />
      <Sidebar
        collapsed={sidebarCollapsed}
        onToggle={() => setSidebarCollapsed(prev => !prev)}
        activeFeature={activeFeature}
        onNavigate={(key) => {
          if (key === 'dashboard') setActiveFeature(null)
          else setActiveFeature(key)
        }}
        features={features}
      />
      <div className="flex-1 flex flex-col min-w-0" style={{ marginLeft: sidebarCollapsed ? 'var(--sidebar-collapsed)' : 'var(--sidebar-width)', transition: 'margin-left var(--transition-slow)' }}>
        <TopNav
          title={featureTitle || 'Dashboard'}
          hasBack={!!activeFeature}
          onBack={closeFeature}
          sidebarCollapsed={sidebarCollapsed}
        />
        <main className="flex-1 px-8 py-6 overflow-y-auto">
          <AnimatePresence mode="wait">
            <motion.div
              key={activeFeature || 'dashboard'}
              initial={{ opacity: 0, y: 12 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -12 }}
              transition={{ duration: 0.2, ease: [0.4, 0, 0.2, 1] }}
            >
              {activeFeature ? (
                <div className="max-w-4xl">
                  <FeatureComponent />
                </div>
              ) : (
                <Dashboard onOpen={openFeature} />
              )}
            </motion.div>
          </AnimatePresence>
        </main>
      </div>
    </div>
  )
}
