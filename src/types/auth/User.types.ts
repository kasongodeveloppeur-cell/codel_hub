import { UserStatus, UserRole } from './Auth.types';

export interface UserPermissions {
  canViewDashboard: boolean;
  canEditProfile: boolean;
  canAccessLibrary: boolean;
  canJoinEvents: boolean;
  canUploadContent: boolean;
  canManageUsers: boolean;
  canAccessAdminPanel: boolean;
}

export interface AppUser {
  id: string;
  name: string;
  email: string;
  handle: string;
  avatar: string;
  level: number;
  points: number;
  isAdmin: boolean;
  clubRole: string;
  userStatus: UserStatus;
  userRole: UserRole;
  isGuest?: boolean;
  permissions?: UserPermissions;
  membershipApplicationId?: string;
  joinedAt?: string;
  lastLoginAt?: string;
  notificationPreferences: {
    securityAlerts: boolean;
    projectUpdates: boolean;
    educationUpdates: boolean;
    communityActivity: boolean;
    achievements: boolean;
    systemUpdates: boolean;
    emailNotifications: boolean;
    pushNotifications: boolean;
    dailyDigest: boolean;
    weeklyDigest: boolean;
  };
  membershipApplication?: any;
  stats: {
    projectsCount: number;
    tutorialsCount: number;
    forumPostsCount: number;
    eventsAttended: number;
    badgesEarned: number;
    contributionPoints: number;
  };
  badges: any[];
  portfolio?: string;
  completedModules: string[];
  attendedEvents: string[];
  projectsContributed: string[];
  favoriteResources?: string[];
  geminiApiKey?: string;
  displayName?: string;
  status: string;
}

export type Member = AppUser;
