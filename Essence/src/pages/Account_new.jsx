import React, { useState } from 'react';
import { signInWithEmailAndPassword, createUserWithEmailAndPassword } from 'firebase/auth';
import { auth } from '../firebase/config';

const Account = () => {
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [isSignUp, setIsSignUp] = useState(false);
    const [error, setError] = useState('');
    const [loading, setLoading] = useState(false);

    const handleSubmit = async (e) => {
        e.preventDefault();
        setLoading(true);
        setError('');

        try {
            if (isSignUp) {
                // Create new user
                await createUserWithEmailAndPassword(auth, email, password);
                console.log('User created successfully');
            } else {
                // Sign in existing user
                await signInWithEmailAndPassword(auth, email, password);
                console.log('User signed in successfully');
            }
            // You can redirect here or update app state
        } catch (error) {
            setError(error.message);
            console.error('Authentication error:', error);
        } finally {
            setLoading(false);
        }
    };

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
