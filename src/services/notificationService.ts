import { collection, query, where, getDocs } from 'firebase/firestore';
import { db } from '../lib/firebase';
import { AppUser } from '../types';

export const notificationService = {
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
  }
};
