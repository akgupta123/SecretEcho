import { useState, useEffect, useRef } from 'react';
import { useAuth } from '../../../contexts/AuthContext';
import MessageList from './MessageList';
import MessageInput from './MessageInput';
import ChatHeader from './ChatHeader';
import { getMessages, sendMessage } from '../../../services/chatservice';
import styles from './chat.module.css';
import { Spinner } from '../ui/Spinner';
import { initializeSocket, socket } from '@/services/socketSevice';
import { useRouter } from 'next/navigation';
export default function ChatPage() {
  const { user, logout } = useAuth();
  const [messages, setMessages] = useState([]);
  const [loading, setLoading] = useState(true);
  const [aiTyping, setAiTyping] = useState(false);
  const messagesEndRef = useRef(null);
  const router = useRouter();
  useEffect(() => {
    if (!localStorage.getItem('token') && localStorage.getItem('token') === null) {
      router.push('/');
    }
    else if(localStorage.getItem('token')!=null) {
    initializeSocket(localStorage.getItem('token'))
    }
  }, [user, loading, router]);

  useEffect(() => {
   if(!localStorage.getItem('token'))
    return;

    const loadMessages = async () => {
      try {
        const data = await getMessages();
        setMessages(data?.data);
      } catch (err) {
        console.error('Failed to load messages:', err);
      } finally {
        setLoading(false);
      }
    };

    loadMessages();

    if (socket) {
      socket.on('message', (message) => {
        console.log(message,"message")
        setMessages(prev => [...prev, message]);
        if (message.sender === "ai") {
          setAiTyping(false);
        }
      });
    }

    return () => {
      if (socket) {
        socket.off('message');
      }
    };
  }, [user, socket]);

  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  const handleSendMessage = async (content) => {
    if (!content.trim()) return;
    const userMessage = {
      _id: Date.now().toString(),
      content,
      //sender: user._id,
      isAI: false,
      createdAt: new Date().toISOString()
    };
    setMessages(prev => [...prev, userMessage]);
    
    try {
      setAiTyping(true);
      
      await sendMessage(content);
    } catch (err) {
      console.error('Failed to send message:', err);
      setAiTyping(false);
      setMessages(prev => prev.filter(msg => msg._id !== userMessage._id));
    }
  };

  if (loading) {
     <Spinner/>
  }

  return (
    <div className={styles.chatContainer}>
      <ChatHeader onLogout={logout} />
      
      <div className={styles.messagesContainer}>
        <MessageList messages={messages} userId={user?._id} />
        {aiTyping && (
          <div className={styles.typingIndicator}>
            <div className={styles.typingDot} />
            <div className={styles.typingDot} />
            <div className={styles.typingDot} />
            <span>AI is thinking...</span>
          </div>
        )}
        <div ref={messagesEndRef} />
      </div>
      
      <div className={styles.inputContainer}>
        <MessageInput onSend={handleSendMessage} />
      </div>
    </div>
  );
}