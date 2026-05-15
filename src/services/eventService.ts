import { 
  collection, 
  query, 
  orderBy, 
  getDocs, 
  addDoc, 
  serverTimestamp,
  doc,
  updateDoc,
  increment
} from 'firebase/firestore';
import { db, handleFirestoreError, OperationType } from '../lib/firebase';
import { Event } from '../types';

const COLLECTION = 'events';

export const eventService = {
  async getEvents(): Promise<Event[]> {
    try {
      const q = query(collection(db, COLLECTION), orderBy('date', 'asc'));
      const snapshot = await getDocs(q);
      return snapshot.docs.map((doc: any) => ({ id: doc.id, ...doc.data() } as Event));
    } catch (error) {
      handleFirestoreError(error, OperationType.GET, COLLECTION);
      return [];
    }
  },

  async registerForEvent(eventId: string): Promise<void> {
    try {
      const docRef = doc(db, COLLECTION, eventId);
      await updateDoc(docRef, {
        registered: increment(1)
      });
    } catch (error) {
      handleFirestoreError(error, OperationType.WRITE, COLLECTION);
    }
  },

  async initEvents(initialEvents: Event[]): Promise<void> {
    try {
      const snapshot = await getDocs(collection(db, COLLECTION));
      if (snapshot.empty) {
        for (const event of initialEvents) {
          const { id, ...data } = event;
          await addDoc(collection(db, COLLECTION), {
            ...data,
            createdAt: serverTimestamp()
          });
        }
      }
    } catch (error) {
      console.error('Error initializing events:', error);
    }
  }
};
