import { 
  collection, 
  doc, 
  getDoc, 
  updateDoc, 
  addDoc,
  increment,
  serverTimestamp,
  query,
  where,
  orderBy,
  limit,
  getDocs,
  arrayUnion
} from 'firebase/firestore';
import { db } from '../lib/firebase';

export type XPAction = 
  | 'EXERCICE_COMPLETED'
  | 'PROJECT_SUBMITTED'
  | 'TUTORIAL_COMPLETED'
  | 'QUIZ_PASSED'
  | 'BOOK_READ'
  | 'DAILY_LOGIN'
  | 'HELP_OTHERS'
  | 'BADGE_EARNED'
  | 'STREAK_ACHIEVED';

export type XPLevel = {
  level: number;
  title: string;
  minXP: number;
  maxXP: number;
  color: string;
  icon: string;
  rewards: string[];
};

export type UserXP = {
  userId: string;
  totalXP: number;
  currentLevel: number;
  xpToNextLevel: number;
  xpInCurrentLevel: number;
  levelHistory: Array<{
    level: number;
    reachedAt: string;
    totalXP: number;
  }>;
  achievements: Array<{
    id: string;
    name: string;
    description: string;
    xpReward: number;
    unlockedAt: string;
  }>;
  dailyStreak: number;
  lastActivityDate: string;
  weeklyXP: number;
  monthlyXP: number;
  allTimeXP: number;
};

export type XPTransaction = {
  id: string;
  userId: string;
  action: XPAction;
  xpAmount: number;
  description: string;
  metadata?: Record<string, any>;
  createdAt: string;
};

// Niveaux et récompenses
export const XP_LEVELS: XPLevel[] = [
  {
    level: 1,
    title: 'Débutant',
    minXP: 0,
    maxXP: 50,
    color: '#10B981',
    icon: '🌱',
    rewards: ['Accès aux exercices débutants']
  },
  {
    level: 2,
    title: 'Apprenti',
    minXP: 50,
    maxXP: 150,
    color: '#3B82F6',
    icon: '📚',
    rewards: ['Badge "Premiers pas"', 'Accès exercices intermédiaires']
  },
  {
    level: 3,
    title: 'Développeur',
    minXP: 150,
    maxXP: 300,
    color: '#8B5CF6',
    icon: '💻',
    rewards: ['Badge "Codeur"', 'Accès projets avancés']
  },
  {
    level: 4,
    title: 'Expert',
    minXP: 300,
    maxXP: 600,
    color: '#F59E0B',
    icon: '🎯',
    rewards: ['Badge "Expert"', 'Accès mentorat']
  },
  {
    level: 5,
    title: 'Maître',
    minXP: 600,
    maxXP: 1000,
    color: '#EF4444',
    icon: '👑',
    rewards: ['Badge "Maître"', 'Role Mentor']
  },
  {
    level: 6,
    title: 'Légende',
    minXP: 1000,
    maxXP: 2000,
    color: '#EC4899',
    icon: '🌟',
    rewards: ['Badge "Légende"', 'Accès exclusif']
  }
];

// Actions XP et récompenses
export const XP_REWARDS: Record<XPAction, { xp: number; description: string }> = {
  EXERCICE_COMPLETED: { xp: 5, description: 'Exercice terminé' },
  PROJECT_SUBMITTED: { xp: 20, description: 'Projet soumis' },
  TUTORIAL_COMPLETED: { xp: 10, description: 'Tutoriel terminé' },
  QUIZ_PASSED: { xp: 15, description: 'Quiz réussi' },
  BOOK_READ: { xp: 25, description: 'Livre terminé' },
  DAILY_LOGIN: { xp: 2, description: 'Connexion quotidienne' },
  HELP_OTHERS: { xp: 8, description: 'Aide aux autres' },
  BADGE_EARNED: { xp: 30, description: 'Badge obtenu' },
  STREAK_ACHIEVED: { xp: 50, description: 'Série atteinte' }
};

export const xpService = {
  /**
   * Calcule le niveau actuel basé sur le XP total
   */
  calculateLevel(totalXP: number): { level: number; xpInCurrentLevel: number; xpToNextLevel: number } {
    let level = 1;
    let remainingXP = totalXP;

    for (let i = 0; i < XP_LEVELS.length - 1; i++) {
      const currentLevel = XP_LEVELS[i];
      const nextLevel = XP_LEVELS[i + 1];
      
      if (totalXP >= currentLevel.minXP && totalXP < nextLevel.minXP) {
        level = currentLevel.level;
        remainingXP = totalXP - currentLevel.minXP;
        break;
      }
    }

    if (totalXP >= XP_LEVELS[XP_LEVELS.length - 1].minXP) {
      level = XP_LEVELS[XP_LEVELS.length - 1].level;
      remainingXP = totalXP - XP_LEVELS[XP_LEVELS.length - 1].minXP;
    }

    const currentLevelData = XP_LEVELS.find(l => l.level === level) || XP_LEVELS[0];
    const nextLevelData = XP_LEVELS.find(l => l.level === level + 1);
    
    const xpToNextLevel = nextLevelData 
      ? nextLevelData.minXP - totalXP 
      : 0;

    return {
      level,
      xpInCurrentLevel: remainingXP,
      xpToNextLevel
    };
  },

  /**
   * Ajoute de l'XP à un utilisateur
   */
  async addXP(
    userId: string, 
    action: XPAction, 
    metadata?: Record<string, any>
  ): Promise<{ newTotal: number; levelUp: boolean; newLevel?: number }> {
    try {
      const reward = XP_REWARDS[action];
      const userRef = doc(db, 'users', userId);
      const userDoc = await getDoc(userRef);

      if (!userDoc.exists()) {
        throw new Error('User not found');
      }

      const userData = userDoc.data();
      const currentXP = userData.xp?.totalXP || 0;
      const newTotalXP = currentXP + reward.xp;

      // Calculer le nouveau niveau
      const { level: newLevel, xpInCurrentLevel, xpToNextLevel } = this.calculateLevel(newTotalXP);
      const currentLevel = userData.xp?.currentLevel || 1;
      const levelUp = newLevel > currentLevel;

      // Créer la transaction XP
      const transactionData: Omit<XPTransaction, 'id' | 'createdAt'> = {
        userId,
        action,
        xpAmount: reward.xp,
        description: reward.description,
        metadata
      };

      await addDoc(collection(db, 'xp_transactions'), {
        ...transactionData,
        createdAt: serverTimestamp()
      });

      // Mettre à jour l'XP utilisateur
      const updateData: any = {
        'xp.totalXP': increment(reward.xp),
        'xp.currentLevel': newLevel,
        'xp.xpInCurrentLevel': xpInCurrentLevel,
        'xp.xpToNextLevel': xpToNextLevel,
        'xp.weeklyXP': userData.xp?.weeklyXP || 0 + reward.xp,
        'xp.monthlyXP': userData.xp?.monthlyXP || 0 + reward.xp,
        'xp.allTimeXP': userData.xp?.allTimeXP || 0 + reward.xp,
        'xp.lastActivityDate': serverTimestamp()
      };

      if (levelUp) {
        updateData['xp.levelHistory'] = {
          level: newLevel,
          reachedAt: serverTimestamp(),
          totalXP: newTotalXP
        };
      }

      await updateDoc(userRef, updateData);

      return {
        newTotal: newTotalXP,
        levelUp,
        newLevel: levelUp ? newLevel : undefined
      };
    } catch (error) {
      console.error('Error adding XP:', error);
      throw error;
    }
  },

  /**
   * Récupère les statistiques XP d'un utilisateur
   */
  async getUserXP(userId: string): Promise<UserXP | null> {
    try {
      const userDoc = await getDoc(doc(db, 'users', userId));
      
      if (!userDoc.exists()) {
        return null;
      }

      const userData = userDoc.data();
      const xpData = userData.xp || {};

      return {
        userId,
        totalXP: xpData.totalXP || 0,
        currentLevel: xpData.currentLevel || 1,
        xpToNextLevel: xpData.xpToNextLevel || 50,
        xpInCurrentLevel: xpData.xpInCurrentLevel || 0,
        levelHistory: xpData.levelHistory || [],
        achievements: xpData.achievements || [],
        dailyStreak: xpData.dailyStreak || 0,
        lastActivityDate: xpData.lastActivityDate || '',
        weeklyXP: xpData.weeklyXP || 0,
        monthlyXP: xpData.monthlyXP || 0,
        allTimeXP: xpData.allTimeXP || 0
      };
    } catch (error) {
      console.error('Error getting user XP:', error);
      return null;
    }
  },

  /**
   * Récupère le leaderboard XP
   */
  async getLeaderboard(limit: number = 10): Promise<Array<{ userId: string; totalXP: number; level: number; displayName: string }>> {
    try {
      const q = query(
        collection(db, 'users'),
        where('xp.totalXP', '>', 0),
        orderBy('xp.totalXP', 'desc'),
        limit(limit)
      );

      const snapshot = await getDocs(q);
      
      return snapshot.docs.map(doc => ({
        userId: doc.id,
        totalXP: doc.data().xp?.totalXP || 0,
        level: doc.data().xp?.currentLevel || 1,
        displayName: doc.data().name || 'Utilisateur'
      }));
    } catch (error) {
      console.error('Error getting leaderboard:', error);
      return [];
    }
  },

  /**
   * Récupère l'historique des transactions XP
   */
  async getXPHistory(userId: string, limit: number = 50): Promise<XPTransaction[]> {
    try {
      const q = query(
        collection(db, 'xp_transactions'),
        where('userId', '==', userId),
        orderBy('createdAt', 'desc'),
        limit(limit)
      );

      const snapshot = await getDocs(q);
      
      return snapshot.docs.map(doc => ({
        id: doc.id,
        ...doc.data()
      } as XPTransaction));
    } catch (error) {
      console.error('Error getting XP history:', error);
      return [];
    }
  },

  /**
   * Met à jour la série quotidienne
   */
  async updateDailyStreak(userId: string): Promise<number> {
    try {
      const userRef = doc(db, 'users', userId);
      const userDoc = await getDoc(userRef);

      if (!userDoc.exists()) {
        throw new Error('User not found');
      }

      const userData = userDoc.data();
      const xpData = userData.xp || {};
      const lastActivity = xpData.lastActivityDate?.toDate();
      const today = new Date();
      today.setHours(0, 0, 0, 0);

      let newStreak = xpData.dailyStreak || 0;

      if (lastActivity) {
        const lastActivityDay = new Date(lastActivity);
        lastActivityDay.setHours(0, 0, 0, 0);
        
        const dayDiff = Math.floor((today.getTime() - lastActivityDay.getTime()) / (1000 * 60 * 60 * 24));
        
        if (dayDiff === 1) {
          // Consecutif
          newStreak += 1;
        } else if (dayDiff > 1) {
          // Série brisée
          newStreak = 1;
        }
        // dayDiff === 0 : déjà connecté aujourd'hui
      } else {
        // Première connexion
        newStreak = 1;
      }

      await updateDoc(userRef, {
        'xp.dailyStreak': newStreak,
        'xp.lastActivityDate': serverTimestamp()
      });

      // Ajouter XP pour la série si applicable
      if (newStreak > 1 && newStreak % 7 === 0) {
        await this.addXP(userId, 'STREAK_ACHIEVED', { streak: newStreak });
      }

      return newStreak;
    } catch (error) {
      console.error('Error updating daily streak:', error);
      throw error;
    }
  },

  /**
   * Vérifie et débloque les achievements
   */
  async checkAchievements(userId: string): Promise<string[]> {
    try {
      const userXP = await this.getUserXP(userId);
      if (!userXP) return [];

      const newAchievements: string[] = [];

      // Achievement: Premier exercice
      if (userXP.totalXP >= 5 && !userXP.achievements.find(a => a.id === 'first_exercise')) {
        newAchievements.push('first_exercise');
      }

      // Achievement: 100 XP
      if (userXP.totalXP >= 100 && !userXP.achievements.find(a => a.id === 'xp_100')) {
        newAchievements.push('xp_100');
      }

      // Achievement: Niveau 5
      if (userXP.currentLevel >= 5 && !userXP.achievements.find(a => a.id === 'level_5')) {
        newAchievements.push('level_5');
      }

      // Achievement: Série de 7 jours
      if (userXP.dailyStreak >= 7 && !userXP.achievements.find(a => a.id === 'streak_7')) {
        newAchievements.push('streak_7');
      }

      // Mettre à jour les achievements
      if (newAchievements.length > 0) {
        const userRef = doc(db, 'users', userId);
        const userDoc = await getDoc(userRef);
        const userData = userDoc.exists() ? userDoc.data() : {};
        
        await updateDoc(userRef, {
          'xp.achievements': [
            ...(userData.xp?.achievements || []),
            ...newAchievements.map(id => ({
              id,
              name: this.getAchievementName(id),
              description: this.getAchievementDescription(id),
              xpReward: this.getAchievementXPReward(id),
              unlockedAt: serverTimestamp()
            }))
          ]
        });
      }

      return newAchievements;
    } catch (error) {
      console.error('Error checking achievements:', error);
      return [];
    }
  },

  getAchievementName(id: string): string {
    const names: Record<string, string> = {
      first_exercise: 'Premiers pas',
      xp_100: 'Centenaire XP',
      level_5: 'Expert en code',
      streak_7: 'Dévoué'
    };
    return names[id] || 'Achievement';
  },

  getAchievementDescription(id: string): string {
    const descriptions: Record<string, string> = {
      first_exercise: 'Terminer ton premier exercice',
      xp_100: 'Atteindre 100 XP',
      level_5: 'Atteindre le niveau 5',
      streak_7: '7 jours de connexion consécutifs'
    };
    return descriptions[id] || 'Achievement débloqué';
  },

  getAchievementXPReward(id: string): number {
    const rewards: Record<string, number> = {
      first_exercise: 10,
      xp_100: 50,
      level_5: 100,
      streak_7: 30
    };
    return rewards[id] || 0;
  }
};
