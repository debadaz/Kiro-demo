import { useState } from 'react'
import { LoginForm } from './components/LoginForm/LoginForm'
import { WelcomePage } from './components/WelcomePage/WelcomePage'
import styles from './App.module.css'

function App() {
  const [loggedIn, setLoggedIn] = useState(false)

  return (
    <div className={styles.wrapper}>
      <header className={styles.header}>
        <h1>Created by Kiro</h1>
      </header>
      <main>
        {loggedIn ? (
          <WelcomePage />
        ) : (
          <LoginForm onLoginSuccess={() => setLoggedIn(true)} />
        )}
      </main>
    </div>
  )
}

export default App
