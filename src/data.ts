import { Member, Event, Project, Module, LearningPath } from './types';

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
    clubRole: 'Vice-Président',
  },
  {
    id: 'MBR-2290-Z',
    name: 'Jordan Smith',
    email: 'jordan@codelhub.io',
    handle: 'jsmith_sec',
    role: 'Spécialiste Sécurité',
    status: 'Expired',
    avatar: 'https://i.pravatar.cc/150?u=jordan',
    level: 2,
    isAdmin: false,
    clubRole: 'Secrétaire',
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
    clubRole: 'Comptable',
  }
];

export const MOCK_EVENTS: Event[] = [
  {
    id: 'EVT-001',
    title: 'Linux Kernel Deep Dive',
    type: 'WORKSHOP',
    date: 'Aujourd\'hui',
    time: '18:00',
    registered: 65,
    location: 'Salle de Conférence B',
    thumbnail: 'https://images.unsplash.com/photo-1629654297299-c8506221ca97?q=80&w=1000&auto=format&fit=crop',
  },
  {
    id: 'EVT-002',
    title: 'Cyber-Guard Hackathon 2026',
    type: 'HACKATHON',
    date: '24 - 26 Mai',
    time: '48 Heures',
    registered: 240,
    location: 'Campus Numérique',
    thumbnail: 'https://images.unsplash.com/photo-1550751827-4bd374c3f58b?q=80&w=1000&auto=format&fit=crop',
  },
  {
    id: 'EVT-003',
    title: 'L’Intelligence Artificielle de Demain',
    type: 'TALK',
    date: '28 Mai',
    time: '14:00',
    registered: 120,
    location: 'Amphithéâtre Turing',
    thumbnail: 'https://images.unsplash.com/photo-1677442136019-21780ecad995?q=80&w=1000&auto=format&fit=crop',
  }
];

export const MOCK_PROJECTS: Project[] = [
  {
    id: 'PROJ-042',
    title: 'OpenERP Hub',
    description: 'Une plateforme de gestion open-source pour les clubs et associations étudiantes.',
    tags: ['EXPRESS', 'REACT', 'POSTGRES'],
    status: 'BUSY',
    progress: 82,
    commits: 1284,
  },
  {
    id: 'PROJ-055',
    title: 'Bot Discord Communautaire',
    description: 'Automatisation des rôles, gestion des événements et gamification du serveur club.',
    tags: ['TYPESCRIPT', 'DISCORD.JS'],
    status: 'LIVE',
    progress: 100,
    commits: 452,
  },
  {
    id: 'PROJ-018',
    title: 'Plateforme CTF Internale',
    description: 'Moteur de challenges en cybersécurité pour les membres du club.',
    tags: ['PYTHON', 'DOCKER', 'K8S'],
    status: 'STABLE',
    progress: 45,
    commits: 89,
  }
];

export const MOCK_MODULES: Module[] = [
  {
    id: 'MOD-001',
    title: 'Maîtriser Git & GitHub',
    instructor: 'Alex Rivera',
    duration: '3.5 heures',
    progress: 100,
    icon: 'CODE',
  },
  {
    id: 'MOD-002',
    title: 'Introduction à la Cryptographie',
    instructor: 'Jordan Smith',
    duration: '8.2 heures',
    progress: 15,
    icon: 'SHIELD',
  },
  {
    id: 'MOD-003',
    title: 'Développement Mobile Flutter',
    instructor: 'Elena Vance',
    duration: '12.0 heures',
    progress: 60,
    icon: 'SMARTPHONE',
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
};
