import React from 'react';
import './MosaicCard.css';

const MosaicCard = ({ title, coverImage, progress, onClick, completed }) => (
  <div className={`mosaic-card-glass${completed ? ' completed' : ''}`} onClick={onClick}>
    <div className="mosaic-card-image">
      <img src={coverImage} alt={title} />
      {completed && <div className="mosaic-card-check">✔</div>}
    </div>
    <div className="mosaic-card-title">{title}</div>
    <div className="mosaic-card-progress">
      <div className="mosaic-card-progress-bar" style={{ width: progress + '%' }} />
    </div>
  </div>
);

export default MosaicCard;