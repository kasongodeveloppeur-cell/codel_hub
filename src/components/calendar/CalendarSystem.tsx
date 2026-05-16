import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { 
  Calendar as CalendarIcon, 
  Clock, 
  MapPin, 
  Users, 
  Bell, 
  Plus,
  ChevronLeft,
  ChevronRight,
  X,
  Edit,
  Trash2,
  Video,
  Code,
  Coffee,
  Award,
  BookOpen,
  Gamepad2
} from 'lucide-react';
import { Button } from '../ui/Button';
import { Card, CardHeader, CardContent } from '../ui/Card';
import { Badge } from '../ui/Badge';
import { useThemeClasses } from '../../hooks/useTheme';

interface CalendarEvent {
  id: string;
  title: string;
  description: string;
  date: Date;
  startTime: string;
  endTime: string;
  type: 'workshop' | 'meeting' | 'deadline' | 'social' | 'competition' | 'study_group';
  location?: string;
  isOnline: boolean;
  maxParticipants?: number;
  currentParticipants: number;
  organizer: string;
  tags: string[];
  reminder?: boolean;
}

interface NotificationSettings {
  events: boolean;
  deadlines: boolean;
  workshops: boolean;
  social: boolean;
  reminderTime: number; // minutes before
}

const EventCard: React.FC<{
  event: CalendarEvent;
  onClick: (event: CalendarEvent) => void;
  isDarkMode: boolean;
}> = ({ event, onClick, isDarkMode }) => {
  const { bgCard, text } = useThemeClasses();

  const getEventIcon = (type: string) => {
    switch (type) {
      case 'workshop': return <Code className="w-4 h-4" />;
      case 'meeting': return <Users className="w-4 h-4" />;
      case 'deadline': return <Clock className="w-4 h-4" />;
      case 'social': return <Coffee className="w-4 h-4" />;
      case 'competition': return <Award className="w-4 h-4" />;
      case 'study_group': return <BookOpen className="w-4 h-4" />;
      default: return <CalendarIcon className="w-4 h-4" />;
    }
  };

  const getEventColor = (type: string) => {
    switch (type) {
      case 'workshop': return 'bg-blue-100 text-blue-800 dark:bg-blue-900 dark:text-blue-200';
      case 'meeting': return 'bg-purple-100 text-purple-800 dark:bg-purple-900 dark:text-purple-200';
      case 'deadline': return 'bg-red-100 text-red-800 dark:bg-red-900 dark:text-red-200';
      case 'social': return 'bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-200';
      case 'competition': return 'bg-yellow-100 text-yellow-800 dark:bg-yellow-900 dark:text-yellow-200';
      case 'study_group': return 'bg-cyan-100 text-cyan-800 dark:bg-cyan-900 dark:text-cyan-200';
      default: return 'bg-gray-100 text-gray-800';
    }
  };

  const formatDate = (date: Date) => {
    return date.toLocaleDateString('fr-FR', { 
      day: 'numeric', 
      month: 'short' 
    });
  };

  return (
    <motion.div
      className={`${bgCard} rounded-lg border p-4 cursor-pointer hover:shadow-md transition-shadow`}
      whileHover={{ y: -2 }}
      onClick={() => onClick(event)}
    >
      <div className="flex items-start justify-between mb-3">
        <div className="flex items-center gap-3">
          <div className={`p-2 rounded-lg ${getEventColor(event.type)}`}>
            {getEventIcon(event.type)}
          </div>
          <div>
            <h4 className={`font-semibold ${text} text-sm`}>{event.title}</h4>
            <p className={`text-xs ${isDarkMode ? 'text-gray-400' : 'text-gray-600'}`}>
              {formatDate(event.date)} • {event.startTime}
            </p>
          </div>
        </div>
        
        {event.reminder && (
          <Bell className="w-4 h-4 text-cyan-500" />
        )}
      </div>
      
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-3 text-xs text-gray-500">
          {event.isOnline ? (
            <span className="flex items-center gap-1">
              <Video className="w-3 h-3" />
              En ligne
            </span>
          ) : (
            <span className="flex items-center gap-1">
              <MapPin className="w-3 h-3" />
              {event.location}
            </span>
          )}
          
          {event.maxParticipants && (
            <span className="flex items-center gap-1">
              <Users className="w-3 h-3" />
              {event.currentParticipants}/{event.maxParticipants}
            </span>
          )}
        </div>
      </div>
    </motion.div>
  );
};

const EventModal: React.FC<{
  event: CalendarEvent | null;
  isOpen: boolean;
  onClose: () => void;
  onJoin?: (eventId: string) => void;
  onEdit?: (event: CalendarEvent) => void;
  onDelete?: (eventId: string) => void;
  isDarkMode: boolean;
}> = ({ event, isOpen, onClose, onJoin, onEdit, onDelete, isDarkMode }) => {
  const { bg, text } = useThemeClasses();

  if (!event || !isOpen) return null;

  const getEventIcon = (type: string) => {
    switch (type) {
      case 'workshop': return <Code className="w-6 h-6" />;
      case 'meeting': return <Users className="w-6 h-6" />;
      case 'deadline': return <Clock className="w-6 h-6" />;
      case 'social': return <Coffee className="w-6 h-6" />;
      case 'competition': return <Award className="w-6 h-6" />;
      case 'study_group': return <BookOpen className="w-6 h-6" />;
      default: return <CalendarIcon className="w-6 h-6" />;
    }
  };

  const getEventColor = (type: string) => {
    switch (type) {
      case 'workshop': return 'text-blue-500';
      case 'meeting': return 'text-purple-500';
      case 'deadline': return 'text-red-500';
      case 'social': return 'text-green-500';
      case 'competition': return 'text-yellow-500';
      case 'study_group': return 'text-cyan-500';
      default: return 'text-gray-500';
    }
  };

  return (
    <AnimatePresence>
      <div className="fixed inset-0 bg-black/50 flex items-center justify-center p-4 z-50">
        <motion.div
          initial={{ opacity: 0, scale: 0.9 }}
          animate={{ opacity: 1, scale: 1 }}
          exit={{ opacity: 0, scale: 0.9 }}
          className={`${bg} rounded-xl max-w-2xl w-full max-h-[90vh] overflow-y-auto`}
        >
          <div className="p-6">
            {/* Header */}
            <div className="flex items-start justify-between mb-6">
              <div className="flex items-center gap-4">
                <div className={`p-3 rounded-lg ${getEventColor(event.type)}`}>
                  {getEventIcon(event.type)}
                </div>
                <div>
                  <h2 className={`text-2xl font-bold ${text}`}>{event.title}</h2>
                  <p className={`${isDarkMode ? 'text-gray-400' : 'text-gray-600'}`}>
                    Organisé par {event.organizer}
                  </p>
                </div>
              </div>
              
              <Button
                variant="ghost"
                size="sm"
                onClick={onClose}
                icon={<X className="w-4 h-4" />}
              />
            </div>

            {/* Event Details */}
            <div className="space-y-6">
              <div>
                <h3 className={`font-semibold ${text} mb-2`}>Description</h3>
                <p className={`${isDarkMode ? 'text-gray-300' : 'text-gray-700'}`}>
                  {event.description}
                </p>
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <h4 className={`font-medium ${text} mb-1`}>Date</h4>
                  <p className={`${isDarkMode ? 'text-gray-400' : 'text-gray-600'}`}>
                    {event.date.toLocaleDateString('fr-FR', { 
                      weekday: 'long',
                      year: 'numeric',
                      month: 'long',
                      day: 'numeric'
                    })}
                  </p>
                </div>
                
                <div>
                  <h4 className={`font-medium ${text} mb-1`}>Heure</h4>
                  <p className={`${isDarkMode ? 'text-gray-400' : 'text-gray-600'}`}>
                    {event.startTime} - {event.endTime}
                  </p>
                </div>
              </div>

              <div>
                <h4 className={`font-medium ${text} mb-1`}>Lieu</h4>
                <p className={`${isDarkMode ? 'text-gray-400' : 'text-gray-600'}`}>
                  {event.isOnline ? 'En ligne (lien envoyé aux participants)' : event.location}
                </p>
              </div>

              {event.maxParticipants && (
                <div>
                  <h4 className={`font-medium ${text} mb-1`}>Participants</h4>
                  <div className="flex items-center gap-2">
                    <div className="flex -space-x-2">
                      {[...Array(Math.min(event.currentParticipants, 5))].map((_, i) => (
                        <div
                          key={i}
                          className="w-8 h-8 rounded-full bg-cyan-500 border-2 border-white dark:border-gray-800 flex items-center justify-center text-white text-xs font-medium"
                        >
                          {String.fromCharCode(65 + i)}
                        </div>
                      ))}
                    </div>
                    <span className={`${isDarkMode ? 'text-gray-400' : 'text-gray-600'}`}>
                      {event.currentParticipants}/{event.maxParticipants} participants
                    </span>
                  </div>
                </div>
              )}

              {event.tags.length > 0 && (
                <div>
                  <h4 className={`font-medium ${text} mb-2`}>Tags</h4>
                  <div className="flex flex-wrap gap-2">
                    {event.tags.map(tag => (
                      <Badge key={tag} variant="outline" size="sm">
                        {tag}
                      </Badge>
                    ))}
                  </div>
                </div>
              )}
            </div>

            {/* Actions */}
            <div className="flex gap-3 mt-8 pt-6 border-t">
              {onJoin && event.type !== 'deadline' && (
                <Button
                  onClick={() => onJoin(event.id)}
                  disabled={event.maxParticipants ? event.currentParticipants >= event.maxParticipants : false}
                  className="flex-1"
                >
                  {event.maxParticipants && event.currentParticipants >= event.maxParticipants 
                    ? 'Complet' 
                    : 'Participer'
                  }
                </Button>
              )}
              
              {onEdit && (
                <Button
                  variant="outline"
                  onClick={() => onEdit(event)}
                  icon={<Edit className="w-4 h-4" />}
                >
                  Modifier
                </Button>
              )}
              
              {onDelete && (
                <Button
                  variant="danger"
                  onClick={() => onDelete(event.id)}
                  icon={<Trash2 className="w-4 h-4" />}
                >
                  Supprimer
                </Button>
              )}
            </div>
          </div>
        </motion.div>
      </div>
    </AnimatePresence>
  );
};

export const CalendarSystem: React.FC = () => {
  const { bg, text } = useThemeClasses();
  const [isDarkMode] = useState(false); // État local pour le mode sombre
  const [currentDate, setCurrentDate] = useState(new Date());
  const [selectedEvent, setSelectedEvent] = useState<CalendarEvent | null>(null);
  const [showEventModal, setShowEventModal] = useState(false);
  const [viewMode, setViewMode] = useState<'month' | 'week' | 'list'>('month');
  const [events, setEvents] = useState<CalendarEvent[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  // Événements de démonstration
  const demoEvents: CalendarEvent[] = [
    {
      id: '1',
      title: 'Workshop React Hooks',
      description: 'Apprenez à maîtriser les hooks React avec des exemples pratiques et projets concrets.',
      date: new Date(2024, 0, 15),
      startTime: '14:00',
      endTime: '16:00',
      type: 'workshop',
      location: 'Salle A101',
      isOnline: false,
      maxParticipants: 25,
      currentParticipants: 18,
      organizer: 'Alice Martin',
      tags: ['React', 'Frontend', 'JavaScript'],
      reminder: true
    },
    {
      id: '2',
      title: 'Réunion hebdomadaire CODEL',
      description: 'Point sur les projets en cours et planification des prochaines activités.',
      date: new Date(2024, 0, 17),
      startTime: '18:00',
      endTime: '19:00',
      type: 'meeting',
      isOnline: true,
      maxParticipants: 50,
      currentParticipants: 32,
      organizer: 'Bob Dupont',
      tags: ['Réunion', 'Planning'],
      reminder: true
    },
    {
      id: '3',
      title: 'Deadline: Projet Web',
      description: 'Date limite pour soumettre les projets finaux du cours de développement web.',
      date: new Date(2024, 0, 20),
      startTime: '23:59',
      endTime: '23:59',
      type: 'deadline',
      isOnline: true,
      currentParticipants: 0,
      organizer: 'Prof. Chen',
      tags: ['Deadline', 'Projet', 'Web'],
      reminder: true
    },
    {
      id: '4',
      title: 'Coffee & Code',
      description: 'Session informelle de programmation et networking entre membres.',
      date: new Date(2024, 0, 22),
      startTime: '15:00',
      endTime: '17:00',
      type: 'social',
      location: 'Café CODEL',
      isOnline: false,
      maxParticipants: 30,
      currentParticipants: 12,
      organizer: 'Claire Durand',
      tags: ['Social', 'Networking', 'Détente'],
      reminder: false
    },
    {
      id: '5',
      title: 'Hackathon CODEL 2024',
      description: 'Compétition de programmation de 24h avec des prix à gagner!',
      date: new Date(2024, 0, 25),
      startTime: '10:00',
      endTime: '10:00',
      type: 'competition',
      location: 'Amphi B',
      isOnline: false,
      maxParticipants: 100,
      currentParticipants: 67,
      organizer: 'Équipe CODEL',
      tags: ['Compétition', 'Hackathon', 'Prix'],
      reminder: true
    }
  ];

  useEffect(() => {
    setTimeout(() => {
      setEvents(demoEvents);
      setIsLoading(false);
    }, 1000);
  }, []);

  const handleEventClick = (event: CalendarEvent) => {
    setSelectedEvent(event);
    setShowEventModal(true);
  };

  const handleJoinEvent = (eventId: string) => {
    setEvents(prev => prev.map(event => 
      event.id === eventId 
        ? { ...event, currentParticipants: event.currentParticipants + 1 }
        : event
    ));
    setShowEventModal(false);
  };

  const handleDeleteEvent = (eventId: string) => {
    setEvents(prev => prev.filter(event => event.id !== eventId));
    setShowEventModal(false);
  };

  const getDaysInMonth = (date: Date) => {
    const year = date.getFullYear();
    const month = date.getMonth();
    const firstDay = new Date(year, month, 1);
    const lastDay = new Date(year, month + 1, 0);
    const daysInMonth = lastDay.getDate();
    const startingDayOfWeek = firstDay.getDay();

    const days = [];
    
    // Add empty cells for days before month starts
    for (let i = 0; i < startingDayOfWeek; i++) {
      days.push(null);
    }
    
    // Add days of the month
    for (let i = 1; i <= daysInMonth; i++) {
      days.push(new Date(year, month, i));
    }

    return days;
  };

  const getEventsForDay = (day: Date) => {
    return events.filter(event => {
      const eventDate = new Date(event.date);
      return eventDate.toDateString() === day.toDateString();
    });
  };

  const navigateMonth = (direction: number) => {
    setCurrentDate(prev => {
      const newDate = new Date(prev);
      newDate.setMonth(prev.getMonth() + direction);
      return newDate;
    });
  };

  if (isLoading) {
    return (
      <div className={`min-h-screen ${bg} ${text} flex items-center justify-center`}>
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-cyan-500"></div>
      </div>
    );
  }

  return (
    <div className={`min-h-screen ${bg} ${text} p-6`}>
      <div className="max-w-7xl mx-auto">
        {/* Header */}
        <div className="flex items-center justify-between mb-8">
          <div className="flex items-center gap-4">
            <CalendarIcon className="w-8 h-8 text-cyan-500" />
            <div>
              <h1 className="text-3xl font-bold">Calendrier CODEL</h1>
              <p className={`${isDarkMode ? 'text-gray-400' : 'text-gray-600'}`}>
                Ne manquez aucune activité du club
              </p>
            </div>
          </div>
          
          <div className="flex items-center gap-3">
            <div className="flex items-center bg-gray-100 dark:bg-gray-800 rounded-lg">
              <Button
                variant={viewMode === 'month' ? 'primary' : 'ghost'}
                size="sm"
                onClick={() => setViewMode('month')}
              >
                Mois
              </Button>
              <Button
                variant={viewMode === 'week' ? 'primary' : 'ghost'}
                size="sm"
                onClick={() => setViewMode('week')}
              >
                Semaine
              </Button>
              <Button
                variant={viewMode === 'list' ? 'primary' : 'ghost'}
                size="sm"
                onClick={() => setViewMode('list')}
              >
                Liste
              </Button>
            </div>
            
            <Button
              variant="primary"
              icon={<Plus className="w-4 h-4" />}
            >
              Ajouter
            </Button>
          </div>
        </div>

        {/* Calendar View */}
        {viewMode === 'month' && (
          <Card>
            <CardContent className="p-6">
              {/* Month Navigation */}
              <div className="flex items-center justify-between mb-6">
                <Button
                  variant="outline"
                  onClick={() => navigateMonth(-1)}
                  icon={<ChevronLeft className="w-4 h-4" />}
                />
                
                <h2 className="text-xl font-semibold">
                  {currentDate.toLocaleDateString('fr-FR', { 
                    month: 'long', 
                    year: 'numeric' 
                  })}
                </h2>
                
                <Button
                  variant="outline"
                  onClick={() => navigateMonth(1)}
                  icon={<ChevronRight className="w-4 h-4" />}
                />
              </div>

              {/* Calendar Grid */}
              <div className="grid grid-cols-7 gap-px bg-gray-200 dark:bg-gray-700">
                {/* Day headers */}
                {['Dim', 'Lun', 'Mar', 'Mer', 'Jeu', 'Ven', 'Sam'].map(day => (
                  <div
                    key={day}
                    className={`p-3 text-center text-sm font-medium ${bg} ${text}`}
                  >
                    {day}
                  </div>
                ))}
                
                {/* Calendar days */}
                {getDaysInMonth(currentDate).map((day, index) => {
                  const dayEvents = day ? getEventsForDay(day) : [];
                  const isToday = day?.toDateString() === new Date().toDateString();

                  return (
                    <div
                      key={index}
                      className={`min-h-[100px] p-2 ${bg} ${
                        isToday ? 'bg-cyan-50 dark:bg-cyan-900/20' : ''
                      }`}
                    >
                      {day && (
                        <>
                          <div className={`text-sm font-medium mb-1 ${
                            isToday ? 'text-cyan-600' : text
                          }`}>
                            {day.getDate()}
                          </div>
                          
                          <div className="space-y-1">
                            {dayEvents.slice(0, 2).map(event => (
                              <div
                                key={event.id}
                                className="text-xs p-1 rounded cursor-pointer hover:opacity-80"
                                style={{
                                  backgroundColor: event.type === 'workshop' ? '#3B82F6' :
                                                  event.type === 'meeting' ? '#8B5CF6' :
                                                  event.type === 'deadline' ? '#EF4444' :
                                                  event.type === 'social' ? '#10B981' :
                                                  event.type === 'competition' ? '#F59E0B' :
                                                  '#06B6D4',
                                  color: 'white'
                                }}
                                onClick={() => handleEventClick(event)}
                              >
                                {event.title}
                              </div>
                            ))}
                            
                            {dayEvents.length > 2 && (
                              <div className="text-xs text-gray-500">
                                +{dayEvents.length - 2} plus
                              </div>
                            )}
                          </div>
                        </>
                      )}
                    </div>
                  );
                })}
              </div>
            </CardContent>
          </Card>
        )}

        {/* List View */}
        {viewMode === 'list' && (
          <div className="space-y-4">
            {events.length > 0 ? (
              events.map(event => (
                <EventCard
                  key={event.id}
                  event={event}
                  onClick={handleEventClick}
                  isDarkMode={isDarkMode}
                />
              ))
            ) : (
              <div className="text-center py-12">
                <CalendarIcon className={`w-16 h-16 mx-auto mb-4 ${isDarkMode ? 'text-gray-600' : 'text-gray-400'}`} />
                <h3 className={`text-xl font-medium mb-2 ${text}`}>
                  Aucun événement prévu
                </h3>
                <p className={`${isDarkMode ? 'text-gray-400' : 'text-gray-600'}`}>
                  Revenez bientôt pour de nouvelles activités!
                </p>
              </div>
            )}
          </div>
        )}

        {/* Event Modal */}
        <EventModal
          event={selectedEvent}
          isOpen={showEventModal}
          onClose={() => setShowEventModal(false)}
          onJoin={handleJoinEvent}
          onDelete={handleDeleteEvent}
          isDarkMode={isDarkMode}
        />
      </div>
    </div>
  );
};

export default CalendarSystem;
