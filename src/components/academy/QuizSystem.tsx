import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { 
  CheckCircle, 
  XCircle, 
  Clock, 
  Award, 
  Target, 
  Brain,
  Play,
  RotateCcw,
  ChevronRight,
  ChevronLeft,
  BookOpen,
  Lightbulb,
  Zap
} from 'lucide-react';
import { Button } from '../ui/Button';
import { Card, CardHeader, CardContent } from '../ui/Card';
import { Badge } from '../ui/Badge';
import { useThemeClasses } from '../../hooks/useTheme';

interface Quiz {
  id: string;
  title: string;
  description: string;
  category: string;
  difficulty: 'Débutant' | 'Intermédiaire' | 'Avancé';
  duration: number; // en minutes
  questions: QuizQuestion[];
  passingScore: number;
  xpReward: number;
}

interface QuizQuestion {
  id: string;
  question: string;
  type: 'multiple-choice' | 'true-false' | 'code' | 'fill-blank';
  options?: string[];
  correctAnswer: string | string[];
  explanation: string;
  points: number;
  codeSnippet?: string;
}

interface QuizResult {
  quizId: string;
  score: number;
  totalQuestions: number;
  correctAnswers: number;
  timeSpent: number;
  passed: boolean;
  xpEarned: number;
  completedAt: Date;
}

const QuizCard: React.FC<{
  quiz: Quiz;
  onStart: (quiz: Quiz) => void;
  isDarkMode: boolean;
}> = ({ quiz, onStart, isDarkMode }) => {
  const { bgCard, text } = useThemeClasses();

  const getDifficultyColor = (difficulty: string) => {
    switch (difficulty) {
      case 'Débutant': return 'bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-200';
      case 'Intermédiaire': return 'bg-yellow-100 text-yellow-800 dark:bg-yellow-900 dark:text-yellow-200';
      case 'Avancé': return 'bg-red-100 text-red-800 dark:bg-red-900 dark:text-red-200';
      default: return 'bg-gray-100 text-gray-800';
    }
  };

  return (
    <motion.div
      className={`${bgCard} rounded-xl border p-6 hover:shadow-lg transition-shadow cursor-pointer`}
      whileHover={{ y: -2 }}
      onClick={() => onStart(quiz)}
    >
      <div className="flex items-start justify-between mb-4">
        <div className="flex-1">
          <h3 className={`text-lg font-semibold ${text} mb-2`}>{quiz.title}</h3>
          <p className={`text-sm ${isDarkMode ? 'text-gray-400' : 'text-gray-600'} mb-3`}>
            {quiz.description}
          </p>
        </div>
        <div className="text-cyan-500">
          <Brain className="w-8 h-8" />
        </div>
      </div>
      
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-3">
          <Badge variant="outline" size="sm">
            {quiz.category}
          </Badge>
          <span className={`text-xs px-2 py-1 rounded-full ${getDifficultyColor(quiz.difficulty)}`}>
            {quiz.difficulty}
          </span>
        </div>
        
        <div className="flex items-center gap-4 text-sm text-gray-500">
          <span className="flex items-center gap-1">
            <Clock className="w-4 h-4" />
            {quiz.duration}min
          </span>
          <span className="flex items-center gap-1">
            <Target className="w-4 h-4" />
            {quiz.questions.length} questions
          </span>
          <span className="flex items-center gap-1 text-cyan-500">
            <Zap className="w-4 h-4" />
            {quiz.xpReward} XP
          </span>
        </div>
      </div>
    </motion.div>
  );
};

const QuizInterface: React.FC<{
  quiz: Quiz;
  onComplete: (result: QuizResult) => void;
  onExit: () => void;
  isDarkMode: boolean;
}> = ({ quiz, onComplete, onExit, isDarkMode }) => {
  const { bg, text } = useThemeClasses();
  const [currentQuestionIndex, setCurrentQuestionIndex] = useState(0);
  const [answers, setAnswers] = useState<Record<string, string | string[]>>({});
  const [timeSpent, setTimeSpent] = useState(0);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [showResults, setShowResults] = useState(false);

  const currentQuestion = quiz.questions[currentQuestionIndex];
  const progress = ((currentQuestionIndex + 1) / quiz.questions.length) * 100;

  useEffect(() => {
    const timer = setInterval(() => {
      setTimeSpent(prev => prev + 1);
    }, 1000);

    return () => clearInterval(timer);
  }, []);

  const formatTime = (seconds: number) => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins}:${secs.toString().padStart(2, '0')}`;
  };

  const handleAnswer = (answer: string | string[]) => {
    setAnswers(prev => ({
      ...prev,
      [currentQuestion.id]: answer
    }));
  };

  const handleNext = () => {
    if (currentQuestionIndex < quiz.questions.length - 1) {
      setCurrentQuestionIndex(prev => prev + 1);
    } else {
      handleSubmit();
    }
  };

  const handlePrevious = () => {
    if (currentQuestionIndex > 0) {
      setCurrentQuestionIndex(prev => prev - 1);
    }
  };

  const calculateScore = () => {
    let correct = 0;
    let totalPoints = 0;

    quiz.questions.forEach(question => {
      totalPoints += question.points;
      const userAnswer = answers[question.id];
      
      if (Array.isArray(question.correctAnswer)) {
        if (Array.isArray(userAnswer) && 
            question.correctAnswer.every(ans => userAnswer.includes(ans)) &&
            userAnswer.length === question.correctAnswer.length) {
          correct += question.points;
        }
      } else {
        if (userAnswer === question.correctAnswer) {
          correct += question.points;
        }
      }
    });

    return {
      score: Math.round((correct / totalPoints) * 100),
      correctAnswers: quiz.questions.filter(q => {
        const userAnswer = answers[q.id];
        if (Array.isArray(q.correctAnswer)) {
          return Array.isArray(userAnswer) && 
                 q.correctAnswer.every(ans => userAnswer.includes(ans)) &&
                 userAnswer.length === q.correctAnswer.length;
        }
        return userAnswer === q.correctAnswer;
      }).length,
      totalQuestions: quiz.questions.length
    };
  };

  const handleSubmit = async () => {
    setIsSubmitting(true);
    
    const { score, correctAnswers, totalQuestions } = calculateScore();
    const passed = score >= quiz.passingScore;
    const xpEarned = passed ? quiz.xpReward : Math.floor(quiz.xpReward * 0.3);

    const result: QuizResult = {
      quizId: quiz.id,
      score,
      totalQuestions,
      correctAnswers,
      timeSpent,
      passed,
      xpEarned,
      completedAt: new Date()
    };

    setTimeout(() => {
      setShowResults(true);
      onComplete(result);
      setIsSubmitting(false);
    }, 1000);
  };

  if (showResults) {
    const { score, correctAnswers, totalQuestions } = calculateScore();
    const passed = score >= quiz.passingScore;
    const xpEarned = passed ? quiz.xpReward : Math.floor(quiz.xpReward * 0.3);

    return (
      <div className={`min-h-screen ${bg} ${text} flex items-center justify-center p-6`}>
        <Card className="max-w-md w-full">
          <CardContent className="p-8 text-center">
            <motion.div
              initial={{ scale: 0 }}
              animate={{ scale: 1 }}
              className={`w-20 h-20 rounded-full flex items-center justify-center mx-auto mb-6 ${
                passed ? 'bg-green-100 text-green-600' : 'bg-red-100 text-red-600'
              }`}
            >
              {passed ? <CheckCircle className="w-10 h-10" /> : <XCircle className="w-10 h-10" />}
            </motion.div>
            
            <h2 className={`text-2xl font-bold mb-2 ${text}`}>
              {passed ? 'Félicitations!' : 'Quiz terminé'}
            </h2>
            
            <p className={`${isDarkMode ? 'text-gray-400' : 'text-gray-600'} mb-6`}>
              {passed 
                ? 'Vous avez réussi le quiz avec succès!' 
                : 'Continuez à pratiquer pour vous améliorer.'}
            </p>
            
            <div className="space-y-4 mb-8">
              <div className="flex justify-between">
                <span>Score:</span>
                <span className="font-bold">{score}%</span>
              </div>
              <div className="flex justify-between">
                <span>Réponses correctes:</span>
                <span className="font-bold">{correctAnswers}/{totalQuestions}</span>
              </div>
              <div className="flex justify-between">
                <span>Temps:</span>
                <span className="font-bold">{formatTime(timeSpent)}</span>
              </div>
              <div className="flex justify-between">
                <span>XP gagnés:</span>
                <span className="font-bold text-cyan-500">+{xpEarned} XP</span>
              </div>
            </div>
            
            <div className="flex gap-3">
              <Button
                variant="outline"
                onClick={onExit}
                className="flex-1"
              >
                Quitter
              </Button>
              <Button
                onClick={() => window.location.reload()}
                className="flex-1"
                icon={<RotateCcw className="w-4 h-4" />}
              >
                Recommencer
              </Button>
            </div>
          </CardContent>
        </Card>
      </div>
    );
  }

  return (
    <div className={`min-h-screen ${bg} ${text} p-6`}>
      <div className="max-w-4xl mx-auto">
        {/* Header */}
        <div className="flex items-center justify-between mb-8">
          <div>
            <h1 className="text-2xl font-bold mb-2">{quiz.title}</h1>
            <div className="flex items-center gap-4 text-sm text-gray-500">
              <span>Question {currentQuestionIndex + 1} sur {quiz.questions.length}</span>
              <span className="flex items-center gap-1">
                <Clock className="w-4 h-4" />
                {formatTime(timeSpent)}
              </span>
            </div>
          </div>
          
          <Button
            variant="outline"
            onClick={onExit}
          >
            Quitter
          </Button>
        </div>

        {/* Progress Bar */}
        <div className="mb-8">
          <div className="w-full bg-gray-200 dark:bg-gray-700 rounded-full h-2">
            <motion.div
              className="bg-gradient-to-r from-cyan-500 to-blue-600 h-2 rounded-full"
              initial={{ width: 0 }}
              animate={{ width: `${progress}%` }}
              transition={{ duration: 0.3 }}
            />
          </div>
        </div>

        {/* Question */}
        <Card className="mb-8">
          <CardContent className="p-8">
            <div className="mb-6">
              <h3 className="text-xl font-semibold mb-4">{currentQuestion.question}</h3>
              
              {currentQuestion.codeSnippet && (
                <div className="bg-gray-900 text-gray-100 p-4 rounded-lg mb-4 font-mono text-sm">
                  <pre>{currentQuestion.codeSnippet}</pre>
                </div>
              )}
            </div>

            {/* Answer Options */}
            <div className="space-y-3">
              {currentQuestion.type === 'multiple-choice' && currentQuestion.options?.map((option, index) => (
                <label
                  key={index}
                  className={`block p-4 rounded-lg border cursor-pointer transition-colors ${
                    answers[currentQuestion.id] === option
                      ? 'border-cyan-500 bg-cyan-50 dark:bg-cyan-900/20'
                      : 'border-gray-200 dark:border-gray-700 hover:border-gray-300'
                  }`}
                >
                  <div className="flex items-center">
                    <input
                      type="radio"
                      name={`question-${currentQuestion.id}`}
                      value={option}
                      checked={answers[currentQuestion.id] === option}
                      onChange={(e) => handleAnswer(e.target.value)}
                      className="mr-3"
                    />
                    <span>{option}</span>
                  </div>
                </label>
              ))}

              {currentQuestion.type === 'true-false' && (
                <div className="grid grid-cols-2 gap-4">
                  {['Vrai', 'Faux'].map((option) => (
                    <label
                      key={option}
                      className={`block p-4 rounded-lg border cursor-pointer transition-colors text-center ${
                        answers[currentQuestion.id] === option
                          ? 'border-cyan-500 bg-cyan-50 dark:bg-cyan-900/20'
                          : 'border-gray-200 dark:border-gray-700 hover:border-gray-300'
                      }`}
                    >
                      <input
                        type="radio"
                        name={`question-${currentQuestion.id}`}
                        value={option}
                        checked={answers[currentQuestion.id] === option}
                        onChange={(e) => handleAnswer(e.target.value)}
                        className="sr-only"
                      />
                      <span className="font-medium">{option}</span>
                    </label>
                  ))}
                </div>
              )}

              {currentQuestion.type === 'fill-blank' && (
                <input
                  type="text"
                  value={answers[currentQuestion.id] as string || ''}
                  onChange={(e) => handleAnswer(e.target.value)}
                  placeholder="Votre réponse..."
                  className="w-full p-4 rounded-lg border border-gray-200 dark:border-gray-700 bg-white dark:bg-gray-800"
                />
              )}
            </div>
          </CardContent>
        </Card>

        {/* Navigation */}
        <div className="flex justify-between">
          <Button
            variant="outline"
            onClick={handlePrevious}
            disabled={currentQuestionIndex === 0}
            icon={<ChevronLeft className="w-4 h-4" />}
          >
            Précédent
          </Button>
          
          <Button
            onClick={handleNext}
            disabled={!answers[currentQuestion.id]}
            loading={isSubmitting}
            icon={currentQuestionIndex === quiz.questions.length - 1 ? <CheckCircle className="w-4 h-4" /> : <ChevronRight className="w-4 h-4" />}
          >
            {currentQuestionIndex === quiz.questions.length - 1 ? 'Terminer' : 'Suivant'}
          </Button>
        </div>
      </div>
    </div>
  );
};

export const QuizSystem: React.FC = () => {
  const { bg, text } = useThemeClasses();
  const [isDarkMode] = useState(false); // État local pour le mode sombre
  const [quizzes, setQuizzes] = useState<Quiz[]>([]);
  const [selectedQuiz, setSelectedQuiz] = useState<Quiz | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  // Quiz de démonstration
  const demoQuizzes: Quiz[] = [
    {
      id: '1',
      title: 'HTML & CSS Fundamentals',
      description: 'Testez vos connaissances de base en HTML et CSS',
      category: 'Web',
      difficulty: 'Débutant',
      duration: 15,
      passingScore: 70,
      xpReward: 50,
      questions: [
        {
          id: 'q1',
          question: 'Quelle balise HTML est utilisée pour créer un lien?',
          type: 'multiple-choice',
          options: ['<link>', '<a>', '<href>', '<url>'],
          correctAnswer: '<a>',
          explanation: 'La balise <a> (anchor) est utilisée pour créer des hyperliens.',
          points: 10
        },
        {
          id: 'q2',
          question: 'CSS signifie:',
          type: 'multiple-choice',
          options: [
            'Computer Style Sheets',
            'Cascading Style Sheets',
            'Creative Style Sheets',
            'Colorful Style Sheets'
          ],
          correctAnswer: 'Cascading Style Sheets',
          explanation: 'CSS signifie Cascading Style Sheets.',
          points: 10
        },
        {
          id: 'q3',
          question: 'Le JavaScript est un langage compilé.',
          type: 'true-false',
          correctAnswer: 'Faux',
          explanation: 'JavaScript est un langage interprété, pas compilé.',
          points: 10
        }
      ]
    },
    {
      id: '2',
      title: 'JavaScript Basics',
      description: 'Évaluez vos connaissances en JavaScript',
      category: 'Programming',
      difficulty: 'Intermédiaire',
      duration: 20,
      passingScore: 75,
      xpReward: 75,
      questions: [
        {
          id: 'q1',
          question: 'Quelle méthode est utilisée pour ajouter un élément à la fin d\'un tableau?',
          type: 'multiple-choice',
          options: ['push()', 'pop()', 'shift()', 'unshift()'],
          correctAnswer: 'push()',
          explanation: 'push() ajoute un élément à la fin d\'un tableau.',
          points: 15
        },
        {
          id: 'q2',
          question: 'Completez: const array = [1, 2, 3]; array.___(4); // [1, 2, 3, 4]',
          type: 'fill-blank',
          correctAnswer: 'push',
          explanation: 'La méthode push() ajoute des éléments à la fin du tableau.',
          points: 15
        }
      ]
    }
  ];

  useEffect(() => {
    setTimeout(() => {
      setQuizzes(demoQuizzes);
      setIsLoading(false);
    }, 1000);
  }, []);

  const handleQuizComplete = (result: QuizResult) => {
    console.log('Quiz completed:', result);
    // Sauvegarder le résultat, attribuer XP, etc.
  };

  const handleStartQuiz = (quiz: Quiz) => {
    setSelectedQuiz(quiz);
  };

  const handleExitQuiz = () => {
    setSelectedQuiz(null);
  };

  if (selectedQuiz) {
    return (
      <QuizInterface
        quiz={selectedQuiz}
        onComplete={handleQuizComplete}
        onExit={handleExitQuiz}
        isDarkMode={isDarkMode}
      />
    );
  }

  if (isLoading) {
    return (
      <div className={`min-h-screen ${bg} ${text} flex items-center justify-center`}>
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-cyan-500"></div>
      </div>
    );
  }

  return (
    <div className={`min-h-screen ${bg} ${text} p-6`}>
      <div className="max-w-6xl mx-auto">
        {/* Header */}
        <div className="text-center mb-12">
          <div className="flex items-center justify-center mb-4">
            <Brain className="w-12 h-12 text-cyan-500 mr-3" />
            <h1 className="text-4xl font-bold">CODEL Quiz</h1>
          </div>
          <p className={`text-lg ${isDarkMode ? 'text-gray-400' : 'text-gray-600'}`}>
            Testez vos connaissances et gagnez des points XP!
          </p>
        </div>

        {/* Stats */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-12">
          <Card>
            <CardContent className="p-6 text-center">
              <div className="text-3xl font-bold text-cyan-500 mb-2">{quizzes.length}</div>
              <div className="text-sm text-gray-500">Quiz disponibles</div>
            </CardContent>
          </Card>
          
          <Card>
            <CardContent className="p-6 text-center">
              <div className="text-3xl font-bold text-green-500 mb-2">0</div>
              <div className="text-sm text-gray-500">Quiz complétés</div>
            </CardContent>
          </Card>
          
          <Card>
            <CardContent className="p-6 text-center">
              <div className="text-3xl font-bold text-yellow-500 mb-2">0%</div>
              <div className="text-sm text-gray-500">Taux de réussite</div>
            </CardContent>
          </Card>
          
          <Card>
            <CardContent className="p-6 text-center">
              <div className="text-3xl font-bold text-purple-500 mb-2">0</div>
              <div className="text-sm text-gray-500">XP gagnés</div>
            </CardContent>
          </Card>
        </div>

        {/* Quiz Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {quizzes.map((quiz) => (
            <QuizCard
              key={quiz.id}
              quiz={quiz}
              onStart={handleStartQuiz}
              isDarkMode={isDarkMode}
            />
          ))}
        </div>

        {quizzes.length === 0 && (
          <div className="text-center py-12">
            <Brain className={`w-16 h-16 mx-auto mb-4 ${isDarkMode ? 'text-gray-600' : 'text-gray-400'}`} />
            <h3 className={`text-xl font-medium mb-2 ${text}`}>
              Aucun quiz disponible
            </h3>
            <p className={`${isDarkMode ? 'text-gray-400' : 'text-gray-600'}`}>
              Revenez bientôt pour de nouveaux quiz!
            </p>
          </div>
        )}
      </div>
    </div>
  );
};

export default QuizSystem;
