import * as QRCode from 'qrcode';
import { Event, QRCodeData, EventAttendance } from '../types';
import { db, handleFirestoreError, OperationType } from '../lib/firebase';
import { 
  collection, 
  doc, 
  addDoc, 
  serverTimestamp,
  query,
  where,
  getDocs,
  updateDoc,
  deleteDoc
} from 'firebase/firestore';

const QR_CODES_COLLECTION = 'qr_codes';
const EVENT_ATTENDANCE_COLLECTION = 'event_attendance';

export const qrCodeService = {
  // Générer un QR code pour un événement
  async generateEventQRCode(event: Event): Promise<string> {
    try {
      const qrData: QRCodeData = {
        eventId: event.id,
        timestamp: new Date().toISOString(),
        location: event.location,
        secret: this.generateSecret()
      };

      const qrCodeDataUrl = await QRCode.toDataURL(JSON.stringify(qrData), {
        width: 300,
        margin: 2,
        color: {
          dark: '#000000',
          light: '#FFFFFF'
        }
      });

      // Sauvegarder le QR code dans Firestore
      await addDoc(collection(db, QR_CODES_COLLECTION), {
        eventId: event.id,
        qrData: JSON.stringify(qrData),
        qrCodeUrl: qrCodeDataUrl,
        createdAt: serverTimestamp(),
        expiresAt: new Date(Date.now() + 24 * 60 * 60 * 1000) // Expire dans 24h
      });

      return qrCodeDataUrl;
    } catch (error) {
      handleFirestoreError(error, OperationType.CREATE, QR_CODES_COLLECTION);
      throw error;
    }
  },

  // Valider un QR code scanné
  async validateQRCode(qrCodeData: string, userId: string): Promise<{
    isValid: boolean;
    event?: Event;
    pointsAwarded?: number;
    message: string;
  }> {
    try {
      const data: QRCodeData = JSON.parse(qrCodeData);
      
      // Vérifier si le QR code n'est pas expiré
      const qrAge = Date.now() - new Date(data.timestamp).getTime();
      if (qrAge > 24 * 60 * 60 * 1000) { // 24 heures
        return {
          isValid: false,
          message: 'QR code expiré'
        };
      }

      // Récupérer l'événement
      const eventDoc = await getDocs(query(collection(db, 'events'), where('__name__', '==', data.eventId)));
      if (eventDoc.empty) {
        return {
          isValid: false,
          message: 'Événement non trouvé'
        };
      }

      const event = eventDoc.docs[0].data() as Event;

      // Vérifier si l'utilisateur n'a pas déjà scanné ce QR code
      const existingAttendance = await getDocs(
        query(
          collection(db, EVENT_ATTENDANCE_COLLECTION),
          where('eventId', '==', data.eventId),
          where('userId', '==', userId)
        )
      );

      if (!existingAttendance.empty) {
        return {
          isValid: false,
          message: 'Présence déjà enregistrée pour cet événement'
        };
      }

      // Enregistrer la présence
      const attendance: EventAttendance = {
        id: '', // Sera généré par Firestore
        eventId: data.eventId,
        userId,
        checkedInAt: new Date().toISOString(),
        qrCodeScanned: true,
        pointsAwarded: event.pointsReward
      };

      await addDoc(collection(db, EVENT_ATTENDANCE_COLLECTION), attendance);

      // Mettre à jour le nombre de participants
      const eventRef = doc(db, 'events', data.eventId);
      await updateDoc(eventRef, {
        registered: event.registered + 1
      });

      return {
        isValid: true,
        event,
        pointsAwarded: event.pointsReward,
        message: `Présence confirmée pour ${event.title}! +${event.pointsReward} points`
      };
    } catch (error) {
      return {
        isValid: false,
        message: 'Erreur lors de la validation du QR code'
      };
    }
  },

  // Obtenir les QR codes actifs pour un événement
  async getEventQRCodes(eventId: string): Promise<Array<{
    id: string;
    qrCodeUrl: string;
    createdAt: string;
    expiresAt: string;
  }>> {
    try {
      const snapshot = await getDocs(query(collection(db, QR_CODES_COLLECTION), where('eventId', '==', eventId)));
      return snapshot.docs.map(doc => {
        const data = doc.data();
        return {
          id: doc.id,
          qrCodeUrl: data.qrCodeUrl,
          createdAt: data.createdAt?.toDate().toISOString() || '',
          expiresAt: data.expiresAt?.toDate().toISOString() || ''
        };
      });
    } catch (error) {
      handleFirestoreError(error, OperationType.GET, QR_CODES_COLLECTION);
      return [];
    }
  },

  // Obtenir l'historique des présences d'un utilisateur
  async getUserAttendanceHistory(userId: string): Promise<EventAttendance[]> {
    try {
      const snapshot = await getDocs(query(collection(db, EVENT_ATTENDANCE_COLLECTION), where('userId', '==', userId)));
      return snapshot.docs.map(doc => ({
        id: doc.id,
        ...doc.data()
      } as EventAttendance));
    } catch (error) {
      handleFirestoreError(error, OperationType.GET, EVENT_ATTENDANCE_COLLECTION);
      return [];
    }
  },

  // Obtenir les statistiques de présence pour un événement
  async getEventAttendanceStats(eventId: string): Promise<{
    totalCheckedIn: number;
    uniqueUsers: number;
    averageCheckInTime: string;
  }> {
    try {
      const snapshot = await getDocs(query(collection(db, EVENT_ATTENDANCE_COLLECTION), where('eventId', '==', eventId)));
      const attendances = snapshot.docs.map(doc => doc.data() as EventAttendance);

      const uniqueUsers = new Set(attendances.map(a => a.userId)).size;
      const totalCheckedIn = attendances.length;

      // Calculer l'heure moyenne de check-in
      if (attendances.length === 0) {
        return {
          totalCheckedIn: 0,
          uniqueUsers: 0,
          averageCheckInTime: 'N/A'
        };
      }

      const checkInTimes = attendances.map(a => new Date(a.checkedInAt).getHours() + new Date(a.checkedInAt).getMinutes() / 60);
      const averageTime = checkInTimes.reduce((sum, time) => sum + time, 0) / checkInTimes.length;
      const hours = Math.floor(averageTime);
      const minutes = Math.round((averageTime - hours) * 60);

      return {
        totalCheckedIn,
        uniqueUsers,
        averageCheckInTime: `${hours.toString().padStart(2, '0')}:${minutes.toString().padStart(2, '0')}`
      };
    } catch (error) {
      handleFirestoreError(error, OperationType.GET, EVENT_ATTENDANCE_COLLECTION);
      return {
        totalCheckedIn: 0,
        uniqueUsers: 0,
        averageCheckInTime: 'N/A'
      };
    }
  },

  // Nettoyer les QR codes expirés
  async cleanupExpiredQRCodes(): Promise<void> {
    try {
      const now = new Date();
      const snapshot = await getDocs(collection(db, QR_CODES_COLLECTION));
      
      const expiredCodes = snapshot.docs.filter(doc => {
        const expiresAt = doc.data().expiresAt?.toDate();
        return expiresAt && expiresAt < now;
      });

      for (const doc of expiredCodes) {
        await deleteDoc(doc.ref);
      }
    } catch (error) {
      console.error('Error cleaning up expired QR codes:', error);
    }
  },

  // Générer un secret pour le QR code
  generateSecret(): string {
    const chars = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789';
    let secret = '';
    for (let i = 0; i < 16; i++) {
      secret += chars.charAt(Math.floor(Math.random() * chars.length));
    }
    return secret;
  },

  // Vérifier si un QR code est valide sans l'utiliser
  async checkQRCodeValidity(qrCodeData: string): Promise<{
    isValid: boolean;
    event?: Event;
    message: string;
  }> {
    try {
      const data: QRCodeData = JSON.parse(qrCodeData);
      
      // Vérifier l'âge du QR code
      const qrAge = Date.now() - new Date(data.timestamp).getTime();
      if (qrAge > 24 * 60 * 60 * 1000) {
        return {
          isValid: false,
          message: 'QR code expiré'
        };
      }

      // Vérifier l'événement
      const eventDoc = await getDocs(query(collection(db, 'events'), where('__name__', '==', data.eventId)));
      if (eventDoc.empty) {
        return {
          isValid: false,
          message: 'Événement non trouvé'
        };
      }

      return {
        isValid: true,
        event: eventDoc.docs[0].data() as Event,
        message: 'QR code valide'
      };
    } catch (error) {
      return {
        isValid: false,
        message: 'QR code invalide'
      };
    }
  }
};
