import { useState } from 'react'
import LoginPage from './components/LoginPage'
import Dashboard from './components/Dashboard'
import ESADashboard from './components/ESADashboard'
import './App.css'

function App() {
  const [isLoggedIn, setIsLoggedIn] = useState(false)
  const [currentView, setCurrentView] = useState('main') // 'main' ou 'esa'

  const handleLogin = () => {
    setIsLoggedIn(true)
    setCurrentView('main')
  }

  const handleLogout = () => {
    setIsLoggedIn(false)
    setCurrentView('main')
  }

  const handleNavigateToESA = () => {
    setCurrentView('esa')
  }

  const handleNavigateBack = () => {
    setCurrentView('main')
  }

  if (!isLoggedIn) {
    return <LoginPage onLogin={handleLogin} />
  }

  if (currentView === 'esa') {
    return (
      <ESADashboard 
        onLogout={handleLogout} 
        onNavigateBack={handleNavigateBack}
      />
    )
  }

  return (
    <Dashboard 
      onLogout={handleLogout} 
      onNavigateToESA={handleNavigateToESA}
    />
  )
}

export default App

