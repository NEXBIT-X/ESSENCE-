import React, { useState, useEffect } from 'react';
import { updateProfile } from 'firebase/auth';
import { useAuth } from '../contexts/AuthContext';
import { useNavigate } from 'react-router-dom';
import './Profile.css';

const Profile = () => {
    const { currentUser } = useAuth();
    const navigate = useNavigate();
    const [displayName, setDisplayName] = useState('');
    const [photoURL, setPhotoURL] = useState('');
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState('');
    const [success, setSuccess] = useState('');

    // Redirect if user is not logged in
    useEffect(() => {
        if (!currentUser) {
            navigate('/account');
        } else {
            setDisplayName(currentUser.displayName || '');
            // Load profile picture from localStorage or use default
            const savedPhotoURL = localStorage.getItem(`profilePic_${currentUser.uid}`);
            setPhotoURL(savedPhotoURL || currentUser.photoURL || '');
        }
    }, [currentUser, navigate]);

    const handleSubmit = async (e) => {
        e.preventDefault();
        setLoading(true);
        setError('');
        setSuccess('');

        try {
            // Check if photoURL is too long for Firebase (limit is ~2000 characters)
            // If it's a base64 image or very long URL, don't save to Firebase profile
            const isBase64 = photoURL.startsWith('data:');
            const isTooLong = photoURL.length > 1900; // Safe margin under Firebase limit
            
            const profileData = {
                displayName: displayName
            };
            
            // Only add photoURL to Firebase if it's not base64 and not too long
            if (photoURL && !isBase64 && !isTooLong) {
                profileData.photoURL = photoURL;
            } else if (!photoURL) {
                // Clear photoURL if empty
                profileData.photoURL = null;
            }
            
            await updateProfile(currentUser, profileData);
            
            // Always save profile picture to localStorage (base64, long URLs, or regular URLs)
            if (photoURL) {
                localStorage.setItem(`profilePic_${currentUser.uid}`, photoURL);
            } else {
                localStorage.removeItem(`profilePic_${currentUser.uid}`);
            }
            
            // Save display name to localStorage
            if (displayName) {
                localStorage.setItem(`displayName_${currentUser.uid}`, displayName);
            } else {
                localStorage.removeItem(`displayName_${currentUser.uid}`);
            }
            
            setSuccess('Profile updated successfully!');
            console.log('Profile updated successfully');
        } catch (error) {
            setError('Failed to update profile: ' + error.message);
            console.error('Profile update error:', error);
        } finally {
            setLoading(false);
        }
    };

    const handlePhotoUpload = (e) => {
        const file = e.target.files[0];
        if (file) {
            // Convert file to base64 and store in localStorage
            const reader = new FileReader();
            reader.onload = (e) => {
                const base64Image = e.target.result;
                setPhotoURL(base64Image);
                // Save to localStorage immediately
                localStorage.setItem(`profilePic_${currentUser.uid}`, base64Image);
            };
            reader.readAsDataURL(file);
        }
    };

    const handlePhotoURLChange = (e) => {
        const newURL = e.target.value;
        setPhotoURL(newURL);
        // Save to localStorage when URL changes
        if (newURL) {
            localStorage.setItem(`profilePic_${currentUser.uid}`, newURL);
        } else {
            localStorage.removeItem(`profilePic_${currentUser.uid}`);
        }
    };

    if (!currentUser) {
        return null;
    }

    return (
        <div className="profile-page">
            <div className="profile-container">
                <div className="profile-header">
                    <h1>Profile Settings</h1>
                    <p>Manage your account information</p>
                </div>

                <div className="profile-content">
                    <div className="profile-avatar-section">
                        <div className="avatar-container">
                            <img 
                                src={photoURL || '/essence.svg'} 
                                alt="Profile" 
                                className="profile-avatar"
                            />
                            <div className="avatar-overlay">
                                <label htmlFor="photo-upload" className="avatar-upload-btn">
                                    Change Photo
                                </label>
                                <input 
                                    type="file" 
                                    id="photo-upload"
                                    accept="image/*"
                                    onChange={handlePhotoUpload}
                                    style={{display: 'none'}}
                                />
                            </div>
                        </div>
                    </div>

                    <div className="profile-form-section">
                        {error && <div className="error-message">{error}</div>}
                        {success && <div className="success-message">{success}</div>}

                        <form onSubmit={handleSubmit} className="profile-form">
                            <div className="form-group">
                                <label htmlFor="email">Email</label>
                                <input 
                                    type="email" 
                                    id="email"
                                    value={currentUser.email}
                                    disabled
                                    className="form-input disabled"
                                />
                                <small>Email cannot be changed</small>
                            </div>

                            <div className="form-group">
                                <label htmlFor="displayName">Display Name</label>
                                <input 
                                    type="text" 
                                    id="displayName"
                                    value={displayName}
                                    onChange={(e) => setDisplayName(e.target.value)}
                                    placeholder="Enter your display name"
                                    className="form-input"
                                />
                            </div>

                            <div className="form-group">
                                <label htmlFor="photoURL">Profile Picture URL</label>
                                <input 
                                    type="url" 
                                    id="photoURL"
                                    value={photoURL}
                                    onChange={handlePhotoURLChange}
                                    placeholder="Enter image URL (long URLs stored locally)"
                                    className="form-input"
                                />
                                <small>Very long URLs and uploaded images are stored locally for your privacy</small>
                            </div>

                            <button 
                                type="submit" 
                                disabled={loading}
                                className="profile-save-btn"
                            >
                                {loading ? 'Updating...' : 'Save Changes'}
                            </button>
                        </form>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default Profile;
