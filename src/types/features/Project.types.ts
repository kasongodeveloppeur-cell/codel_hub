export interface Project {
  id: string;
  title: string;
  description: string;
  category: 'web' | 'mobile' | 'ai' | 'cybersecurity' | 'design' | 'network' | 'robotics' | 'other';
  status: 'planning' | 'in-progress' | 'review' | 'completed' | 'archived';
  priority: 'low' | 'medium' | 'high' | 'critical';
  progress: number;
  startDate: string;
  endDate?: string;
  deadline?: string;
  team: TeamMember[];
  technologies: string[];
  repository?: string;
  demoUrl?: string;
  images?: string[];
  documents?: ProjectDocument[];
  requirements?: string[];
  deliverables?: string[];
  milestones?: ProjectMilestone[];
  tags: string[];
  createdBy: string;
  createdAt: string;
  updatedAt: string;
}

export interface TeamMember {
  id: string;
  name: string;
  email: string;
  role: 'lead' | 'developer' | 'designer' | 'tester' | 'contributor';
  avatar?: string;
  joinedAt: string;
  contributionLevel: number;
}

export interface ProjectDocument {
  id: string;
  name: string;
  type: 'specification' | 'design' | 'documentation' | 'report' | 'other';
  url: string;
  uploadedBy: string;
  uploadedAt: string;
  size: number;
}

export interface ProjectMilestone {
  id: string;
  title: string;
  description: string;
  dueDate: string;
  status: 'pending' | 'completed' | 'overdue';
  completedAt?: string;
  assignedTo: string[];
}

export interface ProjectFilter {
  category?: string;
  status?: string;
  priority?: string;
  teamMember?: string;
  tags?: string[];
  dateRange?: {
    start: string;
    end: string;
  };
}
