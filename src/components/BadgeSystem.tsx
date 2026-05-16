import React, { useState, useEffect } from 'react';
import { 
  Trophy, 
  Star, 
  Award, 
  Target, 
  Zap, 
  Shield, 
  Flame,
  Crown,
  Gem,
  Rocket,
  Heart,
  Brain,
  Code,
  Users,
  BookOpen,
  Lightbulb,
  ChevronRight
} from 'lucide-react';
import { motion, AnimatePresence } from 'motion/react';
import { clsx } from 'clsx';
import { Badge } from '../types';
import { useAuth } from '../context/AuthContext';
import { notificationService } from '../services/notificationService';

interface BadgeDisplayProps {
  badge: Badge;
  size?: 'small' | 'medium' | 'large';
  showTooltip?: boolean;
  isNew?: boolean;
  onClick?: () => void;
}

const BadgeDisplay: React.FC<BadgeDisplayProps> = ({ 
  badge, 
  size = 'medium', 
  showTooltip = true,
  isNew = false,
  onClick 
}) => {
  const [isHovered, setIsHovered] = useState(false);

  const sizeClasses = {
    small: 'w-8 h-8 text-xs',
    medium: 'w-12 h-12 text-sm',
    large: 'w-16 h-16 text-base'
  };

  const getIcon = (category: Badge['category']) => {
    switch (category) {
      case 'PARTICIPATION': return <Users className="w-full h-full" />;
      case 'PROJET': return <Code className="w-full h-full" />;
      case 'FORMATION': return <BookOpen className="w-full h-full" />;
      case 'MENTORAT': return <Lightbulb className="w-full h-full" />;
      case 'EXCEPTIONNEL': return <Crown className="w-full h-full" />;
      default: return <Star className="w-full h-full" />;
    }
  };

  return (
    <div 
      className="relative inline-block"
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
      onClick={onClick}
    >
      <motion.div
        className={clsx(
          'relative rounded-full flex items-center justify-center cursor-pointer transition-all duration-300',
          sizeClasses[size],
          'shadow-lg hover:shadow-xl hover:scale-110'
        )}
        style={{ 
          backgroundColor: badge.color,
          boxShadow: `0 0 20px ${badge.color}40`
        }}
        whileHover={{ scale: 1.1, rotate: 5 }}
        whileTap={{ scale: 0.95 }}
      >
        <div className="text-white">
          {getIcon(badge.category)}
        </div>
        
        {/* Badge NEW indicator */}
        {isNew && (
          <motion.div
            className="absolute -top-1 -right-1 w-3 h-3 bg-red-500 rounded-full"
            animate={{ scale: [1, 1.2, 1] }}
            transition={{ duration: 2, repeat: Infinity }}
          />
        )}
      </motion.div>

      {/* Tooltip */}
      <AnimatePresence>
        {isHovered && showTooltip && (
          <motion.div
            initial={{ opacity: 0, y: 10, scale: 0.8 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: 10, scale: 0.8 }}
            className="absolute z-50 bottom-full left-1/2 transform -translate-x-1/2 mb-2 px-3 py-2 bg-hub-surface border border-hub-border rounded-lg shadow-xl whitespace-nowrap"
          >
            <div className="text-center">
              <div className="font-bold text-white text-sm">{badge.name}</div>
              <div className="text-xs text-slate-400 mt-1">{badge.description}</div>
              <div className="text-xs text-brand-cyan mt-1">+{badge.points} points</div>
            </div>
            <div className="absolute top-full left-1/2 transform -translate-x-1/2 -mt-1">
              <div className="w-0 h-0 border-l-4 border-r-4 border-t-4 border-transparent border-t-hub-surface"></div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
};

interface BadgeProgressProps {
  currentPoints: number;
  requiredPoints: number;
  badge: Badge;
  isActive?: boolean;
}

const BadgeProgress: React.FC<BadgeProgressProps> = ({ 
  currentPoints, 
  requiredPoints, 
  badge,
  isActive = false 
}) => {
  const progress = Math.min((currentPoints / requiredPoints) * 100, 100);
  
  return (
    <motion.div
      className={clsx(
        'relative p-4 rounded-lg border transition-all duration-300',
        isActive 
          ? 'bg-brand-cyan/10 border-brand-cyan shadow-[0_0_15px_rgba(0,242,255,0.3)]' 
          : 'bg-hub-surface/50 border-hub-border hover:border-brand-cyan/30'
      )}
      whileHover={{ scale: 1.02 }}
    >
      <div className="flex items-center gap-4">
        <div 
          className="w-12 h-12 rounded-full flex items-center justify-center text-white"
          style={{ backgroundColor: badge.color }}
        >
          <Star className="w-6 h-6" />
        </div>
        
        <div className="flex-1">
          <div className="flex justify-between items-center mb-2">
            <div>
              <h3 className="font-bold text-white">{badge.name}</h3>
              <p className="text-xs text-slate-400">{badge.description}</p>
            </div>
            <div className="text-right">
              <div className="text-sm font-bold text-brand-cyan">{badge.points} pts</div>
              <div className="text-xs text-slate-400">{currentPoints}/{requiredPoints}</div>
            </div>
          </div>
          
          <div className="w-full bg-hub-border rounded-full h-2 overflow-hidden">
            <motion.div
              className="h-full rounded-full transition-all duration-500"
              style={{ 
                backgroundColor: badge.color,
                width: `${progress}%` 
              }}
              initial={{ width: 0 }}
              animate={{ width: `${progress}%` }}
            />
          </div>
        </div>
      </div>
    </motion.div>
  );
};

interface BadgeSystemProps {
  showProgress?: boolean;
  maxBadges?: number;
}

export const BadgeSystem: React.FC<BadgeSystemProps> = ({ 
  showProgress = false, 
  maxBadges = 12 
}) => {
  const { user } = useAuth();
  const [userBadges, setUserBadges] = useState<Badge[]>([]);
  const [availableBadges, setAvailableBadges] = useState<Badge[]>([]);
  const [selectedBadge, setSelectedBadge] = useState<Badge | null>(null);
  const [showBadgeModal, setShowBadgeModal] = useState(false);

  // Badges prédéfinis pour CODEL Hub
  const predefinedBadges: Omit<Badge, 'id' | 'unlockedAt'>[] = [
    {
      name: 'Premier Pas',
      description: 'Première connexion au hub',
      icon: '👋',
      color: '#10B981',
      category: 'PARTICIPATION',
      points: 10
    },
    {
      name: 'Développeur Actif',
      description: '5 contributions aux projets',
      icon: '💻',
      color: '#3B82F6',
      category: 'PROJET',
      points: 50
    },
    {
      name: 'Menteur Junior',
      description: 'Aider 3 membres',
      icon: '🤝',
      color: '#8B5CF6',
      category: 'MENTORAT',
      points: 75
    },
    {
      name: 'Étudiant Assidu',
      description: 'Compléter 3 modules',
      icon: '📚',
      color: '#F59E0B',
      category: 'FORMATION',
      points: 30
    },
    {
      name: 'Community Star',
      description: '50 messages dans le forum',
      icon: '⭐',
      color: '#EF4444',
      category: 'PARTICIPATION',
      points: 40
    },
    {
      name: 'Security Expert',
      description: 'Détecter 5 menaces',
      icon: '🛡️',
      color: '#06B6D4',
      category: 'EXCEPTIONNEL',
      points: 100
    },
    {
      name: 'Code Master',
      description: '1000 lignes de code',
      icon: '🚀',
      color: '#EC4899',
      category: 'PROJET',
      points: 80
    },
    {
      name: 'Knowledge Share',
      description: 'Créer 5 tutoriels',
      icon: '🎓',
      color: '#14B8A6',
      category: 'FORMATION',
      points: 60
    },
    {
      name: 'Team Player',
      description: 'Participer à 10 projets',
      icon: '👥',
      color: '#F97316',
      category: 'PARTICIPATION',
      points: 45
    },
    {
      name: 'Innovation Award',
      description: 'Proposer 3 améliorations',
      icon: '💡',
      color: '#84CC16',
      category: 'EXCEPTIONNEL',
      points: 90
    },
    {
      name: 'Night Owl',
      description: '50 connexions nocturnes',
      icon: '🦉',
      color: '#6366F1',
      category: 'PARTICIPATION',
      points: 25
    },
    {
      name: 'Hub Champion',
      description: 'Atteindre 1000 points',
      icon: '👑',
      color: '#FBBF24',
      category: 'EXCEPTIONNEL',
      points: 150
    }
  ];

  useEffect(() => {
    if (user) {
      // Simuler les badges de l'utilisateur
      const unlockedBadges = predefinedBadges
        .slice(0, Math.min(user.points / 50, 8))
        .map((badge, index) => ({
          ...badge,
          id: `badge-${index}`,
          unlockedAt: new Date(Date.now() - Math.random() * 30 * 24 * 60 * 60 * 1000).toISOString()
        }));
      
      setUserBadges(unlockedBadges);
      
      // Badges disponibles (non débloqués)
      const lockedBadges = predefinedBadges
        .slice(user.points / 50)
        .map((badge, index) => ({
          ...badge,
          id: `badge-locked-${index}`,
          unlockedAt: undefined
        }));
      
      setAvailableBadges(lockedBadges);
    }
  }, [user]);

  const handleBadgeClick = (badge: Badge) => {
    setSelectedBadge(badge);
    setShowBadgeModal(true);
  };

  const handleUnlockBadge = async (badge: Omit<Badge, 'id' | 'unlockedAt'>) => {
    if (!user) return;
    
    try {
      // Simuler le déblocage du badge
      const newBadge: Badge = {
        ...badge,
        id: `badge-${Date.now()}`,
        unlockedAt: new Date().toISOString()
      };
      
      setUserBadges(prev => [...prev, newBadge]);
      setAvailableBadges(prev => prev.filter(b => b.name !== badge.name));
      
      // Notifier l'utilisateur
      await notificationService.notifyAchievement(user.id, badge.name, badge.points);
      
      setShowBadgeModal(false);
    } catch (error) {
      console.error('Error unlocking badge:', error);
    }
  };

  if (!user) return null;

  return (
    <div className="space-y-6">
      {/* Badges débloqués */}
      <div>
        <h2 className="text-2xl font-bold text-white mb-4 flex items-center gap-2">
          <Trophy className="w-6 h-6 text-brand-cyan" />
          Mes Badges
        </h2>
        
        {userBadges.length > 0 ? (
          <div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-6 gap-4">
            {userBadges.map((badge) => (
              <BadgeDisplay
                key={badge.id}
                badge={badge}
                size="medium"
                onClick={() => handleBadgeClick(badge)}
              />
            ))}
          </div>
        ) : (
          <div className="text-center py-8 bg-hub-surface/50 rounded-lg border border-hub-border">
            <Trophy className="w-12 h-12 text-slate-500 mx-auto mb-2" />
            <p className="text-slate-400">Aucun badge débloqué pour le moment</p>
            <p className="text-sm text-slate-500 mt-1">Commencez à participer pour débloquer vos premiers badges!</p>
          </div>
        )}
      </div>

      {/* Progression des badges */}
      {showProgress && availableBadges.length > 0 && (
        <div>
          <h3 className="text-xl font-bold text-white mb-4">Progression</h3>
          <div className="space-y-3">
            {availableBadges.slice(0, 5).map((badge) => (
              <BadgeProgress
                key={badge.id}
                badge={badge}
                currentPoints={user.points}
                requiredPoints={badge.points}
              />
            ))}
          </div>
        </div>
      )}

      {/* Modal détails badge */}
      <AnimatePresence>
        {showBadgeModal && selectedBadge && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4"
            onClick={() => setShowBadgeModal(false)}
          >
            <motion.div
              initial={{ scale: 0.9, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.9, opacity: 0 }}
              className="bg-hub-surface border border-hub-border rounded-2xl p-6 max-w-md w-full"
              onClick={(e) => e.stopPropagation()}
            >
              <div className="text-center">
                <div 
                  className="w-20 h-20 rounded-full flex items-center justify-center text-white mx-auto mb-4"
                  style={{ backgroundColor: selectedBadge.color }}
                >
                  <Star className="w-10 h-10" />
                </div>
                
                <h3 className="text-2xl font-bold text-white mb-2">{selectedBadge.name}</h3>
                <p className="text-slate-400 mb-4">{selectedBadge.description}</p>
                
                <div className="flex justify-center gap-4 mb-4">
                  <div className="text-center">
                    <div className="text-2xl font-bold text-brand-cyan">{selectedBadge.points}</div>
                    <div className="text-xs text-slate-500">Points</div>
                  </div>
                  <div className="text-center">
                    <div className="text-lg font-bold text-white">{selectedBadge.category}</div>
                    <div className="text-xs text-slate-500">Catégorie</div>
                  </div>
                </div>
                
                {selectedBadge.unlockedAt && (
                  <div className="text-sm text-slate-500 mb-4">
                    Débloqué le {new Date(selectedBadge.unlockedAt).toLocaleDateString('fr-FR')}
                  </div>
                )}
                
                <button
                  onClick={() => setShowBadgeModal(false)}
                  className="hub-button-primary w-full"
                >
                  Fermer
                </button>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
};

export default BadgeSystem;
