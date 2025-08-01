import React from 'react';
import { useAuth } from '../contexts/AuthContext';
import { useNavigate } from 'react-router-dom';
import { useEffect } from 'react';

const ProtectedRoute = ({ children }) => {
    const { currentUser, loading } = useAuth();
    const navigate = useNavigate();

    useEffect(() => {
        if (!loading && !currentUser) {
            navigate('/account');
        }
    }, [currentUser, loading, navigate]);

    if (loading) {
        return (
            <div className="loading-container">
                <div className="loading-spinner"></div>
                <p>Loading...</p>
            </div>
        );
    }

    if (!currentUser) {
        return (
            <div className="auth-required">
                <div className="auth-required-content">
                    <img src="/essence.svg" alt="Essence Logo" className="auth-logo" />
                    <h2>🔒 Authentication Required</h2>
                    <p>Please log in to access the Mosaics and start your cultural learning journey.</p>
                    <div className="auth-features">
                        <div className="auth-feature">
                            <span className="auth-feature-icon">🎯</span>
                            <span>AI-Powered Lessons</span>
                        </div>
                        <div className="auth-feature">
                            <span className="auth-feature-icon">📚</span>
                            <span>Cultural Insights</span>
                        </div>
                        <div className="auth-feature">
                            <span className="auth-feature-icon">🏆</span>
                            <span>Progress Tracking</span>
                        </div>
                    </div>
                    <button 
                        onClick={() => navigate('/account')} 
                        className="auth-cta-button"
                    >
                        Sign In to Continue
                    </button>
                </div>
            </div>
        );
    }

    return children;
};

export default ProtectedRoute;
