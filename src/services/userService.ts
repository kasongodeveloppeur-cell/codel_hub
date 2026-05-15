import { collection, doc, getDocs, updateDoc } from 'firebase/firestore';
import { db, handleFirestoreError, OperationType } from '../lib/firebase';
import { AppUser } from '../types';

export const updateUserProfile = async (userId: string, data: Partial<AppUser>) => {
  const userRef = doc(db, 'users', userId);
  try {
    await updateDoc(userRef, data);
  } catch (error) {
    handleFirestoreError(error, OperationType.WRITE, `users/${userId}`);
  }
};

export const getAllUsers = async (): Promise<AppUser[]> => {
  const usersRef = collection(db, 'users');
  try {
    const snapshot = await getDocs(usersRef);
    return snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() } as AppUser));
  } catch (error) {
    handleFirestoreError(error, OperationType.GET, 'users');
    return [];
  }
};
