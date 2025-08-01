import React from 'react';
import Container from "./components/Container.jsx";
import XPBar from './components/XPBar.jsx';
import ProgressCard from './components/ProgressCard.jsx';
import Button from './components/Button.jsx';

function Dash() {
    // Mock user data
    const userStats = {
        xp: 320,
        maxXp: 500,
        streak: 7,
        completed: 12,
        total: 20,
        recent: [
            { id: 1, title: 'Japanese Tea Ceremony', time: '2h ago', xp: 20 },
            { id: 2, title: 'Moroccan Cuisine', time: '1d ago', xp: 15 },
            { id: 3, title: 'Italian Renaissance Art', time: '3d ago', xp: 25 },
        ]
    };

    return (
        <div className="dashboard-page">
            <Container>
                <div className="dashboard-header">
                    <h1>Welcome back!</h1>
                    <p>Track your cultural learning journey and discover new experiences</p>
                </div>
                <XPBar xp={userStats.xp} maxXp={userStats.maxXp} />
                <div className="stats-grid">
                    <ProgressCard icon="🔥" label="Streak" value={userStats.streak + ' days'} />
                    <ProgressCard icon="✅" label="Completed" value={userStats.completed + '/' + userStats.total} />
                    <ProgressCard icon="⭐" label="XP" value={userStats.xp} />
                </div>
                <div className="dashboard-section">
                    <h2>Recent Activity</h2>
                    <ul className="recent-list">
                        {userStats.recent.map(item => (
                            <li key={item.id} className="recent-item-glass">
                                <span className="recent-title">{item.title}</span>
                                <span className="recent-time">{item.time}</span>
                                <span className="recent-xp">+{item.xp} XP</span>
                            </li>
                        ))}
                    </ul>
                </div>
                <div style={{textAlign: 'center', marginTop: 32}}>
                    <Button text="Continue Learning" className="btn-primary btn-large" />
                </div>
            </Container>
        </div>
    );
}

export default Dash;