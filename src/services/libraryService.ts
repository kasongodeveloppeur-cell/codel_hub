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
  Query,
  DocumentData,
  startAfter,
  getDoc,
  arrayUnion,
  arrayRemove
} from 'firebase/firestore';
import { db, handleFirestoreError, OperationType } from '../lib/firebase';
import { 
  LibraryResource, 
  LibraryCategory, 
  ReadingProgress, 
  Bookmark, 
  SearchQuery, 
  SearchResult,
  AppUser
} from '../types';

const LIBRARY_COLLECTION = 'library_resources';
const CATEGORIES_COLLECTION = 'library_categories';
const READING_PROGRESS_COLLECTION = 'reading_progress';
const BOOKMARKS_COLLECTION = 'bookmarks';

// Catégories prédéfinies pour CODEL Library
export const CODEL_LIBRARY_CATEGORIES: Omit<LibraryCategory, 'resourceCount'>[] = [
  {
    id: 'cat-programmation',
    name: 'Programmation',
    icon: '💻',
    description: 'Langages de programmation, algorithmique, structures de données',
    color: '#3B82F6'
  },
  {
    id: 'cat-mobile',
    name: 'Développement Mobile',
    icon: '📱',
    description: 'iOS, Android, Flutter, React Native',
    color: '#10B981'
  },
  {
    id: 'cat-web',
    name: 'Web',
    icon: '🌐',
    description: 'HTML, CSS, JavaScript, frameworks web',
    color: '#F59E0B'
  },
  {
    id: 'cat-ia',
    name: 'Intelligence Artificielle',
    icon: '🤖',
    description: 'Machine Learning, Deep Learning, NLP',
    color: '#8B5CF6'
  },
  {
    id: 'cat-cybersec',
    name: 'Cybersécurité',
    icon: '🔒',
    description: 'Sécurité réseau, cryptographie, pentesting',
    color: '#EF4444'
  },
  {
    id: 'cat-linux',
    name: 'Linux',
    icon: '🐧',
    description: 'Administration Linux, shell, serveurs',
    color: '#F97316'
  },
  {
    id: 'cat-design',
    name: 'Design',
    icon: '🎨',
    description: 'UI/UX, design graphique, prototypage',
    color: '#EC4899'
  },
  {
    id: 'cat-maths',
    name: 'Mathématiques',
    icon: '📐',
    description: 'Mathématiques appliquées, statistiques',
    color: '#06B6D4'
  },
  {
    id: 'cat-reseaux',
    name: 'Réseaux',
    icon: '🌍',
    description: 'TCP/IP, protocoles, administration réseau',
    color: '#84CC16'
  },
  {
    id: 'cat-entrepreneuriat',
    name: 'Entrepreneuriat',
    icon: '🚀',
    description: 'Business models, startup, gestion de projet',
    color: '#6366F1'
  }
];

export const libraryService = {
  // Initialiser les catégories de la bibliothèque
  async initCategories(): Promise<void> {
    try {
      const snapshot = await getDocs(collection(db, CATEGORIES_COLLECTION));
      if (snapshot.empty) {
        for (const category of CODEL_LIBRARY_CATEGORIES) {
          await addDoc(collection(db, CATEGORIES_COLLECTION), {
            ...category,
            resourceCount: 0,
            createdAt: serverTimestamp()
          });
        }
      }
    } catch (error) {
      console.error('Error initializing library categories:', error);
    }
  },

  // Recherche intelligente de ressources
  async searchResources(searchQuery: SearchQuery): Promise<SearchResult[]> {
    try {
      let q: Query<DocumentData> = collection(db, LIBRARY_COLLECTION);
      
      // Filtrage par catégorie
      if (searchQuery.category) {
        q = query(q, where('category', '==', searchQuery.category));
      }
      
      // Filtrage par type
      if (searchQuery.type) {
        q = query(q, where('type', '==', searchQuery.type));
      }
      
      // Filtrage par difficulté
      if (searchQuery.difficulty) {
        q = query(q, where('difficulty', '==', searchQuery.difficulty));
      }
      
      // Filtrage par tags
      if (searchQuery.tags && searchQuery.tags.length > 0) {
        q = query(q, where('tags', 'array-contains-any', searchQuery.tags));
      }
      
      // Tri
      const sortField = searchQuery.sortBy === 'rating' ? 'rating' : searchQuery.sortBy === 'downloads' ? 'downloads' : searchQuery.sortBy === 'date' ? 'uploadedAt' : 'title';
      q = query(q, orderBy(sortField, searchQuery.sortOrder === 'desc' ? 'desc' : 'asc'));
      
      // Limitation
      q = query(q, limit(50));
      
      const snapshot = await getDocs(q);
      const resources = snapshot.docs.map(doc => ({ 
        id: doc.id, 
        ...doc.data() as LibraryResource
      }));
      
      // Calculer le score de pertinence
      const results = resources.map(resource => ({
        resource,
        relevanceScore: this.calculateRelevanceScore(resource, searchQuery),
        matchedFields: this.getMatchedFields(resource, searchQuery)
      })).sort((a, b) => b.relevanceScore - a.relevanceScore);
      
      return results;
    } catch (error) {
      handleFirestoreError(error, OperationType.GET, LIBRARY_COLLECTION);
      return [];
    }
  },

  // Calculer le score de pertinence pour la recherche
  calculateRelevanceScore(resource: LibraryResource, query: SearchQuery): number {
    let score = 0;
    const searchTerms = query.query.toLowerCase().split(' ');
    
    // Recherche dans le titre (poids le plus élevé)
    searchTerms.forEach(term => {
      if (resource.title.toLowerCase().includes(term)) {
        score += 10;
      }
    });
    
    // Recherche dans la description
    searchTerms.forEach(term => {
      if (resource.description.toLowerCase().includes(term)) {
        score += 5;
      }
    });
    
    // Recherche dans les tags
    searchTerms.forEach(term => {
      resource.tags.forEach(tag => {
        if (tag.toLowerCase().includes(term)) {
          score += 3;
        }
      });
    });
    
    // Bonus pour les ressources vérifiées
    if (resource.isVerified) score += 2;
    
    // Bonus pour les ressources officielles
    if (resource.isOfficial) score += 1;
    
    return score;
  },

  // Obtenir les champs qui correspondent à la recherche
  getMatchedFields(resource: LibraryResource, query: SearchQuery): string[] {
    const matchedFields: string[] = [];
    const searchTerms = query.query.toLowerCase().split(' ');
    
    searchTerms.forEach(term => {
      if (resource.title.toLowerCase().includes(term) && !matchedFields.includes('title')) {
        matchedFields.push('title');
      }
      if (resource.description.toLowerCase().includes(term) && !matchedFields.includes('description')) {
        matchedFields.push('description');
      }
      resource.tags.forEach(tag => {
        if (tag.toLowerCase().includes(term) && !matchedFields.includes('tags')) {
          matchedFields.push('tags');
        }
      });
    });
    
    return matchedFields;
  },

  // Obtenir les ressources par catégorie
  async getResourcesByCategory(category: string, limitCount: number = 20): Promise<LibraryResource[]> {
    try {
      const q = query(
        collection(db, LIBRARY_COLLECTION),
        where('category', '==', category),
        orderBy('downloads', 'desc'),
        limit(limitCount)
      );
      
      const snapshot = await getDocs(q);
      return snapshot.docs.map(doc => ({ 
        id: doc.id, 
        ...doc.data() 
      } as LibraryResource));
    } catch (error) {
      handleFirestoreError(error, OperationType.GET, LIBRARY_COLLECTION);
      return [];
    }
  },

  // Obtenir les ressources populaires
  async getPopularResources(limitCount: number = 10): Promise<LibraryResource[]> {
    try {
      const q = query(
        collection(db, LIBRARY_COLLECTION),
        orderBy('downloads', 'desc'),
        limit(limitCount)
      );
      
      const snapshot = await getDocs(q);
      return snapshot.docs.map(doc => ({ 
        id: doc.id, 
        ...doc.data() 
      } as LibraryResource));
    } catch (error) {
      handleFirestoreError(error, OperationType.GET, LIBRARY_COLLECTION);
      return [];
    }
  },

  // Obtenir les ressources récentes
  async getRecentResources(limitCount: number = 10): Promise<LibraryResource[]> {
    try {
      const q = query(
        collection(db, LIBRARY_COLLECTION),
        orderBy('uploadedAt', 'desc'),
        limit(limitCount)
      );
      
      const snapshot = await getDocs(q);
      return snapshot.docs.map(doc => ({ 
        id: doc.id, 
        ...doc.data() 
      } as LibraryResource));
    } catch (error) {
      handleFirestoreError(error, OperationType.GET, LIBRARY_COLLECTION);
      return [];
    }
  },

  // Ajouter une ressource à la bibliothèque
  async addResource(resource: Omit<LibraryResource, 'id' | 'downloads' | 'views' | 'uploadedAt' | 'lastUpdated'>, uploadedBy: string): Promise<string> {
    try {
      const newResource = {
        ...resource,
        downloads: 0,
        views: 0,
        uploadedBy,
        uploadedAt: serverTimestamp(),
        lastUpdated: serverTimestamp()
      };
      
      const docRef = await addDoc(collection(db, LIBRARY_COLLECTION), newResource);
      
      // Mettre à jour le compteur de ressources dans la catégorie
      await this.updateCategoryResourceCount(resource.category, 1);
      
      // Récompenser l'utilisateur
      await this.rewardUploader(uploadedBy, 'RESOURCE_UPLOADED', 10, `Ressource ajoutée: ${resource.title}`);
      
      return docRef.id;
    } catch (error) {
      handleFirestoreError(error, OperationType.CREATE, LIBRARY_COLLECTION);
      throw error;
    }
  },

  // Mettre à jour une ressource
  async updateResource(resourceId: string, updates: Partial<LibraryResource>): Promise<void> {
    try {
      const resourceRef = doc(db, LIBRARY_COLLECTION, resourceId);
      await updateDoc(resourceRef, {
        ...updates,
        lastUpdated: serverTimestamp()
      });
    } catch (error) {
      handleFirestoreError(error, OperationType.UPDATE, `${LIBRARY_COLLECTION}/${resourceId}`);
      throw error;
    }
  },

  // Supprimer une ressource
  async deleteResource(resourceId: string): Promise<void> {
    try {
      const resourceRef = doc(db, LIBRARY_COLLECTION, resourceId);
      const resourceDoc = await getDoc(resourceRef);
      
      if (resourceDoc.exists()) {
        const resource = resourceDoc.data() as LibraryResource;
        
        // Mettre à jour le compteur de ressources dans la catégorie
        await this.updateCategoryResourceCount(resource.category, -1);
        
        await deleteDoc(resourceRef);
      }
    } catch (error) {
      handleFirestoreError(error, OperationType.DELETE, `${LIBRARY_COLLECTION}/${resourceId}`);
      throw error;
    }
  },

  // Incrémenter le nombre de téléchargements
  async incrementDownloads(resourceId: string): Promise<void> {
    try {
      const resourceRef = doc(db, LIBRARY_COLLECTION, resourceId);
      await updateDoc(resourceRef, {
        downloads: arrayUnion(resourceId)
      });
    } catch (error) {
      handleFirestoreError(error, OperationType.UPDATE, `${LIBRARY_COLLECTION}/${resourceId}/downloads`);
    }
  },

  // Incrémenter le nombre de vues
  async incrementViews(resourceId: string): Promise<void> {
    try {
      const resourceRef = doc(db, LIBRARY_COLLECTION, resourceId);
      await updateDoc(resourceRef, {
        views: arrayUnion(resourceId)
      });
    } catch (error) {
      handleFirestoreError(error, OperationType.UPDATE, `${LIBRARY_COLLECTION}/${resourceId}/views`);
    }
  },

  // Gérer la progression de lecture
  async saveReadingProgress(userId: string, resourceId: string, progress: Partial<ReadingProgress>): Promise<void> {
    try {
      const q = query(
        collection(db, READING_PROGRESS_COLLECTION),
        where('userId', '==', userId),
        where('resourceId', '==', resourceId)
      );
      
      const snapshot = await getDocs(q);
      
      if (snapshot.empty) {
        // Créer une nouvelle progression
        await addDoc(collection(db, READING_PROGRESS_COLLECTION), {
          userId,
          resourceId,
          progress: 0,
          currentPage: 0,
          currentPosition: 0,
          lastReadAt: serverTimestamp(),
          isCompleted: false,
          readingTime: 0,
          bookmarks: [],
          ...progress
        });
      } else {
        // Mettre à jour la progression existante
        const progressRef = doc(db, READING_PROGRESS_COLLECTION, snapshot.docs[0].id);
        await updateDoc(progressRef, {
          ...progress,
          lastReadAt: serverTimestamp()
        });
      }
    } catch (error) {
      handleFirestoreError(error, OperationType.CREATE, READING_PROGRESS_COLLECTION);
    }
  },

  // Obtenir la progression de lecture d'un utilisateur
  async getReadingProgress(userId: string, resourceId: string): Promise<ReadingProgress | null> {
    try {
      const q = query(
        collection(db, READING_PROGRESS_COLLECTION),
        where('userId', '==', userId),
        where('resourceId', '==', resourceId)
      );
      
      const snapshot = await getDocs(q);
      if (snapshot.empty) return null;
      
      return { id: snapshot.docs[0].id, ...snapshot.docs[0].data() } as ReadingProgress;
    } catch (error) {
      handleFirestoreError(error, OperationType.GET, READING_PROGRESS_COLLECTION);
      return null;
    }
  },

  // Ajouter un marque-page
  async addBookmark(userId: string, resourceId: string, bookmark: Omit<Bookmark, 'id' | 'createdAt'>): Promise<void> {
    try {
      const q = query(
        collection(db, READING_PROGRESS_COLLECTION),
        where('userId', '==', userId),
        where('resourceId', '==', resourceId)
      );
      
      const snapshot = await getDocs(q);
      
      if (!snapshot.empty) {
        const progressRef = doc(db, READING_PROGRESS_COLLECTION, snapshot.docs[0].id);
        const newBookmark = {
          ...bookmark,
          id: `bookmark-${Date.now()}`,
          createdAt: serverTimestamp()
        };
        
        await updateDoc(progressRef, {
          bookmarks: arrayUnion(newBookmark)
        });
      }
    } catch (error) {
      handleFirestoreError(error, OperationType.CREATE, BOOKMARKS_COLLECTION);
    }
  },

  // Gérer les ressources favorites
  async toggleFavorite(userId: string, resourceId: string): Promise<boolean> {
    try {
      const userRef = doc(db, 'users', userId);
      const userDoc = await getDoc(userRef);
      
      if (userDoc.exists()) {
        const user = userDoc.data() as AppUser;
        const favorites = user.favoriteResources || [];
        const isFavorite = favorites.includes(resourceId);
        
        await updateDoc(userRef, {
          favoriteResources: isFavorite 
            ? arrayRemove(resourceId)
            : arrayUnion(resourceId)
        });
        
        return !isFavorite;
      }
      
      return false;
    } catch (error) {
      handleFirestoreError(error, OperationType.UPDATE, `users/${userId}/favorites`);
      return false;
    }
  },

  // Obtenir les ressources favorites d'un utilisateur
  async getFavoriteResources(userId: string): Promise<LibraryResource[]> {
    try {
      const userDoc = await getDoc(doc(db, 'users', userId));
      if (!userDoc.exists()) return [];
      
      const user = userDoc.data() as AppUser;
      const favoriteIds = user.favoriteResources || [];
      
      if (favoriteIds.length === 0) return [];
      
      const q = query(
        collection(db, LIBRARY_COLLECTION),
        where('__name__', 'in', favoriteIds)
      );
      
      const snapshot = await getDocs(q);
      return snapshot.docs.map(doc => ({ 
        id: doc.id, 
        ...doc.data() 
      } as LibraryResource));
    } catch (error) {
      handleFirestoreError(error, OperationType.GET, LIBRARY_COLLECTION);
      return [];
    }
  },

  // Mettre à jour le compteur de ressources dans une catégorie
  async updateCategoryResourceCount(category: string, increment: number): Promise<void> {
    try {
      const q = query(collection(db, CATEGORIES_COLLECTION), where('name', '==', category));
      const snapshot = await getDocs(q);
      
      if (!snapshot.empty) {
        const categoryRef = doc(db, CATEGORIES_COLLECTION, snapshot.docs[0].id);
        const currentCount = snapshot.docs[0].data().resourceCount || 0;
        await updateDoc(categoryRef, {
          resourceCount: Math.max(0, currentCount + increment)
        });
      }
    } catch (error) {
      console.error('Error updating category resource count:', error);
    }
  },

  // Récompenser l'utilisateur qui upload une ressource
  async rewardUploader(userId: string, type: string, points: number, reason: string): Promise<void> {
    try {
      // Cette fonction pourrait appeler le gamificationService
      // Pour l'instant, on met à jour directement les points de l'utilisateur
      const userRef = doc(db, 'users', userId);
      const userDoc = await getDoc(userRef);
      
      if (userDoc.exists()) {
        const user = userDoc.data() as AppUser;
        await updateDoc(userRef, {
          points: (user.points || 0) + points
        });
      }
    } catch (error) {
      console.error('Error rewarding uploader:', error);
    }
  },

  // Obtenir les catégories avec leurs comptes
  async getCategories(): Promise<LibraryCategory[]> {
    try {
      const snapshot = await getDocs(collection(db, CATEGORIES_COLLECTION));
      return snapshot.docs.map(doc => ({ 
        id: doc.id, 
        ...doc.data() 
      } as LibraryCategory));
    } catch (error) {
      handleFirestoreError(error, OperationType.GET, CATEGORIES_COLLECTION);
      return [];
    }
  },

  // Obtenir les ressources téléchargées pour lecture hors ligne
  async getDownloadedResources(userId: string): Promise<LibraryResource[]> {
    try {
      const userDoc = await getDoc(doc(db, 'users', userId));
      if (!userDoc.exists()) return [];
      
      const user = userDoc.data() as AppUser;
      const downloadedIds = user.downloadedResources || [];
      
      if (downloadedIds.length === 0) return [];
      
      const q = query(
        collection(db, LIBRARY_COLLECTION),
        where('__name__', 'in', downloadedIds)
      );
      
      const snapshot = await getDocs(q);
      return snapshot.docs.map(doc => ({ 
        id: doc.id, 
        ...doc.data() 
      } as LibraryResource));
    } catch (error) {
      handleFirestoreError(error, OperationType.GET, LIBRARY_COLLECTION);
      return [];
    }
  }
};
