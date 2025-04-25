'use client';

import { createContext, useContext, useState, useEffect, useCallback } from 'react';
import { toast } from 'react-hot-toast';
import { useAuth } from './AuthContext';
import { messagesAPI } from '../services/ApiService';
import { getSocket, emitTyping } from '../services/socket';

const ChatContext = createContext();

export const useChat = () => useContext(ChatContext);

export const ChatProvider = ({ children }) => {
  const { user } = useAuth();
  const [messages, setMessages] = useState([]);
  const [loading, setLoading] = useState(false);
  const [sending, setSending] = useState(false);
  const [isAiTyping, setIsAiTyping] = useState(false);
  const [pagination, setPagination] = useState({
    page: 1,
    pages: 1,
    total: 0,
    limit: 50,
  });
  const [hasMore, setHasMore] = useState(false);

  const fetchMessages = useCallback(async (page = 1) => {
    setLoading(true);
    try {
      const response = await messagesAPI.getMessages(page, pagination.limit);
      const { data, pagination: paginationData } = response.data;
      
      if (page === 1) {
        setMessages(data);
      } else {
        setMessages(prevMessages => [...data, ...prevMessages]);
      }
      
      setPagination(paginationData);
      setHasMore(paginationData.page < paginationData.pages);
    } catch (error) {
      console.error('Error fetching messages:', error);
      toast.error('Failed to load messages');
    } finally {
      setLoading(false);
    }
  }, [ pagination.limit]);

  const loadMoreMessages = useCallback(() => {
    if (hasMore && !loading) {
      fetchMessages(pagination.page + 1);
    }
  }, [fetchMessages, hasMore, loading, pagination.page]);

  
  const sendMessage = useCallback(async (content) => {
    if (!content.trim()  || sending) return;

    setSending(true);
    setIsAiTyping(true);
    
    try {
      emitTyping(true);
      
      const optimisticUserMessage = {
        _id: `temp-${Date.now()}`,
        sender: 'user',
        userId: user._id,
        content,
        createdAt: new Date().toISOString(),
        isRead: true,
        isOptimistic: true,
      };
      
      setMessages(prev => [...prev, optimisticUserMessage]);
      
      const response = await messagesAPI.sendMessage(content);
      const { userMessage, aiMessage } = response.data.data;
      
      setMessages(prev => 
        prev.map(msg => 
          msg._id === optimisticUserMessage._id ? userMessage : msg
        )
      );
      

      await messagesAPI.markAsRead();
      
      return true;
    } catch (error) {
      console.error('Error sending message:', error);
      toast.error('Failed to send message');
      
      setMessages(prev => prev.filter(msg => !msg.isOptimistic));
      
      return false;
    } finally {
      setSending(false);
      emitTyping(false);
    }
  }, [isAuthenticated, sending, user]);

  useEffect(() => {

    const socket = getSocket();
    if (!socket) return;

    const handleMessage = (message) => {
      if (message.sender === 'ai') {
        setIsAiTyping(true);
        setTimeout(() => {
          setMessages(prev => [...prev, message]);
          setIsAiTyping(false);
        }, 500);
      } else {
        if (!messages.some(m => m._id === message._id)) {
          setMessages(prev => [...prev, message]);
        }
      }
    };

    socket.on('message', handleMessage);

    return () => {
      socket.off('message', handleMessage);
    };
  }, [isAuthenticated, messages]);

  useEffect(() => {
    if (isAuthenticated) {
      fetchMessages(1);
    }
  }, [isAuthenticated, fetchMessages]);

  const value = {
    messages,
    loading,
    sending,
    isAiTyping,
    pagination,
    hasMore,
    sendMessage,
    loadMoreMessages,
    fetchMessages,
  };

  return <ChatContext.Provider value={value}>{children}</ChatContext.Provider>;
};