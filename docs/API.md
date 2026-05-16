# CODEL Hub API Documentation

## Overview

CODEL Hub est une plateforme de gestion de club de développement informatique construite avec React, TypeScript, Firebase et Vite. Cette documentation décrit les API et services disponibles.

## Architecture

### Frontend
- **Framework**: React 19 avec TypeScript
- **Routing**: React Router v7
- **Styling**: Tailwind CSS v4
- **Animations**: Framer Motion
- **Build Tool**: Vite v6

### Backend
- **Database**: Firebase Firestore
- **Authentication**: Firebase Auth (Google)
- **Hosting**: Vercel
- **Storage**: Firebase Storage

## Services API

### 1. Authentication Service

#### `src/lib/firebase.ts`

```typescript
// Firebase configuration
export const auth = getAuth(app);
export const googleProvider = new GoogleAuthProvider();

// Methods
export { signInWithPopup, signOut };
```

#### Usage
```typescript
import { signInWithPopup, googleProvider, auth } from '../lib/firebase';

// Login
await signInWithPopup(auth, googleProvider);

// Logout
await auth.signOut();
```

### 2. User Service

#### `src/services/userService.ts`

```typescript
interface AppUser {
  id: string;
  name: string;
  email: string;
  handle: string;
  avatar: string;
  level: number;
  points: number;
  isAdmin: boolean;
  clubRole: string;
  // ... other properties
}

// Methods
export const userService = {
  getAllUsers(): Promise<AppUser[]>
  updateUserProfile(userId: string, data: Partial<AppUser>): Promise<void>
  getUserById(userId: string): Promise<AppUser | null>
};
```

#### Usage
```typescript
import { getAllUsers, updateUserProfile } from '../services/userService';

// Get all users
const users = await getAllUsers();

// Update user profile
await updateUserProfile(userId, { name: 'New Name' });
```

### 3. Notification Service

#### `src/services/notificationService.ts`

```typescript
interface Notification {
  id: string;
  userId: string;
  title: string;
  message: string;
  type: 'security' | 'project' | 'education' | 'community' | 'system' | 'achievement';
  priority: 'low' | 'medium' | 'high' | 'urgent';
  isRead: boolean;
  createdAt: string;
  // ... other properties
}

export const notificationService = {
  createNotification(userId: string, notification: Omit<Notification, 'id' | 'createdAt' | 'isRead'>): Promise<string>
  getUnreadNotifications(userId: string, limitCount?: number): Promise<Notification[]>
  markAsRead(notificationId: string): Promise<void>
  markAllAsRead(userId: string): Promise<void>
  listenToNotifications(userId: string, callback: (notifications: Notification[]) => void): () => void
};
```

#### Usage
```typescript
import { notificationService } from '../services/notificationService';

// Create notification
const notificationId = await notificationService.createNotification(userId, {
  title: 'New Achievement!',
  message: 'You unlocked a new badge',
  type: 'achievement',
  priority: 'medium'
});

// Listen to real-time notifications
const unsubscribe = notificationService.listenToNotifications(userId, (notifications) => {
  console.log('New notifications:', notifications);
});
```

### 4. Project Service

#### `src/services/projectService.ts`

```typescript
interface Project {
  id: string;
  title: string;
  description: string;
  status: 'planning' | 'in_progress' | 'completed' | 'on_hold';
  technologies: string[];
  contributors: string[];
  createdAt: string;
  // ... other properties
}

export const projectService = {
  getProjects(): Promise<Project[]>
  createProject(project: Omit<Project, 'id' | 'createdAt'>): Promise<string>
  updateProject(projectId: string, data: Partial<Project>): Promise<void>
  deleteProject(projectId: string): Promise<void>
  joinProject(projectId: string, userId: string): Promise<void>
};
```

#### Usage
```typescript
import { projectService } from '../services/projectService';

// Get all projects
const projects = await projectService.getProjects();

// Create new project
const projectId = await projectService.createProject({
  title: 'New Project',
  description: 'Project description',
  status: 'planning',
  technologies: ['React', 'TypeScript'],
  contributors: []
});
```

### 5. Education Service

#### `src/services/educationService.ts`

```typescript
interface LearningPath {
  id: string;
  title: string;
  description: string;
  difficulty: 'Débutant' | 'Intermédiaire' | 'Avancé';
  estimatedDuration: string;
  modules: Module[];
  // ... other properties
}

export const educationService = {
  getLearningPaths(): Promise<LearningPath[]>
  getModules(pathId: string): Promise<Module[]>
  updateProgress(userId: string, pathId: string, moduleId: string): Promise<void>
  getProgress(userId: string): Promise<StudentProgress[]>
};
```

#### Usage
```typescript
import { educationService } from '../services/educationService';

// Get learning paths
const paths = await educationService.getLearningPaths();

// Update progress
await educationService.updateProgress(userId, pathId, moduleId);
```

### 6. Library Service

#### `src/services/libraryService.ts`

```typescript
interface LibraryResource {
  id: string;
  title: string;
  description: string;
  category: 'PROGRAMMATION' | 'DEVELOPPEMENT_MOBILE' | 'WEB' | 'IA' | 'CYBERSECURITE';
  type: 'PDF' | 'EPUB' | 'VIDEO' | 'DOCUMENTATION';
  url: string;
  rating: number;
  downloads: number;
  // ... other properties
}

export const libraryService = {
  searchResources(searchQuery: SearchQuery): Promise<SearchResult[]>
  uploadResource(resource: Omit<LibraryResource, 'id' | 'createdAt' | 'lastUpdated'>): Promise<string>
  updateReadingProgress(userId: string, resourceId: string, progress: Partial<ReadingProgress>): Promise<void>
  getReadingProgress(userId: string, resourceId: string): Promise<ReadingProgress | null>
};
```

#### Usage
```typescript
import { libraryService } from '../services/libraryService';

// Search resources
const results = await libraryService.searchResources({
  query: 'React',
  category: 'PROGRAMMATION',
  sortBy: 'rating'
});

// Upload resource
const resourceId = await libraryService.uploadResource({
  title: 'React Guide',
  description: 'Complete React tutorial',
  category: 'PROGRAMMATION',
  type: 'PDF',
  url: 'https://example.com/react.pdf',
  rating: 0,
  downloads: 0
});
```

### 7. Academy Service

#### `src/services/academyService.ts`

```typescript
interface Tutorial {
  id: string;
  title: string;
  description: string;
  content: string;
  category: 'PROGRAMMATION' | 'DEVELOPPEMENT_MOBILE' | 'WEB' | 'IA';
  level: 'Débutant' | 'Intermédiaire' | 'Avancé';
  authorId: string;
  authorName: string;
  status: 'PUBLISHED' | 'PENDING' | 'DRAFT';
  // ... other properties
}

export const academyService = {
  getTutorials(filter?: TutorialFilter): Promise<Tutorial[]>
  createTutorial(tutorial: Omit<Tutorial, 'id' | 'createdAt' | 'lastUpdated'>): Promise<string>
  updateTutorial(tutorialId: string, data: Partial<Tutorial>): Promise<void>
  rateTutorial(tutorialId: string, userId: string, rating: number, review?: string): Promise<void>
  addComment(tutorialId: string, userId: string, content: string): Promise<string>
};
```

#### Usage
```typescript
import { academyService } from '../services/academyService';

// Get tutorials
const tutorials = await academyService.getutorials({
  category: 'PROGRAMMATION',
  level: 'Débutant'
});

// Create tutorial
const tutorialId = await academyService.createTutorial({
  title: 'React Basics',
  description: 'Learn React fundamentals',
  content: 'Tutorial content...',
  category: 'PROGRAMMATION',
  level: 'Débutant',
  authorId: userId,
  authorName: userName,
  status: 'PUBLISHED'
});
```

## Components API

### 1. Badge System

#### `src/components/BadgeSystem.tsx`

```typescript
interface Badge {
  id: string;
  name: string;
  description: string;
  icon: string;
  color: string;
  category: 'PARTICIPATION' | 'PROJET' | 'FORMATION' | 'MENTORAT' | 'EXCEPTIONNEL';
  points: number;
  unlockedAt?: string;
}

// Usage
<BadgeSystem 
  showProgress={true} 
  maxBadges={12}
/>
```

### 2. Lazy Image

#### `src/components/LazyImage.tsx`

```typescript
interface LazyImageProps {
  src: string;
  alt: string;
  className?: string;
  width?: number | string;
  height?: number | string;
  fallback?: string;
  onLoad?: () => void;
  onError?: () => void;
}

// Usage
<LazyImage 
  src="https://example.com/image.jpg"
  alt="Description"
  className="w-full h-64"
  fallback="/placeholder.jpg"
/>
```

### 3. PDF Reader

#### `src/components/PDFReader.tsx`

```typescript
interface PDFReaderProps {
  resource: LibraryResource;
  onClose: () => void;
  initialPage?: number;
  initialScale?: number;
}

// Usage
<PDFReader 
  resource={selectedResource}
  onClose={() => setShowPDFReader(false)}
  initialPage={1}
  initialScale={1.0}
/>
```

## Firebase Collections

### Users Collection
```typescript
{
  id: string; // Document ID = User ID
  name: string;
  email: string;
  handle: string;
  avatar: string;
  level: number;
  points: number;
  isAdmin: boolean;
  clubRole: string;
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
  // ... other fields
}
```

### Projects Collection
```typescript
{
  title: string;
  description: string;
  status: 'planning' | 'in_progress' | 'completed' | 'on_hold';
  technologies: string[];
  contributors: string[];
  createdBy: string;
  createdAt: string;
  updatedAt: string;
  // ... other fields
}
```

### Notifications Collection
```typescript
{
  userId: string;
  title: string;
  message: string;
  type: 'security' | 'project' | 'education' | 'community' | 'system' | 'achievement';
  priority: 'low' | 'medium' | 'high' | 'urgent';
  isRead: boolean;
  createdAt: string;
  readAt?: string;
  actionUrl?: string;
  actionText?: string;
  metadata?: Record<string, any>;
}
```

### Library Resources Collection
```typescript
{
  title: string;
  description: string;
  category: 'PROGRAMMATION' | 'DEVELOPPEMENT_MOBILE' | 'WEB' | 'IA' | 'CYBERSECURITE';
  type: 'PDF' | 'EPUB' | 'VIDEO' | 'DOCUMENTATION';
  url: string;
  downloadUrl?: string;
  author?: string;
  difficulty?: 'Débutant' | 'Intermédiaire' | 'Avancé';
  tags: string[];
  rating: number;
  downloads: number;
  views: number;
  fileSize?: string;
  duration?: string;
  pages?: number;
  language: 'FR' | 'EN' | 'ES';
  isOfflineAvailable: boolean;
  uploadedBy?: string;
  uploadedAt: string;
  lastUpdated: string;
  isOfficial: boolean;
  isVerified: boolean;
}
```

## Environment Variables

### `.env.example`
```env
GEMINI_API_KEY="MY_GEMINI_API_KEY"
APP_URL="MY_APP_URL"
```

### Vercel Environment Variables
```env
VITE_APP_URL="https://codel-hub.vercel.app"
FIREBASE_API_KEY="your-firebase-api-key"
FIREBASE_AUTH_DOMAIN="your-project.firebaseapp.com"
FIREBASE_PROJECT_ID="your-project-id"
FIREBASE_STORAGE_BUCKET="your-project.appspot.com"
FIREBASE_MESSAGING_SENDER_ID="123456789"
FIREBASE_APP_ID="your-app-id"
```

## Error Handling

### Firestore Error Handler
```typescript
export function handleFirestoreError(error: unknown, operationType: OperationType, path: string | null) {
  const errInfo: FirestoreErrorInfo = {
    error: error instanceof Error ? error.message : String(error),
    authInfo: {
      userId: auth.currentUser?.uid,
      email: auth.currentUser?.email,
      emailVerified: auth.currentUser?.emailVerified,
      isAnonymous: auth.currentUser?.isAnonymous,
      tenantId: auth.currentUser?.tenantId,
      providerInfo: auth.currentUser?.providerData?.map(provider => ({
        providerId: provider.providerId,
        email: provider.email,
      })) || []
    },
    operationType,
    path
  };
  console.error('Firestore Error: ', JSON.stringify(errInfo));
  throw new Error(JSON.stringify(errInfo));
}
```

## Security Considerations

1. **Authentication**: All API calls require user authentication via Firebase Auth
2. **Authorization**: Admin operations check `isAdmin` flag in user profile
3. **Data Validation**: All inputs are validated before database operations
4. **Error Handling**: Sensitive information is not exposed in error messages
5. **Firestore Rules**: Implement security rules to protect data access

## Performance Optimizations

1. **Lazy Loading**: Images and components are loaded on demand
2. **Code Splitting**: Routes are split into separate chunks
3. **Caching**: Firestore queries use appropriate caching strategies
4. **Bundle Optimization**: Manual chunks for vendor libraries
5. **Image Optimization**: WebP format and responsive images

## Deployment

### Build Commands
```bash
# Development
npm run dev

# Build for production
npm run build

# Preview build
npm run preview

# Type checking
npm run type-check
```

### Vercel Configuration
```json
{
  "version": 2,
  "builds": [
    {
      "src": "package.json",
      "use": "@vercel/static-build",
      "config": {
        "distDir": "dist"
      }
    }
  ],
  "routes": [
    {
      "src": "/assets/(.*)",
      "dest": "/assets/$1",
      "status": 200
    },
    {
      "src": "/(.*)",
      "dest": "/index.html",
      "status": 200
    }
  ]
}
```

## Contributing

1. Follow TypeScript strict mode
2. Use meaningful variable names
3. Add comments for complex logic
4. Write unit tests for new features
5. Update documentation for API changes

## Support

For technical support or questions about the API, please contact the development team or create an issue in the repository.
