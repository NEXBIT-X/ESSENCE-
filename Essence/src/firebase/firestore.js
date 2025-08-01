import { 
  collection, 
  addDoc, 
  getDocs, 
  query, 
  orderBy, 
  limit, 
  where,
  updateDoc,
  doc,
  getDoc,
  serverTimestamp 
} from 'firebase/firestore';
import { db } from './config';

// Save user score to Firestore
export const saveScore = async (userId, userName, topic, score, totalQuestions, timeSpent) => {
  try {
    const scoreData = {
      userId,
      userName,
      topic,
      score,
      totalQuestions,
      percentage: Math.round((score / totalQuestions) * 100),
      timeSpent, // in seconds
      timestamp: serverTimestamp()
    };

    const docRef = await addDoc(collection(db, 'scores'), scoreData);
    console.log('Score saved with ID: ', docRef.id);
    return docRef.id;
  } catch (error) {
    console.error('Error saving score: ', error);
    throw error;
  }
};

// Get user's personal scores
export const getUserScores = async (userId) => {
  try {
    const q = query(
      collection(db, 'scores'),
      where('userId', '==', userId),
      orderBy('timestamp', 'desc'),
      limit(20)
    );
    
    const querySnapshot = await getDocs(q);
    const scores = [];
    querySnapshot.forEach((doc) => {
      scores.push({ id: doc.id, ...doc.data() });
    });
    
    return scores;
  } catch (error) {
    console.error('Error fetching user scores: ', error);
    return [];
  }
};

// Get global leaderboard
export const getGlobalLeaderboard = async (limitCount = 10) => {
  try {
    const q = query(
      collection(db, 'scores'),
      orderBy('percentage', 'desc'),
      orderBy('timeSpent', 'asc'), // Secondary sort by time (faster is better)
      limit(limitCount)
    );
    
    const querySnapshot = await getDocs(q);
    const leaderboard = [];
    querySnapshot.forEach((doc) => {
      leaderboard.push({ id: doc.id, ...doc.data() });
    });
    
    return leaderboard;
  } catch (error) {
    console.error('Error fetching leaderboard: ', error);
    return [];
  }
};

// Get topic-specific leaderboard
export const getTopicLeaderboard = async (topic, limitCount = 10) => {
  try {
    const q = query(
      collection(db, 'scores'),
      where('topic', '==', topic),
      orderBy('percentage', 'desc'),
      orderBy('timeSpent', 'asc'),
      limit(limitCount)
    );
    
    const querySnapshot = await getDocs(q);
    const leaderboard = [];
    querySnapshot.forEach((doc) => {
      leaderboard.push({ id: doc.id, ...doc.data() });
    });
    
    return leaderboard;
  } catch (error) {
    console.error('Error fetching topic leaderboard: ', error);
    return [];
  }
};

// Get user statistics
export const getUserStats = async (userId) => {
  try {
    const q = query(
      collection(db, 'scores'),
      where('userId', '==', userId)
    );
    
    const querySnapshot = await getDocs(q);
    const scores = [];
    querySnapshot.forEach((doc) => {
      scores.push(doc.data());
    });
    
    if (scores.length === 0) {
      return {
        totalQuizzes: 0,
        averageScore: 0,
        bestScore: 0,
        totalTimeSpent: 0,
        topicsStudied: 0
      };
    }
    
    const totalQuizzes = scores.length;
    const averageScore = scores.reduce((sum, score) => sum + score.percentage, 0) / totalQuizzes;
    const bestScore = Math.max(...scores.map(score => score.percentage));
    const totalTimeSpent = scores.reduce((sum, score) => sum + (score.timeSpent || 0), 0);
    const topicsStudied = new Set(scores.map(score => score.topic)).size;
    
    return {
      totalQuizzes,
      averageScore: Math.round(averageScore),
      bestScore,
      totalTimeSpent,
      topicsStudied
    };
  } catch (error) {
    console.error('Error fetching user stats: ', error);
    return {
      totalQuizzes: 0,
      averageScore: 0,
      bestScore: 0,
      totalTimeSpent: 0,
      topicsStudied: 0
    };
  }
};

// Achievement system
export const checkAchievements = async (userId, newScore) => {
  const achievements = [];
  
  try {
    const userStats = await getUserStats(userId);
    
    // Perfect Score Achievement
    if (newScore.percentage === 100) {
      achievements.push({
        type: 'perfect_score',
        title: 'Perfect Scholar!',
        description: 'Scored 100% on a quiz',
        icon: '🏆'
      });
    }
    
    // Speed Demon Achievement
    if (newScore.timeSpent < 60 && newScore.percentage >= 80) {
      achievements.push({
        type: 'speed_demon',
        title: 'Speed Demon!',
        description: 'Completed quiz in under 1 minute with 80%+ score',
        icon: '⚡'
      });
    }
    
    // Quiz Master Achievement
    if (userStats.totalQuizzes >= 10) {
      achievements.push({
        type: 'quiz_master',
        title: 'Quiz Master!',
        description: 'Completed 10 quizzes',
        icon: '🎓'
      });
    }
    
    // Cultural Explorer Achievement
    if (userStats.topicsStudied >= 5) {
      achievements.push({
        type: 'cultural_explorer',
        title: 'Cultural Explorer!',
        description: 'Studied 5 different cultural topics',
        icon: '🌍'
      });
    }
    
    return achievements;
  } catch (error) {
    console.error('Error checking achievements: ', error);
    return [];
  }
};
