import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { 
  Play, 
  Pause, 
  RotateCcw, 
  Save, 
  Copy, 
  CheckCircle, 
  XCircle, 
  Terminal,
  Code2,
  Zap,
  Trophy,
  Book,
  Lightbulb,
  ChevronRight,
  Settings,
  Maximize2,
  Minimize2,
  RefreshCw
} from 'lucide-react';
import { clsx } from 'clsx';
import { useThemeClasses } from '../hooks/useTheme';
import { useAuth } from '../context/AuthContext';

interface Exercise {
  id: string;
  title: string;
  description: string;
  difficulty: 'DEBUTANT' | 'INTERMEDIAIRE' | 'AVANCE';
  category: 'PYTHON' | 'HTML' | 'CSS' | 'JAVASCRIPT' | 'SQL' | 'ALGORITHMES';
  starterCode: string;
  solution: string;
  hints: string[];
  xpReward: number;
  estimatedTime: number;
}

interface CodeExecutionResult {
  output: string;
  error?: string;
  executionTime: number;
  success: boolean;
}

export const CODELLabs: React.FC = () => {
  const { user } = useAuth();
  const { bg, bgCard, bgHover, text, textSecondary, border, primary, primaryBg, success, error, transition } = useThemeClasses();
  
  const [selectedExercise, setSelectedExercise] = useState<Exercise | null>(null);
  const [userCode, setUserCode] = useState('');
  const [isRunning, setIsRunning] = useState(false);
  const [executionResult, setExecutionResult] = useState<CodeExecutionResult | null>(null);
  const [showSolution, setShowSolution] = useState(false);
  const [currentHintIndex, setCurrentHintIndex] = useState(0);
  const [isFullscreen, setIsFullscreen] = useState(false);
  const [userXP, setUserXP] = useState(0);
  const [completedExercises, setCompletedExercises] = useState<string[]>([]);
  
  const exercises: Exercise[] = [
    {
      id: 'python-1',
      title: 'Bonjour CODEL',
      description: 'Affiche "Bonjour CODEL" en utilisant la fonction print()',
      difficulty: 'DEBUTANT',
      category: 'PYTHON',
      starterCode: '# Écris ton code ici\nprint("Bonjour CODEL")',
      solution: 'print("Bonjour CODEL")',
      hints: [
        'Utilise la fonction print() pour afficher du texte',
        'Le texte doit être entre guillemets',
        'print("Bonjour CODEL") est la solution'
      ],
      xpReward: 5,
      estimatedTime: 5
    },
    {
      id: 'python-2',
      title: 'Calculatrice Simple',
      description: 'Crée une fonction qui additionne deux nombres',
      difficulty: 'DEBUTANT',
      category: 'PYTHON',
      starterCode: 'def additionner(a, b):\n    # Écris ton code ici\n    pass\n\n# Test\nresultat = additionner(5, 3)\nprint(resultat)',
      solution: 'def additionner(a, b):\n    return a + b\n\n# Test\nresultat = additionner(5, 3)\nprint(resultat)',
      hints: [
        'Utilise le mot-clé return pour renvoyer une valeur',
        'L\'addition se fait avec l\'opérateur +',
        'return a + b'
      ],
      xpReward: 10,
      estimatedTime: 10
    }
  ];

  useEffect(() => {
    if (selectedExercise) {
      setUserCode(selectedExercise.starterCode);
      setExecutionResult(null);
      setShowSolution(false);
      setCurrentHintIndex(0);
    }
  }, [selectedExercise]);

  const executeCode = async () => {
    if (!selectedExercise || !userCode.trim()) return;
    
    setIsRunning(true);
    setExecutionResult(null);
    
    try {
      await new Promise(resolve => setTimeout(resolve, 1000));
      
      if (selectedExercise.category === 'PYTHON') {
        const expectedOutput = selectedExercise.solution.includes('print') 
          ? selectedExercise.solution.match(/print\("([^"]+)"\)/)?.[1] 
          : '';
        
        if (userCode.includes('print("Bonjour CODEL")')) {
          setExecutionResult({
            output: 'Bonjour CODEL',
            executionTime: 0.05,
            success: true
          });
          
          if (!completedExercises.includes(selectedExercise.id)) {
            setUserXP(prev => prev + selectedExercise.xpReward);
            setCompletedExercises(prev => [...prev, selectedExercise.id]);
          }
        } else {
          setExecutionResult({
            output: '',
            error: 'Le code ne produit pas la sortie attendue',
            executionTime: 0.05,
            success: false
          });
        }
      } else {
        setExecutionResult({
          output: 'Code exécuté avec succès',
          executionTime: 0.1,
          success: true
        });
        
        if (!completedExercises.includes(selectedExercise.id)) {
          setUserXP(prev => prev + selectedExercise.xpReward);
          setCompletedExercises(prev => [...prev, selectedExercise.id]);
        }
      }
    } catch (error) {
      setExecutionResult({
        output: '',
        error: 'Erreur lors de l\'exécution',
        executionTime: 0,
        success: false
      });
    } finally {
      setIsRunning(false);
    }
  };

  const resetCode = () => {
    if (selectedExercise) {
      setUserCode(selectedExercise.starterCode);
      setExecutionResult(null);
    }
  };

  const copyCode = () => {
    navigator.clipboard.writeText(userCode);
  };

  const getDifficultyColor = (difficulty: string) => {
    switch (difficulty) {
      case 'DEBUTANT': return 'bg-green-500/20 text-green-500 border-green-500/30';
      case 'INTERMEDIAIRE': return 'bg-yellow-500/20 text-yellow-500 border-yellow-500/30';
      case 'AVANCE': return 'bg-red-500/20 text-red-500 border-red-500/30';
      default: return 'bg-slate-500/20 text-slate-500 border-slate-500/30';
    }
  };

  const getCategoryIcon = (category: string) => {
    switch (category) {
      case 'PYTHON': return '🐍';
      case 'JAVASCRIPT': return '🟨';
      case 'HTML': return '🌐';
      case 'CSS': return '🎨';
      case 'SQL': return '🗃️';
      case 'ALGORITHMES': return '🧮';
      default: return '💻';
    }
  };

  const filteredExercises = exercises.filter(exercise => 
    !completedExercises.includes(exercise.id)
  );

  return (
    <div className={clsx('min-h-screen', bg, text, transition)}>
      <div className="container mx-auto p-4">
        <div className="mb-6">
          <h1 className="text-3xl font-bold mb-2 flex items-center gap-3">
            <Terminal className="w-8 h-8 text-cyan-500" />
            CODEL LABS
          </h1>
          <p className={textSecondary}>
            Environnement de pratique pour apprendre à coder
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-6">
          <div className={clsx(bgCard, border, 'rounded-lg p-4')}>
            <div className="flex items-center gap-3">
              <Zap className="w-5 h-5 text-yellow-500" />
              <div>
                <div className="text-2xl font-bold">{userXP}</div>
                <div className="text-sm text-slate-400">XP Total</div>
              </div>
            </div>
          </div>
          
          <div className={clsx(bgCard, border, 'rounded-lg p-4')}>
            <div className="flex items-center gap-3">
              <Trophy className="w-5 h-5 text-green-500" />
              <div>
                <div className="text-2xl font-bold">{completedExercises.length}</div>
                <div className="text-sm text-slate-400">Exercices terminés</div>
              </div>
            </div>
          </div>
          
          <div className={clsx(bgCard, border, 'rounded-lg p-4')}>
            <div className="flex items-center gap-3">
              <Book className="w-5 h-5 text-blue-500" />
              <div>
                <div className="text-2xl font-bold">{filteredExercises.length}</div>
                <div className="text-sm text-slate-400">À faire</div>
              </div>
            </div>
          </div>
          
          <div className={clsx(bgCard, border, 'rounded-lg p-4')}>
            <div className="flex items-center gap-3">
              <Lightbulb className="w-5 h-5 text-purple-500" />
              <div>
                <div className="text-2xl font-bold">
                  {Math.floor(userXP / 50) + 1}
                </div>
                <div className="text-sm text-slate-400">Niveau</div>
              </div>
            </div>
          </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          <div className="lg:col-span-1">
            <div className={clsx(bgCard, border, 'rounded-xl p-4')}>
              <h2 className="text-xl font-bold mb-4">Exercices</h2>
              
              <div className="space-y-3 max-h-96 overflow-y-auto">
                {exercises.map((exercise) => {
                  const isCompleted = completedExercises.includes(exercise.id);
                  const isSelected = selectedExercise?.id === exercise.id;
                  
                  return (
                    <motion.div
                      key={exercise.id}
                      whileHover={{ scale: 1.02 }}
                      whileTap={{ scale: 0.98 }}
                      onClick={() => setSelectedExercise(exercise)}
                      className={clsx(
                        'p-3 rounded-lg border cursor-pointer transition-all',
                        isSelected ? primaryBg + ' border-cyan-500/30' : bgHover,
                        isCompleted && 'opacity-60'
                      )}
                    >
                      <div className="flex items-start justify-between">
                        <div className="flex-1">
                          <div className="flex items-center gap-2 mb-1">
                            <span className="text-lg">{getCategoryIcon(exercise.category)}</span>
                            <h3 className="font-semibold">{exercise.title}</h3>
                          </div>
                          <p className="text-sm text-slate-400 mb-2">
                            {exercise.description}
                          </p>
                          <div className="flex items-center gap-2">
                            <span className={clsx(
                              'px-2 py-1 rounded text-xs border',
                              getDifficultyColor(exercise.difficulty)
                            )}>
                              {exercise.difficulty}
                            </span>
                            <span className="text-xs text-slate-400">
                              +{exercise.xpReward} XP
                            </span>
                            <span className="text-xs text-slate-400">
                              {exercise.estimatedTime}min
                            </span>
                          </div>
                        </div>
                        {isCompleted && (
                          <CheckCircle className="w-5 h-5 text-green-500" />
                        )}
                      </div>
                    </motion.div>
                  );
                })}
              </div>
            </div>
          </div>

          <div className={clsx('lg:col-span-2', isFullscreen && 'fixed inset-0 z-50 p-6')}>
            <div className={clsx(
              bgCard, border, 'rounded-xl overflow-hidden',
              isFullscreen ? 'h-full' : 'min-h-[600px]'
            )}>
              <div className={clsx('flex items-center justify-between p-4 border-b', border)}>
                <div className="flex items-center gap-3">
                  <Code2 className="w-5 h-5 text-cyan-500" />
                  <h3 className="font-semibold">
                    {selectedExercise ? selectedExercise.title : 'Sélectionne un exercice'}
                  </h3>
                  {selectedExercise && (
                    <span className={clsx(
                      'px-2 py-1 rounded text-xs border',
                      getDifficultyColor(selectedExercise.difficulty)
                    )}>
                      {selectedExercise.difficulty}
                    </span>
                  )}
                </div>
                
                <div className="flex items-center gap-2">
                  <button
                    onClick={() => setIsFullscreen(!isFullscreen)}
                    className="p-2 rounded-lg hover:bg-slate-700/50 transition-colors"
                    title={isFullscreen ? 'Quitter le plein écran' : 'Plein écran'}
                  >
                    {isFullscreen ? <Minimize2 className="w-4 h-4" /> : <Maximize2 className="w-4 h-4" />}
                  </button>
                </div>
              </div>

              {selectedExercise ? (
                <div className="grid grid-cols-1 h-full">
                  <div className="flex flex-col">
                    <div className={clsx('flex items-center justify-between p-3 border-b', border)}>
                      <div className="flex items-center gap-2">
                        <span className="text-sm font-mono">{selectedExercise.category}</span>
                        <span className="text-xs text-slate-400">main.{selectedExercise.category.toLowerCase()}</span>
                      </div>
                      
                      <div className="flex items-center gap-2">
                        <button
                          onClick={resetCode}
                          className="p-2 rounded hover:bg-slate-700/50 transition-colors"
                          title="Réinitialiser"
                        >
                          <RotateCcw className="w-4 h-4" />
                        </button>
                        <button
                          onClick={copyCode}
                          className="p-2 rounded hover:bg-slate-700/50 transition-colors"
                          title="Copier"
                        >
                          <Copy className="w-4 h-4" />
                        </button>
                      </div>
                    </div>
                    
                    <div className="flex-1 relative">
                      <textarea
                        value={userCode}
                        onChange={(e) => setUserCode(e.target.value)}
                        className={clsx(
                          'w-full h-full p-4 font-mono text-sm resize-none focus:outline-none',
                          bg, text
                        )}
                        placeholder="Écris ton code ici..."
                        spellCheck={false}
                      />
                    </div>
                    
                    <div className={clsx('flex items-center justify-between p-3 border-t', border)}>
                      <div className="flex items-center gap-2">
                        <button
                          onClick={executeCode}
                          disabled={isRunning || !userCode.trim()}
                          className={clsx(
                            'px-4 py-2 rounded-lg font-medium transition-all flex items-center gap-2',
                            isRunning || !userCode.trim()
                              ? 'bg-slate-700 text-slate-400 cursor-not-allowed'
                              : primaryBg + ' ' + primary + ' hover:opacity-90'
                          )}
                        >
                          {isRunning ? (
                            <>
                              <RefreshCw className="w-4 h-4 animate-spin" />
                              Exécution...
                            </>
                          ) : (
                            <>
                              <Play className="w-4 h-4" />
                              Exécuter
                            </>
                          )}
                        </button>
                      </div>
                      
                      <div className="flex items-center gap-2">
                        <button
                          onClick={() => setShowSolution(!showSolution)}
                          className="px-3 py-1 rounded text-sm border hover:bg-slate-700/50 transition-colors"
                        >
                          {showSolution ? 'Cacher' : 'Voir'} solution
                        </button>
                      </div>
                    </div>
                  </div>

                  <div className="grid grid-cols-1 border-t border-l">
                    <div className={clsx('flex border-b', border)}>
                      <button
                        className={clsx(
                          'px-4 py-2 text-sm font-medium transition-colors',
                          executionResult ? primaryBg + ' ' + primary : 'text-slate-400'
                        )}
                      >
                        Résultat
                      </button>
                      <button
                        onClick={() => setCurrentHintIndex(Math.max(0, currentHintIndex - 1))}
                        disabled={currentHintIndex === 0}
                        className="px-4 py-2 text-sm font-medium text-slate-400 hover:text-slate-200 disabled:opacity-50"
                      >
                        Indices ({currentHintIndex + 1}/{selectedExercise.hints.length})
                      </button>
                    </div>

                    <div className="p-4 h-48 overflow-y-auto">
                      {executionResult ? (
                        <div className="space-y-3">
                          <div className={clsx(
                            'p-3 rounded-lg font-mono text-sm',
                            executionResult.success 
                              ? 'bg-green-500/10 text-green-400 border border-green-500/30'
                              : 'bg-red-500/10 text-red-400 border border-red-500/30'
                          )}>
                            {executionResult.error || executionResult.output}
                          </div>
                          
                          <div className="flex items-center gap-4 text-xs text-slate-400">
                            <span>Temps: {executionResult.executionTime}s</span>
                            {executionResult.success && (
                              <span className="flex items-center gap-1 text-green-500">
                                <CheckCircle className="w-3 h-3" />
                                Succès! +{selectedExercise.xpReward} XP
                              </span>
                            )}
                          </div>
                        </div>
                      ) : (
                        <div className="text-slate-400 text-center">
                          Clique sur "Exécuter" pour voir le résultat
                        </div>
                      )}
                      
                      {!executionResult && selectedExercise.hints.length > 0 && (
                        <div className="space-y-2">
                          <div className="flex items-center gap-2">
                            <Lightbulb className="w-4 h-4 text-yellow-500" />
                            <span className="text-sm font-medium">Indice:</span>
                          </div>
                          <p className="text-sm text-slate-300 bg-slate-800/50 p-3 rounded-lg">
                            {selectedExercise.hints[currentHintIndex]}
                          </p>
                          {selectedExercise.hints.length > 1 && (
                            <button
                              onClick={() => setCurrentHintIndex((prev) => 
                                Math.min(prev + 1, selectedExercise.hints.length - 1)
                              )}
                              className="text-xs text-cyan-500 hover:underline"
                            >
                              Indice suivant →
                            </button>
                          )}
                        </div>
                      )}
                    </div>
                  </div>

                  <AnimatePresence>
                    {showSolution && (
                      <motion.div
                        initial={{ height: 0, opacity: 0 }}
                        animate={{ height: 'auto', opacity: 1 }}
                        exit={{ height: 0, opacity: 0 }}
                        className="border-t border-l"
                      >
                        <div className={clsx('p-4 border-b', border)}>
                          <h4 className="font-medium text-yellow-500 mb-2">Solution</h4>
                          <pre className="text-sm font-mono bg-slate-800/50 p-3 rounded overflow-x-auto">
                            {selectedExercise.solution}
                          </pre>
                        </div>
                      </motion.div>
                    )}
                  </AnimatePresence>
                </div>
              ) : (
                <div className="flex items-center justify-center h-96 text-slate-400">
                  <div className="text-center">
                    <Code2 className="w-12 h-12 mx-auto mb-4" />
                    <p>Sélectionne un exercice pour commencer</p>
                  </div>
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default CODELLabs;
