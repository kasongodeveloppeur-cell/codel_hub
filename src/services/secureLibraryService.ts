import { 
  collection, 
  doc, 
  getDocs, 
  addDoc, 
  updateDoc, 
  deleteDoc,
  serverTimestamp,
  query,
  where,
  orderBy,
  limit,
  getDoc,
  arrayUnion,
  arrayRemove,
  increment
} from 'firebase/firestore';
import { db, handleFirestoreError, OperationType } from '../lib/firebase';
import { 
  SecureLibraryResource, 
  ReadingSession, 
  LibraryStats, 
  LibraryBadge, 
  UserLibraryProgress,
  SecureResourceSource,
  ResourceLicense
} from '../types';

const SECURE_LIBRARY_COLLECTION = 'secure_library_resources';
const READING_SESSIONS_COLLECTION = 'reading_sessions';
const USER_LIBRARY_PROGRESS_COLLECTION = 'user_library_progress';
const LIBRARY_STATS_COLLECTION = 'library_stats';
const LIBRARY_BADGES_COLLECTION = 'library_badges';

// Badges prédéfinis pour la bibliothèque
export const LIBRARY_BADGES: Omit<LibraryBadge, 'id' | 'unlockedAt'>[] = [
  {
    name: 'Lecteur Débutant',
    description: 'Lire votre premier livre',
    icon: '📖',
    color: '#10B981',
    requirement: { type: 'BOOKS_READ', value: 1 },
    points: 10
  },
  {
    name: 'Lecteur Actif',
    description: 'Lire 5 livres',
    icon: '📚',
    color: '#3B82F6',
    requirement: { type: 'BOOKS_READ', value: 5 },
    points: 25
  },
  {
    name: 'Bibliophile',
    description: 'Lire 10 livres',
    icon: '📕',
    color: '#8B5CF6',
    requirement: { type: 'BOOKS_READ', value: 10 },
    points: 50
  },
  {
    name: 'Expert en Lecture',
    description: 'Lire 25 livres',
    icon: '📗',
    color: '#EF4444',
    requirement: { type: 'BOOKS_READ', value: 25 },
    points: 100
  },
  {
    name: 'Marathon de Lecture',
    description: '10 heures de lecture',
    icon: '⏰',
    color: '#F59E0B',
    requirement: { type: 'READING_TIME', value: 10 },
    points: 30
  },
  {
    name: 'Explorateur de Catégories',
    description: 'Explorer 3 catégories différentes',
    icon: '🔍',
    color: '#06B6D4',
    requirement: { type: 'CATEGORIES_EXPLORED', value: 3 },
    points: 20
  },
  {
    name: 'Série de Lecture',
    description: '7 jours consécutifs de lecture',
    icon: '🔥',
    color: '#F97316',
    requirement: { type: 'STREAK_DAYS', value: 7 },
    points: 40
  },
  {
    name: 'Maître du Code',
    description: 'Lire 15 livres de programmation',
    icon: '💻',
    color: '#10B981',
    requirement: { type: 'BOOKS_READ', value: 15, target: 'PROGRAMMATION' },
    points: 75
  }
];

export const secureLibraryService = {
  /**
   * Récupère les ressources depuis Open Library API
   */
  async searchOpenLibrary(query: string, category?: string): Promise<SecureLibraryResource[]> {
    try {
      const searchUrl = `https://openlibrary.org/search.json?q=${encodeURIComponent(query)}&fields=key,title,author_name,first_publish_year,subject,edition_count&limit=20`;
      
      const response = await fetch(searchUrl);
      const data = await response.json();
      
      return data.docs.map((doc: any) => ({
        id: `openlibrary-${doc.key}`,
        title: doc.title || 'Sans titre',
        description: `Par ${doc.author_name?.[0] || 'Auteur inconnu'}`,
        category: this.mapOpenLibraryCategory(doc.subject, category),
        type: 'PDF' as const,
        source: 'OPEN_LIBRARY' as const,
        license: 'PUBLIC_DOMAIN' as const,
        sourceUrl: `https://openlibrary.org${doc.key}`,
        isDownloadable: false, // Pas de téléchargement direct
        author: doc.author_name?.[0],
        publishedYear: doc.first_publish_year,
        pages: doc.edition_count || 0,
        language: 'FR',
        difficulty: 'INTERMEDIAIRE',
        views: 0,
        reads: 0,
        averageRating: 0,
        ratingCount: 0,
        tags: doc.subject?.slice(0, 5) || [],
        keywords: [],
        isOfficial: false,
        isVerified: false,
        isValidated: false,
        requiresMembership: true,
        minRole: 'MEMBER',
        addedAt: new Date().toISOString(),
        lastUpdated: new Date().toISOString()
      }));
    } catch (error) {
      console.error('Error searching Open Library:', error);
      return [];
    }
  },

  /**
   * Récupère les ressources depuis Internet Archive
   */
  async searchInternetArchive(query: string, category?: string): Promise<SecureLibraryResource[]> {
    try {
      const searchUrl = `https://archive.org/advancedsearch.php?q=${encodeURIComponent(query)}&output=json&fl[]=identifier,title,creator,date,description,subject&rows=20`;
      
      const response = await fetch(searchUrl);
      const data = await response.json();
      
      return (data.response?.docs || []).map((doc: any) => ({
        id: `archive-${doc.identifier}`,
        title: doc.title || 'Sans titre',
        description: doc.description?.substring(0, 200) || 'Pas de description',
        category: this.mapArchiveCategory(doc.subject, category),
        type: 'PDF' as const,
        source: 'INTERNET_ARCHIVE' as const,
        license: 'CREATIVE_COMMONS' as const,
        sourceUrl: `https://archive.org/details/${doc.identifier}`,
        isDownloadable: false,
        author: doc.creator?.[0],
        publishedYear: parseInt(doc.date?.[0]) || undefined,
        language: 'EN',
        difficulty: 'INTERMEDIAIRE',
        views: 0,
        reads: 0,
        averageRating: 0,
        ratingCount: 0,
        tags: (doc.subject || []).slice(0, 5),
        keywords: [],
        isOfficial: false,
        isVerified: false,
        isValidated: false,
        requiresMembership: true,
        minRole: 'MEMBER',
        addedAt: new Date().toISOString(),
        lastUpdated: new Date().toISOString()
      }));
    } catch (error) {
      console.error('Error searching Internet Archive:', error);
      return [];
    }
  },

  /**
   * Ajoute une ressource validée à la bibliothèque sécurisée
   */
  async addSecureResource(resource: Omit<SecureLibraryResource, 'id' | 'addedAt' | 'lastUpdated'>): Promise<string> {
    try {
      const resourceData = {
        ...resource,
        addedAt: serverTimestamp(),
        lastUpdated: serverTimestamp(),
        isValidated: true,
        validationDate: serverTimestamp()
      };
      
      const docRef = await addDoc(collection(db, SECURE_LIBRARY_COLLECTION), resourceData);
      console.log(`Secure resource added: ${docRef.id}`);
      return docRef.id;
    } catch (error) {
      console.error('Error adding secure resource:', error);
      throw error;
    }
  },

  /**
   * Récupère toutes les ressources sécurisées
   */
  async getSecureResources(userRole: string = 'MEMBER'): Promise<SecureLibraryResource[]> {
    try {
      const q = query(
        collection(db, SECURE_LIBRARY_COLLECTION),
        where('isValidated', '==', true),
        where('minRole', 'in', ['VISITOR', userRole]),
        orderBy('addedAt', 'desc')
      );
      
      const snapshot = await getDocs(q);
      return snapshot.docs.map(doc => ({
        id: doc.id,
        ...doc.data()
      } as SecureLibraryResource));
    } catch (error) {
      console.error('Error fetching secure resources:', error);
      return [];
    }
  },

  /**
   * Démarre une session de lecture
   */
  async startReadingSession(userId: string, resourceId: string): Promise<string> {
    try {
      const sessionData = {
        userId,
        resourceId,
        startedAt: serverTimestamp(),
        duration: 0,
        progress: 0,
        isCompleted: false,
        device: navigator.userAgent.includes('Mobile') ? 'mobile' : 'desktop'
      };
      
      const docRef = await addDoc(collection(db, READING_SESSIONS_COLLECTION), sessionData);
      
      // Mettre à jour les statistiques de la ressource
      await this.updateResourceStats(resourceId, 'views');
      
      return docRef.id;
    } catch (error) {
      console.error('Error starting reading session:', error);
      throw error;
    }
  },

  /**
   * Met à jour une session de lecture
   */
  async updateReadingSession(
    sessionId: string, 
    progress: number, 
    duration: number, 
    pagesRead?: number
  ): Promise<void> {
    try {
      const sessionRef = doc(db, READING_SESSIONS_COLLECTION, sessionId);
      const updateData: any = {
        progress,
        duration,
        endedAt: serverTimestamp(),
        isCompleted: progress >= 100
      };
      
      if (pagesRead) {
        updateData.pagesRead = pagesRead;
      }
      
      await updateDoc(sessionRef, updateData);
    } catch (error) {
      console.error('Error updating reading session:', error);
      throw error;
    }
  },

  /**
   * Récupère la progression de lecture d'un utilisateur
   */
  async getUserLibraryProgress(userId: string): Promise<UserLibraryProgress | null> {
    try {
      const progressDoc = await getDoc(doc(db, USER_LIBRARY_PROGRESS_COLLECTION, userId));
      
      if (progressDoc.exists()) {
        return {
          id: progressDoc.id,
          ...progressDoc.data()
        } as UserLibraryProgress;
      }
      
      // Créer une progression initiale si elle n'existe pas
      const initialProgress: Omit<UserLibraryProgress, 'id'> = {
        userId,
        totalBooksRead: 0,
        totalPagesRead: 0,
        totalReadingTime: 0,
        currentStreak: 0,
        longestStreak: 0,
        categoryProgress: {},
        unlockedBadges: [],
        recentSessions: [],
        favoriteResources: [],
        readingHistory: [],
        lastActivityAt: new Date().toISOString()
      };
      
      await this.createUserLibraryProgress(userId, initialProgress);
      return { ...initialProgress, id: userId };
    } catch (error) {
      console.error('Error getting user library progress:', error);
      return null;
    }
  },

  /**
   * Crée la progression de lecture d'un utilisateur
   */
  async createUserLibraryProgress(userId: string, progress: Omit<UserLibraryProgress, 'id'>): Promise<void> {
    try {
      await updateDoc(doc(db, 'users', userId), {
        libraryProgress: progress
      });
    } catch (error) {
      console.error('Error creating user library progress:', error);
      throw error;
    }
  },

  /**
   * Met à jour la progression après une session de lecture
   */
  async updateUserProgress(
    userId: string, 
    resourceId: string, 
    sessionDuration: number, 
    sessionProgress: number,
    resourceTitle: string,
    resourceCategory: string
  ): Promise<void> {
    try {
      const userRef = doc(db, 'users', userId);
      const userDoc = await getDoc(userRef);
      
      if (!userDoc.exists()) return;
      
      const userData = userDoc.data();
      const currentProgress = userData.libraryProgress || {
        totalBooksRead: 0,
        totalPagesRead: 0,
        totalReadingTime: 0,
        currentStreak: 0,
        longestStreak: 0,
        categoryProgress: {},
        unlockedBadges: [],
        recentSessions: [],
        favoriteResources: [],
        readingHistory: [],
        lastActivityAt: new Date().toISOString()
      };
      
      // Mettre à jour les statistiques
      const updatedProgress = {
        ...currentProgress,
        totalReadingTime: currentProgress.totalReadingTime + (sessionDuration / 60), // Convertir en heures
        lastActivityAt: new Date().toISOString(),
        categoryProgress: {
          ...currentProgress.categoryProgress,
          [resourceCategory]: {
            resourcesRead: (currentProgress.categoryProgress[resourceCategory]?.resourcesRead || 0) + 1,
            totalTime: (currentProgress.categoryProgress[resourceCategory]?.totalTime || 0) + (sessionDuration / 60),
            lastReadAt: new Date().toISOString()
          }
        },
        readingHistory: [
          {
            resourceId,
            title: resourceTitle,
            readAt: new Date().toISOString(),
            duration: sessionDuration,
            progress: sessionProgress
          },
          ...currentProgress.readingHistory.slice(0, 49) // Garder seulement les 50 plus récents
        ]
      };
      
      // Vérifier si le livre est terminé
      if (sessionProgress >= 100) {
        updatedProgress.totalBooksRead = currentProgress.totalBooksRead + 1;
        
        // Vérifier et débloquer des badges
        await this.checkAndUnlockBadges(userId, updatedProgress);
      }
      
      await updateDoc(userRef, {
        libraryProgress: updatedProgress
      });
    } catch (error) {
      console.error('Error updating user progress:', error);
      throw error;
    }
  },

  /**
   * Vérifie et débloque les badges appropriés
   */
  async checkAndUnlockBadges(userId: string, progress: UserLibraryProgress): Promise<string[]> {
    const newlyUnlocked: string[] = [];
    
    for (const badge of LIBRARY_BADGES) {
      if (progress.unlockedBadges.includes(badge.name)) continue;
      
      let shouldUnlock = false;
      
      switch (badge.requirement.type) {
        case 'BOOKS_READ':
          if (badge.requirement.target) {
            // Badge spécifique à une catégorie
            const categoryProgress = progress.categoryProgress[badge.requirement.target];
            shouldUnlock = (categoryProgress?.resourcesRead || 0) >= badge.requirement.value;
          } else {
            shouldUnlock = progress.totalBooksRead >= badge.requirement.value;
          }
          break;
          
        case 'READING_TIME':
          shouldUnlock = progress.totalReadingTime >= badge.requirement.value;
          break;
          
        case 'CATEGORIES_EXPLORED':
          shouldUnlock = Object.keys(progress.categoryProgress).length >= badge.requirement.value;
          break;
          
        case 'STREAK_DAYS':
          shouldUnlock = progress.currentStreak >= badge.requirement.value;
          break;
      }
      
      if (shouldUnlock) {
        await this.unlockBadge(userId, badge.name);
        newlyUnlocked.push(badge.name);
      }
    }
    
    return newlyUnlocked;
  },

  /**
   * Débloque un badge pour un utilisateur
   */
  async unlockBadge(userId: string, badgeName: string): Promise<void> {
    try {
      const userRef = doc(db, 'users', userId);
      await updateDoc(userRef, {
        'libraryProgress.unlockedBadges': arrayUnion(badgeName)
      });
      
      console.log(`Badge unlocked for user ${userId}: ${badgeName}`);
    } catch (error) {
      console.error('Error unlocking badge:', error);
      throw error;
    }
  },

  /**
   * Récupère les statistiques globales de la bibliothèque
   */
  async getLibraryStats(): Promise<LibraryStats> {
    try {
      const resourcesSnapshot = await getDocs(collection(db, SECURE_LIBRARY_COLLECTION));
      const sessionsSnapshot = await getDocs(collection(db, READING_SESSIONS_COLLECTION));
      
      const resources = resourcesSnapshot.docs.map(doc => doc.data() as SecureLibraryResource);
      const sessions = sessionsSnapshot.docs.map(doc => doc.data() as ReadingSession);
      
      const totalResources = resources.length;
      const totalReads = sessions.length;
      const totalReadingTime = sessions.reduce((acc, session) => acc + session.duration, 0) / 60; // en heures
      const completedBooks = sessions.filter(session => session.isCompleted).length;
      const activeReaders = new Set(sessions.map(session => session.userId)).size;
      
      // Catégories populaires
      const categoryCount: Record<string, number> = {};
      resources.forEach(resource => {
        categoryCount[resource.category] = (categoryCount[resource.category] || 0) + 1;
      });
      
      const popularCategories = Object.entries(categoryCount)
        .map(([category, count]) => ({ category, count }))
        .sort((a, b) => b.count - a.count)
        .slice(0, 5);
      
      // Activité récente
      const recentActivity = sessions
        .sort((a, b) => new Date(b.startedAt).getTime() - new Date(a.startedAt).getTime())
        .slice(0, 10)
        .map(session => ({
          userId: session.userId,
          resourceId: session.resourceId,
          action: session.isCompleted ? 'COMPLETED' as const : 'STARTED' as const,
          timestamp: session.startedAt
        }));
      
      return {
        totalResources,
        totalReads,
        totalReadingTime,
        completedBooks,
        activeReaders,
        popularCategories,
        recentActivity
      };
    } catch (error) {
      console.error('Error getting library stats:', error);
      return {
        totalResources: 0,
        totalReads: 0,
        totalReadingTime: 0,
        completedBooks: 0,
        activeReaders: 0,
        popularCategories: [],
        recentActivity: []
      };
    }
  },

  /**
   * Met à jour les statistiques d'une ressource
   */
  async updateResourceStats(resourceId: string, statType: 'views' | 'reads'): Promise<void> {
    try {
      const resourceRef = doc(db, SECURE_LIBRARY_COLLECTION, resourceId);
      await updateDoc(resourceRef, {
        [statType]: increment(1)
      });
    } catch (error) {
      console.error('Error updating resource stats:', error);
    }
  },

  /**
   * Ajoute une ressource aux favoris
   */
  async addToFavorites(userId: string, resourceId: string): Promise<void> {
    try {
      const userRef = doc(db, 'users', userId);
      await updateDoc(userRef, {
        'libraryProgress.favoriteResources': arrayUnion(resourceId)
      });
    } catch (error) {
      console.error('Error adding to favorites:', error);
      throw error;
    }
  },

  /**
   * Retire une ressource des favoris
   */
  async removeFromFavorites(userId: string, resourceId: string): Promise<void> {
    try {
      const userRef = doc(db, 'users', userId);
      await updateDoc(userRef, {
        'libraryProgress.favoriteResources': arrayRemove(resourceId)
      });
    } catch (error) {
      console.error('Error removing from favorites:', error);
      throw error;
    }
  },

  /**
   * Map les catégories d'Open Library vers nos catégories
   */
  mapOpenLibraryCategory(subjects: string[], defaultCategory?: string): SecureLibraryResource['category'] {
    const subjectString = subjects?.join(' ').toLowerCase() || '';
    
    if (subjectString.includes('programming') || subjectString.includes('computer') || subjectString.includes('software')) {
      return 'PROGRAMMATION';
    }
    if (subjectString.includes('artificial intelligence') || subjectString.includes('machine learning')) {
      return 'IA';
    }
    if (subjectString.includes('security') || subjectString.includes('cybersecurity')) {
      return 'CYBERSECURITE';
    }
    if (subjectString.includes('mobile') || subjectString.includes('android') || subjectString.includes('ios')) {
      return 'MOBILE';
    }
    if (subjectString.includes('web') || subjectString.includes('html') || subjectString.includes('javascript')) {
      return 'WEB';
    }
    if (subjectString.includes('linux') || subjectString.includes('unix')) {
      return 'LINUX';
    }
    if (subjectString.includes('cloud') || subjectString.includes('aws') || subjectString.includes('azure')) {
      return 'CLOUD';
    }
    if (subjectString.includes('mathematics') || subjectString.includes('algorithms')) {
      return subjectString.includes('algorithm') ? 'ALGORITHMES' : 'MATHS';
    }
    
    return (defaultCategory as any) || 'PROGRAMMATION';
  },

  /**
   * Map les catégories d'Internet Archive vers nos catégories
   */
  mapArchiveCategory(subjects: string[], defaultCategory?: string): SecureLibraryResource['category'] {
    return this.mapOpenLibraryCategory(subjects, defaultCategory);
  }
};
