import React, { useState, useEffect, useCallback, useRef } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { 
  ArrowLeft, 
  ArrowRight, 
  ZoomIn, 
  ZoomOut, 
  Bookmark, 
  Sun, 
  Moon, 
  RotateCw,
  Maximize2,
  Minimize2,
  Home,
  BookOpen,
  Search,
  Clock,
  Target,
  Heart,
  Share2,
  Download,
  Settings,
  ChevronLeft,
  ChevronRight,
  X,
  Check,
  TrendingUp,
  Award,
  BarChart3
} from 'lucide-react';
import { SecureLibraryResource, ReadingSession, UserLibraryProgress } from '../types';
import { secureLibraryService } from '../services/secureLibraryService';
import { useAuth } from '../context/AuthContext';
import { clsx } from 'clsx';

interface CODELReaderProps {
  resource: SecureLibraryResource;
  onClose: () => void;
  initialPage?: number;
  initialScale?: number;
}

export const CODELReader: React.FC<CODELReaderProps> = ({
  resource,
  onClose,
  initialPage = 1,
  initialScale = 1.0
}) => {
  const { user } = useAuth();
  const [isLoading, setIsLoading] = useState(true);
  const [isDarkMode, setIsDarkMode] = useState(false);
  const [isFullscreen, setIsFullscreen] = useState(false);
  const [currentPage, setCurrentPage] = useState(initialPage);
  const [scale, setScale] = useState(initialScale);
  const [rotation, setRotation] = useState(0);
  
  // Session de lecture
  const [readingSession, setReadingSession] = useState<ReadingSession | null>(null);
  const [sessionStartTime, setSessionStartTime] = useState<Date | null>(null);
  const [readingTime, setReadingTime] = useState(0);
  const [progress, setProgress] = useState(0);
  
  // Fonctions avancées
  const [showSearch, setShowSearch] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');
  const [searchResults, setSearchResults] = useState<Array<{page: number, text: string}>>([]);
  const [showBookmarks, setShowBookmarks] = useState(false);
  const [bookmarks, setBookmarks] = useState<Array<{page: number, note: string, title: string}>>([]);
  const [showBookmarkModal, setShowBookmarkModal] = useState(false);
  const [bookmarkNote, setBookmarkNote] = useState('');
  const [bookmarkTitle, setBookmarkTitle] = useState('');
  
  // Statistiques et progression
  const [userProgress, setUserProgress] = useState<UserLibraryProgress | null>(null);
  const [showStats, setShowStats] = useState(false);
  const [isNewBadge, setIsNewBadge] = useState(false);
  const [newBadgeName, setNewBadgeName] = useState('');
  
  // Contrôles
  const [showControls, setShowControls] = useState(true);
  const [isAutoHide, setIsAutoHide] = useState(true);
  const controlsTimeoutRef = useRef<NodeJS.Timeout>();
  
  const readerRef = useRef<HTMLDivElement>(null);
  const contentRef = useRef<HTMLDivElement>(null);

  // Démarrer la session de lecture
  useEffect(() => {
    if (user && resource) {
      startReadingSession();
      loadUserProgress();
    }
  }, [user, resource]);

  // Timer de lecture
  useEffect(() => {
    if (sessionStartTime) {
      const interval = setInterval(() => {
        const now = new Date();
        const duration = Math.floor((now.getTime() - sessionStartTime.getTime()) / 1000 / 60); // en minutes
        setReadingTime(duration);
      }, 1000);
      
      return () => clearInterval(interval);
    }
  }, [sessionStartTime]);

  // Auto-hide controls
  useEffect(() => {
    if (isAutoHide && showControls) {
      controlsTimeoutRef.current = setTimeout(() => {
        setShowControls(false);
      }, 3000);
    }
    
    return () => {
      if (controlsTimeoutRef.current) {
        clearTimeout(controlsTimeoutRef.current);
      }
    };
  }, [showControls, isAutoHide]);

  const startReadingSession = async () => {
    if (!user) return;
    
    try {
      const sessionId = await secureLibraryService.startReadingSession(user.id, resource.id);
      setSessionStartTime(new Date());
      
      // Simuler une session (à remplacer avec la vraie logique)
      setReadingSession({
        id: sessionId,
        userId: user.id,
        resourceId: resource.id,
        startedAt: new Date().toISOString(),
        duration: 0,
        progress: 0,
        isCompleted: false,
        device: navigator.userAgent.includes('Mobile') ? 'mobile' : 'desktop'
      });
      
      setIsLoading(false);
    } catch (error) {
      console.error('Error starting reading session:', error);
      setIsLoading(false);
    }
  };

  const loadUserProgress = async () => {
    if (!user) return;
    
    try {
      const progress = await secureLibraryService.getUserLibraryProgress(user.id);
      setUserProgress(progress);
    } catch (error) {
      console.error('Error loading user progress:', error);
    }
  };

  const updateProgress = useCallback(() => {
    if (!resource.pages || !readingSession) return;
    
    const currentProgress = Math.round((currentPage / resource.pages) * 100);
    setProgress(currentProgress);
    
    // Mettre à jour la session
    if (readingSession) {
      secureLibraryService.updateReadingSession(
        readingSession.id,
        currentProgress,
        readingTime
      );
      
      // Mettre à jour la progression utilisateur
      secureLibraryService.updateUserProgress(
        user!.id,
        resource.id,
        readingTime,
        currentProgress,
        resource.title,
        resource.category
      );
    }
  }, [currentPage, resource.pages, readingSession, readingTime, user, resource]);

  useEffect(() => {
    updateProgress();
  }, [updateProgress]);

  const handlePageChange = (newPage: number) => {
    if (newPage >= 1 && resource.pages && newPage <= resource.pages) {
      setCurrentPage(newPage);
    }
  };

  const handleZoom = (delta: number) => {
    const newScale = Math.max(0.5, Math.min(3, scale + delta));
    setScale(newScale);
  };

  const handleRotate = () => {
    setRotation((prev) => (prev + 90) % 360);
  };

  const toggleFullscreen = () => {
    if (!document.fullscreenElement) {
      readerRef.current?.requestFullscreen();
      setIsFullscreen(true);
    } else {
      document.exitFullscreen();
      setIsFullscreen(false);
    }
  };

  const addBookmark = () => {
    if (!bookmarkTitle.trim()) return;
    
    const newBookmark = {
      page: currentPage,
      note: bookmarkNote,
      title: bookmarkTitle
    };
    
    setBookmarks([...bookmarks, newBookmark]);
    setShowBookmarkModal(false);
    setBookmarkNote('');
    setBookmarkTitle('');
  };

  const removeBookmark = (index: number) => {
    setBookmarks(bookmarks.filter((_, i) => i !== index));
  };

  const toggleFavorite = async () => {
    if (!user) return;
    
    try {
      const isFavorite = userProgress?.favoriteResources?.includes(resource.id) || false;
      
      if (isFavorite) {
        await secureLibraryService.removeFromFavorites(user.id, resource.id);
      } else {
        await secureLibraryService.addToFavorites(user.id, resource.id);
      }
      
      loadUserProgress();
    } catch (error) {
      console.error('Error toggling favorite:', error);
    }
  };

  const isFavorite = userProgress?.favoriteResources?.includes(resource.id) || false;

  const formatReadingTime = (minutes: number) => {
    const hours = Math.floor(minutes / 60);
    const mins = minutes % 60;
    return hours > 0 ? `${hours}h ${mins}min` : `${mins}min`;
  };

  if (isLoading) {
    return (
      <div className="fixed inset-0 bg-hub-bg flex items-center justify-center z-50">
        <div className="text-center">
          <div className="w-16 h-16 border-4 border-brand-cyan/20 border-t-brand-cyan animate-spin rounded-full mx-auto mb-4"></div>
          <p className="text-brand-cyan">Chargement de la ressource...</p>
        </div>
      </div>
    );
  }

  return (
    <div 
      ref={readerRef}
      className={clsx(
        'fixed inset-0 bg-hub-bg z-50 flex flex-col',
        isDarkMode && 'dark-mode'
      )}
      onMouseMove={() => {
        if (isAutoHide) {
          setShowControls(true);
        }
      }}
    >
      {/* Header Controls */}
      <AnimatePresence>
        {showControls && (
          <motion.div
            initial={{ y: -100, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            exit={{ y: -100, opacity: 0 }}
            className="bg-hub-surface/90 backdrop-blur-md border-b border-hub-border p-4"
          >
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-4">
                <button
                  onClick={onClose}
                  className="p-2 rounded-lg hover:bg-hub-surface/50 transition-colors"
                >
                  <ChevronLeft className="w-5 h-5" />
                </button>
                
                <div className="flex-1">
                  <h2 className="text-white font-bold truncate">{resource.title}</h2>
                  <p className="text-slate-400 text-sm truncate">
                    {resource.author} • {resource.category}
                  </p>
                </div>
              </div>
              
              <div className="flex items-center gap-2">
                {/* Statistiques de lecture */}
                <div className="flex items-center gap-3 px-3 py-1 bg-hub-surface/50 rounded-lg">
                  <div className="flex items-center gap-1 text-sm">
                    <Clock className="w-4 h-4 text-brand-cyan" />
                    <span className="text-slate-300">{formatReadingTime(readingTime)}</span>
                  </div>
                  <div className="flex items-center gap-1 text-sm">
                    <Target className="w-4 h-4 text-green-500" />
                    <span className="text-slate-300">{progress}%</span>
                  </div>
                </div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Main Content Area */}
      <div className="flex-1 relative overflow-hidden">
        <div 
          ref={contentRef}
          className="w-full h-full flex items-center justify-center p-8"
          style={{
            transform: `scale(${scale}) rotate(${rotation}deg)`,
            transition: 'transform 0.3s ease'
          }}
          onClick={() => setShowControls(!showControls)}
        >
          {/* Contenu de la ressource (simulation) */}
          <div className={clsx(
            'bg-white dark:bg-slate-900 rounded-lg shadow-2xl max-w-4xl w-full',
            'border border-hub-border'
          )}>
            <div className="p-8">
              <h3 className="text-2xl font-bold text-hub-bg dark:text-white mb-4">
                {resource.title}
              </h3>
              <div className="space-y-4 text-hub-bg dark:text-slate-300">
                <p>{resource.description}</p>
                <p>Page {currentPage} sur {resource.pages || 'N/A'}</p>
                <div className="h-64 bg-hub-surface/20 rounded flex items-center justify-center">
                  <BookOpen className="w-12 h-12 text-slate-400" />
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Navigation par pages */}
        <AnimatePresence>
          {showControls && (
            <>
              <motion.button
                initial={{ x: -50, opacity: 0 }}
                animate={{ x: 0, opacity: 1 }}
                exit={{ x: -50, opacity: 0 }}
                onClick={() => handlePageChange(currentPage - 1)}
                disabled={currentPage <= 1}
                className="absolute left-4 top-1/2 transform -translate-y-1/2 p-3 bg-hub-surface/80 backdrop-blur rounded-full hover:bg-hub-surface/90 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
              >
                <ArrowLeft className="w-6 h-6" />
              </motion.button>
              
              <motion.button
                initial={{ x: 50, opacity: 0 }}
                animate={{ x: 0, opacity: 1 }}
                exit={{ x: 50, opacity: 0 }}
                onClick={() => handlePageChange(currentPage + 1)}
                disabled={resource.pages && currentPage >= resource.pages}
                className="absolute right-4 top-1/2 transform -translate-y-1/2 p-3 bg-hub-surface/80 backdrop-blur rounded-full hover:bg-hub-surface/90 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
              >
                <ArrowRight className="w-6 h-6" />
              </motion.button>
            </>
          )}
        </AnimatePresence>
      </div>

      {/* Bottom Controls */}
      <AnimatePresence>
        {showControls && (
          <motion.div
            initial={{ y: 100, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            exit={{ y: 100, opacity: 0 }}
            className="bg-hub-surface/90 backdrop-blur-md border-t border-hub-border p-4"
          >
            <div className="flex items-center justify-between">
              {/* Progress Bar */}
              <div className="flex-1 mx-4">
                <div className="flex items-center gap-3">
                  <span className="text-sm text-slate-400">Page {currentPage}</span>
                  <div className="flex-1 bg-hub-border rounded-full h-2">
                    <motion.div
                      className="h-full bg-gradient-to-r from-brand-cyan to-brand-purple rounded-full"
                      initial={{ width: 0 }}
                      animate={{ width: `${progress}%` }}
                      transition={{ duration: 0.3 }}
                    />
                  </div>
                  <span className="text-sm text-slate-400">{resource.pages || 'N/A'}</span>
                </div>
              </div>
              
              {/* Zoom Controls */}
              <div className="flex items-center gap-2">
                <button
                  onClick={() => handleZoom(-0.1)}
                  className="p-2 rounded-lg hover:bg-hub-surface/50 transition-colors"
                >
                  <ZoomOut className="w-4 h-4" />
                </button>
                <span className="text-sm text-slate-400 min-w-[3rem] text-center">
                  {Math.round(scale * 100)}%
                </span>
                <button
                  onClick={() => handleZoom(0.1)}
                  className="p-2 rounded-lg hover:bg-hub-surface/50 transition-colors"
                >
                  <ZoomIn className="w-4 h-4" />
                </button>
                
                <div className="w-px h-6 bg-hub-border mx-2" />
                
                <button
                  onClick={handleRotate}
                  className="p-2 rounded-lg hover:bg-hub-surface/50 transition-colors"
                >
                  <RotateCw className="w-4 h-4" />
                </button>
                
                <button
                  onClick={() => setShowBookmarkModal(true)}
                  className="p-2 rounded-lg hover:bg-hub-surface/50 transition-colors"
                >
                  <Bookmark className="w-4 h-4" />
                </button>
                
                <button
                  onClick={() => setIsAutoHide(!isAutoHide)}
                  className={clsx('p-2 rounded-lg transition-colors', isAutoHide ? 'bg-brand-cyan/20 text-brand-cyan' : 'hover:bg-hub-surface/50')}
                >
                  <Settings className="w-4 h-4" />
                </button>
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Bookmark Modal */}
      <AnimatePresence>
        {showBookmarkModal && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 bg-black/50 flex items-center justify-center z-60 p-4"
            onClick={() => setShowBookmarkModal(false)}
          >
            <motion.div
              initial={{ scale: 0.9, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.9, opacity: 0 }}
              className="bg-hub-surface border border-hub-border rounded-2xl p-6 max-w-md w-full"
              onClick={(e) => e.stopPropagation()}
            >
              <h3 className="text-xl font-bold text-white mb-4">Ajouter un marque-page</h3>
              
              <div className="space-y-4">
                <div>
                  <label className="block text-sm font-medium text-slate-300 mb-2">
                    Titre du marque-page
                  </label>
                  <input
                    type="text"
                    value={bookmarkTitle}
                    onChange={(e) => setBookmarkTitle(e.target.value)}
                    className="w-full px-4 py-2 bg-hub-surface/50 border border-hub-border rounded-lg text-white placeholder-slate-500 focus:outline-none focus:ring-2 focus:ring-brand-cyan"
                    placeholder="Point important..."
                  />
                </div>
                
                <div>
                  <label className="block text-sm font-medium text-slate-300 mb-2">
                    Note (optionnelle)
                  </label>
                  <textarea
                    value={bookmarkNote}
                    onChange={(e) => setBookmarkNote(e.target.value)}
                    className="w-full px-4 py-2 bg-hub-surface/50 border border-hub-border rounded-lg text-white placeholder-slate-500 focus:outline-none focus:ring-2 focus:ring-brand-cyan resize-none"
                    rows={3}
                    placeholder="Mes notes sur ce passage..."
                  />
                </div>
                
                <div className="text-sm text-slate-400">
                  Page {currentPage}
                </div>
              </div>
              
              <div className="flex gap-3 mt-6">
                <button
                  onClick={() => setShowBookmarkModal(false)}
                  className="flex-1 px-4 py-2 border border-hub-border text-white rounded-lg hover:bg-hub-surface/50 transition-colors"
                >
                  Annuler
                </button>
                <button
                  onClick={addBookmark}
                  disabled={!bookmarkTitle.trim()}
                  className="flex-1 px-4 py-2 bg-brand-cyan text-white rounded-lg hover:bg-brand-cyan/80 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  Ajouter
                </button>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Bookmarks Panel */}
      <AnimatePresence>
        {showBookmarks && (
          <motion.div
            initial={{ x: 300, opacity: 0 }}
            animate={{ x: 0, opacity: 1 }}
            exit={{ x: 300, opacity: 0 }}
            className="fixed right-0 top-0 h-full w-80 bg-hub-surface border-l border-hub-border z-60 overflow-y-auto"
          >
            <div className="p-4 border-b border-hub-border">
              <div className="flex items-center justify-between">
                <h3 className="text-lg font-bold text-white">Marque-pages</h3>
                <button
                  onClick={() => setShowBookmarks(false)}
                  className="p-2 rounded-lg hover:bg-hub-surface/50 transition-colors"
                >
                  <X className="w-5 h-5" />
                </button>
              </div>
            </div>
            
            <div className="p-4 space-y-3">
              {bookmarks.length > 0 ? (
                bookmarks.map((bookmark, index) => (
                  <div key={index} className="bg-hub-surface/50 border border-hub-border rounded-lg p-3">
                    <div className="flex items-start justify-between">
                      <div className="flex-1">
                        <h4 className="font-medium text-white mb-1">{bookmark.title}</h4>
                        {bookmark.note && (
                          <p className="text-sm text-slate-400 mb-2">{bookmark.note}</p>
                        )}
                        <p className="text-xs text-slate-500">Page {bookmark.page}</p>
                      </div>
                      <button
                        onClick={() => removeBookmark(index)}
                        className="p-1 rounded hover:bg-hub-surface/50 transition-colors"
                      >
                        <X className="w-4 h-4 text-slate-400" />
                      </button>
                    </div>
                    <button
                      onClick={() => handlePageChange(bookmark.page)}
                      className="mt-2 text-sm text-brand-cyan hover:underline"
                    >
                      Aller à la page
                    </button>
                  </div>
                ))
              ) : (
                <div className="text-center py-8">
                  <Bookmark className="w-12 h-12 text-slate-500 mx-auto mb-4" />
                  <p className="text-slate-400">Aucun marque-page</p>
                </div>
              )}
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Stats Modal */}
      <AnimatePresence>
        {showStats && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 bg-black/50 flex items-center justify-center z-60 p-4"
            onClick={() => setShowStats(false)}
          >
            <motion.div
              initial={{ scale: 0.9, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.9, opacity: 0 }}
              className="bg-hub-surface border border-hub-border rounded-2xl p-6 max-w-2xl w-full max-h-[80vh] overflow-y-auto"
              onClick={(e) => e.stopPropagation()}
            >
              <div className="flex items-center justify-between mb-6">
                <h3 className="text-xl font-bold text-white">Statistiques de Lecture</h3>
                <button
                  onClick={() => setShowStats(false)}
                  className="p-2 rounded-lg hover:bg-hub-surface/50 transition-colors"
                >
                  <X className="w-5 h-5" />
                </button>
              </div>
              
              {userProgress && (
                <div className="space-y-6">
                  {/* Statistiques générales */}
                  <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                    <div className="bg-hub-surface/50 border border-hub-border rounded-lg p-4">
                      <div className="flex items-center gap-2 mb-2">
                        <BookOpen className="w-5 h-5 text-brand-cyan" />
                        <span className="text-sm text-slate-400">Livres lus</span>
                      </div>
                      <div className="text-2xl font-bold text-white">{userProgress.totalBooksRead}</div>
                    </div>
                    
                    <div className="bg-hub-surface/50 border border-hub-border rounded-lg p-4">
                      <div className="flex items-center gap-2 mb-2">
                        <Clock className="w-5 h-5 text-green-500" />
                        <span className="text-sm text-slate-400">Temps total</span>
                      </div>
                      <div className="text-2xl font-bold text-white">
                        {Math.round(userProgress.totalReadingTime)}h
                      </div>
                    </div>
                    
                    <div className="bg-hub-surface/50 border border-hub-border rounded-lg p-4">
                      <div className="flex items-center gap-2 mb-2">
                        <TrendingUp className="w-5 h-5 text-purple-500" />
                        <span className="text-sm text-slate-400">Série actuelle</span>
                      </div>
                      <div className="text-2xl font-bold text-white">{userProgress.currentStreak}j</div>
                    </div>
                    
                    <div className="bg-hub-surface/50 border border-hub-border rounded-lg p-4">
                      <div className="flex items-center gap-2 mb-2">
                        <Award className="w-5 h-5 text-yellow-500" />
                        <span className="text-sm text-slate-400">Badges</span>
                      </div>
                      <div className="text-2xl font-bold text-white">{userProgress.unlockedBadges.length}</div>
                    </div>
                  </div>
                  
                  {/* Badges débloqués */}
                  <div>
                    <h4 className="font-bold text-white mb-3">Badges débloqués</h4>
                    <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
                      {userProgress.unlockedBadges.map((badgeName, index) => (
                        <div key={index} className="bg-hub-surface/50 border border-hub-border rounded-lg p-3 text-center">
                          <div className="text-2xl mb-1">🏆</div>
                          <div className="text-sm text-white font-medium">{badgeName}</div>
                        </div>
                      ))}
                    </div>
                  </div>
                  
                  {/* Progression par catégorie */}
                  <div>
                    <h4 className="font-bold text-white mb-3">Progression par catégorie</h4>
                    <div className="space-y-2">
                      {Object.entries(userProgress.categoryProgress).map(([category, progress]) => (
                        <div key={category} className="bg-hub-surface/50 border border-hub-border rounded-lg p-3">
                          <div className="flex justify-between items-center mb-2">
                            <span className="text-white font-medium">{category}</span>
                            <span className="text-slate-400 text-sm">{progress.resourcesRead} ressources</span>
                          </div>
                          <div className="bg-hub-border rounded-full h-2">
                            <div 
                              className="h-full bg-gradient-to-r from-brand-cyan to-brand-purple rounded-full"
                              style={{ width: `${Math.min((progress.resourcesRead / 10) * 100, 100)}%` }}
                            />
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>
                </div>
              )}
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* New Badge Notification */}
      <AnimatePresence>
        {isNewBadge && (
          <motion.div
            initial={{ y: 100, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            exit={{ y: 100, opacity: 0 }}
            className="fixed bottom-20 right-4 bg-gradient-to-r from-brand-cyan to-brand-purple text-white rounded-lg p-4 shadow-lg z-70"
          >
            <div className="flex items-center gap-3">
              <Award className="w-6 h-6" />
              <div>
                <div className="font-bold">Nouveau badge débloqué !</div>
                <div className="text-sm">{newBadgeName}</div>
              </div>
              <button
                onClick={() => setIsNewBadge(false)}
                className="p-1 rounded hover:bg-white/20 transition-colors"
              >
                <X className="w-4 h-4" />
              </button>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
};

export default CODELReader;
