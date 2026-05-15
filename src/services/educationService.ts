import { 
  collection, 
  query, 
  orderBy, 
  getDocs, 
  addDoc, 
  serverTimestamp,
  doc,
  updateDoc
} from 'firebase/firestore';
import { db, handleFirestoreError, OperationType } from '../lib/firebase';
import { LearningPath, Module } from '../types';

const PATHS_COLLECTION = 'learning_paths';

export const educationService = {
  async getLearningPaths(): Promise<LearningPath[]> {
    try {
      const q = query(collection(db, PATHS_COLLECTION), orderBy('title', 'asc'));
      const snapshot = await getDocs(q);
      return snapshot.docs.map((doc: any) => ({ id: doc.id, ...doc.data() } as LearningPath));
    } catch (error) {
      handleFirestoreError(error, OperationType.GET, PATHS_COLLECTION);
      return [];
    }
  },

  async getModules(pathId: string): Promise<Module[]> {
    try {
      const modulesRef = collection(db, PATHS_COLLECTION, pathId, 'modules');
      const q = query(modulesRef, orderBy('order', 'asc'));
      const snapshot = await getDocs(q);
      return snapshot.docs.map((doc: any) => ({ id: doc.id, ...doc.data() } as Module));
    } catch (error) {
      handleFirestoreError(error, OperationType.GET, `${PATHS_COLLECTION}/${pathId}/modules`);
      return [];
    }
  },

  async initEducation(path: LearningPath, modules: Module[]): Promise<void> {
    try {
      const snapshot = await getDocs(collection(db, PATHS_COLLECTION));
      if (snapshot.empty) {
        const { id, ...pathData } = path;
        const pathDoc = await addDoc(collection(db, PATHS_COLLECTION), {
          ...pathData,
          createdAt: serverTimestamp()
        });

        const modulesRef = collection(db, PATHS_COLLECTION, pathDoc.id, 'modules');
        for (let i = 0; i < modules.length; i++) {
          const { id: mid, ...modData } = modules[i];
          await addDoc(modulesRef, {
            ...modData,
            order: i,
            createdAt: serverTimestamp()
          });
        }
      }
    } catch (error) {
      console.error('Error initializing education data:', error);
    }
  }
};
