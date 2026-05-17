export interface CalendarEvent {
  id: string;
  title: string;
  description?: string;
  start: Date;
  end: Date;
  type: 'event' | 'reminder' | 'task' | 'deadline';
  category: 'workshop' | 'meeting' | 'social' | 'deadline' | 'personal' | 'other';
  location?: string;
  attendees?: string[];
  isAllDay: boolean;
  color?: string;
  reminder?: {
    enabled: boolean;
    minutesBefore: number;
  };
  recurrence?: RecurrenceRule;
  metadata?: {
    eventId?: string;
    projectId?: string;
    quizId?: string;
  };
  createdBy: string;
  createdAt: string;
  updatedAt: string;
}

export interface RecurrenceRule {
  frequency: 'daily' | 'weekly' | 'monthly' | 'yearly';
  interval: number;
  endDate?: Date;
  daysOfWeek?: number[]; // 0-6 (Sunday-Saturday)
  dayOfMonth?: number; // 1-31
  weekOfMonth?: number; // 1-5, -1 (last)
}

export interface CalendarView {
  type: 'month' | 'week' | 'day' | 'list';
  date: Date;
  events: CalendarEvent[];
}

export interface CalendarFilter {
  type?: string;
  category?: string;
  dateRange?: {
    start: Date;
    end: Date;
  };
  attendees?: string[];
  searchTerm?: string;
}

export interface CalendarSettings {
  defaultView: 'month' | 'week' | 'day' | 'list';
  weekStartsOn: 0 | 1; // 0 = Sunday, 1 = Monday
  timeFormat: '12h' | '24h';
  showWeekends: boolean;
  defaultEventDuration: number; // en minutes
  defaultReminder: number; // en minutes
}
