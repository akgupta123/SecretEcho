import { format } from 'date-fns';
import styles from './chat.module.css';

export default function Message({ message, isCurrentUser }) {
  return (
    <div className={`${styles.message} ${isCurrentUser ? styles.userMessage : styles.aiMessage}`}>
      <div className={styles.messageContent}>
        <p>{message.content}</p>
        <span className={styles.messageTime}>
          {format(new Date(message.createdAt), 'h:mm a')}
        </span>
      </div>
    </div>
  );
}