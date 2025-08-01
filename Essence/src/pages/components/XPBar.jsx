import React from 'react';
import './XPBar.css';

const XPBar = ({ xp, maxXp }) => {
  const percent = Math.min(100, (xp / maxXp) * 100);
  return (
    <div className="xpbar-glass">
      <div className="xpbar-fill" style={{ width: percent + '%' }} />
      <span className="xpbar-label">{xp} / {maxXp} XP</span>
    </div>
  );
};

export default XPBar;