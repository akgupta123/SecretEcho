'use client';

import { forwardRef } from 'react';

export const Message = forwardRef(({ message, ...props }, ref) => {
  const isUser = message.sender === 'user';
  const className = `message ${isUser ? 'user-message' : 'ai-message'} ${props.className || ''}`;
  
  return (
    <div 
      ref={ref}
      className={`${className} mb-3`}
    >
      {message.content}
      <div className="text-xs opacity-70 mt-1 text-right">
        {new Date(message.createdAt).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
      </div>
    </div>
  );
});