import { 
  collection, 
  query, 
  orderBy, 
  getDocs, 
  addDoc, 
  serverTimestamp,
  doc,
  updateDoc,
  deleteDoc,
  where
} from 'firebase/firestore';
import { db, handleFirestoreError, OperationType } from '../lib/firebase';
import { Project } from '../types';
import { notificationService } from './notificationService';

const COLLECTION = 'projects';

export const projectService = {
  async getProjects(): Promise<Project[]> {
    try {
      const q = query(collection(db, COLLECTION), orderBy('progress', 'desc'));
      const snapshot = await getDocs(q);
      return snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() } as Project));
    } catch (error) {
      handleFirestoreError(error, OperationType.GET, COLLECTION);
      return [];
    }
  },

  async createProject(project: Omit<Project, 'id'>, authorId: string): Promise<string> {
    try {
      const docRef = await addDoc(collection(db, COLLECTION), {
        ...project,
        authorId,
        createdAt: serverTimestamp()
      });

      // Trigger notification
      notificationService.notifyProjectUpdate(
        project.title, 
        `Un nouveau projet a été initialisé sur la grille par un contributeur actif.`
      );

      return docRef.id;
    } catch (error) {
      handleFirestoreError(error, OperationType.CREATE, COLLECTION);
      throw error;
    }
  },

  async initProjects(initialProjects: Project[], authorId: string): Promise<void> {
    try {
      const snapshot = await getDocs(collection(db, COLLECTION));
      if (snapshot.empty) {
        for (const project of initialProjects) {
          const { id, ...data } = project;
          await addDoc(collection(db, COLLECTION), {
            ...data,
            authorId,
            createdAt: serverTimestamp()
          });
        }
      }
    } catch (error) {
      console.error('Error initializing projects:', error);
    }
  }
};
