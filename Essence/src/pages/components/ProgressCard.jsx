import React from 'react';
import './ProgressCard.css';

const ProgressCard = ({ icon, label, value }) => (
  <div className="progress-card-glass">
    <div className="progress-card-icon">{icon}</div>
    <div className="progress-card-content">
      <div className="progress-card-value">{value}</div>
      <div className="progress-card-label">{label}</div>
    </div>
  </div>
);

export default ProgressCard;