export interface Event {
  id: string;
  title: string;
  description: string;
  type: 'workshop' | 'meeting' | 'deadline' | 'social' | 'competition';
  date: string;
  time: string;
  duration: string;
  location: string;
  maxParticipants: number;
  registered: number;
  status: 'upcoming' | 'ongoing' | 'completed' | 'cancelled';
  organizer: string;
  tags: string[];
  requirements?: string[];
  materials?: string[];
  imageUrl?: string;
  createdAt: string;
  updatedAt: string;
}

export interface EventFilter {
  type?: string;
  status?: string;
  dateRange?: {
    start: string;
    end: string;
  };
  tags?: string[];
}

export interface EventRegistration {
  eventId: string;
  userId: string;
  registeredAt: string;
  status: 'registered' | 'attended' | 'cancelled';
  notes?: string;
}
