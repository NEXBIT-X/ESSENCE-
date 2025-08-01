import React from 'react';
import Container from './components/Container.jsx';
import Button from './components/Button.jsx';
import Icon from './components/Icon.jsx';

const Home = () => {
    return (
        <div className="home-page">
          
                {/* Hero Section */}
                <section className="hero">
                    <div className="hero-content">
                        <h1 className="hero-title">A Bit Of Every Culture</h1>
                        <p className="hero-subtitle">Not just words — experience the world's essence.</p>
                       
                    </div>
                    <div className="hero-visual">  
                            <img src="/feature.svg"></img>  
                    </div>
                </section>
                

                {/* Features Section */}
                <section className="features">
                    <h2 >Why Choose Essence?</h2>
                    <div className="features-grid">
                        <div className="feature-card">
                            <div className="feature-icon">🎯</div>
                            <h3>Interactive Mosaics</h3>
                            <p>Bite-sized cultural lessons inspired by real-world data</p>
                        </div>
                        <div className="feature-card">
                            <div className="feature-icon">🤖</div>
                            <h3>AI-Powered Learning</h3>
                            <p>Enhanced explanations that adapt to your learning style</p>
                        </div>
                        <div className="feature-card">
                            <div className="feature-icon">🌏</div>
                            <h3>Global Cultures</h3>
                            <p>Explore art, traditions, music, food, and lifestyles worldwide</p>
                        </div>
                        <div className="feature-card">
                            <div className="feature-icon">📊</div>
                            <h3>Cultural Data</h3>
                            <p>Powered by real cultural insights from APIs like Qloo</p>
                        </div>
                    </div>
                </section>
                <section id="features">
                    <h5 className="don">What You Can Learn</h5>
                    <div className="features-grid">
                        <div className="feature-card">
                            <div className='feature-icon'>🗺️</div>
                            <div>
                                <h3>Geography & Regions</h3>
                        
                                <p>Understand how geography shapes traditions and behavior</p>
                            </div>
                        </div>
                        <div className="feature-card">
                            <div className='feature-icon'>🎭</div>
                            <div>
                                <h3>Festivals & Rituals</h3>
                                
                                <p>Explore unique celebrations and seasonal customs</p>
                            </div>
                        </div>
                        <div className="feature-card">
                            <div className='feature-icon'>🍽️</div>
                            <div>
                                <h3>Food & Cuisine</h3>
                                
                                <p>Discover the tastes, cooking methods, and food stories of every culture</p>
                            </div>
                        </div>
                        <div className="feature-card">
                            <div className='feature-icon'>👗</div>
                            <div>
                                <h3>Clothing & Design</h3>
                                
                                <p>See how history, climate, and beliefs influence clothing styles</p>
                            </div>
                        </div>
                    </div>
                </section>
                <section className="how-it-works">
                    <h2>How It Works</h2>
                    <div className="steps">
                        <div className="step">
                            <div className="step-number">1</div>
                            <h3>Choose Your Culture</h3>
                            <p>Select from hundreds of cultural regions and traditions</p>
                        </div>
                        <div className="step">
                            <div className="step-number">2</div>
                            <h3>Complete Mosaics</h3>
                            <p>Engage with interactive lessons and cultural activities</p>
                        </div>
                        <div className="step">
                            <div className="step-number">3</div>
                            <h3>Track Progress</h3>
                            <p>Monitor your cultural learning journey with detailed analytics</p>
                        </div>
                    </div>
                </section>

                {/* CTA Section */}
                <section className="cta">
                    <h2>Ready to Experience the World's Essence?</h2>
                    <p>Join thousands of learners discovering cultures through interactive mosaics</p>
                    <Button text="Get Started Now" className="btn-primary btn-large" />
                </section>
                { /* Footer Section */}
                <footer class="footer">
  <div class="footer-container">
    
    <div class="footer-section logo-section">
      <img src="/essence.svg" alt="Essence Logo" class="footer-logo"/>
      <p class="footer-text">Discover the world — one culture at a time.</p>
    </div>

    <div class="footer-section">
      <h3>Explore</h3>
      <ul>
        <li><a href="#">Interactive Mosaics</a></li>
        <li><a href="#">Global Cultures</a></li>
        <li><a href="#">Cultural Data</a></li>
        <li><a href="#">Featured Lessons</a></li>
      </ul>
    </div>

    <div class="footer-section">
      <h3>Resources</h3>
      <ul>
        <li><a href="#">FAQs</a></li>
        <li><a href="#">Partner with Us</a></li>
        <li><a href="#">Privacy Policy</a></li>
        <li><a href="#">Terms of Use</a></li>
      </ul>
    </div>

  </div>

  <div class="footer-bottom">
    © 2025 ESSENCE. All rights reserved.
  </div>
</footer>

        </div>
    );
};

export default Home;
