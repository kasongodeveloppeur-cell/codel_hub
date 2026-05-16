import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { 
  Award, 
  Star, 
  Trophy, 
  Target, 
  Zap, 
  Crown, 
  Shield, 
  Sword,
  Heart,
  Sparkles,
  Gem,
  Medal,
  Ribbon,
  Lock,
  Unlock,
  TrendingUp,
  Calendar,
  Clock,
  Users,
  BookOpen,
  Code,
  Coffee,
  Gamepad2,
  Lightbulb,
  Rocket,
  Mountain,
  Flag,
  CheckCircle,
  XCircle,
  AlertCircle,
  Info,
  Settings,
  Filter,
  Search,
  Grid,
  List,
  ChevronDown,
  ChevronUp,
  MoreHorizontal
} from 'lucide-react';
import { Button } from '../ui/Button';
import { Card, CardHeader, CardContent } from '../ui/Card';
import { Badge } from '../ui/Badge';
import { LazyImage } from '../ui/LazyImage';
import { useThemeClasses } from '../../hooks/useTheme';

interface AdvancedBadge {
  id: string;
  name: string;
  description: string;
  icon: string;
  category: 'achievement' | 'skill' | 'social' | 'contribution' | 'special' | 'seasonal' | 'milestone';
  rarity: 'common' | 'uncommon' | 'rare' | 'epic' | 'legendary' | 'mythic';
  level: number;
  maxLevel: number;
  progress: number;
  unlocked: boolean;
  unlockedAt?: Date;
  requirements: {
    type: 'xp' | 'streak' | 'projects' | 'tutorials' | 'social' | 'time' | 'custom';
    value: number;
    current: number;
    description: string;
  }[];
  rewards?: {
    xp: number;
    title?: string;
    perks?: string[];
  };
  tags: string[];
  isHidden?: boolean;
  isSecret?: boolean;
  prerequisites?: string[];
}

interface BadgeProgress {
  badgeId: string;
  currentLevel: number;
  progress: number;
  lastUpdated: Date;
  milestones: {
    level: number;
    unlockedAt: Date;
    rewardClaimed: boolean;
  }[];
}

interface UserStats {
  totalBadges: number;
  unlockedBadges: number;
  rareBadges: number;
  legendaryBadges: number;
  currentStreak: number;
  totalXP: number;
  rank: string;
  nextRankXP: number;
}

const BadgeCard: React.FC<{
  badge: AdvancedBadge;
  progress?: BadgeProgress;
  onView: (badge: AdvancedBadge) => void;
  isDarkMode: boolean;
}> = ({ badge, progress, onView, isDarkMode }) => {
  const { bgCard, text } = useThemeClasses();

  const getRarityColor = (rarity: string) => {
    switch (rarity) {
      case 'common': return 'border-gray-300 bg-gray-50 dark:bg-gray-800';
      case 'uncommon': return 'border-green-300 bg-green-50 dark:bg-green-900/20';
      case 'rare': return 'border-blue-300 bg-blue-50 dark:bg-blue-900/20';
      case 'epic': return 'border-purple-300 bg-purple-50 dark:bg-purple-900/20';
      case 'legendary': return 'border-yellow-300 bg-yellow-50 dark:bg-yellow-900/20';
      case 'mythic': return 'border-red-300 bg-red-50 dark:bg-red-900/20';
      default: return 'border-gray-300 bg-gray-50';
    }
  };

  const getRarityGradient = (rarity: string) => {
    switch (rarity) {
      case 'common': return 'from-gray-400 to-gray-600';
      case 'uncommon': return 'from-green-400 to-green-600';
      case 'rare': return 'from-blue-400 to-blue-600';
      case 'epic': return 'from-purple-400 to-purple-600';
      case 'legendary': return 'from-yellow-400 to-yellow-600';
      case 'mythic': return 'from-red-400 to-red-600';
      default: return 'from-gray-400 to-gray-600';
    }
  };

  const getCategoryIcon = (category: string) => {
    switch (category) {
      case 'achievement': return <Trophy className="w-4 h-4" />;
      case 'skill': return <Zap className="w-4 h-4" />;
      case 'social': return <Users className="w-4 h-4" />;
      case 'contribution': return <Heart className="w-4 h-4" />;
      case 'special': return <Star className="w-4 h-4" />;
      case 'seasonal': return <Calendar className="w-4 h-4" />;
      case 'milestone': return <Mountain className="w-4 h-4" />;
      default: return <Award className="w-4 h-4" />;
    }
  };

  const getIcon = () => {
    switch (badge.icon) {
      case 'trophy': return <Trophy className="w-8 h-8" />;
      case 'star': return <Star className="w-8 h-8" />;
      case 'target': return <Target className="w-8 h-8" />;
      case 'zap': return <Zap className="w-8 h-8" />;
      case 'crown': return <Crown className="w-8 h-8" />;
      case 'shield': return <Shield className="w-8 h-8" />;
      case 'sword': return <Sword className="w-8 h-8" />;
      case 'heart': return <Heart className="w-8 h-8" />;
      case 'sparkles': return <Sparkles className="w-8 h-8" />;
      case 'gem': return <Gem className="w-8 h-8" />;
      case 'medal': return <Medal className="w-8 h-8" />;
      case 'ribbon': return <Ribbon className="w-8 h-8" />;
      case 'rocket': return <Rocket className="w-8 h-8" />;
      case 'mountain': return <Mountain className="w-8 h-8" />;
      case 'flag': return <Flag className="w-8 h-8" />;
      default: return <Award className="w-8 h-8" />;
    }
  };

  const progressPercentage = progress ? (progress.progress / 100) : 0;
  const isUnlocked = badge.unlocked || (progress && progress.currentLevel > 0);

  return (
    <motion.div
      className={`${bgCard} rounded-xl border-2 ${getRarityColor(badge.rarity)} p-6 cursor-pointer hover:shadow-lg transition-all relative overflow-hidden`}
      whileHover={{ y: -4, scale: 1.02 }}
      whileTap={{ scale: 0.98 }}
      onClick={() => onView(badge)}
    >
      {/* Rarity Glow Effect */}
      {badge.unlocked && (
        <div className={`absolute inset-0 bg-gradient-to-br ${getRarityGradient(badge.rarity)} opacity-10`} />
      )}

      {/* Lock Overlay */}
      {!isUnlocked && (
        <div className="absolute inset-0 bg-black/50 flex items-center justify-center z-10">
          <Lock className="w-12 h-12 text-white/50" />
        </div>
      )}

      {/* Badge Content */}
      <div className="relative z-10">
        {/* Header */}
        <div className="flex items-start justify-between mb-4">
          <div className="flex items-center gap-3">
            <div className={`p-3 rounded-lg bg-gradient-to-br ${getRarityGradient(badge.rarity)} text-white`}>
              {getIcon()}
            </div>
            <div>
              <h3 className={`font-bold ${text} mb-1`}>{badge.name}</h3>
              <div className="flex items-center gap-2">
                <Badge variant="outline" size="sm">
                  {badge.category}
                </Badge>
                <Badge variant="outline" size="sm" className={`${getRarityColor(badge.rarity)} border-current`}>
                  {badge.rarity}
                </Badge>
              </div>
            </div>
          </div>
          
          {badge.level > 1 && (
            <div className="text-right">
              <div className="text-2xl font-bold text-cyan-500">{badge.level}</div>
              <div className="text-xs text-gray-500">Niveau</div>
            </div>
          )}
        </div>

        {/* Description */}
        <p className={`text-sm ${isDarkMode ? 'text-gray-300' : 'text-gray-700'} mb-4 line-clamp-2`}>
          {badge.description}
        </p>

        {/* Progress */}
        {progress && !badge.unlocked && (
          <div className="mb-4">
            <div className="flex justify-between text-sm mb-2">
              <span>Progression</span>
              <span>{Math.round(progressPercentage)}%</span>
            </div>
            <div className="w-full bg-gray-200 dark:bg-gray-700 rounded-full h-2">
              <motion.div
                className={`h-2 rounded-full bg-gradient-to-r ${getRarityGradient(badge.rarity)}`}
                initial={{ width: 0 }}
                animate={{ width: `${progressPercentage}%` }}
                transition={{ duration: 0.5, delay: 0.2 }}
              />
            </div>
          </div>
        )}

        {/* Requirements */}
        <div className="space-y-2">
          {badge.requirements.slice(0, 2).map((req, index) => (
            <div key={index} className="flex items-center justify-between text-sm">
              <span className={isDarkMode ? 'text-gray-400' : 'text-gray-600'}>
                {req.description}
              </span>
              <span className="font-medium">
                {req.current}/{req.value}
              </span>
            </div>
          ))}
          {badge.requirements.length > 2 && (
            <div className="text-xs text-gray-500">
              +{badge.requirements.length - 2} autres exigences
            </div>
          )}
        </div>

        {/* Tags */}
        {badge.tags.length > 0 && (
          <div className="flex flex-wrap gap-1 mt-4">
            {badge.tags.slice(0, 3).map(tag => (
              <Badge key={tag} variant="secondary" size="sm">
                {tag}
              </Badge>
            ))}
            {badge.tags.length > 3 && (
              <Badge variant="secondary" size="sm">
                +{badge.tags.length - 3}
              </Badge>
            )}
          </div>
        )}

        {/* Rewards */}
        {badge.rewards && (
          <div className={`mt-4 p-3 rounded-lg ${isDarkMode ? 'bg-gray-800' : 'bg-gray-50'}`}>
            <div className="flex items-center gap-2 text-sm font-medium text-cyan-500">
              <Zap className="w-4 h-4" />
              Récompenses
            </div>
            <div className="mt-1 space-y-1">
              {badge.rewards.xp > 0 && (
                <div className="text-xs">
                  +{badge.rewards.xp} XP
                </div>
              )}
              {badge.rewards.title && (
                <div className="text-xs">
                  Titre: {badge.rewards.title}
                </div>
              )}
            </div>
          </div>
        )}
      </div>

      {/* Shimmer Effect for Unlocked Badges */}
      {badge.unlocked && (
        <motion.div
          className="absolute inset-0 bg-gradient-to-r from-transparent via-white/20 to-transparent -skew-x-12"
          animate={{ x: ['-100%', '100%'] }}
          transition={{ duration: 2, repeat: Infinity, repeatDelay: 1 }}
        />
      )}
    </motion.div>
  );
};

const BadgeModal: React.FC<{
  badge: AdvancedBadge;
  progress?: BadgeProgress;
  isOpen: boolean;
  onClose: () => void;
  onClaimReward?: (badgeId: string) => void;
  isDarkMode: boolean;
}> = ({ badge, progress, isOpen, onClose, onClaimReward, isDarkMode }) => {
  const { bg, text } = useThemeClasses();

  if (!isOpen) return null;

  const getRarityGradient = (rarity: string) => {
    switch (rarity) {
      case 'common': return 'from-gray-400 to-gray-600';
      case 'uncommon': return 'from-green-400 to-green-600';
      case 'rare': return 'from-blue-400 to-blue-600';
      case 'epic': return 'from-purple-400 to-purple-600';
      case 'legendary': return 'from-yellow-400 to-yellow-600';
      case 'mythic': return 'from-red-400 to-red-600';
      default: return 'from-gray-400 to-gray-600';
    }
  };

  const getIcon = () => {
    switch (badge.icon) {
      case 'trophy': return <Trophy className="w-16 h-16" />;
      case 'star': return <Star className="w-16 h-16" />;
      case 'target': return <Target className="w-16 h-16" />;
      case 'zap': return <Zap className="w-16 h-16" />;
      case 'crown': return <Crown className="w-16 h-16" />;
      case 'shield': return <Shield className="w-16 h-16" />;
      case 'sword': return <Sword className="w-16 h-16" />;
      case 'heart': return <Heart className="w-16 h-16" />;
      case 'fire': return <Fire className="w-16 h-16" />;
      case 'sparkles': return <Sparkles className="w-16 h-16" />;
      case 'gem': return <Gem className="w-16 h-16" />;
      case 'medal': return <Medal className="w-16 h-16" />;
      case 'ribbon': return <Ribbon className="w-16 h-16" />;
      default: return <Award className="w-16 h-16" />;
    }
  };

  return (
    <AnimatePresence>
      <div className="fixed inset-0 bg-black/50 flex items-center justify-center p-4 z-50">
        <motion.div
          initial={{ opacity: 0, scale: 0.9 }}
          animate={{ opacity: 1, scale: 1 }}
          exit={{ opacity: 0, scale: 0.9 }}
          className={`${bg} rounded-2xl max-w-2xl w-full max-h-[90vh] overflow-y-auto`}
        >
          <div className="p-8">
            {/* Header */}
            <div className="flex items-center justify-between mb-6">
              <div className="flex items-center gap-4">
                <div className={`p-4 rounded-xl bg-gradient-to-br ${getRarityGradient(badge.rarity)} text-white`}>
                  {getIcon()}
                </div>
                <div>
                  <h2 className={`text-2xl font-bold ${text}`}>{badge.name}</h2>
                  <div className="flex items-center gap-2 mt-1">
                    <Badge variant="outline">{badge.category}</Badge>
                    <Badge variant="outline" className="border-current">{badge.rarity}</Badge>
                    {badge.level > 1 && (
                      <Badge variant="primary">Niveau {badge.level}</Badge>
                    )}
                  </div>
                </div>
              </div>
              
              <Button
                variant="ghost"
                size="sm"
                onClick={onClose}
                icon={<X className="w-4 h-4" />}
              />
            </div>

            {/* Description */}
            <p className={`${isDarkMode ? 'text-gray-300' : 'text-gray-700'} mb-6`}>
              {badge.description}
            </p>

            {/* Progress */}
            {progress && (
              <div className="mb-6">
                <div className="flex justify-between mb-2">
                  <span className="font-medium">Progression</span>
                  <span>{Math.round(progress.progress)}%</span>
                </div>
                <div className="w-full bg-gray-200 dark:bg-gray-700 rounded-full h-3">
                  <motion.div
                    className={`h-3 rounded-full bg-gradient-to-r ${getRarityGradient(badge.rarity)}`}
                    initial={{ width: 0 }}
                    animate={{ width: `${progress.progress}%` }}
                    transition={{ duration: 0.5 }}
                  />
                </div>
              </div>
            )}

            {/* Requirements */}
            <div className="mb-6">
              <h3 className={`font-semibold ${text} mb-3`}>Exigences</h3>
              <div className="space-y-3">
                {badge.requirements.map((req, index) => (
                  <div key={index} className="flex items-center justify-between p-3 rounded-lg bg-gray-100 dark:bg-gray-800">
                    <div>
                      <div className={`font-medium ${text}`}>{req.description}</div>
                      <div className="text-sm text-gray-500">
                        Type: {req.type}
                      </div>
                    </div>
                    <div className="text-right">
                      <div className="font-bold text-lg">
                        {req.current}/{req.value}
                      </div>
                      <div className="text-sm text-gray-500">
                        {Math.round((req.current / req.value) * 100)}%
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {/* Rewards */}
            {badge.rewards && (
              <div className="mb-6">
                <h3 className={`font-semibold ${text} mb-3`}>Récompenses</h3>
                <div className={`p-4 rounded-lg bg-gradient-to-r ${getRarityGradient(badge.rarity)} bg-opacity-10`}>
                  <div className="space-y-2">
                    {badge.rewards.xp > 0 && (
                      <div className="flex items-center gap-2">
                        <Zap className="w-5 h-5 text-cyan-500" />
                        <span className="font-medium">+{badge.rewards.xp} XP</span>
                      </div>
                    )}
                    {badge.rewards.title && (
                      <div className="flex items-center gap-2">
                        <Award className="w-5 h-5 text-yellow-500" />
                        <span className="font-medium">Titre: {badge.rewards.title}</span>
                      </div>
                    )}
                    {badge.rewards.perks && badge.rewards.perks.length > 0 && (
                      <div className="space-y-1">
                        <div className="flex items-center gap-2">
                          <Star className="w-5 h-5 text-purple-500" />
                          <span className="font-medium">Avantages:</span>
                        </div>
                        <ul className="ml-7 space-y-1">
                          {badge.rewards.perks.map((perk, index) => (
                            <li key={index} className="text-sm text-gray-600">
                              • {perk}
                            </li>
                          ))}
                        </ul>
                      </div>
                    )}
                  </div>
                </div>
              </div>
            )}

            {/* Tags */}
            {badge.tags.length > 0 && (
              <div className="mb-6">
                <h3 className={`font-semibold ${text} mb-3`}>Tags</h3>
                <div className="flex flex-wrap gap-2">
                  {badge.tags.map(tag => (
                    <Badge key={tag} variant="outline">
                      {tag}
                    </Badge>
                  ))}
                </div>
              </div>
            )}

            {/* Actions */}
            {badge.unlocked && badge.rewards && onClaimReward && (
              <div className="flex gap-3">
                <Button
                  variant="primary"
                  onClick={() => onClaimReward(badge.id)}
                  className="flex-1"
                >
                  Réclamer la récompense
                </Button>
              </div>
            )}
          </div>
        </motion.div>
      </div>
    </AnimatePresence>
  );
};

export const AdvancedBadgeSystem: React.FC = () => {
  const { bg, text } = useThemeClasses();
  const [isDarkMode] = useState(false);
  
  const [badges, setBadges] = useState<AdvancedBadge[]>([]);
  const [progress, setProgress] = useState<Record<string, BadgeProgress>>({});
  const [userStats, setUserStats] = useState<UserStats | null>(null);
  const [selectedBadge, setSelectedBadge] = useState<AdvancedBadge | null>(null);
  const [showModal, setShowModal] = useState(false);
  const [filter, setFilter] = useState({
    category: 'all',
    rarity: 'all',
    unlocked: 'all'
  });
  const [viewMode, setViewMode] = useState<'grid' | 'list'>('grid');
  const [sortBy, setSortBy] = useState<'name' | 'rarity' | 'progress' | 'unlocked'>('unlocked');

  // Demo badges data
  const demoBadges: AdvancedBadge[] = [
    {
      id: '1',
      name: 'Débutant Déterminé',
      description: 'Complétez votre premier tutoriel et commencez votre voyage dans CODEL',
      icon: 'star',
      category: 'achievement',
      rarity: 'common',
      level: 1,
      maxLevel: 1,
      progress: 100,
      unlocked: true,
      unlockedAt: new Date('2024-01-15'),
      requirements: [
        {
          type: 'tutorials',
          value: 1,
          current: 1,
          description: 'Compléter 1 tutoriel'
        }
      ],
      rewards: {
        xp: 50,
        title: 'Débutant'
      },
      tags: ['débutant', 'tutoriel', 'premier']
    },
    {
      id: '2',
      name: 'Maître du Code',
      description: 'Devenez un expert en programmation avec 100 projets complétés',
      icon: 'trophy',
      category: 'achievement',
      rarity: 'legendary',
      level: 1,
      maxLevel: 5,
      progress: 45,
      unlocked: false,
      requirements: [
        {
          type: 'projects',
          value: 100,
          current: 45,
          description: 'Compléter 100 projets'
        },
        {
          type: 'xp',
          value: 10000,
          current: 4500,
          description: 'Gagner 10,000 XP'
        }
      ],
      rewards: {
        xp: 1000,
        title: 'Maître du Code',
        perks: ['Accès prioritaire au support', 'Badge spécial sur le profil']
      },
      tags: ['expert', 'projects', 'légendaire']
    },
    {
      id: '3',
      name: 'Social Butterfly',
      description: 'Connectez-vous avec la communauté CODEL',
      icon: 'users',
      category: 'social',
      rarity: 'uncommon',
      level: 2,
      maxLevel: 3,
      progress: 67,
      unlocked: true,
      unlockedAt: new Date('2024-02-20'),
      requirements: [
        {
          type: 'social',
          value: 50,
          current: 34,
          description: 'Participer à 50 discussions'
        },
        {
          type: 'social',
          value: 10,
          current: 10,
          description: 'Aider 10 membres'
        }
      ],
      rewards: {
        xp: 200,
        perks: ['Badge "Communautaire" spécial']
      },
      tags: ['social', 'communauté', 'aide']
    },
    {
      id: '4',
      name: 'Night Owl',
      description: 'Codez tard dans la nuit avec une streak de 30 jours',
      icon: 'moon',
      category: 'milestone',
      rarity: 'rare',
      level: 1,
      maxLevel: 1,
      progress: 87,
      unlocked: false,
      requirements: [
        {
          type: 'streak',
          value: 30,
          current: 26,
          description: 'Maintenir une streak de 30 jours'
        }
      ],
      rewards: {
        xp: 300,
        title: 'Night Owl'
      },
      tags: ['streak', 'nuit', 'consistance']
    },
    {
      id: '5',
      name: 'Speed Demon',
      description: 'Complétez des défis en temps record',
      icon: 'zap',
      category: 'special',
      rarity: 'epic',
      level: 1,
      maxLevel: 3,
      progress: 25,
      unlocked: false,
      requirements: [
        {
          type: 'custom',
          value: 10,
          current: 2,
          description: 'Compléter 10 défis en moins de 5 minutes'
        }
      ],
      rewards: {
        xp: 500,
        perks: ['Accès aux défis exclusifs']
      },
      tags: ['vitesse', 'défi', 'record']
    }
  ];

  const demoStats: UserStats = {
    totalBadges: 5,
    unlockedBadges: 2,
    rareBadges: 1,
    legendaryBadges: 0,
    currentStreak: 26,
    totalXP: 4500,
    rank: 'Développeur Intermédiaire',
    nextRankXP: 5000
  };

  useEffect(() => {
    setBadges(demoBadges);
    setUserStats(demoStats);
    
    // Set up demo progress
    const demoProgress: Record<string, BadgeProgress> = {
      '1': {
        badgeId: '1',
        currentLevel: 1,
        progress: 100,
        lastUpdated: new Date(),
        milestones: [
          { level: 1, unlockedAt: new Date('2024-01-15'), rewardClaimed: true }
        ]
      },
      '2': {
        badgeId: '2',
        currentLevel: 1,
        progress: 45,
        lastUpdated: new Date(),
        milestones: []
      },
      '3': {
        badgeId: '3',
        currentLevel: 2,
        progress: 67,
        lastUpdated: new Date(),
        milestones: [
          { level: 1, unlockedAt: new Date('2024-02-20'), rewardClaimed: true },
          { level: 2, unlockedAt: new Date('2024-03-10'), rewardClaimed: false }
        ]
      },
      '4': {
        badgeId: '4',
        currentLevel: 1,
        progress: 87,
        lastUpdated: new Date(),
        milestones: []
      },
      '5': {
        badgeId: '5',
        currentLevel: 1,
        progress: 25,
        lastUpdated: new Date(),
        milestones: []
      }
    };
    setProgress(demoProgress);
  }, []);

  const filteredBadges = badges.filter(badge => {
    if (filter.category !== 'all' && badge.category !== filter.category) return false;
    if (filter.rarity !== 'all' && badge.rarity !== filter.rarity) return false;
    if (filter.unlocked !== 'all') {
      const isUnlocked = badge.unlocked || (progress[badge.id]?.currentLevel > 0);
      if (filter.unlocked === 'unlocked' && !isUnlocked) return false;
      if (filter.unlocked === 'locked' && isUnlocked) return false;
    }
    return true;
  });

  const sortedBadges = [...filteredBadges].sort((a, b) => {
    switch (sortBy) {
      case 'name':
        return a.name.localeCompare(b.name);
      case 'rarity':
        const rarityOrder = { common: 1, uncommon: 2, rare: 3, epic: 4, legendary: 5, mythic: 6 };
        return rarityOrder[a.rarity] - rarityOrder[b.rarity];
      case 'progress':
        return (progress[b.id]?.progress || 0) - (progress[a.id]?.progress || 0);
      case 'unlocked':
        const aUnlocked = a.unlocked || (progress[a.id]?.currentLevel > 0);
        const bUnlocked = b.unlocked || (progress[b.id]?.currentLevel > 0);
        return bUnlocked ? 1 : -1;
      default:
        return 0;
    }
  });

  const handleBadgeClick = (badge: AdvancedBadge) => {
    setSelectedBadge(badge);
    setShowModal(true);
  };

  const handleClaimReward = (badgeId: string) => {
    console.log('Claim reward for badge:', badgeId);
    setShowModal(false);
  };

  const categories = [
    { value: 'all', label: 'Toutes' },
    { value: 'achievement', label: 'Succès' },
    { value: 'skill', label: 'Compétence' },
    { value: 'social', label: 'Social' },
    { value: 'contribution', label: 'Contribution' },
    { value: 'special', label: 'Spécial' },
    { value: 'seasonal', label: 'Saisonnier' },
    { value: 'milestone', label: 'Jalon' }
  ];

  const rarities = [
    { value: 'all', label: 'Toutes' },
    { value: 'common', label: 'Commun' },
    { value: 'uncommon', label: 'Peu commun' },
    { value: 'rare', label: 'Rare' },
    { value: 'epic', label: 'Épique' },
    { value: 'legendary', label: 'Légendaire' },
    { value: 'mythic', label: 'Mythique' }
  ];

  const unlockedFilters = [
    { value: 'all', label: 'Toutes' },
    { value: 'unlocked', label: 'Débloquées' },
    { value: 'locked', label: 'Verrouillées' }
  ];

  return (
    <div className={`min-h-screen ${bg} ${text} p-6`}>
      <div className="max-w-7xl mx-auto">
        {/* Header */}
        <div className="text-center mb-8">
          <div className="flex items-center justify-center mb-4">
            <Trophy className="w-12 h-12 text-yellow-500 mr-3" />
            <h1 className="text-4xl font-bold">Système de Badges Avancé</h1>
          </div>
          <p className={`text-lg ${isDarkMode ? 'text-gray-400' : 'text-gray-600'}`}>
            Collectionnez des badges et débloquez des récompenses exclusives
          </p>
        </div>

        {/* User Stats */}
        {userStats && (
          <div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-6 gap-4 mb-8">
            <Card>
              <CardContent className="p-4 text-center">
                <div className="text-2xl font-bold text-cyan-500 mb-1">{userStats.totalBadges}</div>
                <div className="text-xs text-gray-500">Total Badges</div>
              </CardContent>
            </Card>
            <Card>
              <CardContent className="p-4 text-center">
                <div className="text-2xl font-bold text-green-500 mb-1">{userStats.unlockedBadges}</div>
                <div className="text-xs text-gray-500">Débloqués</div>
              </CardContent>
            </Card>
            <Card>
              <CardContent className="p-4 text-center">
                <div className="text-2xl font-bold text-purple-500 mb-1">{userStats.rareBadges}</div>
                <div className="text-xs text-gray-500">Rares+</div>
              </CardContent>
            </Card>
            <Card>
              <CardContent className="p-4 text-center">
                <div className="text-2xl font-bold text-orange-500 mb-1">{userStats.currentStreak}</div>
                <div className="text-xs text-gray-500">Streak</div>
              </CardContent>
            </Card>
            <Card>
              <CardContent className="p-4 text-center">
                <div className="text-2xl font-bold text-blue-500 mb-1">{userStats.totalXP}</div>
                <div className="text-xs text-gray-500">XP Total</div>
              </CardContent>
            </Card>
            <Card>
              <CardContent className="p-4 text-center">
                <div className="text-2xl font-bold text-yellow-500 mb-1">{userStats.rank}</div>
                <div className="text-xs text-gray-500">Rang</div>
              </CardContent>
            </Card>
          </div>
        )}

        {/* Filters and Controls */}
        <Card className="mb-6">
          <CardContent className="p-6">
            <div className="flex flex-wrap gap-4 mb-6">
              {/* Category Filter */}
              <div>
                <label className={`block text-sm font-medium ${text} mb-2`}>Catégorie</label>
                <select
                  value={filter.category}
                  onChange={(e) => setFilter(prev => ({ ...prev, category: e.target.value as any }))}
                  className={`px-3 py-2 rounded-lg border ${bg} ${text} border-gray-200 dark:border-gray-700`}
                >
                  {categories.map(cat => (
                    <option key={cat.value} value={cat.value}>{cat.label}</option>
                  ))}
                </select>
              </div>

              {/* Rarity Filter */}
              <div>
                <label className={`block text-sm font-medium ${text} mb-2`}>Rareté</label>
                <select
                  value={filter.rarity}
                  onChange={(e) => setFilter(prev => ({ ...prev, rarity: e.target.value as any }))}
                  className={`px-3 py-2 rounded-lg border ${bg} ${text} border-gray-200 dark:border-gray-700`}
                >
                  {rarities.map(rarity => (
                    <option key={rarity.value} value={rarity.value}>{rarity.label}</option>
                  ))}
                </select>
              </div>

              {/* Unlocked Filter */}
              <div>
                <label className={`block text-sm font-medium ${text} mb-2`}>Statut</label>
                <select
                  value={filter.unlocked}
                  onChange={(e) => setFilter(prev => ({ ...prev, unlocked: e.target.value as any }))}
                  className={`px-3 py-2 rounded-lg border ${bg} ${text} border-gray-200 dark:border-gray-700`}
                >
                  {unlockedFilters.map(filter => (
                    <option key={filter.value} value={filter.value}>{filter.label}</option>
                  ))}
                </select>
              </div>

              {/* Sort */}
              <div>
                <label className={`block text-sm font-medium ${text} mb-2`}>Trier par</label>
                <select
                  value={sortBy}
                  onChange={(e) => setSortBy(e.target.value as any)}
                  className={`px-3 py-2 rounded-lg border ${bg} ${text} border-gray-200 dark:border-gray-700`}
                >
                  <option value="unlocked">Statut</option>
                  <option value="name">Nom</option>
                  <option value="rarity">Rareté</option>
                  <option value="progress">Progression</option>
                </select>
              </div>
            </div>

            {/* View Mode Toggle */}
            <div className="flex items-center gap-2">
              <Button
                variant={viewMode === 'grid' ? 'primary' : 'outline'}
                size="sm"
                onClick={() => setViewMode('grid')}
                icon={<Grid className="w-4 h-4" />}
              >
                Grille
              </Button>
              <Button
                variant={viewMode === 'list' ? 'primary' : 'outline'}
                size="sm"
                onClick={() => setViewMode('list')}
                icon={<List className="w-4 h-4" />}
              >
                Liste
              </Button>
            </div>
          </CardContent>
        </Card>

        {/* Badges Grid/List */}
        <div className={viewMode === 'grid' ? 'grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6' : 'space-y-4'}>
          {sortedBadges.map(badge => (
            <BadgeCard
              key={badge.id}
              badge={badge}
              progress={progress[badge.id]}
              onView={handleBadgeClick}
              isDarkMode={isDarkMode}
            />
          ))}
        </div>

        {/* Badge Modal */}
        {selectedBadge && (
          <BadgeModal
            badge={selectedBadge}
            progress={progress[selectedBadge.id]}
            isOpen={showModal}
            onClose={() => setShowModal(false)}
            onClaimReward={handleClaimReward}
            isDarkMode={isDarkMode}
          />
        )}

        {/* Empty State */}
        {sortedBadges.length === 0 && (
          <div className="text-center py-12">
            <Trophy className={`w-16 h-16 mx-auto mb-4 ${isDarkMode ? 'text-gray-600' : 'text-gray-400'}`} />
            <h3 className={`text-xl font-medium mb-2 ${text}`}>
              Aucun badge trouvé
            </h3>
            <p className={`${isDarkMode ? 'text-gray-400' : 'text-gray-600'}`}>
              Essayez de modifier vos filtres pour voir plus de badges
            </p>
          </div>
        )}
      </div>
    </div>
  );
};

export default AdvancedBadgeSystem;
