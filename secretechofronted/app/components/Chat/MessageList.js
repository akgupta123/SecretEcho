import Message from './Message';
import styles from './chat.module.css';

export default function MessageList({ messages, userId }) {
  return (
    <div className={styles.messageList}>
      {messages.map((message) => (
        <Message 
          key={message._id} 
          message={message} 
          isCurrentUser={message.sender === userId}
        />
      ))}
    </div>
  );
}