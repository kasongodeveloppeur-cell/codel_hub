export interface Quiz {
  id: string;
  title: string;
  description: string;
  category: string;
  difficulty: 'beginner' | 'intermediate' | 'advanced' | 'expert';
  duration: number; // en minutes
  questions: Question[];
  passingScore: number;
  maxAttempts: number;
  xpReward: number;
  prerequisites?: string[];
  tags: string[];
  createdAt: string;
  updatedAt: string;
  createdBy: string;
  isPublished: boolean;
}

export interface Question {
  id: string;
  type: 'multiple-choice' | 'true-false' | 'fill-blank' | 'code' | 'matching';
  question: string;
  explanation?: string;
  points: number;
  options?: QuestionOption[];
  correctAnswer: string | string[];
  codeSnippet?: string;
  hints?: string[];
  order: number;
}

export interface QuestionOption {
  id: string;
  text: string;
  isCorrect: boolean;
  explanation?: string;
}

export interface QuizAttempt {
  id: string;
  quizId: string;
  userId: string;
  answers: QuizAnswer[];
  score: number;
  maxScore: number;
  passed: boolean;
  startedAt: string;
  completedAt?: string;
  timeSpent: number; // en secondes
  attemptNumber: number;
}

export interface QuizAnswer {
  questionId: string;
  answer: string | string[];
  isCorrect: boolean;
  pointsEarned: number;
  timeSpent: number;
}

export interface QuizProgress {
  userId: string;
  quizId: string;
  status: 'not-started' | 'in-progress' | 'completed' | 'failed';
  bestScore: number;
  attempts: number;
  lastAttemptAt?: string;
  xpEarned: number;
}

export interface QuizFilter {
  category?: string;
  difficulty?: string;
  duration?: {
    min: number;
    max: number;
  };
  tags?: string[];
  isPublished?: boolean;
}
