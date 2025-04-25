import styles from './chat.module.css';

export default function ChatHeader({ onLogout }) {
  return (
    <div className={styles.chatHeader}>
      <div className={styles.headerContent}>
        <h1>SecretEcho</h1>
        <p>Your AI Companion</p>
      </div>
      <button onClick={onLogout} className={styles.logoutButton}>
        Logout
      </button>
    </div>
  );
}