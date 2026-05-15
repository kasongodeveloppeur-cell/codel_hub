import { 
  collection, 
  query, 
  where, 
  orderBy, 
  addDoc, 
  getDocs, 
  onSnapshot, 
  serverTimestamp, 
  doc, 
  updateDoc, 
  deleteDoc,
  getDoc,
  increment
} from 'firebase/firestore';
import { db, handleFirestoreError, OperationType } from '../lib/firebase';
import { ForumTopic, ForumThread, ForumComment } from '../types';

const TOPICS_COLLECTION = 'forum_topics';
const THREADS_COLLECTION = 'forum_threads';
const COMMENTS_COLLECTION = 'forum_comments';

export const forumService = {
  // Topics
  async getTopics(): Promise<ForumTopic[]> {
    try {
      const q = query(collection(db, TOPICS_COLLECTION), orderBy('title', 'asc'));
      const snapshot = await getDocs(q);
      return snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() } as ForumTopic));
    } catch (error) {
      handleFirestoreError(error, OperationType.GET, TOPICS_COLLECTION);
      return [];
    }
  },

  // Threads
  async getThreads(topicId: string): Promise<ForumThread[]> {
    try {
      const q = query(
        collection(db, THREADS_COLLECTION), 
        where('topicId', '==', topicId),
        orderBy('createdAt', 'desc')
      );
      const snapshot = await getDocs(q);
      return snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() } as ForumThread));
    } catch (error) {
      handleFirestoreError(error, OperationType.GET, THREADS_COLLECTION);
      return [];
    }
  },

  async createThread(thread: Omit<ForumThread, 'id' | 'createdAt' | 'views' | 'repliesCount'>): Promise<string> {
    try {
      const docRef = await addDoc(collection(db, THREADS_COLLECTION), {
        ...thread,
        createdAt: serverTimestamp(),
        views: 0,
        repliesCount: 0
      });
      
      // Update thread count in topic (ideally via Cloud Function, but doing it here for simplicity)
      const topicRef = doc(db, TOPICS_COLLECTION, thread.topicId);
      await updateDoc(topicRef, {
        threadsCount: increment(1),
        lastUpdated: serverTimestamp()
      });

      return docRef.id;
    } catch (error) {
      handleFirestoreError(error, OperationType.CREATE, THREADS_COLLECTION);
      throw error;
    }
  },

  async getThread(threadId: string): Promise<ForumThread | null> {
    try {
      const docRef = doc(db, THREADS_COLLECTION, threadId);
      const docSnap = await getDoc(docRef);
      if (docSnap.exists()) {
        // Increment views
        await updateDoc(docRef, { views: increment(1) });
        return { id: docSnap.id, ...docSnap.data() } as ForumThread;
      }
      return null;
    } catch (error) {
      handleFirestoreError(error, OperationType.GET, THREADS_COLLECTION);
      return null;
    }
  },

  // Comments
  async getComments(threadId: string): Promise<ForumComment[]> {
    try {
      const q = query(
        collection(db, COMMENTS_COLLECTION), 
        where('threadId', '==', threadId),
        orderBy('createdAt', 'asc')
      );
      const snapshot = await getDocs(q);
      return snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() } as ForumComment));
    } catch (error) {
      handleFirestoreError(error, OperationType.GET, COMMENTS_COLLECTION);
      return [];
    }
  },

  async addComment(comment: Omit<ForumComment, 'id' | 'createdAt'>): Promise<string> {
    try {
      const docRef = await addDoc(collection(db, COMMENTS_COLLECTION), {
        ...comment,
        createdAt: serverTimestamp()
      });

      // Update replies count in thread
      const threadRef = doc(db, THREADS_COLLECTION, comment.threadId);
      await updateDoc(threadRef, {
        repliesCount: increment(1)
      });

      return docRef.id;
    } catch (error) {
      handleFirestoreError(error, OperationType.CREATE, COMMENTS_COLLECTION);
      throw error;
    }
  },

  async initForumTopics(): Promise<void> {
    try {
      const snapshot = await getDocs(collection(db, TOPICS_COLLECTION));
      if (snapshot.empty) {
        const initialTopics: Omit<ForumTopic, 'id'>[] = [
          { title: 'Discussions Générales', description: 'Tech, carrière, et vie du club au quotidien.', threadsCount: 0, lastUpdated: new Date().toISOString(), category: 'General', icon: 'MessageSquare' },
          { title: 'Aide & Debugging', description: 'Bloqué sur un bug ? Besoin d\'une revue de code ? Postez ici.', threadsCount: 0, lastUpdated: new Date().toISOString(), category: 'Help', icon: 'HelpCircle' },
          { title: 'Showcase Projets', description: 'Partagez vos créations et obtenez des retours constructifs.', threadsCount: 0, lastUpdated: new Date().toISOString(), category: 'Showcase', icon: 'Share2' }
        ];
        
        for (const topic of initialTopics) {
          await addDoc(collection(db, TOPICS_COLLECTION), {
            ...topic,
            lastUpdated: serverTimestamp()
          });
        }
      }
    } catch (error) {
      console.error('Error initializing topics:', error);
    }
  }
};
