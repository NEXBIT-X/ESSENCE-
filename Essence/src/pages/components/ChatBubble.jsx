import React from 'react';
import './ChatBubble.css';

const ChatBubble = ({ type, content, timestamp }) => (
  <div className={`chat-bubble ${type}`}> 
    <div className="chat-bubble-content">{content}</div>
    <div className="chat-bubble-timestamp">{timestamp}</div>
  </div>
);

export default ChatBubble;