import { 
  collection, 
  query, 
  orderBy, 
  limit, 
  onSnapshot, 
  addDoc, 
  serverTimestamp 
} from 'firebase/firestore';
import { db, handleFirestoreError, OperationType } from '../lib/firebase';

const COLLECTION = 'chat_messages';

export type ChatMessage = {
  id: string;
  text: string;
  author: string;
  authorId: string;
  avatar: string;
  timestamp: any;
};

export const chatService = {
  subscribeToMessages(callback: (messages: ChatMessage[]) => void) {
    const q = query(
      collection(db, COLLECTION), 
      orderBy('timestamp', 'desc'),
      limit(50)
    );

    return onSnapshot(q, (snapshot) => {
      const messages = snapshot.docs.map((doc: any) => ({
        id: doc.id,
        ...doc.data()
      } as ChatMessage)).reverse();
      callback(messages);
    }, (error: any) => {
      handleFirestoreError(error, OperationType.GET, COLLECTION);
    });
  },

  async sendMessage(message: { text: string; author: string; authorId: string; avatar: string }) {
    try {
      await addDoc(collection(db, COLLECTION), {
        ...message,
        timestamp: serverTimestamp()
      });
    } catch (error) {
      handleFirestoreError(error, OperationType.CREATE, COLLECTION);
    }
  }
};
