export type AppUser = {
  id: string;
  name: string;
  email: string;
  status: string;
  avatar: string;
  level: number;
  handle: string;
  isAdmin: boolean;
  clubRole: 'Président' | 'Vice-Président' | 'Secrétaire' | 'Comptable' | 'Superviseur' | 'Membre';
  role?: string;
  geminiApiKey?: string;
  skills?: string[];
  tools?: string[];
  platforms?: string[];
  bio?: string;
  notificationPreferences?: {
    securityAlerts: boolean;
    projectUpdates: boolean;
  };
};

export type Member = AppUser; // For backward compatibility if needed

export type LearningPath = {
  id: string;
  title: string;
  description: string;
  modules: number;
  enrolled: number;
  tags: string[];
  thumbnail: string;
};

export type Event = {
  id: string;
  title: string;
  type: 'WORKSHOP' | 'HACKATHON' | 'TALK';
  date: string;
  time: string;
  registered: number;
  location: string;
  thumbnail: string;
};

export type Project = {
  id: string;
  title: string;
  description: string;
  tags: string[];
  status: 'LIVE' | 'STABLE' | 'BUSY' | 'PAUSED' | 'COMPLETED';
  progress: number;
  commits?: number;
  url?: string;
  githubUrl?: string;
  liveUrl?: string;
  thumbnail?: string;
};

export type Module = {
  id: string;
  title: string;
  instructor: string;
  duration: string;
  progress: number;
  icon: string;
};

export type ForumTopic = {
  id: string;
  title: string;
  description: string;
  threadsCount: number;
  lastUpdated: string;
  category: 'General' | 'Help' | 'Showcase';
  icon: string;
};

export type ForumThread = {
  id: string;
  topicId: string;
  authorId: string;
  authorName: string;
  authorAvatar: string;
  title: string;
  content: string;
  createdAt: string;
  views: number;
  repliesCount: number;
};

export type ForumComment = {
  id: string;
  threadId: string;
  authorId: string;
  authorName: string;
  authorAvatar: string;
  content: string;
  createdAt: string;
};
