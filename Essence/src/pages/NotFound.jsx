import React from 'react';
import Container from './components/Container.jsx';
import Button from './components/Button.jsx';
import { Link } from 'react-router-dom';

const NotFound = () => {
    return (
        <div className="not-found-page">
          
                <div className="not-found-content">
                    <div className="not-found-icon">🌍</div>
                    <h1>404 - Culture Not Found</h1>
                    <p>Oops! It seems this cultural path doesn't exist yet.</p>
                    <p>Don't worry, there are plenty of other amazing cultures to explore!</p>
                    
                    <div className="not-found-actions">
                        <Link to="/">
                            <Button text="Go Home" className="btn-primary" />
                        </Link>
                        <Link to="/mosaics">
                            <Button text="Explore Mosaics" className="btn-secondary" />
                        </Link>
                    </div>
                    
                    <div className="not-found-suggestions">
                        <h3>Popular Cultures to Explore:</h3>
                        <div className="suggestions-grid">
                            <div className="suggestion-item">🍵 Japanese Tea Ceremony</div>
                            <div className="suggestion-item">🎨 Italian Renaissance</div>
                            <div className="suggestion-item">🥘 Moroccan Cuisine</div>
                            <div className="suggestion-item">✒️ Arabic Calligraphy</div>
                        </div>
                    </div>
                </div>
        </div>
    );
};

export default NotFound; 