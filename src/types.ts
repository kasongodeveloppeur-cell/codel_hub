// Types pour le système de motivation CODEL
export type Badge = {
  id: string;
  name: string;
  description: string;
  icon: string;
  color: string;
  category: 'PARTICIPATION' | 'PROJET' | 'FORMATION' | 'MENTORAT' | 'EXCEPTIONNEL';
  points: number;
  unlockedAt?: string;
};

export type ModuleResource = {
  id: string;
  title: string;
  type: 'PDF' | 'VIDEO' | 'LINK' | 'CODE' | 'EXERCICE';
  url: string;
  description?: string;
};

export type Exercise = {
  id: string;
  title: string;
  description: string;
  difficulty: 'Débutant' | 'Intermédiaire' | 'Avancé';
  instructions: string[];
  solution?: string;
  hints?: string[];
  timeLimit?: number;
};

export type Quiz = {
  id: string;
  title: string;
  questions: QuizQuestion[];
  passingScore: number;
  timeLimit?: number;
};

export type QuizQuestion = {
  id: string;
  question: string;
  type: 'MULTIPLE_CHOICE' | 'TRUE_FALSE' | 'SHORT_ANSWER';
  options?: string[];
  correctAnswer: string | string[];
  points: number;
};

// Types pour CODEL Library - Bibliothèque Numérique Intelligente
export type LibraryResource = {
  id: string;
  title: string;
  description: string;
  category: 'PROGRAMMATION' | 'DEVELOPPEMENT_MOBILE' | 'WEB' | 'IA' | 'CYBERSECURITE' | 'LINUX' | 'DESIGN' | 'MATHEMATIQUES' | 'RESEAUX' | 'ENTREPRENARIAT';
  type: 'PDF' | 'EPUB' | 'VIDEO' | 'DOCUMENTATION' | 'NOTES' | 'ARTICLE' | 'LIVRE' | 'TUTORIEL' | 'GUIDE';
  url: string;
  downloadUrl?: string; // Pour téléchargement hors ligne
  author?: string;
  difficulty?: 'Débutant' | 'Intermédiaire' | 'Avancé';
  tags: string[];
  rating: number;
  downloads: number;
  views: number;
  fileSize?: string;
  duration?: string; // Pour les vidéos
  pages?: number; // Pour les PDF/livres
  language: 'FR' | 'EN' | 'ES';
  isOfflineAvailable: boolean;
  uploadedBy?: string; // ID du membre qui a uploadé
  uploadedAt: string;
  lastUpdated: string;
  isOfficial: boolean; // Contenu officiel du club
  isVerified: boolean; // Vérifié par les responsables
};

export type LibraryCategory = {
  id: string;
  name: string;
  icon: string;
  description: string;
  resourceCount: number;
  color: string;
};

export type ReadingProgress = {
  id: string;
  userId: string;
  resourceId: string;
  currentPage?: number;
  currentPosition?: number; // Pour les vidéos (en secondes)
  progress: number; // Pourcentage
  lastReadAt: string;
  isCompleted: boolean;
  readingTime: number; // Temps total de lecture en minutes
  bookmarks: Bookmark[];
};

export type Bookmark = {
  id: string;
  page?: number;
  position?: number;
  note?: string;
  createdAt: string;
  title: string;
};

export type SearchQuery = {
  query: string;
  category?: string;
  type?: string;
  difficulty?: string;
  tags?: string[];
  sortBy?: 'relevance' | 'rating' | 'downloads' | 'date' | 'title';
  sortOrder?: 'asc' | 'desc';
};

export type SearchResult = {
  resource: LibraryResource;
  relevanceScore: number;
  matchedFields: string[];
};

// Types pour CODEL Academy - Plateforme Tutoriels Étudiants
export type Tutorial = {
  id: string;
  title: string;
  description: string;
  content: string;
  thumbnail: string;
  videoUrl?: string;
  videoDuration?: number;
  category: 'PROGRAMMATION' | 'DEVELOPPEMENT_MOBILE' | 'WEB' | 'IA' | 'CYBERSECURITE' | 'LINUX' | 'DESIGN' | 'OUTILS';
  level: 'Débutant' | 'Intermédiaire' | 'Avancé';
  tags: string[];
  authorId: string;
  authorName: string;
  authorAvatar: string;
  createdAt: string;
  lastUpdated: string;
  status: 'PUBLISHED' | 'PENDING' | 'DRAFT' | 'REJECTED';
  isOfficial: boolean;
  isVerified: boolean;
  views: number;
  likes: number;
  dislikes: number;
  commentsCount: number;
  resources: TutorialResource[];
  exercises?: Exercise[];
  estimatedDuration: string;
  prerequisites?: string[];
};

export type TutorialResource = {
  id: string;
  title: string;
  type: 'PDF' | 'LINK' | 'CODE' | 'DOWNLOAD' | 'IMAGE';
  url: string;
  description?: string;
};

export type TutorialComment = {
  id: string;
  tutorialId: string;
  authorId: string;
  authorName: string;
  authorAvatar: string;
  content: string;
  createdAt: string;
  likes: number;
  replies: TutorialComment[];
  isPinned?: boolean;
};

export type TutorialRating = {
  id: string;
  tutorialId: string;
  userId: string;
  rating: number; // 1-5 étoiles
  review?: string;
  createdAt: string;
};

export type CreatorStats = {
  id: string;
  userId: string;
  tutorialsPublished: number;
  totalViews: number;
  totalLikes: number;
  totalComments: number;
  averageRating: number;
  pointsEarned: number;
  badges: string[];
  level: 'Contributeur' | 'Formateur' | 'Mentor' | 'Créateur Actif';
};

export type AcademyCourse = {
  id: string;
  title: string;
  description: string;
  thumbnail: string;
  category: string;
  level: 'Débutant' | 'Intermédiaire' | 'Avancé';
  duration: string;
  instructor: string;
  modules: AcademyModule[];
  enrolledStudents: number;
  isOfficial: boolean;
  price: number; // 0 pour gratuit
  certificate: boolean;
  tags: string[];
  createdAt: string;
  lastUpdated: string;
};

export type AcademyModule = {
  id: string;
  title: string;
  description: string;
  order: number;
  type: 'VIDEO' | 'PDF' | 'QUIZ' | 'PROJECT' | 'EXERCISE';
  content: string;
  resourceUrl?: string;
  duration: string;
  isRequired: boolean;
  quiz?: Quiz;
  project?: {
    title: string;
    description: string;
    requirements: string[];
    submissionUrl?: string;
  };
};

export type StudentProgress = {
  id: string;
  userId: string;
  courseId: string;
  completedModules: string[];
  currentModule: string;
  progress: number; // Pourcentage
  startedAt: string;
  lastAccessedAt: string;
  completedAt?: string;
  timeSpent: number; // En minutes
  quizScores: { moduleId: string; score: number; attempts: number }[];
  certificate?: {
    url: string;
    issuedAt: string;
  };
};

// Types pour le système de récompenses créateurs
export type CreatorBadge = {
  id: string;
  name: string;
  description: string;
  icon: string;
  color: string;
  category: 'CONTRIBUTION' | 'FORMATION' | 'MENTORAT' | 'EXCELLENCE';
  points: number;
  requirements: {
    type: string;
    value: number;
    description: string;
  }[];
};

export type CreatorReward = {
  id: string;
  userId: string;
  type: 'POINTS' | 'BADGE' | 'LEVEL_UP';
  value: number | string;
  reason: string;
  tutorialId?: string;
  createdAt: string;
};

export type ContributionActivity = {
  id: string;
  userId: string;
  type: 'TUTORIAL_PUBLISHED' | 'RESOURCE_UPLOADED' | 'COMMENT_HELPFUL' | 'TUTORIAL_POPULAR' | 'COURSE_COMPLETED';
  points: number;
  description: string;
  relatedId?: string; // ID du tutoriel, ressource, etc.
  createdAt: string;
};

// Gestion des événements avec QR Code
export type EventAttendance = {
  id: string;
  eventId: string;
  userId: string;
  checkedInAt: string;
  qrCodeScanned: boolean;
  pointsAwarded: number;
};

export type QRCodeData = {
  eventId: string;
  timestamp: string;
  location: string;
  secret: string;
};

export type AppUser = {
  id: string;
  name: string;
  email: string;
  status: string;
  avatar: string;
  level: number;
  handle: string;
  isAdmin: boolean;
  clubRole: 'Président' | 'Vice-Président' | 'Secrétaire' | 'Responsable Formation' | 'Responsable Projets' | 'Responsable Communication' | 'Membre';
  role?: string;
  geminiApiKey?: string;
  skills?: string[];
  tools?: string[];
  platforms?: string[];
  bio?: string;
  // Système de motivation CODEL
  badges: Badge[];
  points: number;
  portfolio?: string;
  // Suivi de progression
  completedModules: string[];
  attendedEvents: string[];
  projectsContributed: string[];
  // CODEL Library - Bibliothèque Numérique
  favoriteResources?: string[]; // IDs des ressources favorites
  readingProgress?: ReadingProgress[]; // Progression de lecture
  downloadedResources?: string[]; // IDs des ressources téléchargées
  // CODEL Academy - Plateforme Tutoriels
  uploadedTutorials?: string[]; // IDs des tutoriels uploadés
  completedCourses?: string[]; // IDs des cours complétés
  tutorialProgress?: StudentProgress[]; // Progression dans les cours
  creatorStats?: CreatorStats; // Statistiques de créateur
  // Préférences
  notificationPreferences?: {
    securityAlerts: boolean;
    projectUpdates: boolean;
    trainingUpdates: boolean;
    eventReminders: boolean;
    newTutorials: boolean;
    newResources: boolean;
    creatorRewards: boolean;
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
  difficulty: 'Débutant' | 'Intermédiaire' | 'Avancé';
  duration: string;
  prerequisites?: string[];
  technologies: string[];
  instructor?: string;
};

export type Event = {
  id: string;
  title: string;
  type: 'ATELIER' | 'CODING_NIGHT' | 'HACKATHON' | 'CONFERENCE' | 'REUNION' | 'CONCOURS' | 'FORMATION';
  date: string;
  time: string;
  duration: string;
  registered: number;
  maxParticipants?: number;
  location: string;
  thumbnail: string;
  description: string;
  instructor?: string;
  requirements?: string[];
  qrCodeEnabled: boolean;
  pointsReward: number;
  badgeReward?: Badge;
};

export type Project = {
  id: string;
  title: string;
  description: string;
  tags: string[];
  status: 'PLANIFICATION' | 'DEVELOPPEMENT' | 'TEST' | 'LIVE' | 'STABLE' | 'PAUSED' | 'COMPLETED';
  progress: number;
  commits?: number;
  url?: string;
  githubUrl?: string;
  liveUrl?: string;
  thumbnail?: string;
  // Équipe collaborative
  teamMembers: string[]; // IDs des membres
  teamLead?: string;
  technologies: string[];
  difficulty: 'Débutant' | 'Intermédiaire' | 'Avancé';
  category: 'WEB' | 'MOBILE' | 'LOGICIEL' | 'JEU' | 'IA' | 'OUTIL' | 'AUTRE';
  repository?: string;
  demoUrl?: string;
};

export type Module = {
  id: string;
  title: string;
  description: string;
  instructor: string;
  duration: string;
  progress: number;
  icon: string;
  difficulty: 'Débutant' | 'Intermédiaire' | 'Avancé';
  category: 'DEVELOPPEMENT' | 'IA' | 'CYBERSECURITE' | 'DESIGN' | 'OUTILS';
  technologies: string[];
  prerequisites?: string[];
  resources: ModuleResource[];
  exercises?: Exercise[];
  quiz?: Quiz;
};

export type ForumTopic = {
  id: string;
  title: string;
  description: string;
  threadsCount: number;
  lastUpdated: string;
  category: 'General' | 'AIDE' | 'SHOWCASE' | 'FORMATIONS' | 'PROJETS' | 'CONCOURS' | 'CARRIERE';
  icon: string;
  isPinned?: boolean;
  isLocked?: boolean;
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
