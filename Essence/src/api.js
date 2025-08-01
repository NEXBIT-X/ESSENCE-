import axios from 'axios';

// API utility for cultural learning app
const API_BASE = {
  qloo: 'https://api.qloo.com/v1',
  groq: 'https://api.groq.com/openai/v1/chat/completions',
  pexels: 'https://api.pexels.com/v1/search'
};

// Get API keys from environment
const API_KEYS = {
  qloo: import.meta.env.VITE_QLOO_API_KEY,
  groq: import.meta.env.VITE_GROQ_API_KEY,
  pexels: import.meta.env.VITE_PEXELS_API_KEY
};

// Helper function to validate API keys
const validateApiKeys = () => {
  const missing = [];
  if (!API_KEYS.qloo) missing.push('QLOO');
  if (!API_KEYS.groq) missing.push('GROQ');
  if (!API_KEYS.pexels) missing.push('PEXELS');
  
  if (missing.length > 0) {
    console.warn(`Missing API keys: ${missing.join(', ')}`);
    return false;
  }
  return true;
};

// Qloo API - Fetch cultural recommendations and insights
export const fetchCulturalData = async (topic) => {
  if (!validateApiKeys()) {
    console.warn('Using mock data due to missing API keys');
    return getMockCulturalData(topic);
  }

  try {
    // Qloo API for cultural recommendations
    const response = await axios.post(
      `${API_BASE.qloo}/recommendations`,
      {
        type: 'culture',
        context: {
          subject: topic,
          category: 'educational',
          target_audience: 'adult_learners'
        },
        filter: {
          limit: 10,
          diversity: 0.8
        }
      },
      {
        headers: {
          'Authorization': `Bearer ${API_KEYS.qloo}`,
          'Content-Type': 'application/json',
          'X-API-Version': '1.0'
        }
      }
    );
    
    return response.data.results || [];
  } catch (error) {
    console.error('Qloo API Error:', error.response?.data || error.message);
    // Return mock data if API fails
    return getMockCulturalData(topic);
  }
};

// Groq API - Generate comprehensive lesson content
export const generateLessonContent = async (culturalData, topic) => {
  if (!validateApiKeys()) {
    console.warn('Using mock lesson content due to missing API keys');
    return getMockLessonContent(topic);
  }

  try {
    const culturalContext = culturalData.length > 0 
      ? JSON.stringify(culturalData.slice(0, 3), null, 2)
      : `General information about ${topic}`;

    const prompt = `You are a world-class cultural education expert and instructional designer. Based on the cultural topic "${topic}" and the following cultural insights, create a comprehensive, engaging educational lesson.

Cultural Insights: ${culturalContext}

Create a lesson that is:
- Culturally sensitive and accurate
- Engaging for adult learners
- Educational and informative
- Well-structured with clear learning objectives

Respond with ONLY valid JSON in this exact format:
{
  "title": "${topic}",
  "summary": "A compelling 2-3 sentence summary that captures the essence and importance of ${topic}",
  "studyGuide": {
    "keyFacts": [
      "5 important, specific facts about ${topic} that learners should know",
      "Each fact should be concise but informative",
      "Focus on historical, cultural, and social significance",
      "Include practical applications or modern relevance",
      "Make facts memorable and engaging"
    ],
    "keyTerms": [
      {
        "term": "Important cultural term related to ${topic}",
        "definition": "Clear, accessible definition that explains significance"
      },
      {
        "term": "Another key concept",
        "definition": "Another clear definition with cultural context"
      },
      {
        "term": "Third important term",
        "definition": "Definition that helps understand the practice/tradition"
      }
    ],
    "timeline": [
      {
        "period": "Ancient/Early period",
        "event": "Key historical development or origin of ${topic}"
      },
      {
        "period": "Medieval/Classical period",
        "event": "Important evolution or milestone"
      },
      {
        "period": "Modern period",
        "event": "Contemporary development or current state"
      }
    ]
  },
  "flashcards": [
    {
      "term": "Key concept about ${topic}",
      "definition": "Clear, memorable definition for spaced repetition learning"
    }
  ],
  "quiz": [
    {
      "question": "Engaging multiple choice question about ${topic}",
      "options": ["Correct answer", "Plausible distractor", "Another distractor", "Third distractor"],
      "correctAnswer": "Correct answer",
      "explanation": "Clear explanation of why this answer is correct and educational context",
      "difficulty": "easy"
    }
  ]
}

Requirements:
- Create exactly 5 flashcards covering different aspects of ${topic}
- Create exactly 8 quiz questions: 3 easy, 3 medium, 2 hard
- Make content culturally accurate and respectful
- Ensure educational value and engagement
- Use clear, accessible language
- Include both historical and contemporary perspectives`;

    const response = await axios.post(
      API_BASE.groq,
      {
        model: 'llama-3.3-70b-versatile',
        messages: [
          {
            role: 'system',
            content: 'You are an expert cultural educator who creates accurate, engaging, and respectful educational content about world cultures.'
          },
          {
            role: 'user',
            content: prompt
          }
        ],
        temperature: 0.7,
        max_tokens: 4000,
        top_p: 0.9
      },
      {
        headers: {
          'Authorization': `Bearer ${API_KEYS.groq}`,
          'Content-Type': 'application/json'
        }
      }
    );

    const content = response.data.choices[0]?.message?.content;
    if (!content) {
      throw new Error('No content received from Groq API');
    }

    // Clean the response to ensure it's valid JSON
    const cleanedContent = content.replace(/```json\n?/g, '').replace(/```\n?/g, '').trim();
    const parsedContent = JSON.parse(cleanedContent);
    
    // Validate the structure
    if (!parsedContent.quiz || !Array.isArray(parsedContent.quiz) || parsedContent.quiz.length !== 8) {
      console.warn('Generated content structure invalid, using mock data');
      return getMockLessonContent(topic);
    }

    return parsedContent;
  } catch (error) {
    console.error('Groq API Error:', error.response?.data || error.message);
    // Return mock lesson if API fails
    return getMockLessonContent(topic);
  }
};

// Pexels API - Fetch high-quality cultural images
export const fetchCulturalImages = async (topic, count = 3) => {
  if (!validateApiKeys()) {
    console.warn('Using mock images due to missing API keys');
    return getMockImages(topic);
  }

  try {
    // Enhanced search terms for better cultural imagery
    const searchTerms = [
      `${topic} culture traditional`,
      `${topic} heritage art`,
      `${topic} ceremony festival`
    ];

    const imagePromises = searchTerms.slice(0, count).map(async (searchTerm, index) => {
      try {
        const response = await axios.get(
          `${API_BASE.pexels}?query=${encodeURIComponent(searchTerm)}&per_page=3&orientation=landscape&size=large`,
          {
            headers: {
              'Authorization': API_KEYS.pexels
            }
          }
        );
        
        return response.data.photos.slice(0, 1).map(photo => ({
          id: `${photo.id}_${index}`,
          url: photo.src.large,
          thumbnail: photo.src.medium,
          photographer: photo.photographer,
          alt: photo.alt || `${topic} cultural image`
        }));
      } catch (error) {
        console.error(`Error fetching image for "${searchTerm}":`, error);
        return [];
      }
    });

    const imageResults = await Promise.all(imagePromises);
    const allImages = imageResults.flat();
    
    // If we have images, return them; otherwise return mock images
    return allImages.length > 0 ? allImages : getMockImages(topic);
  } catch (error) {
    console.error('Pexels API Error:', error.response?.data || error.message);
    // Return mock images if API fails
    return getMockImages(topic);
  }
};

// Complete lesson generation pipeline with enhanced AI recommendations
export const generateCompleteLesson = async (topic) => {
  try {
    console.log(`🎯 Starting lesson generation for: ${topic}`);
    
    // Step 1: Fetch cultural insights from Qloo
    console.log('📚 Fetching cultural data...');
    const culturalData = await fetchCulturalData(topic);
    
    // Step 2: Generate comprehensive lesson content with Groq
    console.log('🤖 Generating lesson content...');
    const lessonContent = await generateLessonContent(culturalData, topic);
    
    // Step 3: Fetch relevant high-quality images from Pexels
    console.log('🖼️ Fetching cultural images...');
    const images = await fetchCulturalImages(topic, 3);
    
    // Step 4: Combine everything into a complete lesson
    const completeLesson = {
      topic,
      ...lessonContent,
      images,
      heroImage: images[0]?.url || '/feature.svg',
      culturalInsights: culturalData.slice(0, 3), // Include top 3 cultural insights
      metadata: {
        generatedAt: new Date().toISOString(),
        apiSources: {
          qloo: culturalData.length > 0,
          groq: true,
          pexels: images.length > 0
        }
      }
    };
    
    console.log('✅ Lesson generation completed successfully');
    return completeLesson;
  } catch (error) {
    console.error('❌ Complete lesson generation error:', error);
    // Return a fallback lesson with mock data
    return {
      topic,
      ...getMockLessonContent(topic),
      images: getMockImages(topic),
      heroImage: '/feature.svg',
      culturalInsights: getMockCulturalData(topic),
      metadata: {
        generatedAt: new Date().toISOString(),
        apiSources: {
          qloo: false,
          groq: false,
          pexels: false
        },
        fallback: true
      }
    };
  }
};

// Enhanced recommendation system for related topics
export const getRecommendedTopics = async (currentTopic) => {
  try {
    if (!API_KEYS.qloo) {
      return getDefaultRecommendations(currentTopic);
    }

    const response = await axios.post(
      `${API_BASE.qloo}/recommendations`,
      {
        type: 'culture',
        context: {
          reference: currentTopic,
          category: 'educational',
          related_subjects: true
        },
        filter: {
          limit: 6,
          diversity: 0.9
        }
      },
      {
        headers: {
          'Authorization': `Bearer ${API_KEYS.qloo}`,
          'Content-Type': 'application/json'
        }
      }
    );

    return response.data.results?.map(item => ({
      title: item.name || item.title,
      description: item.description || `Explore ${item.name || item.title}`,
      confidence: item.confidence || 0.8
    })) || getDefaultRecommendations(currentTopic);
  } catch (error) {
    console.error('Error fetching recommendations:', error);
    return getDefaultRecommendations(currentTopic);
  }
};

// Get trending cultural topics
export const getTrendingTopics = async () => {
  try {
    if (!API_KEYS.qloo) {
      return getDefaultTrendingTopics();
    }

    const response = await axios.get(
      `${API_BASE.qloo}/trending/culture`,
      {
        headers: {
          'Authorization': `Bearer ${API_KEYS.qloo}`,
          'Content-Type': 'application/json'
        },
        params: {
          limit: 8,
          category: 'educational'
        }
      }
    );

    return response.data.results?.map(item => ({
      title: item.name || item.title,
      description: item.description,
      popularity: item.popularity || item.score
    })) || getDefaultTrendingTopics();
  } catch (error) {
    console.error('Error fetching trending topics:', error);
    return getDefaultTrendingTopics();
  }
};

// Mock data fallbacks with enhanced content
const getMockCulturalData = (topic) => [
  {
    name: `${topic} Cultural Heritage`,
    description: `Deep exploration of ${topic} traditions and cultural significance`,
    category: 'heritage',
    confidence: 0.9
  },
  {
    name: `${topic} Modern Practices`,
    description: `Contemporary expressions and evolution of ${topic}`,
    category: 'contemporary',
    confidence: 0.8
  },
  {
    name: `${topic} Historical Context`,
    description: `Historical development and cultural impact of ${topic}`,
    category: 'historical',
    confidence: 0.9
  }
];

const getDefaultRecommendations = (currentTopic) => [
  { title: 'Japanese Tea Ceremony', description: 'Traditional Japanese cultural practice', confidence: 0.8 },
  { title: 'Italian Renaissance Art', description: 'Masterpieces of Renaissance Italy', confidence: 0.9 },
  { title: 'Indian Classical Dance', description: 'Sacred dance traditions of India', confidence: 0.8 },
  { title: 'Mexican Day of the Dead', description: 'Día de los Muertos celebrations', confidence: 0.9 },
  { title: 'Chinese Calligraphy', description: 'Ancient art of Chinese writing', confidence: 0.7 },
  { title: 'African Storytelling', description: 'Oral traditions of Africa', confidence: 0.8 }
];

const getDefaultTrendingTopics = () => [
  { title: 'K-Pop Culture', description: 'South Korean pop culture phenomenon', popularity: 0.95 },
  { title: 'Mindfulness Meditation', description: 'Buddhist mindfulness practices', popularity: 0.88 },
  { title: 'Street Art Culture', description: 'Urban artistic expression', popularity: 0.82 },
  { title: 'Sustainable Living', description: 'Eco-conscious lifestyle practices', popularity: 0.87 },
  { title: 'Digital Nomadism', description: 'Remote work cultural movement', popularity: 0.79 },
  { title: 'Plant-Based Cuisine', description: 'Vegetarian culinary traditions', popularity: 0.84 },
  { title: 'Indigenous Wisdom', description: 'Traditional ecological knowledge', popularity: 0.86 },
  { title: 'Tiny House Movement', description: 'Minimalist living philosophy', popularity: 0.78 }
];

const getMockLessonContent = (topic) => ({
  summary: `${topic} is a fascinating cultural tradition that has been practiced for centuries. This ancient art form encompasses various aspects of cultural life, from ceremonial practices to daily rituals. Understanding ${topic} gives us insight into the values, beliefs, and artistic expressions of its culture.`,
  studyGuide: {
    keyFacts: [
      `${topic} has ancient origins dating back centuries`,
      `This cultural practice involves specific rituals and ceremonies`,
      `It holds deep spiritual and social significance`,
      `The tradition has evolved while maintaining core elements`,
      `It continues to influence modern cultural expressions`
    ],
    keyTerms: [
      {
        term: `${topic} Master`,
        definition: `A skilled practitioner who has dedicated years to mastering ${topic}`
      },
      {
        term: 'Cultural Heritage',
        definition: 'The legacy of cultural practices passed down through generations'
      },
      {
        term: 'Ritualistic Elements',
        definition: 'The ceremonial components that give cultural practices their meaning'
      }
    ],
    timeline: [
      {
        period: 'Ancient Times',
        event: `${topic} first developed as a cultural practice`
      },
      {
        period: 'Modern Era',
        event: `${topic} adapted to contemporary society while preserving traditions`
      }
    ]
  },
  flashcards: [
    {
      term: `${topic} Origins`,
      definition: `The historical background and cultural significance of ${topic}`
    },
    {
      term: 'Cultural Practice',
      definition: 'The traditional methods and customs associated with this cultural element'
    },
    {
      term: 'Modern Relevance',
      definition: 'How this tradition continues to influence contemporary culture'
    },
    {
      term: 'Sacred Elements',
      definition: 'The spiritual and ceremonial aspects of the cultural practice'
    },
    {
      term: 'Community Impact',
      definition: 'How this cultural tradition affects and unites communities'
    }
  ],
  quiz: [
    {
      question: `What is the primary cultural significance of ${topic}?`,
      options: [
        'Spiritual and ceremonial importance',
        'Economic benefits only',
        'Entertainment purposes',
        'Political control'
      ],
      correctAnswer: 'Spiritual and ceremonial importance',
      explanation: 'Most traditional cultural practices have deep spiritual and ceremonial roots',
      difficulty: 'easy'
    },
    {
      question: `How has ${topic} evolved in modern times?`,
      options: [
        'It has completely disappeared',
        'It remains exactly the same',
        'It has adapted while keeping core traditions',
        'It is only practiced by tourists'
      ],
      correctAnswer: 'It has adapted while keeping core traditions',
      explanation: 'Cultural traditions typically evolve and adapt while maintaining their essential character',
      difficulty: 'easy'
    },
    {
      question: `What role does ${topic} play in community building?`,
      options: [
        'It divides communities',
        'It has no social impact',
        'It brings people together through shared experiences',
        'It only affects individual practitioners'
      ],
      correctAnswer: 'It brings people together through shared experiences',
      explanation: 'Cultural practices often serve as bonding experiences that strengthen community ties',
      difficulty: 'medium'
    },
    {
      question: `Which aspect is most important for preserving ${topic}?`,
      options: [
        'Commercial exploitation',
        'Passing knowledge to younger generations',
        'Modernizing all traditional elements',
        'Restricting access to outsiders'
      ],
      correctAnswer: 'Passing knowledge to younger generations',
      explanation: 'Cultural preservation depends on intergenerational knowledge transfer',
      difficulty: 'medium'
    },
    {
      question: `What distinguishes authentic ${topic} from superficial imitations?`,
      options: [
        'Higher price points',
        'Modern equipment usage',
        'Deep understanding of cultural context and meaning',
        'Celebrity endorsements'
      ],
      correctAnswer: 'Deep understanding of cultural context and meaning',
      explanation: 'Authenticity in cultural practices comes from genuine understanding and respect for traditions',
      difficulty: 'medium'
    },
    {
      question: `How do practitioners typically achieve mastery in ${topic}?`,
      options: [
        'Through online courses only',
        'Years of dedicated practice and mentorship',
        'Reading books exclusively',
        'Watching videos'
      ],
      correctAnswer: 'Years of dedicated practice and mentorship',
      explanation: 'Traditional cultural mastery requires long-term commitment and guidance from experienced practitioners',
      difficulty: 'hard'
    },
    {
      question: `What is the most complex aspect of ${topic} that scholars still debate?`,
      options: [
        'Its commercial value',
        'Its origins and earliest forms',
        'Its entertainment value',
        'Its modern applications'
      ],
      correctAnswer: 'Its origins and earliest forms',
      explanation: 'The deepest historical roots of cultural practices often involve scholarly debate and ongoing research',
      difficulty: 'hard'
    },
    {
      question: `Which factor most threatens the continuation of traditional ${topic}?`,
      options: [
        'Too much academic study',
        'Lack of interest from younger generations',
        'Government support',
        'International recognition'
      ],
      correctAnswer: 'Lack of interest from younger generations',
      explanation: 'Cultural traditions face their greatest threat when younger generations lose interest and connection',
      difficulty: 'hard'
    }
  ]
});

const getMockImages = (topic) => [
  {
    id: `${topic}_1`,
    url: '/feature.svg',
    thumbnail: '/feature.svg',
    photographer: 'Essence Collection',
    alt: `${topic} cultural imagery`
  },
  {
    id: `${topic}_2`,
    url: '/mosaic.svg',
    thumbnail: '/mosaic.svg',
    photographer: 'Essence Collection',
    alt: `${topic} traditional art`
  },
  {
    id: `${topic}_3`,
    url: '/essence.svg',
    thumbnail: '/essence.svg',
    photographer: 'Essence Collection',
    alt: `${topic} cultural heritage`
  }
];
