import { LoginForm } from './components/LoginForm/LoginForm'
import styles from './App.module.css'

function App() {
  return (
    <div className={styles.wrapper}>
      <header className={styles.header}>
        <h1>Created by Kiro</h1>
      </header>
      <main>
        <LoginForm />
      </main>
    </div>
  )
}

export default App
