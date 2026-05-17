export interface Portfolio {
  id: string;
  userId: string;
  title: string;
  description: string;
  category: 'web' | 'mobile' | 'design' | 'ai' | 'data' | 'other';
  images: PortfolioImage[];
  videos: PortfolioVideo[];
  skills: PortfolioSkill[];
  technologies: string[];
  tags: string[];
  featured: boolean;
  status: 'draft' | 'published' | 'archived';
  githubUrl?: string;
  demoUrl?: string;
  documentation?: string;
  testimonials?: Testimonial[];
  statistics: PortfolioStatistics;
  createdAt: string;
  updatedAt: string;
  publishedAt?: string;
}

export interface PortfolioImage {
  id: string;
  url: string;
  title: string;
  description?: string;
  order: number;
  isCover: boolean;
  uploadedAt: string;
}

export interface PortfolioVideo {
  id: string;
  url: string;
  title: string;
  description?: string;
  duration: number; // en secondes
  thumbnail?: string;
  order: number;
  uploadedAt: string;
}

export interface PortfolioSkill {
  id: string;
  name: string;
  level: 1 | 2 | 3 | 4 | 5; // 1=Beginner, 5=Expert
  category: 'frontend' | 'backend' | 'design' | 'database' | 'devops' | 'other';
  yearsOfExperience?: number;
  projectsCount?: number;
  verified: boolean;
}

export interface Testimonial {
  id: string;
  author: string;
  authorAvatar?: string;
  authorRole?: string;
  content: string;
  rating: number; // 1-5
  date: string;
  verified: boolean;
}

export interface PortfolioStatistics {
  views: number;
  likes: number;
  shares: number;
  comments: number;
  averageRating: number;
  totalRatings: number;
  featuredCount: number;
  lastViewed?: string;
}

export interface PortfolioFilter {
  category?: string;
  status?: string;
  featured?: boolean;
  skills?: string[];
  technologies?: string[];
  tags?: string[];
  dateRange?: {
    start: string;
    end: string;
  };
}

export interface PortfolioSettings {
  allowComments: boolean;
  allowRatings: boolean;
  showStatistics: boolean;
  contactEnabled: boolean;
  downloadEnabled: boolean;
}
