// Export unifié pour tous les types
export * from './auth/User.types';
export * from './auth/Auth.types';
export * from './features/Event.types';
export * from './features/Project.types';
export * from './features/Quiz.types';
export * from './features/Calendar.types';
export * from './features/Portfolio.types';
export * from './ui/Component.types';

// Legacy exports pour compatibilité
export type { AppUser, UserPermissions } from './auth/User.types';
export type { UserStatus, UserRole } from './auth/Auth.types';
export type { Event, EventFilter, EventRegistration } from './features/Event.types';
export type { Project, TeamMember, ProjectFilter } from './features/Project.types';
export type { Quiz, Question, QuizAttempt, QuizProgress } from './features/Quiz.types';
export type { CalendarEvent, CalendarView, CalendarFilter } from './features/Calendar.types';
export type { Portfolio, PortfolioSkill, PortfolioFilter } from './features/Portfolio.types';
export type { ButtonProps, CardProps, InputProps, BadgeProps } from './ui/Component.types';
