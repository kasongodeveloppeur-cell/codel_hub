import { collection, query, where, getDocs, addDoc, serverTimestamp, onSnapshot, orderBy, limit, doc, updateDoc, deleteDoc, getDoc } from 'firebase/firestore';
import { db } from '../lib/firebase';
import { AppUser } from '../types';

// Types pour les notifications
export interface Notification {
  id: string;
  userId: string;
  title: string;
  message: string;
  type: 'security' | 'project' | 'education' | 'community' | 'system' | 'achievement';
  priority: 'low' | 'medium' | 'high' | 'urgent';
  isRead: boolean;
  createdAt: string;
  readAt?: string;
  actionUrl?: string;
  actionText?: string;
  metadata?: Record<string, any>;
}

export interface NotificationPreferences {
  securityAlerts: boolean;
  projectUpdates: boolean;
  educationUpdates: boolean;
  communityActivity: boolean;
  achievements: boolean;
  systemUpdates: boolean;
  emailNotifications: boolean;
  pushNotifications: boolean;
  dailyDigest: boolean;
  weeklyDigest: boolean;
}

export const notificationService = {
  /**
   * Crée une notification pour un utilisateur
   */
  async createNotification(userId: string, notification: Omit<Notification, 'id' | 'createdAt' | 'isRead'>): Promise<string> {
    try {
      const notificationData = {
        ...notification,
        userId,
        isRead: false,
        createdAt: serverTimestamp()
      };
      
      const docRef = await addDoc(collection(db, 'notifications'), notificationData);
      console.log(`Notification created: ${docRef.id}`);
      return docRef.id;
    } catch (error) {
      console.error('Error creating notification:', error);
      throw error;
    }
  },

  /**
   * Récupère les notifications non lues pour un utilisateur
   */
  async getUnreadNotifications(userId: string, limitCount: number = 20): Promise<Notification[]> {
    try {
      const q = query(
        collection(db, 'notifications'),
        where('userId', '==', userId),
        where('isRead', '==', false),
        orderBy('createdAt', 'desc'),
        limit(limitCount)
      );
      
      const snapshot = await getDocs(q);
      return snapshot.docs.map(doc => ({
        id: doc.id,
        ...doc.data()
      } as Notification));
    } catch (error) {
      console.error('Error fetching unread notifications:', error);
      return [];
    }
  },

  /**
   * Marque une notification comme lue
   */
  async markAsRead(notificationId: string): Promise<void> {
    try {
      const notificationRef = doc(db, 'notifications', notificationId);
      await updateDoc(notificationRef, {
        isRead: true,
        readAt: serverTimestamp()
      });
    } catch (error) {
      console.error('Error marking notification as read:', error);
      throw error;
    }
  },

  /**
   * Marque toutes les notifications d'un utilisateur comme lues
   */
  async markAllAsRead(userId: string): Promise<void> {
    try {
      const q = query(
        collection(db, 'notifications'),
        where('userId', '==', userId),
        where('isRead', '==', false)
      );
      
      const snapshot = await getDocs(q);
      const updatePromises = snapshot.docs.map(doc => 
        updateDoc(doc.ref, {
          isRead: true,
          readAt: serverTimestamp()
        })
      );
      
      await Promise.all(updatePromises);
    } catch (error) {
      console.error('Error marking all notifications as read:', error);
      throw error;
    }
  },

  /**
   * Supprime une notification
   */
  async deleteNotification(notificationId: string): Promise<void> {
    try {
      await deleteDoc(doc(db, 'notifications', notificationId));
    } catch (error) {
      console.error('Error deleting notification:', error);
      throw error;
    }
  },

  /**
   * Écoute les notifications en temps réel pour un utilisateur
   */
  listenToNotifications(userId: string, callback: (notifications: Notification[]) => void): () => void {
    const q = query(
      collection(db, 'notifications'),
      where('userId', '==', userId),
      orderBy('createdAt', 'desc'),
      limit(50)
    );
    
    const unsubscribe = onSnapshot(q, (snapshot) => {
      const notifications = snapshot.docs.map(doc => ({
        id: doc.id,
        ...doc.data()
      } as Notification));
      callback(notifications);
    });
    
    return unsubscribe;
  },

  /**
   * Notifie les utilisateurs de nouveaux achievements
   */
  async notifyAchievement(userId: string, achievement: string, points: number): Promise<void> {
    try {
      await this.createNotification(userId, {
        title: '🏆 Nouvel Achievement!',
        message: `Félicitations! Vous avez débloqué: ${achievement} (+${points} points)`,
        type: 'achievement',
        priority: 'medium',
        actionUrl: '/profile',
        actionText: 'Voir mon profil',
        metadata: { achievement, points }
      });
    } catch (error) {
      console.error('Error sending achievement notification:', error);
    }
  },

  /**
   * Notifie les mises à jour éducatives
   */
  async notifyEducationUpdate(userId: string, courseName: string, updateType: string): Promise<void> {
    try {
      await this.createNotification(userId, {
        title: '📚 Mise à jour éducative',
        message: `Nouveau contenu disponible pour: ${courseName}`,
        type: 'education',
        priority: 'low',
        actionUrl: '/education',
        actionText: 'Voir les cours',
        metadata: { courseName, updateType }
      });
    } catch (error) {
      console.error('Error sending education notification:', error);
    }
  },

  /**
   * Notifie l'activité communautaire
   */
  async notifyCommunityActivity(userId: string, activity: string, authorName: string): Promise<void> {
    try {
      await this.createNotification(userId, {
        title: '💬 Activité communautaire',
        message: `${authorName} a publié: ${activity}`,
        type: 'community',
        priority: 'low',
        actionUrl: '/community',
        actionText: 'Voir la discussion',
        metadata: { activity, authorName }
      });
    } catch (error) {
      console.error('Error sending community notification:', error);
    }
  },

  /**
   * Notifie les mises à jour système
   */
  async notifySystemUpdate(title: string, message: string, priority: 'low' | 'medium' | 'high' | 'urgent' = 'medium'): Promise<void> {
    try {
      const usersRef = collection(db, 'users');
      const q = query(usersRef, where('notificationPreferences.systemUpdates', '==', true));
      const snapshot = await getDocs(q);
      
      const notificationPromises = snapshot.docs.map((doc: any) => {
        const user = doc.data() as AppUser;
        return this.createNotification(user.id, {
          title: `🔔 ${title}`,
          message,
          type: 'system',
          priority,
          actionUrl: '/about',
          actionText: 'En savoir plus'
        });
      });

      await Promise.all(notificationPromises);
    } catch (error) {
      console.error('Error sending system notifications:', error);
    }
  },
  /**
   * Simulates sending an email notification.
   * In a real production environment, this would call a backend API (like SendGrid or AWS SES)
   * or trigger a Firebase Cloud Function.
   */
  async sendEmail(to: string, subject: string, body: string) {
    // Log the email "sending"
    console.log(`[EMAIL_SERVICE] Sending to: ${to}`);
    console.log(`[EMAIL_SERVICE] Subject: ${subject}`);
    console.log(`[EMAIL_SERVICE] Body: ${body}`);
    
    // Simulate API call
    return new Promise((resolve) => setTimeout(resolve, 500));
  },

  /**
   * Notifies all users who have subscribed to security alerts.
   */
  async notifySecurityAlert(title: string, message: string) {
    try {
      const usersRef = collection(db, 'users');
      // Query users with securityAlerts enabled
      const q = query(usersRef, where('notificationPreferences.securityAlerts', '==', true));
      const snapshot = await getDocs(q);
      
      const emailPromises = snapshot.docs.map((doc: any) => {
        const user = doc.data() as AppUser;
        return this.sendEmail(
          user.email,
          `[SECURITY ALERT] ${title}`,
          `Hello ${user.name},\n\nA security event has been detected: ${message}\n\nPlease check your security logs for more details.`
        );
      });

      await Promise.all(emailPromises);
    } catch (error) {
      console.error('Error sending security notifications:', error);
    }
  },

  /**
   * Notifies all users who have subscribed to project updates.
   */
  async notifyProjectUpdate(projectName: string, updateMessage: string) {
    try {
      const usersRef = collection(db, 'users');
      // Query users with projectUpdates enabled
      const q = query(usersRef, where('notificationPreferences.projectUpdates', '==', true));
      const snapshot = await getDocs(q);
      
      const emailPromises = snapshot.docs.map((doc: any) => {
        const user = doc.data() as AppUser;
        return this.sendEmail(
          user.email,
          `[PROJECT UPDATE] ${projectName}`,
          `Hello ${user.name},\n\nThe project "${projectName}" has a new update:\n\n${updateMessage}\n\nStay connected.`
        );
      });

      await Promise.all(emailPromises);
    } catch (error) {
      console.error('Error sending project notifications:', error);
    }
  },

  /**
   * Génère le digest quotidien des notifications
   */
  async generateDailyDigest(userId: string): Promise<void> {
    try {
      const startOfDay = new Date();
      startOfDay.setHours(0, 0, 0, 0);
      
      const q = query(
        collection(db, 'notifications'),
        where('userId', '==', userId),
        where('createdAt', '>=', startOfDay),
        orderBy('createdAt', 'desc')
      );
      
      const snapshot = await getDocs(q);
      const notifications = snapshot.docs.map(doc => doc.data() as Notification);
      
      if (notifications.length > 0) {
        const digestContent = notifications.map(n => 
          `• ${n.title}: ${n.message}`
        ).join('\n');
        
        // Récupérer l'email de l'utilisateur
        const userDoc = await getDoc(doc(db, 'users', userId));
        if (userDoc.exists()) {
          const user = userDoc.data() as AppUser;
          await this.sendEmail(
            user.email,
            '[CODEL HUB] Daily Digest',
            `Hello ${user.name},\n\nHere's your daily digest:\n\n${digestContent}\n\nBest regards,\nCODEL Hub Team`
          );
        }
      }
    } catch (error) {
      console.error('Error generating daily digest:', error);
    }
  },

  /**
   * Compte les notifications non lues
   */
  async getUnreadCount(userId: string): Promise<number> {
    try {
      const q = query(
        collection(db, 'notifications'),
        where('userId', '==', userId),
        where('isRead', '==', false)
      );
      
      const snapshot = await getDocs(q);
      return snapshot.size;
    } catch (error) {
      console.error('Error getting unread count:', error);
      return 0;
    }
  }
};
