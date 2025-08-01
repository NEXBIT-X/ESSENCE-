import React from "react";
import './App.css';
import { BrowserRouter as Router, Routes, Route, Link } from "react-router-dom";
import Home from './pages/Home.jsx';
import Dash from "./pages/Dash.jsx";
import Mosaics from "./pages/Mosaics.jsx";
import NotFound from "./pages/NotFound.jsx";
import Grid from "./pages/components/Grid.jsx";
import Icon from "./pages/components/Icon.jsx";
import Account from "./pages/Account.jsx";
import Profile from "./pages/Profile.jsx";
import { AuthProvider, useAuth } from "./contexts/AuthContext.jsx";

const Nav = () => {
  const { currentUser, logout, getDisplayName } = useAuth();

  const handleLogout = async () => {
    try {
      await logout();
      console.log('User logged out successfully');
    } catch (error) {
      console.error('Logout error:', error);
    }
  };

  return (
    <nav>
      <div className="nav-logo">
        <img src="/essence.svg" className="es" alt="Essence Logo" />
      </div>
      <div className="nav-links">
        <Link to="/" className="nav-link">
          HOME
        </Link>
        <Link to="/mosaics" className="nav-link">
          MOSAICS
        </Link>
        {currentUser ? (
          <>
            <span style={{
              color: 'var(--text-color)', 
              fontSize: '0.2em', 
              opacity: 0.8,
              transform: 'none'
            }}>
              Welcome, {getDisplayName()}
            </span>
            <Link to="/profile" className="nav-link">
              PROFILE
            </Link>
            <button 
              onClick={handleLogout}
              className="nav-link"
              style={{
                background: 'none', 
                border: 'none', 
                cursor: 'pointer', 
                color: 'wheat',
                textDecoration: 'none',
                fontSize: 'small',
                fontFamily: 'monospace',
                fontWeight: 'bold'
              }}
              onMouseEnter={(e) => e.target.style.color = 'var(--primary-color)'}
              onMouseLeave={(e) => e.target.style.color = 'wheat'}
            >
            
              SIGN OUT
            </button>
          </>
        ) : (
          <Link to="/Account" className="nav-link">
            ACCOUNT
          </Link>
        )}
      </div>
    </nav>
  );
};

const App = () => {
  return (
    <AuthProvider>
      <Router>
        <Grid className="app">
        <Nav />
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/dash" element={<Dash />} />
          <Route path="/mosaics" element={<Mosaics />} />
          <Route path="/account" element={<Account/>}/>
          <Route path="/profile" element={<Profile/>}/>
          <Route path="*" element={<NotFound />} />
        </Routes>
        </Grid>
        
      </Router>
    </AuthProvider>
  );
};

export default App;
