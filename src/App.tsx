import { useState } from 'react'
import { LoginForm } from './components/LoginForm/LoginForm'
import { WelcomePage } from './components/WelcomePage/WelcomePage'
import { CIAgentForm } from './components/CIAgentForm/CIAgentForm'
import styles from './App.module.css'

type Page = 'login' | 'welcome' | 'ciAgent'

function App() {
  const [currentPage, setCurrentPage] = useState<Page>('login')

  const handleLoginSuccess = () => {
    setCurrentPage('welcome')
  }

  const handleLogout = () => {
    setCurrentPage('login')
  }

  const handleNavigateToCIAgent = () => {
    setCurrentPage('ciAgent')
  }

  const handleCIAgentSuccess = () => {
    setCurrentPage('welcome')
  }

  const handleBackToWelcome = () => {
    setCurrentPage('welcome')
  }

  return (
    <div className={styles.wrapper}>
      <header className={styles.header}>
        <h1>Created by Kiro</h1>
      </header>
      <main>
        {currentPage === 'login' && (
          <LoginForm onLoginSuccess={handleLoginSuccess} />
        )}
        {currentPage === 'welcome' && (
          <WelcomePage
            onLogout={handleLogout}
            onNavigateToCIAgent={handleNavigateToCIAgent}
          />
        )}
        {currentPage === 'ciAgent' && (
          <CIAgentForm
            onSuccess={handleCIAgentSuccess}
            onBack={handleBackToWelcome}
          />
        )}
      </main>
    </div>
  )
}

export default App
