import React, { useState, useRef, useEffect } from 'react';
import ChatBubble from './components/ChatBubble.jsx';
import Button from './components/Button.jsx';
import { getCulturalChatResponse } from '../services/api.js';

const mockIntro = (title) => `Welcome to the ${title} lesson! Ask me anything about this culture, and I'll answer with real insights.`;

const MosaicChat = ({ mosaic, onBack }) => {
  const [messages, setMessages] = useState([
    { id: 1, type: 'assistant', content: mockIntro(mosaic.title), timestamp: new Date().toLocaleTimeString() }
  ]);
  const [input, setInput] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [completed, setCompleted] = useState(false);
  const chatEndRef = useRef(null);

  useEffect(() => { chatEndRef.current?.scrollIntoView({ behavior: 'smooth' }); }, [messages]);

  const handleSend = async () => {
    if (!input.trim()) return;
    
    console.log('Sending message:', input);
    console.log('Mosaic context:', mosaic);
    
    const userMsg = { id: messages.length + 1, type: 'user', content: input, timestamp: new Date().toLocaleTimeString() };
    setMessages(msgs => [...msgs, userMsg]);
    setInput('');
    setIsLoading(true);
    
    try {
      console.log('Calling getCulturalChatResponse...');
      const aiResponse = await getCulturalChatResponse(input, mosaic);
      console.log('AI Response received:', aiResponse);
      
      const aiMsg = {
        id: messages.length + 2,
        type: 'assistant',
        content: aiResponse,
        timestamp: new Date().toLocaleTimeString()
      };
      setMessages(msgs => [...msgs, aiMsg]);
      setCompleted(true);
    } catch (error) {
      console.error('Error getting AI response:', error);
      const errorMsg = {
        id: messages.length + 2,
        type: 'assistant',
        content: `I'm having trouble connecting right now. Error: ${error.message}. Let me try to help you learn about ${mosaic.title} in a different way!`,
        timestamp: new Date().toLocaleTimeString()
      };
      setMessages(msgs => [...msgs, errorMsg]);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="mosaic-chat-page">
      <div className="mosaic-chat-header">
        <Button text="← Back" onClick={onBack} className="btn-secondary" />
        <img src={mosaic.coverImage} alt={mosaic.title} className="mosaic-chat-cover" />
        <h2>{mosaic.title}</h2>
      </div>
      <div className="chat-messages">
        {messages.map(msg => (
          <ChatBubble key={msg.id} type={msg.type} content={msg.content} timestamp={msg.timestamp} />
        ))}
        {isLoading && (
          <ChatBubble type="assistant" content={<span className="typing-indicator"><span></span><span></span><span></span></span>} />
        )}
        <div ref={chatEndRef} />
      </div>
      <div className="chat-input">
        <textarea
          value={input}
          onChange={e => setInput(e.target.value)}
          onKeyDown={e => { if (e.key === 'Enter' && !e.shiftKey) { e.preventDefault(); handleSend(); } }}
          placeholder="Ask about this culture..."
          disabled={isLoading}
        />
        <Button text="Send" onClick={handleSend} disabled={!input.trim() || isLoading} className="btn-primary" />
      </div>
      {completed && (
        <div className="lesson-complete-glass">
          <div>🎉 Lesson Complete! +20 XP</div>
          <Button text="Next Lesson" className="btn-primary" onClick={onBack} />
        </div>
      )}
    </div>
  );
};

export default MosaicChat;