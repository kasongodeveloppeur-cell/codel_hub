import { 
  collection, 
  doc, 
  getDocs, 
  updateDoc, 
  addDoc, 
  serverTimestamp,
  query,
  where
} from 'firebase/firestore';
import { db, handleFirestoreError, OperationType } from '../lib/firebase';
import { AppUser, Badge, EventAttendance } from '../types';

const BADGES_COLLECTION = 'badges';
const EVENT_ATTENDANCE_COLLECTION = 'event_attendance';

// Badges prédéfinis pour CODEL
export const CODEL_BADGES: Omit<Badge, 'id' | 'unlockedAt'>[] = [
  // Badges de participation
  {
    name: 'Débutant',
    description: 'Premiers pas dans CODEL',
    icon: '🌱',
    color: '#10B981',
    category: 'PARTICIPATION',
    points: 5
  },
  {
    name: 'Contributeur',
    description: 'A participé à 3 activités',
    icon: '🤝',
    color: '#3B82F6',
    category: 'PARTICIPATION',
    points: 15
  },
  {
    name: 'Développeur Actif',
    description: 'A contribué à 5 projets',
    icon: '💻',
    color: '#8B5CF6',
    category: 'PROJET',
    points: 20
  },
  {
    name: 'Mentor Étudiant',
    description: 'A aidé 10 étudiants',
    icon: '🎓',
    color: '#F59E0B',
    category: 'MENTORAT',
    points: 25
  },
  {
    name: 'Expert Technique',
    description: 'A complété 10 formations avancées',
    icon: '🏆',
    color: '#EF4444',
    category: 'FORMATION',
    points: 30
  },
  {
    name: 'Hackathon Winner',
    description: 'A gagné un hackathon',
    icon: '🥇',
    color: '#FFD700',
    category: 'EXCEPTIONNEL',
    points: 50
  },
  {
    name: 'Team Player',
    description: 'A travaillé sur 3 projets d équipe',
    icon: '👥',
    color: '#06B6D4',
    category: 'PROJET',
    points: 20
  },
  {
    name: 'Night Coder',
    description: 'A participé à 3 coding nights',
    icon: '🌙',
    color: '#6366F1',
    category: 'PARTICIPATION',
    points: 15
  }
];

export const gamificationService = {
  // Initialiser les badges dans la base de données
  async initBadges(): Promise<void> {
    try {
      const snapshot = await getDocs(collection(db, BADGES_COLLECTION));
      if (snapshot.empty) {
        for (const badge of CODEL_BADGES) {
          await addDoc(collection(db, BADGES_COLLECTION), {
            ...badge,
            createdAt: serverTimestamp()
          });
        }
      }
    } catch (error) {
      console.error('Error initializing badges:', error);
    }
  },

  // Attribuer des points à un utilisateur
  async awardPoints(userId: string, points: number, reason: string): Promise<void> {
    try {
      const userRef = doc(db, 'users', userId);
      const userDoc = await getDocs(query(collection(db, 'users'), where('__name__', '==', userId)));
      
      if (!userDoc.empty) {
        const currentPoints = (userDoc.docs[0].data() as AppUser).points || 0;
        await updateDoc(userRef, {
          points: currentPoints + points,
          lastPointsAwarded: serverTimestamp(),
          lastPointsReason: reason
        });
      }
    } catch (error) {
      handleFirestoreError(error, OperationType.UPDATE, `users/${userId}/points`);
    }
  },

  // Débloquer un badge pour un utilisateur
  async unlockBadge(userId: string, badgeId: string): Promise<void> {
    try {
      const userRef = doc(db, 'users', userId);
      const userDoc = await getDocs(query(collection(db, 'users'), where('__name__', '==', userId)));
      
      if (!userDoc.empty) {
        const user = userDoc.docs[0].data() as AppUser;
        const badge = CODEL_BADGES.find(b => b.name === badgeId);
        
        if (badge && !user.badges.some(b => b.name === badge.name)) {
          const newBadge: Badge = {
            ...badge,
            id: badgeId,
            unlockedAt: new Date().toISOString()
          };
          
          await updateDoc(userRef, {
            badges: [...user.badges, newBadge]
          });
          
          // Attribuer les points du badge
          await this.awardPoints(userId, badge.points, `Badge débloqué: ${badge.name}`);
        }
      }
    } catch (error) {
      handleFirestoreError(error, OperationType.UPDATE, `users/${userId}/badges`);
    }
  },

  // Enregistrer la présence à un événement avec QR code
  async checkInEvent(userId: string, eventId: string, qrCodeData: string): Promise<boolean> {
    try {
      // Vérifier si le QR code est valide
      const isValidQR = await this.validateQRCode(qrCodeData, eventId);
      if (!isValidQR) {
        return false;
      }

      // Vérifier si l'utilisateur n'est pas déjà enregistré
      const existingCheckIn = await getDocs(
        query(
          collection(db, EVENT_ATTENDANCE_COLLECTION),
          where('eventId', '==', eventId),
          where('userId', '==', userId)
        )
      );

      if (!existingCheckIn.empty) {
        return false; // Déjà enregistré
      }

      // Enregistrer la présence
      const attendance: EventAttendance = {
        id: '', // Sera généré par Firestore
        eventId,
        userId,
        checkedInAt: new Date().toISOString(),
        qrCodeScanned: true,
        pointsAwarded: 5 // Points par défaut pour présence
      };

      await addDoc(collection(db, EVENT_ATTENDANCE_COLLECTION), attendance);

      // Attribuer les points de présence
      await this.awardPoints(userId, 5, `Présence à l'événement: ${eventId}`);

      // Vérifier si l'utilisateur débloque le badge "Night Coder" ou "Débutant"
      await this.checkAndUnlockAttendanceBadges(userId);

      return true;
    } catch (error) {
      handleFirestoreError(error, OperationType.CREATE, EVENT_ATTENDANCE_COLLECTION);
      return false;
    }
  },

  // Valider un QR code
  async validateQRCode(qrCodeData: string, eventId: string): Promise<boolean> {
    try {
      // Logique de validation du QR code
      // Pour l'instant, validation simple - à améliorer avec cryptage
      const data = JSON.parse(qrCodeData);
      return data.eventId === eventId && 
             Date.now() - new Date(data.timestamp).getTime() < 3600000; // Valide 1 heure
    } catch (error) {
      return false;
    }
  },

  // Vérifier et débloquer les badges liés à la participation
  async checkAndUnlockAttendanceBadges(userId: string): Promise<void> {
    try {
      const attendanceRecords = await getDocs(
        query(collection(db, EVENT_ATTENDANCE_COLLECTION), where('userId', '==', userId))
      );

      const attendanceCount = attendanceRecords.size;

      // Badge Débutant (première participation)
      if (attendanceCount === 1) {
        await this.unlockBadge(userId, 'Débutant');
      }

      // Badge Contributeur (3 participations)
      if (attendanceCount === 3) {
        await this.unlockBadge(userId, 'Contributeur');
      }

      // Badge Night Coder (3 coding nights)
      const codingNightAttendances = attendanceRecords.docs.filter(doc => {
        const data = doc.data() as EventAttendance;
        return data.eventId.includes('CODING_NIGHT');
      });

      if (codingNightAttendances.length === 3) {
        await this.unlockBadge(userId, 'Night Coder');
      }
    } catch (error) {
      console.error('Error checking attendance badges:', error);
    }
  },

  // Attribuer des points pour complétion de module
  async completeModule(userId: string, moduleId: string, difficulty: string): Promise<void> {
    const pointsMap = {
      'Débutant': 10,
      'Intermédiaire': 15,
      'Avancé': 20
    };

    const points = pointsMap[difficulty as keyof typeof pointsMap] || 10;
    await this.awardPoints(userId, points, `Module complété: ${moduleId}`);

    // Vérifier le badge "Expert Technique"
    await this.checkExpertBadge(userId);
  },

  // Attribuer des points pour contribution à un projet
  async contributeToProject(userId: string, projectId: string): Promise<void> {
    await this.awardPoints(userId, 20, `Contribution au projet: ${projectId}`);
    
    // Vérifier les badges de projet
    await this.checkProjectBadges(userId);
  },

  // Vérifier le badge "Expert Technique"
  async checkExpertBadge(userId: string): Promise<void> {
    try {
      const userDoc = await getDocs(query(collection(db, 'users'), where('__name__', '==', userId)));
      if (!userDoc.empty) {
        const user = userDoc.docs[0].data() as AppUser;
        const completedModules = user.completedModules || [];
        
        if (completedModules.length >= 10) {
          await this.unlockBadge(userId, 'Expert Technique');
        }
      }
    } catch (error) {
      console.error('Error checking expert badge:', error);
    }
  },

  // Vérifier les badges de projet
  async checkProjectBadges(userId: string): Promise<void> {
    try {
      const userDoc = await getDocs(query(collection(db, 'users'), where('__name__', '==', userId)));
      if (!userDoc.empty) {
        const user = userDoc.docs[0].data() as AppUser;
        const projectsContributed = user.projectsContributed || [];
        
        // Badge "Développeur Actif"
        if (projectsContributed.length >= 5) {
          await this.unlockBadge(userId, 'Développeur Actif');
        }

        // Badge "Team Player" (à vérifier avec les projets d'équipe)
        if (projectsContributed.length >= 3) {
          await this.unlockBadge(userId, 'Team Player');
        }
      }
    } catch (error) {
      console.error('Error checking project badges:', error);
    }
  },

  // Obtenir le classement des utilisateurs
  async getLeaderboard(limit: number = 10): Promise<Array<{user: AppUser, rank: number}>> {
    try {
      const usersSnapshot = await getDocs(collection(db, 'users'));
      const users = usersSnapshot.docs.map(doc => ({ 
        id: doc.id, 
        ...doc.data() 
      } as AppUser));

      // Trier par points décroissants
      const sortedUsers = users.sort((a, b) => b.points - a.points);
      
      return sortedUsers.slice(0, limit).map((user, index) => ({
        user,
        rank: index + 1
      }));
    } catch (error) {
      handleFirestoreError(error, OperationType.GET, 'users/leaderboard');
      return [];
    }
  }
};
