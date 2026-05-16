import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { 
  User, 
  Code, 
  Award, 
  BookOpen, 
  ExternalLink, 
  Github, 
  Globe, 
  Star, 
  Eye,
  Heart,
  Download,
  Calendar,
  MapPin,
  Mail,
  Phone,
  Plus,
  Edit,
  Trash2,
  Image as ImageIcon,
  Video,
  FileText,
  Briefcase
} from 'lucide-react';
import { Button } from '../ui/Button';
import { Card, CardHeader, CardContent } from '../ui/Card';
import { Badge } from '../ui/Badge';
import { LazyImage } from '../ui/LazyImage';
import { useThemeClasses } from '../../hooks/useTheme';

interface Project {
  id: string;
  title: string;
  description: string;
  type: 'web' | 'mobile' | 'desktop' | 'game' | 'ai' | 'other';
  technologies: string[];
  images: string[];
  videos?: string[];
  liveUrl?: string;
  githubUrl?: string;
  demoUrl?: string;
  status: 'completed' | 'in-progress' | 'planned';
  featured: boolean;
  createdAt: Date;
  updatedAt: Date;
  teamMembers?: string[];
}

interface Skill {
  id: string;
  name: string;
  category: 'frontend' | 'backend' | 'mobile' | 'design' | 'other';
  level: 'beginner' | 'intermediate' | 'advanced' | 'expert';
  yearsExperience: number;
  projects: string[]; // Project IDs
}

interface Experience {
  id: string;
  title: string;
  company: string;
  location: string;
  startDate: Date;
  endDate?: Date;
  current: boolean;
  description: string;
  achievements: string[];
  technologies: string[];
}

interface Education {
  id: string;
  degree: string;
  institution: string;
  location: string;
  startDate: Date;
  endDate?: Date;
  current: boolean;
  gpa?: string;
  achievements: string[];
}

interface Portfolio {
  id: string;
  userId: string;
  personalInfo: {
    name: string;
    title: string;
    bio: string;
    email: string;
    phone?: string;
    location: string;
    website?: string;
    github?: string;
    linkedin?: string;
    avatar?: string;
  };
  projects: Project[];
  skills: Skill[];
  experience: Experience[];
  education: Education[];
  achievements: string[];
  stats: {
    projectsCompleted: number;
    technologiesUsed: number;
    hoursOfCode: number;
    openSourceContributions: number;
  };
  isPublic: boolean;
  customDomain?: string;
  theme: 'light' | 'dark' | 'auto';
}

const ProjectCard: React.FC<{
  project: Project;
  onView: (project: Project) => void;
  onEdit?: (project: Project) => void;
  onDelete?: (projectId: string) => void;
  isOwner: boolean;
  isDarkMode: boolean;
}> = ({ project, onView, onEdit, onDelete, isOwner, isDarkMode }) => {
  const { bgCard, text } = useThemeClasses();

  const getTypeIcon = (type: string) => {
    switch (type) {
      case 'web': return <Globe className="w-4 h-4" />;
      case 'mobile': return <Phone className="w-4 h-4" />;
      case 'desktop': return <Briefcase className="w-4 h-4" />;
      case 'game': return <Code className="w-4 h-4" />;
      case 'ai': return <Star className="w-4 h-4" />;
      default: return <FileText className="w-4 h-4" />;
    }
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'completed': return 'bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-200';
      case 'in-progress': return 'bg-yellow-100 text-yellow-800 dark:bg-yellow-900 dark:text-yellow-200';
      case 'planned': return 'bg-gray-100 text-gray-800 dark:bg-gray-900 dark:text-gray-200';
      default: return 'bg-gray-100 text-gray-800';
    }
  };

  return (
    <motion.div
      className={`${bgCard} rounded-xl border overflow-hidden hover:shadow-lg transition-shadow cursor-pointer`}
      whileHover={{ y: -2 }}
      onClick={() => onView(project)}
    >
      {/* Project Image */}
      <div className="relative h-48 overflow-hidden">
        {project.images.length > 0 ? (
          <LazyImage
            src={project.images[0]}
            alt={project.title}
            className="w-full h-full object-cover"
          />
        ) : (
          <div className={`w-full h-full flex items-center justify-center ${
            isDarkMode ? 'bg-gray-700' : 'bg-gray-100'
          }`}>
            {getTypeIcon(project.type)}
          </div>
        )}
        
        {project.featured && (
          <div className="absolute top-3 right-3">
            <Badge variant="primary" size="sm">
              <Star className="w-3 h-3 mr-1" />
              Vedette
            </Badge>
          </div>
        )}
        
        {/* Overlay */}
        <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent opacity-0 hover:opacity-100 transition-opacity duration-300">
          <div className="absolute bottom-4 left-4 right-4">
            <div className="flex gap-2">
              {project.liveUrl && (
                <Button
                  size="sm"
                  variant="primary"
                  icon={<ExternalLink className="w-3 h-3" />}
                  onClick={(e) => {
                    e.stopPropagation();
                    window.open(project.liveUrl, '_blank');
                  }}
                >
                  Live
                </Button>
              )}
              {project.githubUrl && (
                <Button
                  size="sm"
                  variant="outline"
                  icon={<Github className="w-3 h-3" />}
                  onClick={(e) => {
                    e.stopPropagation();
                    window.open(project.githubUrl, '_blank');
                  }}
                />
              )}
            </div>
          </div>
        </div>
      </div>

      {/* Project Content */}
      <div className="p-6">
        <div className="flex items-start justify-between mb-3">
          <div>
            <h3 className={`text-lg font-semibold ${text} mb-1`}>{project.title}</h3>
            <p className={`text-sm ${isDarkMode ? 'text-gray-400' : 'text-gray-600'} line-clamp-2`}>
              {project.description}
            </p>
          </div>
          
          <span className={`text-xs px-2 py-1 rounded-full ${getStatusColor(project.status)}`}>
            {project.status === 'completed' ? 'Terminé' : 
             project.status === 'in-progress' ? 'En cours' : 'Planifié'}
          </span>
        </div>
        
        {/* Technologies */}
        <div className="flex flex-wrap gap-2 mb-4">
          {project.technologies.slice(0, 4).map(tech => (
            <Badge key={tech} variant="outline" size="sm">
              {tech}
            </Badge>
          ))}
          {project.technologies.length > 4 && (
            <Badge variant="outline" size="sm">
              +{project.technologies.length - 4}
            </Badge>
          )}
        </div>
        
        {/* Project Stats */}
        <div className="flex items-center justify-between text-xs text-gray-500">
          <div className="flex items-center gap-3">
            <span className="flex items-center gap-1">
              <Eye className="w-3 h-3" />
              1.2k
            </span>
            <span className="flex items-center gap-1">
              <Heart className="w-3 h-3" />
              89
            </span>
          </div>
          <span>{project.createdAt.toLocaleDateString()}</span>
        </div>
        
        {/* Owner Actions */}
        {isOwner && (
          <div className="flex gap-2 mt-4 pt-4 border-t">
            <Button
              variant="outline"
              size="sm"
              onClick={(e) => {
                e.stopPropagation();
                onEdit?.(project);
              }}
              icon={<Edit className="w-3 h-3" />}
            >
              Modifier
            </Button>
            <Button
              variant="danger"
              size="sm"
              onClick={(e) => {
                e.stopPropagation();
                onDelete?.(project.id);
              }}
              icon={<Trash2 className="w-3 h-3" />}
            />
          </div>
        )}
      </div>
    </motion.div>
  );
};

const SkillsSection: React.FC<{
  skills: Skill[];
  isOwner: boolean;
  onEdit?: () => void;
  isDarkMode: boolean;
}> = ({ skills, isOwner, onEdit, isDarkMode }) => {
  const { bgCard, text } = useThemeClasses();

  const skillsByCategory = skills.reduce((acc, skill) => {
    if (!acc[skill.category]) acc[skill.category] = [];
    acc[skill.category].push(skill);
    return acc;
  }, {} as Record<string, Skill[]>);

  const getLevelColor = (level: string) => {
    switch (level) {
      case 'expert': return 'bg-purple-500';
      case 'advanced': return 'bg-blue-500';
      case 'intermediate': return 'bg-green-500';
      case 'beginner': return 'bg-yellow-500';
      default: return 'bg-gray-500';
    }
  };

  const categoryIcons = {
    frontend: <Globe className="w-5 h-5" />,
    backend: <Code className="w-5 h-5" />,
    mobile: <Phone className="w-5 h-5" />,
    design: <ImageIcon className="w-5 h-5" />,
    other: <FileText className="w-5 h-5" />
  };

  return (
    <Card>
      <CardHeader
        title="Compétences"
        subtitle={`${skills.length} compétences maîtrisées`}
        actions={isOwner && onEdit && (
          <Button
            variant="outline"
            size="sm"
            onClick={onEdit}
            icon={<Edit className="w-4 h-4" />}
          >
            Modifier
          </Button>
        )}
      />
      <CardContent>
        <div className="space-y-6">
          {Object.entries(skillsByCategory).map(([category, categorySkills]) => (
            <div key={category}>
              <div className="flex items-center gap-2 mb-3">
                <div className="text-cyan-500">
                  {categoryIcons[category as keyof typeof categoryIcons]}
                </div>
                <h4 className={`font-medium ${text} capitalize`}>
                  {category === 'frontend' ? 'Frontend' :
                   category === 'backend' ? 'Backend' :
                   category === 'mobile' ? 'Mobile' :
                   category === 'design' ? 'Design' : 'Autres'}
                </h4>
                <span className="text-sm text-gray-500">({categorySkills.length})</span>
              </div>
              
              <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                {categorySkills.map(skill => (
                  <div key={skill.id} className={`${bgCard} p-3 rounded-lg border`}>
                    <div className="flex items-center justify-between mb-2">
                      <span className={`font-medium ${text}`}>{skill.name}</span>
                      <span className="text-xs text-gray-500">{skill.yearsExperience} an{skill.yearsExperience > 1 ? 's' : ''}</span>
                    </div>
                    
                    <div className="flex items-center gap-2">
                      <div className="flex-1 bg-gray-200 dark:bg-gray-700 rounded-full h-2">
                        <div
                          className={`h-2 rounded-full ${getLevelColor(skill.level)}`}
                          style={{
                            width: skill.level === 'expert' ? '100%' :
                                   skill.level === 'advanced' ? '80%' :
                                   skill.level === 'intermediate' ? '60%' : '40%'
                          }}
                        />
                      </div>
                      <span className="text-xs text-gray-500 capitalize">
                        {skill.level === 'expert' ? 'Expert' :
                         skill.level === 'advanced' ? 'Avancé' :
                         skill.level === 'intermediate' ? 'Intermédiaire' : 'Débutant'}
                      </span>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          ))}
        </div>
      </CardContent>
    </Card>
  );
};

const StatsSection: React.FC<{
  stats: Portfolio['stats'];
  isDarkMode: boolean;
}> = ({ stats, isDarkMode }) => {
  const { bgCard, text } = useThemeClasses();

  const statItems = [
    { label: 'Projets', value: stats.projectsCompleted, icon: <Briefcase className="w-5 h-5" />, color: 'text-blue-500' },
    { label: 'Technologies', value: stats.technologiesUsed, icon: <Code className="w-5 h-5" />, color: 'text-green-500' },
    { label: 'Heures de code', value: `${stats.hoursOfCode}h`, icon: <Calendar className="w-5 h-5" />, color: 'text-purple-500' },
    { label: 'Contributions', value: stats.openSourceContributions, icon: <Github className="w-5 h-5" />, color: 'text-cyan-500' }
  ];

  return (
    <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
      {statItems.map((stat, index) => (
        <motion.div
          key={stat.label}
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: index * 0.1 }}
          className={`${bgCard} p-4 rounded-lg border text-center`}
        >
          <div className={`${stat.color} mb-2 flex justify-center`}>{stat.icon}</div>
          <div className={`text-2xl font-bold ${text}`}>{stat.value}</div>
          <div className={`text-xs ${isDarkMode ? 'text-gray-400' : 'text-gray-600'}`}>
            {stat.label}
          </div>
        </motion.div>
      ))}
    </div>
  );
};

export const PortfolioSystem: React.FC = () => {
  const { bg, text } = useThemeClasses();
  const [isDarkMode] = useState(false);
  const [portfolio, setPortfolio] = useState<Portfolio | null>(null);
  const [selectedProject, setSelectedProject] = useState<Project | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [isOwner] = useState(true); // Simuler que l'utilisateur est le propriétaire

  // Portfolio de démonstration
  const demoPortfolio: Portfolio = {
    id: '1',
    userId: 'user1',
    personalInfo: {
      name: 'Alice Martin',
      title: 'Développeuse Full Stack',
      bio: 'Passionnée par le développement web et mobile, je crée des solutions innovantes avec les dernières technologies.',
      email: 'alice.martin@example.com',
      phone: '+226 XX XX XX XX',
      location: 'Ouagadougou, Burkina Faso',
      website: 'https://alicedev.com',
      github: 'https://github.com/alice-dev',
      linkedin: 'https://linkedin.com/in/alice-martin'
    },
    projects: [
      {
        id: '1',
        title: 'E-Commerce Platform',
        description: 'Plateforme e-commerce complète avec panier, paiement et gestion des stocks.',
        type: 'web',
        technologies: ['React', 'Node.js', 'MongoDB', 'Stripe'],
        images: ['/api/placeholder/400/300'],
        liveUrl: 'https://demo-ecommerce.com',
        githubUrl: 'https://github.com/alice-dev/ecommerce',
        status: 'completed',
        featured: true,
        createdAt: new Date('2024-01-15'),
        updatedAt: new Date('2024-02-20'),
        teamMembers: ['Bob Dupont', 'Claire Durand']
      },
      {
        id: '2',
        title: 'Mobile Banking App',
        description: 'Application mobile de banque avec transactions sécurisées et notifications.',
        type: 'mobile',
        technologies: ['React Native', 'Firebase', 'Redux'],
        images: ['/api/placeholder/400/300'],
        status: 'in-progress',
        featured: false,
        createdAt: new Date('2024-02-01'),
        updatedAt: new Date('2024-02-15')
      },
      {
        id: '3',
        title: 'AI Chat Assistant',
        description: 'Assistant conversationnel basé sur l\'IA pour le support client.',
        type: 'ai',
        technologies: ['Python', 'TensorFlow', 'FastAPI'],
        images: ['/api/placeholder/400/300'],
        githubUrl: 'https://github.com/alice-dev/ai-chat',
        status: 'completed',
        featured: true,
        createdAt: new Date('2023-12-10'),
        updatedAt: new Date('2024-01-05')
      }
    ],
    skills: [
      {
        id: '1',
        name: 'React',
        category: 'frontend',
        level: 'advanced',
        yearsExperience: 3,
        projects: ['1', '2']
      },
      {
        id: '2',
        name: 'Node.js',
        category: 'backend',
        level: 'intermediate',
        yearsExperience: 2,
        projects: ['1']
      },
      {
        id: '3',
        name: 'React Native',
        category: 'mobile',
        level: 'intermediate',
        yearsExperience: 1,
        projects: ['2']
      },
      {
        id: '4',
        name: 'Python',
        category: 'backend',
        level: 'advanced',
        yearsExperience: 4,
        projects: ['3']
      }
    ],
    experience: [],
    education: [],
    achievements: ['Winner Hackathon 2023', 'Best Project Award'],
    stats: {
      projectsCompleted: 12,
      technologiesUsed: 15,
      hoursOfCode: 2500,
      openSourceContributions: 45
    },
    isPublic: true,
    theme: 'auto'
  };

  useEffect(() => {
    setTimeout(() => {
      setPortfolio(demoPortfolio);
      setIsLoading(false);
    }, 1000);
  }, []);

  const handleProjectView = (project: Project) => {
    setSelectedProject(project);
  };

  const handleProjectDelete = (projectId: string) => {
    if (portfolio) {
      setPortfolio({
        ...portfolio,
        projects: portfolio.projects.filter(p => p.id !== projectId)
      });
    }
  };

  if (isLoading) {
    return (
      <div className={`min-h-screen ${bg} ${text} flex items-center justify-center`}>
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-cyan-500"></div>
      </div>
    );
  }

  if (!portfolio) {
    return (
      <div className={`min-h-screen ${bg} ${text} flex items-center justify-center`}>
        <div className="text-center">
          <User className={`w-16 h-16 mx-auto mb-4 ${isDarkMode ? 'text-gray-600' : 'text-gray-400'}`} />
          <h3 className={`text-xl font-medium mb-2 ${text}`}>
            Portfolio non trouvé
          </h3>
          <p className={`${isDarkMode ? 'text-gray-400' : 'text-gray-600'}`}>
            Créez votre portfolio pour commencer.
          </p>
        </div>
      </div>
    );
  }

  return (
    <div className={`min-h-screen ${bg} ${text} p-6`}>
      <div className="max-w-7xl mx-auto">
        {/* Header */}
        <div className="text-center mb-12">
          <div className="flex items-center justify-center mb-4">
            <Briefcase className="w-12 h-12 text-cyan-500 mr-3" />
            <h1 className="text-4xl font-bold">Portfolio</h1>
          </div>
          <p className={`text-lg ${isDarkMode ? 'text-gray-400' : 'text-gray-600'}`}>
            {portfolio.personalInfo.name} • {portfolio.personalInfo.title}
          </p>
        </div>

        {/* Personal Info */}
        <Card className="mb-8">
          <CardContent className="p-8">
            <div className="flex items-center gap-6 mb-6">
              <div className="w-24 h-24 rounded-full bg-gradient-to-br from-cyan-500 to-blue-600 flex items-center justify-center text-white text-3xl font-bold">
                {portfolio.personalInfo.name.split(' ').map(n => n[0]).join('')}
              </div>
              
              <div className="flex-1">
                <h2 className={`text-2xl font-bold ${text} mb-2`}>
                  {portfolio.personalInfo.name}
                </h2>
                <p className={`text-lg ${isDarkMode ? 'text-gray-400' : 'text-gray-600'} mb-4`}>
                  {portfolio.personalInfo.title}
                </p>
                
                <div className="flex flex-wrap gap-4 text-sm text-gray-500">
                  <span className="flex items-center gap-1">
                    <Mail className="w-4 h-4" />
                    {portfolio.personalInfo.email}
                  </span>
                  <span className="flex items-center gap-1">
                    <MapPin className="w-4 h-4" />
                    {portfolio.personalInfo.location}
                  </span>
                  {portfolio.personalInfo.website && (
                    <span className="flex items-center gap-1">
                      <Globe className="w-4 h-4" />
                      <a href={portfolio.personalInfo.website} target="_blank" rel="noopener noreferrer" className="text-cyan-500 hover:underline">
                        Site web
                      </a>
                    </span>
                  )}
                </div>
              </div>
              
              {isOwner && (
                <Button
                  variant="outline"
                  icon={<Edit className="w-4 h-4" />}
                >
                  Modifier
                </Button>
              )}
            </div>
            
            <p className={`${isDarkMode ? 'text-gray-300' : 'text-gray-700'} leading-relaxed`}>
              {portfolio.personalInfo.bio}
            </p>
          </CardContent>
        </Card>

        {/* Stats */}
        <StatsSection stats={portfolio.stats} isDarkMode={isDarkMode} />

        {/* Projects */}
        <div className="mt-12">
          <div className="flex items-center justify-between mb-6">
            <h2 className={`text-2xl font-bold ${text}`}>Projets</h2>
            {isOwner && (
              <Button
                variant="primary"
                icon={<Plus className="w-4 h-4" />}
              >
                Ajouter un projet
              </Button>
            )}
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {portfolio.projects.map(project => (
              <ProjectCard
                key={project.id}
                project={project}
                onView={handleProjectView}
                onDelete={handleProjectDelete}
                isOwner={isOwner}
                isDarkMode={isDarkMode}
              />
            ))}
          </div>
        </div>

        {/* Skills */}
        <div className="mt-12">
          <SkillsSection
            skills={portfolio.skills}
            isOwner={isOwner}
            isDarkMode={isDarkMode}
          />
        </div>

        {/* Achievements */}
        {portfolio.achievements.length > 0 && (
          <div className="mt-12">
            <Card>
              <CardHeader
                title="Réalisations"
                icon={<Award className="w-5 h-5 text-yellow-500" />}
              />
              <CardContent>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  {portfolio.achievements.map((achievement, index) => (
                    <motion.div
                      key={index}
                      initial={{ opacity: 0, x: -20 }}
                      animate={{ opacity: 1, x: 0 }}
                      transition={{ delay: index * 0.1 }}
                      className={`p-4 rounded-lg border ${isDarkMode ? 'bg-gray-800' : 'bg-gray-50'}`}
                    >
                      <div className="flex items-center gap-3">
                        <Award className="w-5 h-5 text-yellow-500" />
                        <span className={`font-medium ${text}`}>{achievement}</span>
                      </div>
                    </motion.div>
                  ))}
                </div>
              </CardContent>
            </Card>
          </div>
        )}
      </div>
    </div>
  );
};

export default PortfolioSystem;
