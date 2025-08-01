import React, { useState, useRef, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { generateCompleteLesson } from '../api.js';
import { Link } from 'react-router-dom';
import { useAuth } from '../contexts/AuthContext.jsx';
import { 
  saveScore, 
  getUserScores, 
  getGlobalLeaderboard, 
  getTopicLeaderboard,
  getUserStats,
  checkAchievements 
} from '../firebase/firestore.js';
import AIRecommendations from './components/AIRecommendations.jsx';

const Mosaics = () => {
  const [selectedCourse, setSelectedCourse] = useState(null);
  const [lesson, setLesson] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  
  // Cultural search states
  const [searchTopic, setSearchTopic] = useState('');
  const [customLesson, setCustomLesson] = useState(null);
  
  // Lesson flow states
  const [currentPhase, setCurrentPhase] = useState('overview'); // 'overview', 'study', 'quiz', 'results'
  
  // Flashcard states
  const [currentCardIndex, setCurrentCardIndex] = useState(0);
  const [selectedAnswer, setSelectedAnswer] = useState(null);
  const [showExplanation, setShowExplanation] = useState(false);
  const [show, setShow] = useState(true);
  const [quizCompleted, setQuizCompleted] = useState(false);
  const [correctAnswers, setCorrectAnswers] = useState(0);
  const [showConfetti, setShowConfetti] = useState(false);
  const [startTime, setStartTime] = useState(null);
  const [timeSpent, setTimeSpent] = useState(0);
  
  // Score and leaderboard states
  const [userStats, setUserStats] = useState(null);
  const [globalLeaderboard, setGlobalLeaderboard] = useState([]);
  const [topicLeaderboard, setTopicLeaderboard] = useState([]);
  const [showLeaderboard, setShowLeaderboard] = useState(false);
  const [achievements, setAchievements] = useState([]);
  
  const canvasRef = useRef(null);
  const p5InstanceRef = useRef(null);
  const navigate = useNavigate();
  const { currentUser } = useAuth();

  // Preset courses
  const courses = [
    {
      id: 1,
      title: "Japanese Tea Ceremony",
      description: "Traditional Japanese tea ceremony and its cultural significance",
      image: "/japan.svg"
    },
    {
      id: 2,
      title: "Italian Renaissance Art",
      description: "Explore the masterpieces and cultural impact of Renaissance Italy",
      image: "/italian.jpg"
    },
    {
      id: 3,
      title: "Mexican Day of the Dead",
      description: "Understanding Día de los Muertos traditions and celebrations",
      image: "/mexican.jpg"
    },
    {
      id: 4,
      title: "Indian Classical Dance",
      description: "Learn about Bharatanatyam and its spiritual significance",
      image: "/indian.svg"
    }
  ];

  // Handle custom cultural search
  const handleSearch = async (e) => {
    e.preventDefault();
    if (searchTopic.trim()) {
      setLoading(true);
      setError('');
      try {
        const lessonData = await generateCompleteLesson(searchTopic.trim());
        setCustomLesson(lessonData);
        setSelectedCourse({ title: searchTopic.trim(), id: 'custom' });
        setLesson(lessonData);
        resetFlashcardState();
      } catch (err) {
        setError('Failed to generate lesson. Please try again.');
        console.error('Custom lesson error:', err);
      } finally {
        setLoading(false);
      }
    }
  };

  // Handle AI recommendation selection
  const handleAITopicSelect = async (topicTitle) => {
    setSearchTopic(topicTitle);
    await handleQuickStart(topicTitle);
  };

  const handleQuickStart = async (topic) => {
    setLoading(true);
    setError('');
    setSearchTopic(topic);
    try {
      const lessonData = await generateCompleteLesson(topic);
      setCustomLesson(lessonData);
      setSelectedCourse({ title: topic, id: 'custom' });
      setLesson(lessonData);
      resetFlashcardState();
    } catch (err) {
      setError('Failed to generate lesson. Please try again.');
      console.error('Quick start lesson error:', err);
    } finally {
      setLoading(false);
    }
  };

  const resetFlashcardState = () => {
    setCurrentCardIndex(0);
    setSelectedAnswer(null);
    setShowExplanation(false);
    setShow(true);
    setQuizCompleted(false);
    setCorrectAnswers(0);
    setShowConfetti(false);
    setCurrentPhase('overview');
    setStartTime(null);
    setTimeSpent(0);
    setAchievements([]);
  };

  const startStudyPhase = () => {
    setCurrentPhase('study');
  };

  const startQuizPhase = () => {
    setCurrentPhase('quiz');
    setStartTime(Date.now());
  };

  const finishQuiz = async () => {
    const endTime = Date.now();
    const totalTime = Math.floor((endTime - startTime) / 1000); // in seconds
    setTimeSpent(totalTime);
    
    if (currentUser && lesson) {
      try {
        // Save score to Firebase
        await saveScore(
          currentUser.uid,
          currentUser.displayName || currentUser.email,
          selectedCourse.title,
          correctAnswers,
          lesson.quiz.length,
          totalTime
        );
        
        // Check for achievements
        const newAchievements = await checkAchievements(currentUser.uid, {
          percentage: Math.round((correctAnswers / lesson.quiz.length) * 100),
          timeSpent: totalTime
        });
        setAchievements(newAchievements);
        
        // Update user stats
        const stats = await getUserStats(currentUser.uid);
        setUserStats(stats);
        
      } catch (error) {
        console.error('Error saving score:', error);
      }
    }
    
    setQuizCompleted(true);
    setShowConfetti(true);
    setCurrentPhase('results');
  };

  const loadLeaderboards = async () => {
    try {
      const [global, topic] = await Promise.all([
        getGlobalLeaderboard(10),
        selectedCourse ? getTopicLeaderboard(selectedCourse.title, 10) : []
      ]);
      setGlobalLeaderboard(global);
      setTopicLeaderboard(topic);
      setShowLeaderboard(true);
    } catch (error) {
      console.error('Error loading leaderboards:', error);
    }
  };

  // Load user stats on component mount
  useEffect(() => {
    if (currentUser) {
      getUserStats(currentUser.uid).then(setUserStats);
    }
  }, [currentUser]);

  const startLesson = async (courseData) => {
    if (courseData.id === 'custom') {
      setSelectedCourse(courseData);
      setLesson(customLesson);
      resetFlashcardState();
      return;
    }
    
    setLoading(true);
    setError('');
    setSelectedCourse(courseData);
    
    try {
      const lessonData = await generateCompleteLesson(courseData.title);
      setLesson(lessonData);
      resetFlashcardState();
    } catch (err) {
      setError('Failed to generate lesson. Please try again.');
      console.error('Lesson generation error:', err);
    } finally {
      setLoading(false);
    }
  };

  const goBack = () => {
    setSelectedCourse(null);
    setLesson(null);
    setCustomLesson(null);
    setSearchTopic('');
    resetFlashcardState();
  };

  // Confetti effect using p5.js
  useEffect(() => {
    if (showConfetti && !p5InstanceRef.current) {
      import('p5').then((p5Module) => {
        const p5 = p5Module.default;
        
        const sketch = (p) => {
          let confettis;
          let themeCouleur = [
            '#f44336', '#e91e63', '#9c27b0', '#673ab7', '#3f51b5',
            '#2196f3', '#03a9f4', '#00bcd4', '#009688', '#4CAF50',
            '#8BC34A', '#CDDC39', '#FFEB3B', '#FFC107', '#FF9800',
            '#FF5722'
          ];

          class Particule {
            constructor(parent) {
              this.parent = parent;
              this.gravite = parent.gravite;
              this.reinit();
              this.forme = p.round(p.random(0, 1));
              this.etape = 0;
              this.prise = 0;
              this.priseFacteur = p.random(-0.02, 0.02);
              this.multFacteur = p.random(0.01, 0.08);
              this.priseAngle = 0;
              this.priseVitesse = 0.05;
            }
            
            reinit() {
              this.position = p.createVector(
                p.random(0, p.width),
                p.random(-p.height * 0.1, -10)
              );
              this.vitesse = p.createVector(p.random(-2, 2), p.random(-5, -2));
              this.couleur = p.random(themeCouleur);
              this.taille = p.random(8, 12);
              this.vie = 255;
              this.decay = p.random(2, 4);
            }
            
            update() {
              this.vitesse.add(this.gravite);
              this.position.add(this.vitesse);
              this.vie -= this.decay;
              this.prise += this.priseVitesse;
              
              if (this.vie <= 0 || this.position.y > p.height + 50) {
                this.reinit();
              }
            }
            
            rendu() {
              p.push();
              p.translate(this.position.x, this.position.y);
              p.fill(this.couleur);
              p.noStroke();
              p.rotate(this.prise);
              
              if (this.forme === 0) {
                p.rect(0, 0, this.taille, this.taille);
              } else {
                p.ellipse(0, 0, this.taille);
              }
              p.pop();
            }
          }

          class SystemeDeParticules {
            constructor(nombre, position) {
              this.particules = [];
              this.position = position.copy();
              this.gravite = p.createVector(0, 0.1);
              
              for (let i = 0; i < nombre; i++) {
                this.particules.push(new Particule(this));
              }
            }
            
            rendu() {
              for (let particule of this.particules) {
                particule.update();
                particule.rendu();
              }
            }
          }

          p.setup = () => {
            p.createCanvas(p.windowWidth, p.windowHeight);
            confettis = new SystemeDeParticules(300, p.createVector(p.width / 2, -20));
          };

          p.draw = () => {
            p.clear();
            confettis.rendu();
          };

          p.windowResized = () => {
            p.resizeCanvas(p.windowWidth, p.windowHeight);
            confettis.position = p.createVector(p.width / 2, -40);
          };
        };

        p5InstanceRef.current = new p5(sketch, canvasRef.current);
      });
    }

    return () => {
      if (p5InstanceRef.current) {
        p5InstanceRef.current.remove();
        p5InstanceRef.current = null;
      }
    };
  }, [showConfetti]);

  useEffect(() => {
    if (!showConfetti && p5InstanceRef.current) {
      p5InstanceRef.current.remove();
      p5InstanceRef.current = null;
    }
  }, [showConfetti]);

  // Flashcard functions
  const handleAnswer = (answer) => {
    if (selectedAnswer) return;
    
    setSelectedAnswer(answer);
    const currentCard = lesson.quiz[currentCardIndex];
    const isCorrect = answer === currentCard.correctAnswer;
    
    if (isCorrect) {
      setCorrectAnswers(prev => prev + 1);
    } else {
      setShowExplanation(true);
    }
  };

  const nextCard = () => {
    setShow(false);
    setTimeout(() => {
      const nextIndex = currentCardIndex + 1;
      if (nextIndex >= lesson.quiz.length) {
        finishQuiz();
      } else {
        setCurrentCardIndex(nextIndex);
      }
      setSelectedAnswer(null);
      setShowExplanation(false);
      setTimeout(() => {
        setShow(true);
      }, 100);
    }, 400);
  };

  const restartQuiz = () => {
    resetFlashcardState();
  };

  const backToCourses = () => {
    setSelectedCourse(null);
    setLesson(null);
    setError("");
    resetFlashcardState();
  };

  return (
    <div className="app">
      {showConfetti && (
        <div ref={canvasRef} className="confetti-canvas"></div>
      )}
      
      {!selectedCourse && (
        <div className="mosaic">
          <img style={{
            borderRadius: '10px',
          }} height="10%" width="100%" src="/m-banner.svg" alt="Mosaic" className="mosaic-image" />
          
          {/* User Stats Display */}
          {currentUser && userStats && (
            <div className="user-stats">
              <h3>Your Progress</h3>
              <div className="stats-grid">
                <div className="stat-item">
                  <div className="stat-number">{userStats.totalQuizzes}</div>
                  <div className="stat-label">Quizzes Completed</div>
                </div>
                <div className="stat-item">
                  <div className="stat-number">{userStats.averageScore}%</div>
                  <div className="stat-label">Average Score</div>
                </div>
                <div className="stat-item">
                  <div className="stat-number">{userStats.bestScore}%</div>
                  <div className="stat-label">Best Score</div>
                </div>
                <div className="stat-item">
                  <div className="stat-number">{userStats.topicsStudied}</div>
                  <div className="stat-label">Topics Explored</div>
                </div>
              </div>
              <button onClick={loadLeaderboards} className="leaderboard-btn">
                🏆 View Leaderboards
              </button>
            </div>
          )}
             
          {/* Cultural Search Section */}
          <div className="cultural-search">
             {currentUser && (     
            <form onSubmit={handleSearch} className="search-form">
              <input
                type="text"
                value={searchTopic}
                onChange={(e) => setSearchTopic(e.target.value)}
                placeholder="Enter any culture, tradition, or topic..."
                className="search-input"
                disabled={loading}
              />
              <button type="submit" className="search-button" disabled={loading || !searchTopic.trim()}>
                {loading ? 'Creating...' : 'Create Lesson'}
              </button>
            </form>
              )}
              {!currentUser && (
              <div className="login-prompt"><Link to="/account">SIGN IN</Link></div>
              )}

            <div className="quick-start">
              <p>Quick start with popular topics:</p>
              <div className="quick-buttons">
                <button onClick={() => handleQuickStart('Samurai Warriors')}>Samurai Warriors</button>
                <button onClick={() => handleQuickStart('French Cuisine')}>French Cuisine</button>
                <button onClick={() => handleQuickStart('African Drumming')}>African Drumming</button>
                <button onClick={() => handleQuickStart('Norse Mythology')}>Norse Mythology</button>
                <button onClick={() => handleQuickStart('Chinese Calligraphy')}>Chinese Calligraphy</button>
              </div>
            </div>
          </div>
          
          {error && <div className="error-message">{error}</div>}
          
          {/* AI-Powered Recommendations */}
          <AIRecommendations 
            currentTopic={searchTopic}
            onTopicSelect={handleAITopicSelect}
            loading={loading}
          />
          
          <h2>Featured Cultural Courses</h2>
          <div className="courses-grid">
            {courses.map((course) => (
              <div
                key={course.id}
                className="course-card"
                onClick={() => startLesson(course)}
              >
                <img src={course.image} alt={course.title} />
                <h3>{course.title}</h3>
                <p>{course.description}</p>
              </div>
            ))}
          </div>
        </div>
      )}

      {loading && (
        <div className="lesson-container">
          <div className="loading-state">
            <div className="loading-spinner"></div>
            <p>Generating your cultural lesson...</p>
          </div>
        </div>
      )}
      
      {error && selectedCourse && (
        <div className="lesson-container">
          <div className="error-state">
            <p className="error">{error}</p>
            <button onClick={goBack} className="back-btn">← Back to Courses</button>
          </div>
        </div>
      )}

      {selectedCourse && lesson && (
        <div className="lesson-container">
          <div className="lesson-header">
            <button onClick={goBack} className="back-btn">
              ← Back to Courses
            </button>
            <h1>{selectedCourse.title}</h1>
            <div className="lesson-phase-indicator">
              <span className={currentPhase === 'overview' ? 'active' : ''}>Overview</span>
              <span className={currentPhase === 'study' ? 'active' : ''}>Study</span>
              <span className={currentPhase === 'quiz' ? 'active' : ''}>Quiz</span>
              <span className={currentPhase === 'results' ? 'active' : ''}>Results</span>
            </div>
          </div>

          {/* Overview Phase */}
          {currentPhase === 'overview' && (
            <div className="lesson-overview">
              <div className="lesson-summary">
                <h2>About This Topic</h2>
                <p>{lesson.summary}</p>
              </div>
              <div className="lesson-actions">
                <button onClick={startStudyPhase} className="study-btn">
                  📚 Start with Study Guide
                </button>
                <button onClick={startQuizPhase} className="quiz-btn">
                  🎯 Jump to Quiz
                </button>
              </div>
            </div>
          )}

          {/* Study Phase */}
          {currentPhase === 'study' && lesson.studyGuide && (
            <div className="study-guide">
              <h2>📚 Study Guide</h2>
              
              <div className="study-section">
                <h3>🔑 Key Facts</h3>
                <ul className="key-facts">
                  {lesson.studyGuide.keyFacts?.map((fact, index) => (
                    <li key={index}>{fact}</li>
                  ))}
                </ul>
              </div>

              <div className="study-section">
                <h3>📖 Important Terms</h3>
                <div className="key-terms">
                  {lesson.studyGuide.keyTerms?.map((term, index) => (
                    <div key={index} className="term-card">
                      <strong>{term.term}</strong>
                      <p>{term.definition}</p>
                    </div>
                  ))}
                </div>
              </div>

              {lesson.studyGuide.timeline && lesson.studyGuide.timeline.length > 0 && (
                <div className="study-section">
                  <h3>⏰ Timeline</h3>
                  <div className="timeline">
                    {lesson.studyGuide.timeline.map((item, index) => (
                      <div key={index} className="timeline-item">
                        <div className="timeline-period">{item.period}</div>
                        <div className="timeline-event">{item.event}</div>
                      </div>
                    ))}
                  </div>
                </div>
              )}

              <div className="study-actions">
                <button onClick={startQuizPhase} className="ready-quiz-btn">
                  🎯 I'm Ready for the Quiz!
                </button>
              </div>
            </div>
          )}

          {/* Quiz Phase */}
          {currentPhase === 'quiz' && !quizCompleted && (
            <>
              <div className="progress-bar">
                <div className="progress-fill" style={{ width: `${((currentCardIndex + 1) / lesson.quiz.length) * 100}%` }}></div>
                <span className="progress-text">{currentCardIndex + 1} / {lesson.quiz.length}</span>
              </div>
              
              <div className={`flash-card ${show ? 'show' : 'hide'}`}>
                <div className="card-content">
                  <div className="question-difficulty">
                    <span className={`difficulty-badge ${lesson.quiz[currentCardIndex]?.difficulty || 'medium'}`}>
                      {lesson.quiz[currentCardIndex]?.difficulty || 'medium'}
                    </span>
                  </div>
                  <h3>{lesson.quiz[currentCardIndex]?.question}</h3>
                  <div className="answer-options">
                    {lesson.quiz[currentCardIndex]?.options.map((option, index) => (
                      <button
                        key={index}
                        onClick={() => handleAnswer(option)}
                        className={`answer-option ${
                          selectedAnswer === option
                            ? option === lesson.quiz[currentCardIndex].correctAnswer
                              ? 'correct'
                              : 'incorrect'
                            : selectedAnswer && option === lesson.quiz[currentCardIndex].correctAnswer
                            ? 'correct'
                            : ''
                        }`}
                        disabled={!!selectedAnswer}
                      >
                        {option}
                      </button>
                    ))}
                  </div>
                  
                  {showExplanation && (
                    <div className="explanation">
                      <p><strong>Explanation:</strong> {lesson.quiz[currentCardIndex]?.explanation}</p>
                    </div>
                  )}
                  
                  {selectedAnswer && (
                    <button onClick={nextCard} className="next-btn">
                      {currentCardIndex + 1 >= lesson.quiz.length ? 'Finish Quiz' : 'Next Question'}
                    </button>
                  )}
                </div>
              </div>
            </>
          )}

          {/* Results Phase */}
          {currentPhase === 'results' && quizCompleted && (
            <div className="quiz-complete">
              <h2>🎉 Quiz Complete!</h2>
              <div className="score-display">
                <div className="score-circle">
                  <div className="score-number">{Math.round((correctAnswers / lesson.quiz.length) * 100)}%</div>
                  <div className="score-label">{correctAnswers} out of {lesson.quiz.length} correct</div>
                </div>
                <div className="time-display">
                  <div className="time-number">{Math.floor(timeSpent / 60)}:{(timeSpent % 60).toString().padStart(2, '0')}</div>
                  <div className="time-label">Time taken</div>
                </div>
              </div>
              
              {achievements.length > 0 && (
                <div className="achievements">
                  <h3>🏆 New Achievements!</h3>
                  {achievements.map((achievement, index) => (
                    <div key={index} className="achievement-item">
                      <span className="achievement-icon">{achievement.icon}</span>
                      <div>
                        <strong>{achievement.title}</strong>
                        <p>{achievement.description}</p>
                      </div>
                    </div>
                  ))}
                </div>
              )}
              
              <div className="quiz-actions">
                <button onClick={restartQuiz} className="restart-btn">Try Again</button>
                <button onClick={goBack} className="new-lesson-btn">New Lesson</button>
                <button onClick={loadLeaderboards} className="leaderboard-btn">View Leaderboards</button>
              </div>
            </div>
          )}
        </div>
      )}
      
      {/* Leaderboard Modal */}
      {showLeaderboard && (
        <div className="modal-overlay" onClick={() => setShowLeaderboard(false)}>
          <div className="modal-content" onClick={(e) => e.stopPropagation()}>
            <div className="modal-header">
              <h2>🏆 Leaderboards</h2>
              <button className="close-btn" onClick={() => setShowLeaderboard(false)}>×</button>
            </div>
            
            <div className="leaderboard-tabs">
              <div className="leaderboard-section">
                <h3>🌍 Global Rankings</h3>
                <div className="leaderboard-list">
                  {globalLeaderboard.map((entry, index) => (
                    <div key={entry.id} className={`leaderboard-item ${entry.userId === currentUser?.uid ? 'current-user' : ''}`}>
                      <div className="rank">#{index + 1}</div>
                      <div className="player-info">
                        <div className="player-name">{entry.userName}</div>
                        <div className="player-topic">{entry.topic}</div>
                      </div>
                      <div className="score-info">
                        <div className="percentage">{entry.percentage}%</div>
                        <div className="time">{Math.floor(entry.timeSpent / 60)}:{(entry.timeSpent % 60).toString().padStart(2, '0')}</div>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
              
              {selectedCourse && topicLeaderboard.length > 0 && (
                <div className="leaderboard-section">
                  <h3>📚 {selectedCourse.title} Rankings</h3>
                  <div className="leaderboard-list">
                    {topicLeaderboard.map((entry, index) => (
                      <div key={entry.id} className={`leaderboard-item ${entry.userId === currentUser?.uid ? 'current-user' : ''}`}>
                        <div className="rank">#{index + 1}</div>
                        <div className="player-info">
                          <div className="player-name">{entry.userName}</div>
                        </div>
                        <div className="score-info">
                          <div className="percentage">{entry.percentage}%</div>
                          <div className="time">{Math.floor(entry.timeSpent / 60)}:{(entry.timeSpent % 60).toString().padStart(2, '0')}</div>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              )}
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default Mosaics;