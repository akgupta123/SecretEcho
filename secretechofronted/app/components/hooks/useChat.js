import { useState, useEffect } from 'react';
import { useAuth } from '../../../contexts/AuthContext';
import { getMessages, sendMessage } from '../../../services/chatservice';
import { socket } from '@/services/socketSevice';
export default function useChat() {
  const { user } = useAuth();

  const [messages, setMessages] = useState([]);
  const [loading, setLoading] = useState(true);
  const [aiTyping, setAiTyping] = useState(false);

  useEffect(() => {
    if (!user) return;

    const loadMessages = async () => {
      try {
        const data = await getMessages();
        setMessages(data);
      } catch (err) {
        console.error('Failed to load messages:', err);
      } finally {
        setLoading(false);
      }
    };

    loadMessages();

    if (socket) {
      socket.emit('joinRoom', user._id);
      
      socket.on('newMessage', (message) => {
        setMessages(prev => [...prev, message]);
        if (message.isAI) {
          setAiTyping(false);
        }
      });
    }

    return () => {
      if (socket) {
        socket.off('newMessage');
      }
    };
  }, [user, socket]);

  const handleSendMessage = async (content) => {
    if (!content.trim()) return;

    const userMessage = {
      _id: Date.now().toString(),
      content,
      sender: user._id,
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

  return { messages, loading, aiTyping, handleSendMessage };
}