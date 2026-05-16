import { Member, Event, Project, Module, LearningPath, AppUser, Badge, LibraryResource } from './types';

export const MOCK_MEMBERS: Member[] = [
  {
    id: 'MBR-8821-X',
    name: 'Alex Rivera',
    email: 'alex@codelhub.io',
    handle: 'dev_alex',
    role: 'Développeur Fullstack',
    status: 'Active',
    avatar: 'https://i.pravatar.cc/150?u=alex',
    level: 4,
    isAdmin: true,
    clubRole: 'Président',
    badges: [
      {
        id: 'badge-001',
        name: 'Développeur Actif',
        description: 'A contribué à 5 projets',
        icon: '💻',
        color: '#8B5CF6',
        category: 'PROJET',
        points: 20,
        unlockedAt: '2024-01-15T10:00:00Z'
      },
      {
        id: 'badge-002',
        name: 'Mentor Étudiant',
        description: 'A aidé 10 étudiants',
        icon: '🎓',
        color: '#F59E0B',
        category: 'MENTORAT',
        points: 25,
        unlockedAt: '2024-02-20T14:30:00Z'
      }
    ],
    points: 145,
    completedModules: ['mod-001', 'mod-003', 'mod-005'],
    attendedEvents: ['evt-001', 'evt-002'],
    projectsContributed: ['proj-001', 'proj-002', 'proj-003']
  },
  {
    id: 'MBR-7442-A',
    name: 'Elena Vance',
    email: 'elena@codelhub.io',
    handle: 'elena_v',
    role: 'Lead UI/UX',
    status: 'Active',
    avatar: 'https://i.pravatar.cc/150?u=elena',
    level: 3,
    isAdmin: true,
    clubRole: 'Responsable Communication',
    badges: [
      {
        id: 'badge-003',
        name: 'Team Player',
        description: 'A travaillé sur 3 projets d équipe',
        icon: '👥',
        color: '#06B6D4',
        category: 'PROJET',
        points: 20,
        unlockedAt: '2024-03-10T09:15:00Z'
      }
    ],
    points: 85,
    completedModules: ['mod-002', 'mod-004'],
    attendedEvents: ['evt-001'],
    projectsContributed: ['proj-001', 'proj-002']
  },
  {
    id: 'MBR-2290-Z',
    name: 'Jordan Smith',
    email: 'jordan@codelhub.io',
    handle: 'jsmith_sec',
    role: 'Spécialiste Sécurité',
    status: 'Active',
    avatar: 'https://i.pravatar.cc/150?u=jordan',
    level: 2,
    isAdmin: false,
    clubRole: 'Responsable Formation',
    badges: [
      {
        id: 'badge-004',
        name: 'Contributeur',
        description: 'A participé à 3 activités',
        icon: '🤝',
        color: '#3B82F6',
        category: 'PARTICIPATION',
        points: 15,
        unlockedAt: '2024-04-05T16:45:00Z'
      }
    ],
    points: 60,
    completedModules: ['mod-001'],
    attendedEvents: ['evt-001', 'evt-003'],
    projectsContributed: ['proj-001']
  },
  {
    id: 'MBR-4512-B',
    name: 'Sarah Chen',
    email: 'sarah@codelhub.io',
    handle: 'sarah_c',
    role: 'Chef de Produit',
    status: 'Active',
    avatar: 'https://i.pravatar.cc/150?u=sarah',
    level: 3,
    isAdmin: false,
    clubRole: 'Responsable Projets',
    badges: [
      {
        id: 'badge-005',
        name: 'Débutant',
        description: 'Premiers pas dans CODEL',
        icon: '🌱',
        color: '#10B981',
        category: 'PARTICIPATION',
        points: 5,
        unlockedAt: '2024-04-01T12:00:00Z'
      }
    ],
    points: 35,
    completedModules: ['mod-001', 'mod-002'],
    attendedEvents: ['evt-001'],
    projectsContributed: []
  }
];

export const MOCK_EVENTS: Event[] = [
  {
    id: 'EVT-001',
    title: 'Linux Kernel Deep Dive',
    type: 'ATELIER',
    date: 'Aujourd\'hui',
    time: '18:00',
    duration: '3 heures',
    registered: 65,
    maxParticipants: 80,
    location: 'Salle de Conférence B',
    thumbnail: 'https://images.unsplash.com/photo-1629654297299-c8506221ca97?q=80&w=1000&auto=format&fit=crop',
    description: 'Exploration approfondie du kernel Linux pour développeurs avancés',
    instructor: 'Jordan Smith',
    requirements: ['Connaissances de base en C', 'Linux installé'],
    qrCodeEnabled: true,
    pointsReward: 15
  },
  {
    id: 'EVT-002',
    title: 'Cyber-Guard Hackathon 2026',
    type: 'HACKATHON',
    date: '24 - 26 Mai',
    time: '48 Heures',
    duration: '48 heures',
    registered: 240,
    maxParticipants: 300,
    location: 'Campus Numérique',
    thumbnail: 'https://images.unsplash.com/photo-1550751827-4bd374c3f58b?q=80&w=1000&auto=format&fit=crop',
    description: 'Compétition de cybersécurité en équipe avec défis réels',
    requirements: ['Équipe de 3-4 personnes', 'Portable avec outils de sécurité'],
    qrCodeEnabled: true,
    pointsReward: 50,
    badgeReward: {
      id: 'hackathon-winner',
      name: 'Hackathon Winner',
      description: 'A gagné un hackathon',
      icon: '🥇',
      color: '#FFD700',
      category: 'EXCEPTIONNEL',
      points: 50
    }
  },
  {
    id: 'EVT-003',
    title: 'L\'Intelligence Artificielle de Demain',
    type: 'CONFERENCE',
    date: '28 Mai',
    time: '14:00',
    duration: '2 heures',
    registered: 120,
    maxParticipants: 200,
    location: 'Amphithéâtre Turing',
    thumbnail: 'https://images.unsplash.com/photo-1677442136019-21780ecad995?q=80&w=1000&auto=format&fit=crop',
    description: 'Conférence sur les dernières avancées en IA et Machine Learning',
    instructor: 'Dr. Marie Laurent',
    requirements: [],
    qrCodeEnabled: true,
    pointsReward: 10
  },
  {
    id: 'EVT-004',
    title: 'Coding Night: React Challenge',
    type: 'CODING_NIGHT',
    date: '30 Mai',
    time: '20:00',
    duration: '4 heures',
    registered: 45,
    maxParticipants: 60,
    location: 'Labo Informatique',
    thumbnail: 'https://images.unsplash.com/photo-1633356122544-f134324a6cee?q=80&w=1000&auto=format&fit=crop',
    description: 'Session de codage nocturne avec défis React',
    requirements: ['Connaissances de base en React'],
    qrCodeEnabled: true,
    pointsReward: 20
  },
  {
    id: 'EVT-005',
    title: 'Formation Git & GitHub',
    type: 'FORMATION',
    date: '1 Juin',
    time: '10:00',
    duration: '3.5 heures',
    registered: 30,
    maxParticipants: 40,
    location: 'Salle A101',
    thumbnail: 'https://images.unsplash.com/photo-1618401471353-b98afee0b2eb?q=80&w=1000&auto=format&fit=crop',
    description: 'Formation complète sur Git et GitHub pour débutants',
    instructor: 'Alex Rivera',
    requirements: ['Ordinateur portable', 'Compte GitHub'],
    qrCodeEnabled: true,
    pointsReward: 15
  }
];

export const MOCK_PROJECTS: Project[] = [
  {
    id: 'PROJ-042',
    title: 'OpenERP Hub',
    description: 'Une plateforme de gestion open-source pour les clubs et associations étudiantes.',
    tags: ['EXPRESS', 'REACT', 'POSTGRES'],
    status: 'DEVELOPPEMENT',
    progress: 82,
    commits: 1284,
    teamMembers: ['MBR-8821-X', 'MBR-7442-A', 'MBR-4512-B'],
    teamLead: 'MBR-8821-X',
    technologies: ['Node.js', 'React', 'PostgreSQL', 'Docker'],
    difficulty: 'Intermédiaire',
    category: 'WEB',
    repository: 'https://github.com/codelhub/openerp-hub',
    demoUrl: 'https://demo.openerp-hub.codelhub.io',
    thumbnail: 'https://images.unsplash.com/photo-1460925895917-afdab827c52f?q=80&w=1000&auto=format&fit=crop'
  },
  {
    id: 'PROJ-055',
    title: 'Bot Discord Communautaire',
    description: 'Automatisation des rôles, gestion des événements et gamification du serveur club.',
    tags: ['TYPESCRIPT', 'DISCORD.JS'],
    status: 'LIVE',
    progress: 100,
    commits: 452,
    teamMembers: ['MBR-2290-Z', 'MBR-7442-A'],
    teamLead: 'MBR-2290-Z',
    technologies: ['TypeScript', 'Discord.js', 'SQLite', 'Node.js'],
    difficulty: 'Débutant',
    category: 'OUTIL',
    repository: 'https://github.com/codelhub/discord-bot',
    liveUrl: 'https://discord.gg/codelhub',
    thumbnail: 'https://images.unsplash.com/photo-1516035069379-2cc6ab1f9e2b?q=80&w=1000&auto=format&fit=crop'
  },
  {
    id: 'PROJ-018',
    title: 'Plateforme CTF Interne',
    description: 'Moteur de challenges en cybersécurité pour les membres du club.',
    tags: ['PYTHON', 'DOCKER', 'K8S'],
    status: 'STABLE',
    progress: 45,
    commits: 89,
    teamMembers: ['MBR-2290-Z'],
    teamLead: 'MBR-2290-Z',
    technologies: ['Python', 'Docker', 'Kubernetes', 'Flask'],
    difficulty: 'Avancé',
    category: 'OUTIL',
    repository: 'https://github.com/codelhub/ctf-platform',
    demoUrl: 'https://ctf.codelhub.io',
    thumbnail: 'https://images.unsplash.com/photo-1550751827-4bd374c3f58b?q=80&w=1000&auto=format&fit=crop'
  },
  {
    id: 'PROJ-077',
    title: 'App Mobile CODEL',
    description: 'Application mobile pour la gestion du club et notifications push.',
    tags: ['FLUTTER', 'FIREBASE'],
    status: 'PLANIFICATION',
    progress: 15,
    commits: 23,
    teamMembers: ['MBR-7442-A', 'MBR-4512-B'],
    teamLead: 'MBR-7442-A',
    technologies: ['Flutter', 'Firebase', 'Dart', 'Material Design'],
    difficulty: 'Intermédiaire',
    category: 'MOBILE',
    repository: 'https://github.com/codelhub/mobile-app',
    thumbnail: 'https://images.unsplash.com/photo-1512941937669-29a223d514c5?q=80&w=1000&auto=format&fit=crop'
  }
];

export const MOCK_MODULES: Module[] = [
  {
    id: 'MOD-001',
    title: 'Maîtriser Git & GitHub',
    description: 'Apprendre les bases de Git et GitHub pour le travail collaboratif',
    instructor: 'Alex Rivera',
    duration: '3.5 heures',
    progress: 100,
    icon: 'CODE',
    difficulty: 'Débutant',
    category: 'OUTILS',
    technologies: ['Git', 'GitHub', 'Command Line'],
    prerequisites: [],
    resources: [
      {
        id: 'res-001',
        title: 'Introduction à Git',
        type: 'VIDEO',
        url: 'https://example.com/git-intro',
        description: 'Vidéo d\'introduction à Git'
      },
      {
        id: 'res-002',
        title: 'Exercices pratiques',
        type: 'EXERCICE',
        url: 'https://example.com/git-exercises',
        description: 'Exercices pour pratiquer Git'
      }
    ],
    exercises: [
      {
        id: 'ex-001',
        title: 'Créer votre premier repository',
        description: 'Créez un repository GitHub et faites votre premier commit',
        difficulty: 'Débutant',
        instructions: ['1. Créer un compte GitHub', '2. Créer un nouveau repository', '3. Faire un commit initial'],
        solution: 'Utiliser git init et git remote add origin',
        hints: ['Pensez à utiliser git status pour vérifier'],
        timeLimit: 30
      }
    ],
    quiz: {
      id: 'quiz-001',
      title: 'Quiz Git & GitHub',
      questions: [
        {
          id: 'q-001',
          question: 'Quelle commande crée un nouveau repository Git?',
          type: 'MULTIPLE_CHOICE',
          options: ['git init', 'git create', 'git new', 'git start'],
          correctAnswer: 'git init',
          points: 5
        }
      ],
      passingScore: 70,
      timeLimit: 15
    }
  },
  {
    id: 'MOD-002',
    title: 'Introduction à la Cryptographie',
    description: 'Les bases de la cryptographie et de la sécurité des données',
    instructor: 'Jordan Smith',
    duration: '8.2 heures',
    progress: 15,
    icon: 'SHIELD',
    difficulty: 'Intermédiaire',
    category: 'CYBERSECURITE',
    technologies: ['OpenSSL', 'AES', 'RSA'],
    prerequisites: ['Connaissances de base en mathématiques'],
    resources: [
      {
        id: 'res-003',
        title: 'Principes de cryptographie',
        type: 'PDF',
        url: 'https://example.com/crypto-principles',
        description: 'Document sur les principes fondamentaux'
      }
    ],
    exercises: [
      {
        id: 'ex-002',
        title: 'Chiffrement simple',
        description: 'Implémenter un chiffrement César',
        difficulty: 'Débutant',
        instructions: ['1. Comprendre le principe', '2. Implémenter en Python'],
        solution: 'Décalage de caractères dans l\'alphabet',
        hints: ['Utiliser les codes ASCII'],
        timeLimit: 45
      }
    ]
  },
  {
    id: 'MOD-003',
    title: 'Développement Mobile Flutter',
    description: 'Créer des applications mobiles avec Flutter',
    instructor: 'Elena Vance',
    duration: '12.0 heures',
    progress: 60,
    icon: 'SMARTPHONE',
    difficulty: 'Intermédiaire',
    category: 'DEVELOPPEMENT',
    technologies: ['Flutter', 'Dart', 'Material Design'],
    prerequisites: ['Connaissances en programmation orientée objet'],
    resources: [
      {
        id: 'res-004',
        title: 'Installation Flutter',
        type: 'LINK',
        url: 'https://flutter.dev/docs/get-started/install',
        description: 'Guide d\'installation officiel'
      }
    ]
  },
  {
    id: 'MOD-004',
    title: 'HTML & CSS Fundamentals',
    description: 'Les bases du développement web avec HTML et CSS',
    instructor: 'Sarah Chen',
    duration: '6.0 heures',
    progress: 0,
    icon: 'GLOBE',
    difficulty: 'Débutant',
    category: 'DEVELOPPEMENT',
    technologies: ['HTML5', 'CSS3', 'Responsive Design'],
    prerequisites: [],
    resources: [
      {
        id: 'res-005',
        title: 'MDN Web Docs',
        type: 'LINK',
        url: 'https://developer.mozilla.org/',
        description: 'Documentation web complète'
      }
    ]
  },
  {
    id: 'MOD-005',
    title: 'Python pour débutants',
    description: 'Introduction à la programmation avec Python',
    instructor: 'Alex Rivera',
    duration: '8.0 heures',
    progress: 0,
    icon: 'CODE',
    difficulty: 'Débutant',
    category: 'DEVELOPPEMENT',
    technologies: ['Python', 'PIP', 'Virtual Env'],
    prerequisites: [],
    resources: [
      {
        id: 'res-006',
        title: 'Python Tutorial',
        type: 'VIDEO',
        url: 'https://docs.python.org/3/tutorial/',
        description: 'Tutoriel officiel Python'
      }
    ]
  }
];

export const MOCK_DIGITAL_LIBRARY: LibraryResource[] = [
  {
    id: 'lib-001',
    title: 'Python Crash Course',
    category: 'PROGRAMMATION',
    type: 'LIVRE',
    url: 'https://example.com/python-crash-course',
    downloadUrl: 'https://example.com/python-crash-course.pdf',
    description: 'Guide complet pour apprendre Python rapidement',
    author: 'Eric Matthes',
    difficulty: 'Débutant',
    tags: ['Python', 'Programmation', 'Débutant'],
    rating: 4.8,
    downloads: 1250,
    views: 3400,
    fileSize: '15.2 MB',
    pages: 544,
    language: 'FR',
    isOfflineAvailable: true,
    uploadedAt: '2024-01-15T10:00:00Z',
    lastUpdated: '2024-01-15T10:00:00Z',
    isOfficial: false,
    isVerified: true
  },
  {
    id: 'lib-002',
    title: 'Introduction à l\'IA',
    category: 'IA',
    type: 'PDF',
    url: 'https://example.com/intro-ia',
    downloadUrl: 'https://example.com/intro-ia.pdf',
    description: 'Concepts fondamentaux de l\'intelligence artificielle',
    author: 'Dr. Sophie Martin',
    difficulty: 'Intermédiaire',
    tags: ['IA', 'Machine Learning', 'Concepts'],
    rating: 4.6,
    downloads: 890,
    views: 2100,
    fileSize: '8.7 MB',
    pages: 312,
    language: 'FR',
    isOfflineAvailable: true,
    uploadedAt: '2024-02-20T14:30:00Z',
    lastUpdated: '2024-02-20T14:30:00Z',
    isOfficial: false,
    isVerified: true
  },
  {
    id: 'lib-003',
    title: 'Sécurité Réseau',
    category: 'CYBERSECURITE',
    type: 'TUTORIEL',
    url: 'https://example.com/securite-reseau',
    downloadUrl: 'https://example.com/securite-reseau.pdf',
    description: 'Protéger ses réseaux et systèmes',
    author: 'Jordan Smith',
    difficulty: 'Avancé',
    tags: ['Sécurité', 'Réseau', 'Cybersécurité'],
    rating: 4.7,
    downloads: 567,
    views: 1800,
    fileSize: '12.1 MB',
    pages: 428,
    language: 'FR',
    isOfflineAvailable: true,
    uploadedAt: '2024-03-10T09:15:00Z',
    lastUpdated: '2024-03-10T09:15:00Z',
    isOfficial: false,
    isVerified: true
  },
  {
    id: 'lib-004',
    title: 'Design UI/UX',
    category: 'DESIGN',
    type: 'VIDEO',
    url: 'https://example.com/ui-ux-design',
    description: 'Créer des interfaces utilisateur modernes',
    author: 'Elena Vance',
    difficulty: 'Intermédiaire',
    tags: ['Design', 'UI', 'UX', 'Figma'],
    rating: 4.9,
    downloads: 1100,
    views: 3200,
    duration: '2h 45min',
    language: 'FR',
    isOfflineAvailable: false,
    uploadedAt: '2024-01-25T16:45:00Z',
    lastUpdated: '2024-01-25T16:45:00Z',
    isOfficial: false,
    isVerified: true
  },
  {
    id: 'lib-005',
    title: 'Mathématiques pour l\'IA',
    category: 'MATHEMATIQUES',
    type: 'PDF',
    url: 'https://example.com/maths-ia',
    downloadUrl: 'https://example.com/maths-ia.pdf',
    description: 'Bases mathématiques pour l\'intelligence artificielle',
    author: 'Prof. Robert Dubois',
    difficulty: 'Avancé',
    tags: ['Mathématiques', 'IA', 'Algèbre'],
    rating: 4.5,
    downloads: 445,
    views: 980,
    fileSize: '22.4 MB',
    pages: 672,
    language: 'FR',
    isOfflineAvailable: true,
    uploadedAt: '2024-02-15T11:20:00Z',
    lastUpdated: '2024-02-15T11:20:00Z',
    isOfficial: false,
    isVerified: true
  },
  {
    id: 'lib-006',
    title: 'Réseaux informatiques',
    category: 'RESEAUX',
    type: 'GUIDE', // Corriger 'LIEN' en 'GUIDE'
    url: 'https://example.com/reseaux-info',
    description: 'Comprendre les protocoles et architectures réseau',
    author: 'Sarah Chen',
    difficulty: 'Intermédiaire',
    tags: ['Réseau', 'TCP/IP', 'Protocoles'],
    rating: 4.4,
    downloads: 678,
    views: 1200,
    fileSize: '5.8 MB',
    pages: 156,
    language: 'FR',
    isOfflineAvailable: true,
    uploadedAt: '2024-03-05T13:45:00Z',
    lastUpdated: '2024-03-05T13:45:00Z',
    isOfficial: false,
    isVerified: true
  }
];

// Parcours d\'apprentissage CODEL par niveau
export const CODEL_LEARNING_PATHS: LearningPath[] = [
  // Parcours Débutant
  {
    id: 'path-debutant-001',
    title: 'Développeur Web Débutant',
    description: 'Parfait pour commencer en développement web',
    modules: 5,
    enrolled: 120,
    tags: ['HTML', 'CSS', 'JavaScript', 'Git'],
    thumbnail: 'https://images.unsplash.com/photo-1460925895917-afdab827c52f?q=80&w=1000&auto=format&fit=crop',
    difficulty: 'Débutant',
    duration: '40 heures',
    technologies: ['HTML5', 'CSS3', 'JavaScript', 'Git', 'GitHub'],
    instructor: 'Sarah Chen'
  },
  {
    id: 'path-debutant-002',
    title: 'Python Fundamentals',
    description: 'Apprendre les bases de la programmation Python',
    modules: 4,
    enrolled: 95,
    tags: ['Python', 'Algorithmique', 'Bases'],
    thumbnail: 'https://images.unsplash.com/photo-1526379095098-d400fd0bf935?q=80&w=1000&auto=format&fit=crop',
    difficulty: 'Débutant',
    duration: '35 heures',
    technologies: ['Python', 'PIP', 'Algorithmique'],
    instructor: 'Alex Rivera'
  },
  // Parcours Intermédiaire
  {
    id: 'path-intermediaire-001',
    title: 'Fullstack JavaScript',
    description: 'Maîtriser JavaScript et ses frameworks modernes',
    modules: 8,
    enrolled: 78,
    tags: ['React', 'Node.js', 'MongoDB', 'JavaScript'],
    thumbnail: 'https://images.unsplash.com/photo-1627398242454-45a1465c2479?q=80&w=1000&auto=format&fit=crop',
    difficulty: 'Intermédiaire',
    duration: '80 heures',
    technologies: ['JavaScript', 'React', 'Node.js', 'Express', 'MongoDB'],
    instructor: 'Alex Rivera'
  },
  {
    id: 'path-intermediaire-002',
    title: 'Mobile Development',
    description: 'Créer des applications mobiles natives',
    modules: 6,
    enrolled: 62,
    tags: ['Flutter', 'Dart', 'Mobile'],
    thumbnail: 'https://images.unsplash.com/photo-1512941937669-29a223d514c5?q=80&w=1000&auto=format&fit=crop',
    difficulty: 'Intermédiaire',
    duration: '65 heures',
    technologies: ['Flutter', 'Dart', 'Firebase', 'Material Design'],
    instructor: 'Elena Vance'
  },
  // Parcours Avancé
  {
    id: 'path-avance-001',
    title: 'Intelligence Artificielle',
    description: 'Deep Learning et Machine Learning avancé',
    modules: 10,
    enrolled: 45,
    tags: ['IA', 'Python', 'TensorFlow', 'Deep Learning'],
    thumbnail: 'https://images.unsplash.com/photo-1677442136019-21780ecad995?q=80&w=1000&auto=format&fit=crop',
    difficulty: 'Avancé',
    duration: '120 heures',
    technologies: ['Python', 'TensorFlow', 'Keras', 'NumPy', 'Pandas'],
    instructor: 'Dr. Marie Laurent'
  },
  {
    id: 'path-avance-002',
    title: 'Cybersécurité Expert',
    description: 'Devenir expert en sécurité informatique',
    modules: 12,
    enrolled: 38,
    tags: ['Sécurité', 'Réseau', 'Cryptographie', 'Pentesting'],
    thumbnail: 'https://images.unsplash.com/photo-1550751827-4bd374c3f58b?q=80&w=1000&auto=format&fit=crop',
    difficulty: 'Avancé',
    duration: '150 heures',
    technologies: ['Linux', 'Réseau', 'Cryptographie', 'Kali Linux', 'Metasploit'],
    instructor: 'Jordan Smith'
  }
];

export const MOCK_PATH: LearningPath = {
  id: 'PATH-001',
  title: 'Fullstack Architect',
  description: 'Devenez expert dans la conception d\'applications web scalables et modernes.',
  modules: 15,
  enrolled: 450,
  tags: ['CLOUD', 'BACKEND', 'FRONTEND'],
  thumbnail: 'https://images.unsplash.com/photo-1498050108023-c5249f4df085?q=80&w=1200&auto=format&fit=crop',
  difficulty: 'Avancé',
  duration: '120 heures',
  technologies: ['React', 'Node.js', 'MongoDB', 'Docker', 'AWS', 'GraphQL'],
  instructor: 'Alex Rivera'
};
