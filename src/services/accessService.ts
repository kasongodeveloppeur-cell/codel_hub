import { collection, doc, addDoc, updateDoc, getDoc, getDocs, query, where, orderBy, limit, serverTimestamp } from 'firebase/firestore';
import { db } from '../lib/firebase';
import { MembershipApplication, UserStatus, UserRole, PERMISSIONS_BY_ROLE, Permission } from '../types';

export const accessService = {
  /**
   * Crée une nouvelle demande d'adhésion
   */
  async createApplication(application: Omit<MembershipApplication, 'id' | 'submittedAt'>): Promise<string> {
    try {
      const applicationData = {
        ...application,
        submittedAt: serverTimestamp()
      };
      
      const docRef = await addDoc(collection(db, 'membershipApplications'), applicationData);
      console.log(`Application created: ${docRef.id}`);
      return docRef.id;
    } catch (error) {
      console.error('Error creating application:', error);
      throw error;
    }
  },

  /**
   * Récupère une demande d'adhésion par ID
   */
  async getApplication(applicationId: string): Promise<MembershipApplication | null> {
    try {
      const applicationDoc = await getDoc(doc(db, 'membershipApplications', applicationId));
      if (applicationDoc.exists()) {
        return {
          id: applicationDoc.id,
          ...applicationDoc.data()
        } as MembershipApplication;
      }
      return null;
    } catch (error) {
      console.error('Error fetching application:', error);
      throw error;
    }
  },

  /**
   * Récupère toutes les demandes d'adhésion
   */
  async getAllApplications(): Promise<MembershipApplication[]> {
    try {
      const q = query(
        collection(db, 'membershipApplications'),
        orderBy('submittedAt', 'desc')
      );
      
      const snapshot = await getDocs(q);
      return snapshot.docs.map(doc => ({
        id: doc.id,
        ...doc.data()
      } as MembershipApplication));
    } catch (error) {
      console.error('Error fetching applications:', error);
      return [];
    }
  },

  /**
   * Récupère les demandes en attente
   */
  async getPendingApplications(): Promise<MembershipApplication[]> {
    try {
      const q = query(
        collection(db, 'membershipApplications'),
        where('status', '==', 'PENDING'),
        orderBy('submittedAt', 'desc')
      );
      
      const snapshot = await getDocs(q);
      return snapshot.docs.map(doc => ({
        id: doc.id,
        ...doc.data()
      } as MembershipApplication));
    } catch (error) {
      console.error('Error fetching pending applications:', error);
      return [];
    }
  },

  /**
   * Met à jour le statut d'une demande
   */
  async updateApplicationStatus(
    applicationId: string, 
    status: 'APPROVED' | 'REJECTED' | 'NEEDS_INFO',
    reviewedBy: string,
    rejectionReason?: string,
    additionalInfoRequested?: string[]
  ): Promise<void> {
    try {
      const applicationRef = doc(db, 'membershipApplications', applicationId);
      const updateData: any = {
        status,
        reviewedAt: serverTimestamp(),
        reviewedBy
      };
      
      if (rejectionReason) {
        updateData.rejectionReason = rejectionReason;
      }
      
      if (additionalInfoRequested) {
        updateData.additionalInfoRequested = additionalInfoRequested;
      }
      
      await updateDoc(applicationRef, updateData);
    } catch (error) {
      console.error('Error updating application status:', error);
      throw error;
    }
  },

  /**
   * Met à jour le rôle d'un utilisateur
   */
  async updateUserRole(userId: string, userRole: UserRole): Promise<void> {
    try {
      const userRef = doc(db, 'users', userId);
      await updateDoc(userRef, {
        userRole,
        userStatus: this.getUserStatusFromRole(userRole),
        updatedAt: serverTimestamp()
      });
    } catch (error) {
      console.error('Error updating user role:', error);
      throw error;
    }
  },

  /**
   * Convertit un rôle en statut utilisateur
   */
  getUserStatusFromRole(userRole: UserRole): UserStatus {
    switch (userRole) {
      case 'VISITOR':
      case 'APPLICANT':
        return 'GUEST';
      case 'MEMBER':
      case 'CONTRIBUTOR':
        return 'MEMBER';
      case 'MENTOR':
        return 'MENTOR';
      case 'RESPONSIBLE':
      case 'ADMIN':
        return 'ADMIN';
      default:
        return 'GUEST';
    }
  },

  /**
   * Vérifie les permissions d'un utilisateur
   */
  hasPermission(userRole: UserRole, permission: keyof Permission): boolean {
    const permissions = PERMISSIONS_BY_ROLE[userRole];
    return permissions[permission];
  },

  /**
   * Vérifie si un utilisateur peut accéder à une ressource
   */
  canAccessResource(userRole: UserRole, resourceType: 'public' | 'member' | 'mentor' | 'admin'): boolean {
    switch (resourceType) {
      case 'public':
        return true; // Tout le monde peut accéder aux ressources publiques
      case 'member':
        return ['MEMBER', 'CONTRIBUTOR', 'MENTOR', 'RESPONSIBLE', 'ADMIN'].includes(userRole);
      case 'mentor':
        return ['MENTOR', 'RESPONSIBLE', 'ADMIN'].includes(userRole);
      case 'admin':
        return ['RESPONSIBLE', 'ADMIN'].includes(userRole);
      default:
        return false;
    }
  },

  /**
   * Récupère les permissions complètes d'un rôle
   */
  getRolePermissions(userRole: UserRole): Permission {
    return PERMISSIONS_BY_ROLE[userRole];
  },

  /**
   * Vérifie si un utilisateur peut créer du contenu
   */
  canCreateContent(userRole: UserRole): boolean {
    return this.hasPermission(userRole, 'canCreateContent');
  },

  /**
   * Vérifie si un utilisateur peut uploader des tutoriels
   */
  canUploadTutorials(userRole: UserRole): boolean {
    return this.hasPermission(userRole, 'canUploadTutorials');
  },

  /**
   * Vérifie si un utilisateur peut gérer les membres
   */
  canManageMembers(userRole: UserRole): boolean {
    return this.hasPermission(userRole, 'canManageMembers');
  },

  /**
   * Vérifie si un utilisateur peut gérer les candidatures
   */
  canManageApplications(userRole: UserRole): boolean {
    return this.hasPermission(userRole, 'canManageApplications');
  },

  /**
   * Récupère le parcours d'un utilisateur
   */
  getUserJourney(userRole: UserRole): string[] {
    const journey = ['VISITOR'];
    
    switch (userRole) {
      case 'APPLICANT':
        journey.push('APPLICANT');
        break;
      case 'MEMBER':
        journey.push('APPLICANT', 'MEMBER');
        break;
      case 'CONTRIBUTOR':
        journey.push('APPLICANT', 'MEMBER', 'CONTRIBUTOR');
        break;
      case 'MENTOR':
        journey.push('APPLICANT', 'MEMBER', 'CONTRIBUTOR', 'MENTOR');
        break;
      case 'RESPONSIBLE':
        journey.push('APPLICANT', 'MEMBER', 'CONTRIBUTOR', 'MENTOR', 'RESPONSIBLE');
        break;
      case 'ADMIN':
        journey.push('APPLICANT', 'MEMBER', 'CONTRIBUTOR', 'MENTOR', 'RESPONSIBLE', 'ADMIN');
        break;
    }
    
    return journey;
  },

  /**
   * Calcule le prochain rôle possible
   */
  getNextRole(currentRole: UserRole): UserRole | null {
    const roleHierarchy: UserRole[] = [
      'VISITOR', 'APPLICANT', 'MEMBER', 'CONTRIBUTOR', 'MENTOR', 'RESPONSIBLE', 'ADMIN'
    ];
    
    const currentIndex = roleHierarchy.indexOf(currentRole);
    if (currentIndex < roleHierarchy.length - 1) {
      return roleHierarchy[currentIndex + 1];
    }
    return null;
  },

  /**
   * Vérifie si un utilisateur peut être promu
   */
  canBePromoted(currentRole: UserRole, targetRole: UserRole): boolean {
    const roleHierarchy: UserRole[] = [
      'VISITOR', 'APPLICANT', 'MEMBER', 'CONTRIBUTOR', 'MENTOR', 'RESPONSIBLE', 'ADMIN'
    ];
    
    const currentIndex = roleHierarchy.indexOf(currentRole);
    const targetIndex = roleHierarchy.indexOf(targetRole);
    
    return targetIndex > currentIndex && targetIndex <= currentIndex + 1;
  }
};
