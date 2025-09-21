import React, { createContext, useContext, useState, useEffect } from 'react';
import { useAuth } from './AuthContext';

export interface Feedback {
  id: string;
  userId: string;
  userName: string;
  rating: number;
  comment: string;
  serviceOrProduct: string;
  timestamp: Date;
  sentiment?: 'positive' | 'neutral' | 'negative';
}

interface FeedbackContextType {
  feedbacks: Feedback[];
  addFeedback: (feedback: Omit<Feedback, 'id' | 'userId' | 'userName' | 'timestamp' | 'sentiment'>) => void;
  updateFeedback: (id: string, feedback: Partial<Feedback>) => void;
  deleteFeedback: (id: string) => void;
  getUserFeedbacks: (userId: string) => Feedback[];
  getAnalytics: () => {
    totalFeedbacks: number;
    averageRating: number;
    sentimentDistribution: { positive: number; neutral: number; negative: number };
    serviceDistribution: Record<string, number>;
    ratingDistribution: Record<number, number>;
  };
}

const FeedbackContext = createContext<FeedbackContextType | undefined>(undefined);

// Mock data with more realistic feedback
const initialFeedbacks: Feedback[] = [
  {
    id: '1',
    userId: '2',
    userName: 'John Customer',
    rating: 5,
    comment: 'Excellent service! The food delivery was quick and the quality was outstanding.',
    serviceOrProduct: 'Swiggy',
    timestamp: new Date('2024-01-15'),
    sentiment: 'positive'
  },
  {
    id: '2',
    userId: '2',
    userName: 'John Customer',
    rating: 4,
    comment: 'Good banking experience, but the wait time could be improved.',
    serviceOrProduct: 'SBI',
    timestamp: new Date('2024-01-10'),
    sentiment: 'positive'
  },
  {
    id: '3',
    userId: '3',
    userName: 'Sarah Johnson',
    rating: 2,
    comment: 'Food was cold when delivered and customer service was unresponsive.',
    serviceOrProduct: 'Zomato',
    timestamp: new Date('2024-01-08'),
    sentiment: 'negative'
  },
  {
    id: '4',
    userId: '4',
    userName: 'Mike Wilson',
    rating: 3,
    comment: 'Average experience. The app interface needs improvement.',
    serviceOrProduct: 'ICICI',
    timestamp: new Date('2024-01-05'),
    sentiment: 'neutral'
  },
  {
    id: '5',
    userId: '5',
    userName: 'Emma Davis',
    rating: 5,
    comment: 'Amazing food quality and super fast delivery! Highly recommended.',
    serviceOrProduct: 'Swiggy',
    timestamp: new Date('2024-01-03'),
    sentiment: 'positive'
  }
];

// Simple sentiment analysis function
const analyzeSentiment = (comment: string): 'positive' | 'neutral' | 'negative' => {
  const positiveWords = ['excellent', 'amazing', 'great', 'good', 'outstanding', 'fantastic', 'wonderful', 'perfect', 'love', 'awesome'];
  const negativeWords = ['bad', 'terrible', 'awful', 'horrible', 'worst', 'hate', 'disappointing', 'poor', 'unresponsive', 'cold'];
  
  const words = comment.toLowerCase().split(' ');
  const positiveCount = words.filter(word => positiveWords.includes(word)).length;
  const negativeCount = words.filter(word => negativeWords.includes(word)).length;
  
  if (positiveCount > negativeCount) return 'positive';
  if (negativeCount > positiveCount) return 'negative';
  return 'neutral';
};

export const FeedbackProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [feedbacks, setFeedbacks] = useState<Feedback[]>([]);
  const { user } = useAuth();

  useEffect(() => {
    // Load feedbacks from localStorage or use initial data
    const storedFeedbacks = localStorage.getItem('feedback_data');
    if (storedFeedbacks) {
      const parsed = JSON.parse(storedFeedbacks).map((f: any) => ({
        ...f,
        timestamp: new Date(f.timestamp)
      }));
      setFeedbacks(parsed);
    } else {
      setFeedbacks(initialFeedbacks);
    }
  }, []);

  useEffect(() => {
    // Save feedbacks to localStorage whenever they change
    if (feedbacks.length > 0) {
      localStorage.setItem('feedback_data', JSON.stringify(feedbacks));
    }
  }, [feedbacks]);

  const addFeedback = (feedbackData: Omit<Feedback, 'id' | 'userId' | 'userName' | 'timestamp' | 'sentiment'>) => {
    if (!user) return;

    const newFeedback: Feedback = {
      id: Date.now().toString(),
      userId: user.id,
      userName: user.name,
      timestamp: new Date(),
      sentiment: analyzeSentiment(feedbackData.comment),
      ...feedbackData
    };

    setFeedbacks(prev => [newFeedback, ...prev]);
  };

  const updateFeedback = (id: string, updateData: Partial<Feedback>) => {
    setFeedbacks(prev => prev.map(feedback => {
      if (feedback.id === id) {
        const updated = { ...feedback, ...updateData };
        if (updateData.comment) {
          updated.sentiment = analyzeSentiment(updateData.comment);
        }
        return updated;
      }
      return feedback;
    }));
  };

  const deleteFeedback = (id: string) => {
    setFeedbacks(prev => prev.filter(feedback => feedback.id !== id));
  };

  const getUserFeedbacks = (userId: string) => {
    return feedbacks.filter(feedback => feedback.userId === userId);
  };

  const getAnalytics = () => {
    const totalFeedbacks = feedbacks.length;
    const averageRating = feedbacks.length > 0 
      ? feedbacks.reduce((sum, f) => sum + f.rating, 0) / feedbacks.length 
      : 0;

    const sentimentDistribution = feedbacks.reduce(
      (acc, f) => {
        if (f.sentiment) acc[f.sentiment]++;
        return acc;
      },
      { positive: 0, neutral: 0, negative: 0 }
    );

    const serviceDistribution = feedbacks.reduce((acc, f) => {
      acc[f.serviceOrProduct] = (acc[f.serviceOrProduct] || 0) + 1;
      return acc;
    }, {} as Record<string, number>);

    const ratingDistribution = feedbacks.reduce((acc, f) => {
      acc[f.rating] = (acc[f.rating] || 0) + 1;
      return acc;
    }, {} as Record<number, number>);

    return {
      totalFeedbacks,
      averageRating,
      sentimentDistribution,
      serviceDistribution,
      ratingDistribution
    };
  };

  return (
    <FeedbackContext.Provider value={{
      feedbacks,
      addFeedback,
      updateFeedback,
      deleteFeedback,
      getUserFeedbacks,
      getAnalytics
    }}>
      {children}
    </FeedbackContext.Provider>
  );
};

export const useFeedback = () => {
  const context = useContext(FeedbackContext);
  if (context === undefined) {
    throw new Error('useFeedback must be used within a FeedbackProvider');
  }
  return context;
};