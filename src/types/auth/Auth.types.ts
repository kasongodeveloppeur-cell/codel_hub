export type UserStatus = 'GUEST' | 'CANDIDATE' | 'MEMBER' | 'MENTOR' | 'ADMIN';
export type UserRole = 'VISITOR' | 'APPLICANT' | 'MEMBER' | 'CONTRIBUTOR' | 'MENTOR' | 'RESPONSIBLE' | 'ADMIN';

export interface AuthContextType {
  user: any;
  firebaseUser: any;
  loading: boolean;
  isAdmin: boolean;
  logout: () => Promise<void>;
}
