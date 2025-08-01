import React, { useState, useEffect } from 'react';
import { getRecommendedTopics, getTrendingTopics } from '../../api.js';

const AIRecommendations = ({ currentTopic, onTopicSelect, loading }) => {
  const [recommendations, setRecommendations] = useState([]);
  const [trendingTopics, setTrendingTopics] = useState([]);
  const [loadingRecommendations, setLoadingRecommendations] = useState(false);

  useEffect(() => {
    const loadRecommendations = async () => {
      setLoadingRecommendations(true);
      try {
        const [recommended, trending] = await Promise.all([
          currentTopic ? getRecommendedTopics(currentTopic) : [],
          getTrendingTopics()
        ]);
        setRecommendations(recommended);
        setTrendingTopics(trending);
      } catch (error) {
        console.error('Error loading recommendations:', error);
      } finally {
        setLoadingRecommendations(false);
      }
    };

    loadRecommendations();
  }, [currentTopic]);

  if (loadingRecommendations) {
    return (
      <div className="ai-recommendations">
        <div className="loading-recommendations">
          <div className="recommendation-skeleton"></div>
          <div className="recommendation-skeleton"></div>
          <div className="recommendation-skeleton"></div>
        </div>
      </div>
    );
  }

  return (
    <div className="ai-recommendations">
      {/* Trending Topics */}
      {trendingTopics.length > 0 && (
        <div className="trending-section">
          <h3>🔥 Trending Cultural Topics</h3>
          <div className="trending-grid">
            {trendingTopics.slice(0, 6).map((topic, index) => (
              <div
                key={index}
                className="trending-card"
                onClick={() => onTopicSelect(topic.title)}
                style={{ '--delay': `${index * 0.1}s` }}
              >
                <div className="trending-popularity">
                  {Math.round(topic.popularity * 100)}% popular
                </div>
                <h4>{topic.title}</h4>
                <p>{topic.description}</p>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Related Recommendations */}
      {currentTopic && recommendations.length > 0 && (
        <div className="recommendations-section">
          <h3>💡 Related to "{currentTopic}"</h3>
          <div className="recommendations-grid">
            {recommendations.map((recommendation, index) => (
              <div
                key={index}
                className="recommendation-card"
                onClick={() => onTopicSelect(recommendation.title)}
                style={{ '--delay': `${index * 0.1}s` }}
              >
                <div className="confidence-meter">
                  <div 
                    className="confidence-fill" 
                    style={{ width: `${recommendation.confidence * 100}%` }}
                  ></div>
                </div>
                <h4>{recommendation.title}</h4>
                <p>{recommendation.description}</p>
                <div className="confidence-label">
                  {Math.round(recommendation.confidence * 100)}% match
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* AI-Powered Suggestions */}
      <div className="ai-suggestions-section">
        <h3>🤖 AI-Powered Learning Paths</h3>
        <div className="learning-paths">
          <div className="learning-path" onClick={() => onTopicSelect('Ancient Civilizations Journey')}>
            <div className="path-icon">🏛️</div>
            <div className="path-content">
              <h4>Ancient Civilizations Journey</h4>
              <p>Explore Egypt, Greece, Rome, and more</p>
              <div className="path-difficulty">Beginner Friendly</div>
            </div>
          </div>
          <div className="learning-path" onClick={() => onTopicSelect('Asian Cultural Traditions')}>
            <div className="path-icon">🎋</div>
            <div className="path-content">
              <h4>Asian Cultural Traditions</h4>
              <p>Tea ceremonies, martial arts, and festivals</p>
              <div className="path-difficulty">Intermediate</div>
            </div>
          </div>
          <div className="learning-path" onClick={() => onTopicSelect('Modern Cultural Movements')}>
            <div className="path-icon">🎨</div>
            <div className="path-content">
              <h4>Modern Cultural Movements</h4>
              <p>Contemporary art, music, and social trends</p>
              <div className="path-difficulty">Advanced</div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default AIRecommendations;
