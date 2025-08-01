import React, { useState, useEffect } from 'react';
import { useAuth } from '../contexts/AuthContext';
import { useNavigate } from 'react-router-dom';

const Account = () => {
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [isSignUp, setIsSignUp] = useState(false);
    const [error, setError] = useState('');
    const [loading, setLoading] = useState(false);
    
    const { currentUser, login, signup, logout } = useAuth();
    const navigate = useNavigate();

    // Redirect if user is already logged in
    useEffect(() => {
        if (currentUser) {
            navigate('/mosaics');
        }
    }, [currentUser, navigate]);

    const handleSubmit = async (e) => {
        e.preventDefault();
        setLoading(true);
        setError('');

        try {
            if (isSignUp) {
                await signup(email, password);
                console.log('User created successfully');
            } else {
                await login(email, password);
                console.log('User signed in successfully');
            }
            navigate('/mosaics');
        } catch (error) {
            setError(error.message);
            console.error('Authentication error:', error);
        } finally {
            setLoading(false);
        }
    };

    // If user is logged in, show dashboard
    if (currentUser) {
        return (
            <div className="login-wrapper">
                <div className="login-box account-dashboard">
                    <img src="/essence.svg" alt="Essence Logo" className="essence-logo" />
                    <h2>Welcome back!</h2>
                    <p>Email: {currentUser.email}</p>
                    <button onClick={logout} className="logout-button">
                        Logout
                    </button>
                    <button onClick={() => navigate('/mosaics')} className="cta-button">
                        Continue Learning
                    </button>
                </div>
            </div>
        );
    }

    return (
        <div className="login-wrapper">
            <div className="login-box">
                <img src="/essence.svg" alt="Essence Logo" className="essence-logo" />
                <h1 style={{color: "#c0c0c0"}}>
                    <span className="brand-name">Essence</span>
                </h1>
                <p className="caption">"Begin your cultural journey"</p>
                
                {error && <p className="error-message" style={{color: 'red'}}>{error}</p>}
                
                <form className="login-form" onSubmit={handleSubmit}>
                    <input 
                        type="email" 
                        placeholder="Email" 
                        value={email}
                        onChange={(e) => setEmail(e.target.value)}
                        required 
                    />
                    <input 
                        type="password" 
                        placeholder="Password" 
                        value={password}
                        onChange={(e) => setPassword(e.target.value)}
                        required 
                    />
                    <button type="submit" disabled={loading}>
                        {loading ? 'Loading...' : (isSignUp ? 'Sign Up' : 'Login')}
                    </button>
                </form>
                
                <p style={{marginTop: '20px', color: '#c0c0c0'}}>
                    {isSignUp ? 'Already have an account?' : "Don't have an account?"}{' '}
                    <span 
                        style={{color: '#007bff', cursor: 'pointer', textDecoration: 'underline'}}
                        onClick={() => setIsSignUp(!isSignUp)}
                    >
                        {isSignUp ? 'Login' : 'Sign Up'}
                    </span>
                </p>
            </div>
        </div>
    );
};

export default Account;
