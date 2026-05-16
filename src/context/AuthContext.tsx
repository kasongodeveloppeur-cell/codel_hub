import React, { createContext, useContext, useEffect, useState } from 'react';
import { onAuthStateChanged, User as FirebaseUser } from 'firebase/auth';
import { doc, getDoc, setDoc, onSnapshot } from 'firebase/firestore';
import { auth, db } from '../lib/firebase';
import { AppUser } from '../types';

interface AuthContextType {
  user: AppUser | null;
  firebaseUser: FirebaseUser | null;
  loading: boolean;
  isAdmin: boolean;
  logout: () => Promise<void>;
}

const AuthContext = createContext<AuthContextType>({
  user: null,
  firebaseUser: null,
  loading: true,
  isAdmin: false,
  logout: async () => {},
});

export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [firebaseUser, setFirebaseUser] = useState<FirebaseUser | null>(null);
  const [user, setUser] = useState<AppUser | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    let unsubscribeDoc: (() => void) | null = null;

    const unsubscribeAuth = onAuthStateChanged(auth, async (fUser) => {
      setFirebaseUser(fUser);
      
      if (unsubscribeDoc) {
        unsubscribeDoc();
        unsubscribeDoc = null;
      }

      if (fUser) {
        const userDocRef = doc(db, 'users', fUser.uid);
        
        // Check if user exists first to create if needed
        const userDoc = await getDoc(userDocRef);
        if (!userDoc.exists()) {
          const newUser: AppUser = {
            id: fUser.uid,
            name: fUser.displayName || 'New Member',
            email: fUser.email || '',
            status: 'Active',
            avatar: fUser.photoURL || `https://i.pravatar.cc/150?u=${fUser.uid}`,
            level: 1,
            handle: fUser.displayName?.toLowerCase().replace(/\s+/g, '_') || 'member',
            isAdmin: fUser.email === 'kasongodeveloppeur@gmail.com',
            clubRole: fUser.email === 'kasongodeveloppeur@gmail.com' ? 'Président' : 'Membre',
            geminiApiKey: '',
            badges: [],
            points: 0,
            completedModules: [],
            attendedEvents: [],
            projectsContributed: [],
            // Ajout pour le mode visiteur
            isGuest: false,
            permissions: {
              canViewDashboard: true,
              canEditProfile: true,
              canAccessLibrary: true,
              canJoinEvents: true,
              canUploadContent: false,
              canManageUsers: fUser.email === 'kasongodeveloppeur@gmail.com',
              canAccessAdminPanel: fUser.email === 'kasongodeveloppeur@gmail.com'
            }
          };
          await setDoc(userDocRef, newUser);
        }

        // Listen for real-time updates
        unsubscribeDoc = onSnapshot(userDocRef, (doc) => {
          if (doc.exists()) {
            setUser(doc.data() as AppUser);
          } else {
            setUser(null);
          }
          setLoading(false);
        }, (error) => {
          console.error("Error listening to user doc:", error);
          setUser(null);
          setLoading(false);
        });
      } else {
        // Mode visiteur - créer un utilisateur invité
        const guestUser: AppUser = {
          id: 'guest-user',
          name: 'Visiteur',
          email: 'guest@codelhub.com',
          status: 'Active',
          avatar: 'https://i.pravatar.cc/150?u=guest',
          level: 1,
          handle: 'guest',
          isAdmin: false,
          clubRole: 'Visiteur',
          geminiApiKey: '',
          badges: [],
          points: 0,
          completedModules: [],
          attendedEvents: [],
          projectsContributed: [],
          isGuest: true,
          permissions: {
            canViewDashboard: true,
            canEditProfile: false,
            canAccessLibrary: true,
            canJoinEvents: false,
            canUploadContent: false,
            canManageUsers: false,
            canAccessAdminPanel: false
          }
        };
        setUser(guestUser);
        setLoading(false);
      }
    });

    return () => {
      unsubscribeAuth();
      if (unsubscribeDoc) unsubscribeDoc();
    };
  }, []);

  const logout = async () => {
    await auth.signOut();
  };

  const isAdmin = user?.clubRole === 'Président' || user?.clubRole === 'Superviseur' || !!user?.isAdmin;

  return (
    <AuthContext.Provider value={{ user, firebaseUser, loading, isAdmin, logout }}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => useContext(AuthContext);
