import { useState } from 'react'
import styles from './WelcomePage.module.css'

export function WelcomePage({ onLogout, onNavigateToCIAgent }: { onLogout: () => void; onNavigateToCIAgent: () => void }) {
  return (
    <div className={styles.container}>
      <h2 className={styles.heading}>
        Welcome to Commercial Engineering DevOps team page
      </h2>
      <div className={styles.buttonGroup}>
        <button onClick={onNavigateToCIAgent} className={styles.ciAgentButton}>
          Configure CI Agent
        </button>
        <button onClick={onLogout} className={styles.logoutButton}>
          Logout
        </button>
      </div>
    </div>
  )
}
