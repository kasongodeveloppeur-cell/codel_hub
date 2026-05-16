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
  Tutorial, 
  TutorialComment, 
  TutorialRating, 
  CreatorStats, 
  AcademyCourse, 
  StudentProgress,
  AcademyModule,
  CreatorBadge,
  CreatorReward,
  ContributionActivity,
  AppUser
} from '../types';

const TUTORIALS_COLLECTION = 'tutorials';
const ACADEMY_COURSES_COLLECTION = 'academy_courses';
const TUTORIAL_COMMENTS_COLLECTION = 'tutorial_comments';
const TUTORIAL_RATINGS_COLLECTION = 'tutorial_ratings';
const STUDENT_PROGRESS_COLLECTION = 'student_progress';
const CREATOR_STATS_COLLECTION = 'creator_stats';
const CONTRIBUTION_ACTIVITIES_COLLECTION = 'contribution_activities';

// Badges créateurs CODEL Academy
export const ACADEMY_CREATOR_BADGES: Omit<CreatorBadge, 'id'>[] = [
  {
    name: 'Contributeur',
    description: 'Premier tutoriel publié',
    icon: '🌟',
    color: '#10B981',
    category: 'CONTRIBUTION',
    points: 20,
    requirements: [
      { type: 'tutorials_published', value: 1, description: 'Publier votre premier tutoriel' }
    ]
  },
  {
    name: 'Formateur Étudiant',
    description: '5 tutoriels publiés',
    icon: '🎓',
    color: '#3B82F6',
    category: 'FORMATION',
    points: 50,
    requirements: [
      { type: 'tutorials_published', value: 5, description: 'Publier 5 tutoriels' }
    ]
  },
  {
    name: 'Mentor',
    description: '10 tutoriels et 100 likes',
    icon: '👨‍🏫',
    color: '#8B5CF6',
    category: 'MENTORAT',
    points: 100,
    requirements: [
      { type: 'tutorials_published', value: 10, description: 'Publier 10 tutoriels' },
      { type: 'total_likes', value: 100, description: 'Obtenir 100 likes' }
    ]
  },
  {
    name: 'Créateur Actif',
    description: '20 tutoriels et 500 likes',
    icon: '🚀',
    color: '#F59E0B',
    category: 'EXCELLENCE',
    points: 200,
    requirements: [
      { type: 'tutorials_published', value: 20, description: 'Publier 20 tutoriels' },
      { type: 'total_likes', value: 500, description: 'Obtenir 500 likes' }
    ]
  }
];

export const academyService = {
  // Publier un tutoriel
  async publishTutorial(tutorial: Omit<Tutorial, 'id' | 'views' | 'likes' | 'dislikes' | 'commentsCount' | 'createdAt' | 'lastUpdated'>): Promise<string> {
    try {
      const newTutorial = {
        ...tutorial,
        views: 0,
        likes: 0,
        dislikes: 0,
        commentsCount: 0,
        createdAt: serverTimestamp(),
        lastUpdated: serverTimestamp()
      };
      
      const docRef = await addDoc(collection(db, TUTORIALS_COLLECTION), newTutorial);
      
      // Récompenser le créateur
      await this.rewardCreator(tutorial.authorId, 'TUTORIAL_PUBLISHED', 20, `Tutoriel publié: ${tutorial.title}`, docRef.id);
      
      // Mettre à jour les statistiques du créateur
      await this.updateCreatorStats(tutorial.authorId);
      
      // Vérifier si un badge doit être débloqué
      await this.checkAndUnlockBadges(tutorial.authorId);
      
      return docRef.id;
    } catch (error) {
      handleFirestoreError(error, OperationType.CREATE, TUTORIALS_COLLECTION);
      throw error;
    }
  },

  // Mettre à jour un tutoriel
  async updateTutorial(tutorialId: string, updates: Partial<Tutorial>): Promise<void> {
    try {
      const tutorialRef = doc(db, TUTORIALS_COLLECTION, tutorialId);
      await updateDoc(tutorialRef, {
        ...updates,
        lastUpdated: serverTimestamp()
      });
    } catch (error) {
      handleFirestoreError(error, OperationType.UPDATE, `${TUTORIALS_COLLECTION}/${tutorialId}`);
      throw error;
    }
  },

  // Supprimer un tutoriel
  async deleteTutorial(tutorialId: string): Promise<void> {
    try {
      await deleteDoc(doc(db, TUTORIALS_COLLECTION, tutorialId));
    } catch (error) {
      handleFirestoreError(error, OperationType.DELETE, `${TUTORIALS_COLLECTION}/${tutorialId}`);
      throw error;
    }
  },

  // Obtenir les tutoriels par catégorie
  async getTutorialsByCategory(category: string, limitCount: number = 20): Promise<Tutorial[]> {
    try {
      const q = query(
        collection(db, TUTORIALS_COLLECTION),
        where('category', '==', category),
        where('status', '==', 'PUBLISHED'),
        orderBy('createdAt', 'desc'),
        limit(limitCount)
      );
      
      const snapshot = await getDocs(q);
      return snapshot.docs.map(doc => ({ 
        id: doc.id, 
        ...doc.data() 
      } as Tutorial));
    } catch (error) {
      handleFirestoreError(error, OperationType.GET, TUTORIALS_COLLECTION);
      return [];
    }
  },

  // Obtenir les tutoriels populaires
  async getPopularTutorials(limitCount: number = 10): Promise<Tutorial[]> {
    try {
      const q = query(
        collection(db, TUTORIALS_COLLECTION),
        where('status', '==', 'PUBLISHED'),
        orderBy('likes', 'desc'),
        limit(limitCount)
      );
      
      const snapshot = await getDocs(q);
      return snapshot.docs.map(doc => ({ 
        id: doc.id, 
        ...doc.data() 
      } as Tutorial));
    } catch (error) {
      handleFirestoreError(error, OperationType.GET, TUTORIALS_COLLECTION);
      return [];
    }
  },

  // Obtenir les tutoriels récents
  async getRecentTutorials(limitCount: number = 10): Promise<Tutorial[]> {
    try {
      const q = query(
        collection(db, TUTORIALS_COLLECTION),
        where('status', '==', 'PUBLISHED'),
        orderBy('createdAt', 'desc'),
        limit(limitCount)
      );
      
      const snapshot = await getDocs(q);
      return snapshot.docs.map(doc => ({ 
        id: doc.id, 
        ...doc.data() 
      } as Tutorial));
    } catch (error) {
      handleFirestoreError(error, OperationType.GET, TUTORIALS_COLLECTION);
      return [];
    }
  },

  // Obtenir les tutoriels d'un utilisateur
  async getUserTutorials(userId: string): Promise<Tutorial[]> {
    try {
      const q = query(
        collection(db, TUTORIALS_COLLECTION),
        where('authorId', '==', userId),
        orderBy('createdAt', 'desc')
      );
      
      const snapshot = await getDocs(q);
      return snapshot.docs.map(doc => ({ 
        id: doc.id, 
        ...doc.data() 
      } as Tutorial));
    } catch (error) {
      handleFirestoreError(error, OperationType.GET, TUTORIALS_COLLECTION);
      return [];
    }
  },

  // Aimer un tutoriel
  async likeTutorial(tutorialId: string, userId: string): Promise<void> {
    try {
      // Mettre à jour le compteur de likes du tutoriel
      const tutorialRef = doc(db, TUTORIALS_COLLECTION, tutorialId);
      const tutorialDoc = await getDoc(tutorialRef);
      if (tutorialDoc.exists()) {
        const currentLikes = tutorialDoc.data().likes || 0;
        await updateDoc(tutorialRef, {
          likes: currentLikes + 1
        });
        
        // Récompenser l'auteur si le tutoriel devient populaire
        const tutorial = tutorialDoc.data() as Tutorial;
        if ((currentLikes + 1) % 50 === 0) { // Tous les 50 likes
          await this.rewardCreator(tutorial.authorId, 'TUTORIAL_POPULAR', 25, `Tutoriel populaire: ${tutorial.title}`, tutorialId);
        }
      }
    } catch (error) {
      handleFirestoreError(error, OperationType.UPDATE, `${TUTORIALS_COLLECTION}/${tutorialId}/likes`);
    }
  },

  // Ajouter un commentaire à un tutoriel
  async addTutorialComment(comment: Omit<TutorialComment, 'id' | 'createdAt' | 'likes' | 'replies'>): Promise<string> {
    try {
      const newComment = {
        ...comment,
        createdAt: serverTimestamp(),
        likes: 0,
        replies: []
      };
      
      const docRef = await addDoc(collection(db, TUTORIAL_COMMENTS_COLLECTION), newComment);
      
      // Mettre à jour le compteur de commentaires du tutoriel
      const tutorialRef = doc(db, TUTORIALS_COLLECTION, comment.tutorialId);
      const tutorialDoc = await getDoc(tutorialRef);
      if (tutorialDoc.exists()) {
        const currentCount = tutorialDoc.data().commentsCount || 0;
        await updateDoc(tutorialRef, {
          commentsCount: currentCount + 1
        });
      }
      
      return docRef.id;
    } catch (error) {
      handleFirestoreError(error, OperationType.CREATE, TUTORIAL_COMMENTS_COLLECTION);
      throw error;
    }
  },

  // Obtenir les commentaires d'un tutoriel
  async getTutorialComments(tutorialId: string): Promise<TutorialComment[]> {
    try {
      const q = query(
        collection(db, TUTORIALS_COLLECTION),
        where('tutorialId', '==', tutorialId),
        orderBy('createdAt', 'desc')
      );
      
      const snapshot = await getDocs(q);
      return snapshot.docs.map(doc => ({ 
        id: doc.id, 
        ...doc.data() 
      } as TutorialComment));
    } catch (error) {
      handleFirestoreError(error, OperationType.GET, TUTORIAL_COMMENTS_COLLECTION);
      return [];
    }
  },

  // Noter un tutoriel
  async rateTutorial(rating: Omit<TutorialRating, 'id' | 'createdAt'>): Promise<void> {
    try {
      const newRating = {
        ...rating,
        createdAt: serverTimestamp()
      };
      
      await addDoc(collection(db, TUTORIAL_RATINGS_COLLECTION), newRating);
    } catch (error) {
      handleFirestoreError(error, OperationType.CREATE, TUTORIAL_RATINGS_COLLECTION);
      throw error;
    }
  },

  // Obtenir la note moyenne d'un tutoriel
  async getTutorialAverageRating(tutorialId: string): Promise<number> {
    try {
      const q = query(collection(db, TUTORIAL_RATINGS_COLLECTION), where('tutorialId', '==', tutorialId));
      const snapshot = await getDocs(q);
      
      if (snapshot.empty) return 0;
      
      const ratings = snapshot.docs.map(doc => doc.data() as TutorialRating);
      const totalRating = ratings.reduce((sum, rating) => sum + rating.rating, 0);
      
      return Math.round((totalRating / ratings.length) * 10) / 10;
    } catch (error) {
      handleFirestoreError(error, OperationType.GET, TUTORIAL_RATINGS_COLLECTION);
      return 0;
    }
  },

  // Créer un cours académique
  async createAcademyCourse(course: Omit<AcademyCourse, 'id' | 'enrolledStudents' | 'createdAt' | 'lastUpdated'>): Promise<string> {
    try {
      const newCourse = {
        ...course,
        enrolledStudents: 0,
        createdAt: serverTimestamp(),
        lastUpdated: serverTimestamp()
      };
      
      const docRef = await addDoc(collection(db, ACADEMY_COURSES_COLLECTION), newCourse);
      return docRef.id;
    } catch (error) {
      handleFirestoreError(error, OperationType.CREATE, ACADEMY_COURSES_COLLECTION);
      throw error;
    }
  },

  // Inscrire un étudiant à un cours
  async enrollStudent(courseId: string, userId: string): Promise<void> {
    try {
      const progress: Omit<StudentProgress, 'id'> = {
        userId,
        courseId,
        completedModules: [],
        currentModule: '',
        progress: 0,
        startedAt: new Date().toISOString(),
        lastAccessedAt: new Date().toISOString(),
        timeSpent: 0,
        quizScores: []
      };
      
      await addDoc(collection(db, STUDENT_PROGRESS_COLLECTION), progress);
      
      // Mettre à jour le compteur d'étudiants
      const courseRef = doc(db, ACADEMY_COURSES_COLLECTION, courseId);
      const courseDoc = await getDoc(courseRef);
      if (courseDoc.exists()) {
        const currentCount = courseDoc.data().enrolledStudents || 0;
        await updateDoc(courseRef, {
          enrolledStudents: currentCount + 1
        });
      }
    } catch (error) {
      handleFirestoreError(error, OperationType.CREATE, STUDENT_PROGRESS_COLLECTION);
      throw error;
    }
  },

  // Mettre à jour la progression d'un étudiant
  async updateStudentProgress(progressId: string, updates: Partial<StudentProgress>): Promise<void> {
    try {
      const progressRef = doc(db, STUDENT_PROGRESS_COLLECTION, progressId);
      await updateDoc(progressRef, {
        ...updates,
        lastAccessedAt: serverTimestamp()
      });
    } catch (error) {
      handleFirestoreError(error, OperationType.UPDATE, `${STUDENT_PROGRESS_COLLECTION}/${progressId}`);
      throw error;
    }
  },

  // Obtenir la progression d'un étudiant
  async getStudentProgress(userId: string, courseId: string): Promise<StudentProgress | null> {
    try {
      const q = query(
        collection(db, STUDENT_PROGRESS_COLLECTION),
        where('userId', '==', userId),
        where('courseId', '==', courseId)
      );
      
      const snapshot = await getDocs(q);
      if (snapshot.empty) return null;
      
      return { id: snapshot.docs[0].id, ...snapshot.docs[0].data() } as StudentProgress;
    } catch (error) {
      handleFirestoreError(error, OperationType.GET, STUDENT_PROGRESS_COLLECTION);
      return null;
    }
  },

  // Obtenir les statistiques d'un créateur
  async getCreatorStats(userId: string): Promise<CreatorStats | null> {
    try {
      const q = query(collection(db, CREATOR_STATS_COLLECTION), where('userId', '==', userId));
      const snapshot = await getDocs(q);
      
      if (snapshot.empty) {
        // Créer les statistiques initiales
        const initialStats: Omit<CreatorStats, 'id'> = {
          userId,
          tutorialsPublished: 0,
          totalViews: 0,
          totalLikes: 0,
          totalComments: 0,
          averageRating: 0,
          pointsEarned: 0,
          badges: [],
          level: 'Contributeur'
        };
        
        const docRef = await addDoc(collection(db, CREATOR_STATS_COLLECTION), initialStats);
        return { id: docRef.id, ...initialStats };
      }
      
      return { id: snapshot.docs[0].id, ...snapshot.docs[0].data() } as CreatorStats;
    } catch (error) {
      handleFirestoreError(error, OperationType.GET, CREATOR_STATS_COLLECTION);
      return null;
    }
  },

  // Mettre à jour les statistiques d'un créateur
  async updateCreatorStats(userId: string): Promise<void> {
    try {
      // Obtenir les tutoriels de l'utilisateur
      const tutorials = await this.getUserTutorials(userId);
      
      // Calculer les statistiques
      const tutorialsPublished = tutorials.length;
      const totalViews = tutorials.reduce((sum, tutorial) => sum + tutorial.views, 0);
      const totalLikes = tutorials.reduce((sum, tutorial) => sum + tutorial.likes, 0);
      const totalComments = tutorials.reduce((sum, tutorial) => sum + tutorial.commentsCount, 0);
      
      // Calculer la note moyenne
      let averageRating = 0;
      if (tutorials.length > 0) {
        const ratings = await Promise.all(
          tutorials.map(tutorial => this.getTutorialAverageRating(tutorial.id))
        );
        averageRating = ratings.reduce((sum, rating) => sum + rating, 0) / ratings.length;
      }
      
      // Déterminer le niveau
      let level: 'Contributeur' | 'Formateur' | 'Mentor' | 'Créateur Actif' = 'Contributeur';
      if (tutorialsPublished >= 20 && totalLikes >= 500) level = 'Créateur Actif';
      else if (tutorialsPublished >= 10 && totalLikes >= 100) level = 'Mentor';
      else if (tutorialsPublished >= 5) level = 'Formateur';
      
      // Mettre à jour les statistiques
      const statsRef = doc(db, CREATOR_STATS_COLLECTION, userId);
      const statsDoc = await getDoc(statsRef);
      
      if (statsDoc.exists()) {
        await updateDoc(statsRef, {
          tutorialsPublished,
          totalViews,
          totalLikes,
          totalComments,
          averageRating,
          level
        });
      }
    } catch (error) {
      console.error('Error updating creator stats:', error);
    }
  },

  // Récompenser un créateur
  async rewardCreator(userId: string, type: string, points: number, reason: string, relatedId?: string): Promise<void> {
    try {
      // Ajouter l'activité de contribution
      const activity: Omit<ContributionActivity, 'id'> = {
        userId,
        type: type as any,
        points,
        description: reason,
        relatedId,
        createdAt: new Date().toISOString()
      };
      
      await addDoc(collection(db, CONTRIBUTION_ACTIVITIES_COLLECTION), activity);
      
      // Mettre à jour les points de l'utilisateur
      const userRef = doc(db, 'users', userId);
      const userDoc = await getDoc(userRef);
      if (userDoc.exists()) {
        const currentPoints = userDoc.data().points || 0;
        await updateDoc(userRef, {
          points: currentPoints + points
        });
      }
      
      // Mettre à jour les statistiques du créateur
      const stats = await this.getCreatorStats(userId);
      if (stats) {
        await updateDoc(doc(db, CREATOR_STATS_COLLECTION, stats.id), {
          pointsEarned: stats.pointsEarned + points
        });
      }
    } catch (error) {
      console.error('Error rewarding creator:', error);
    }
  },

  // Vérifier et débloquer les badges
  async checkAndUnlockBadges(userId: string): Promise<void> {
    try {
      const stats = await this.getCreatorStats(userId);
      if (!stats) return;
      
      for (const badgeTemplate of ACADEMY_CREATOR_BADGES) {
        // Vérifier si l'utilisateur a déjà ce badge
        if (stats.badges.includes(badgeTemplate.name)) continue;
        
        // Vérifier les conditions
        const requirementsMet = badgeTemplate.requirements.every(req => {
          switch (req.type) {
            case 'tutorials_published':
              return stats.tutorialsPublished >= req.value;
            case 'total_likes':
              return stats.totalLikes >= req.value;
            default:
              return false;
          }
        });
        
        if (requirementsMet) {
          // Débloquer le badge
          await this.unlockBadge(userId, badgeTemplate);
        }
      }
    } catch (error) {
      console.error('Error checking badges:', error);
    }
  },

  // Débloquer un badge
  async unlockBadge(userId: string, badge: Omit<CreatorBadge, 'id'>): Promise<void> {
    try {
      const badgeId = `badge-${Date.now()}`;
      
      // Ajouter le badge aux statistiques du créateur
      const stats = await this.getCreatorStats(userId);
      if (stats) {
        await updateDoc(doc(db, CREATOR_STATS_COLLECTION, stats.id), {
          badges: arrayUnion(badge.name)
        });
      }
      
      // Récompenser l'utilisateur
      await this.rewardCreator(userId, 'BADGE', badge.points, `Badge débloqué: ${badge.name}`);
    } catch (error) {
      console.error('Error unlocking badge:', error);
    }
  },

  // Obtenir les cours académiques
  async getAcademyCourses(): Promise<AcademyCourse[]> {
    try {
      const snapshot = await getDocs(collection(db, ACADEMY_COURSES_COLLECTION));
      return snapshot.docs.map(doc => ({ 
        id: doc.id, 
        ...doc.data() 
      } as AcademyCourse));
    } catch (error) {
      handleFirestoreError(error, OperationType.GET, ACADEMY_COURSES_COLLECTION);
      return [];
    }
  },

  // Obtenir les cours par catégorie
  async getAcademyCoursesByCategory(category: string): Promise<AcademyCourse[]> {
    try {
      const q = query(
        collection(db, ACADEMY_COURSES_COLLECTION),
        where('category', '==', category),
        orderBy('enrolledStudents', 'desc')
      );
      
      const snapshot = await getDocs(q);
      return snapshot.docs.map(doc => ({ 
        id: doc.id, 
        ...doc.data() 
      } as AcademyCourse));
    } catch (error) {
      handleFirestoreError(error, OperationType.GET, ACADEMY_COURSES_COLLECTION);
      return [];
    }
  }
};
