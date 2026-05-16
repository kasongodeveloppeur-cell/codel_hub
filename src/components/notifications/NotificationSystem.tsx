import React, { useState, useEffect, useCallback } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { 
  Bell, 
  BellOff, 
  X, 
  Check, 
  AlertCircle, 
  Info, 
  CheckCircle, 
  XCircle,
  Settings,
  Volume2,
  VolumeX,
  Wifi,
  WifiOff,
  Calendar,
  Award,
  MessageSquare,
  Heart,
  Star,
  Users,
  BookOpen,
  Code,
  Target,
  TrendingUp,
  Clock,
  Zap
} from 'lucide-react';
import { Button } from '../ui/Button';
import { Card, CardHeader, CardContent } from '../ui/Card';
import { Badge } from '../ui/Badge';
import { useThemeClasses } from '../../hooks/useTheme';

interface Notification {
  id: string;
  type: 'info' | 'success' | 'warning' | 'error' | 'achievement' | 'reminder' | 'social' | 'system';
  title: string;
  message: string;
  timestamp: Date;
  read: boolean;
  priority: 'low' | 'medium' | 'high' | 'urgent';
  actions?: {
    label: string;
    action: () => void;
    variant?: 'primary' | 'secondary' | 'danger';
  }[];
  metadata?: {
    source?: string;
    category?: string;
    relatedId?: string;
    imageUrl?: string;
  };
}

interface NotificationSettings {
  enabled: boolean;
  sound: boolean;
  desktop: boolean;
  types: {
    info: boolean;
    success: boolean;
    warning: boolean;
    error: boolean;
    achievement: boolean;
    reminder: boolean;
    social: boolean;
    system: boolean;
  };
  priorities: {
    low: boolean;
    medium: boolean;
    high: boolean;
    urgent: boolean;
  };
  quietHours: {
    enabled: boolean;
    start: string;
    end: string;
  };
}

const NotificationItem: React.FC<{
  notification: Notification;
  onRead: (id: string) => void;
  onDelete: (id: string) => void;
  onAction: (id: string, action: () => void) => void;
  isDarkMode: boolean;
}> = ({ notification, onRead, onDelete, onAction, isDarkMode }) => {
  const { bgCard, text } = useThemeClasses();

  const getIcon = (type: string) => {
    switch (type) {
      case 'info': return <Info className="w-5 h-5" />;
      case 'success': return <CheckCircle className="w-5 h-5" />;
      case 'warning': return <AlertCircle className="w-5 h-5" />;
      case 'error': return <XCircle className="w-5 h-5" />;
      case 'achievement': return <Award className="w-5 h-5" />;
      case 'reminder': return <Calendar className="w-5 h-5" />;
      case 'social': return <Users className="w-5 h-5" />;
      case 'system': return <Settings className="w-5 h-5" />;
      default: return <Bell className="w-5 h-5" />;
    }
  };

  const getTypeColor = (type: string) => {
    switch (type) {
      case 'info': return 'text-blue-500 bg-blue-100 dark:bg-blue-900/20';
      case 'success': return 'text-green-500 bg-green-100 dark:bg-green-900/20';
      case 'warning': return 'text-yellow-500 bg-yellow-100 dark:bg-yellow-900/20';
      case 'error': return 'text-red-500 bg-red-100 dark:bg-red-900/20';
      case 'achievement': return 'text-purple-500 bg-purple-100 dark:bg-purple-900/20';
      case 'reminder': return 'text-cyan-500 bg-cyan-100 dark:bg-cyan-900/20';
      case 'social': return 'text-pink-500 bg-pink-100 dark:bg-pink-900/20';
      case 'system': return 'text-gray-500 bg-gray-100 dark:bg-gray-900/20';
      default: return 'text-gray-500 bg-gray-100 dark:bg-gray-900/20';
    }
  };

  const getPriorityColor = (priority: string) => {
    switch (priority) {
      case 'urgent': return 'border-red-500';
      case 'high': return 'border-orange-500';
      case 'medium': return 'border-yellow-500';
      case 'low': return 'border-gray-300';
      default: return 'border-gray-300';
    }
  };

  const formatTime = (date: Date) => {
    const now = new Date();
    const diff = now.getTime() - date.getTime();
    const minutes = Math.floor(diff / 60000);
    const hours = Math.floor(diff / 3600000);
    const days = Math.floor(diff / 86400000);

    if (minutes < 1) return 'À l\'instant';
    if (minutes < 60) return `Il y a ${minutes} min`;
    if (hours < 24) return `Il y a ${hours}h`;
    return `Il y a ${days}j`;
  };

  return (
    <motion.div
      className={`${bgCard} rounded-lg border p-4 cursor-pointer transition-all hover:shadow-md ${
        !notification.read ? 'font-semibold' : ''
      } ${getPriorityColor(notification.priority)}`}
      whileHover={{ x: 4 }}
      onClick={() => onRead(notification.id)}
    >
      <div className="flex items-start gap-3">
        <div className={`p-2 rounded-lg ${getTypeColor(notification.type)} flex-shrink-0`}>
          {getIcon(notification.type)}
        </div>
        
        <div className="flex-1 min-w-0">
          <div className="flex items-start justify-between mb-2">
            <div>
              <h4 className={`font-medium ${text} mb-1`}>{notification.title}</h4>
              <p className={`text-sm ${isDarkMode ? 'text-gray-400' : 'text-gray-600'} line-clamp-2`}>
                {notification.message}
              </p>
            </div>
            
            <div className="flex items-center gap-2 ml-3">
              {!notification.read && (
                <div className="w-2 h-2 bg-blue-500 rounded-full"></div>
              )}
              <button
                onClick={(e) => {
                  e.stopPropagation();
                  onDelete(notification.id);
                }}
                className="p-1 rounded hover:bg-gray-200 dark:hover:bg-gray-700"
              >
                <X className="w-4 h-4" />
              </button>
            </div>
          </div>
          
          <div className="flex items-center justify-between">
            <span className="text-xs text-gray-500">
              {formatTime(notification.timestamp)}
            </span>
            
            {notification.metadata?.source && (
              <Badge variant="outline" size="sm">
                {notification.metadata.source}
              </Badge>
            )}
          </div>
          
          {notification.actions && notification.actions.length > 0 && (
            <div className="flex gap-2 mt-3">
              {notification.actions.map((action, index) => (
                <Button
                  key={index}
                  size="sm"
                  variant={action.variant || 'primary'}
                  onClick={(e) => {
                    e.stopPropagation();
                    onAction(notification.id, action.action);
                  }}
                >
                  {action.label}
                </Button>
              ))}
            </div>
          )}
        </div>
      </div>
    </motion.div>
  );
};

const NotificationCenter: React.FC<{
  isOpen: boolean;
  onClose: () => void;
  notifications: Notification[];
  settings: NotificationSettings;
  onSettingsChange: (settings: NotificationSettings) => void;
  isDarkMode: boolean;
}> = ({ isOpen, onClose, notifications, settings, onSettingsChange, isDarkMode }) => {
  const { bg, text } = useThemeClasses();
  const [activeTab, setActiveTab] = useState<'all' | 'unread' | 'achievements'>('all');

  const unreadCount = notifications.filter(n => !n.read).length;
  const achievementCount = notifications.filter(n => n.type === 'achievement').length;

  const filteredNotifications = notifications.filter(notification => {
    switch (activeTab) {
      case 'unread':
        return !notification.read;
      case 'achievements':
        return notification.type === 'achievement';
      default:
        return true;
    }
  });

  const markAllAsRead = () => {
    // Implementation would update notifications
    console.log('Mark all as read');
  };

  const clearAll = () => {
    // Implementation would clear notifications
    console.log('Clear all notifications');
  };

  if (!isOpen) return null;

  return (
    <AnimatePresence>
      <div className="fixed inset-0 bg-black/50 flex items-center justify-center p-4 z-50">
        <motion.div
          initial={{ opacity: 0, scale: 0.9 }}
          animate={{ opacity: 1, scale: 1 }}
          exit={{ opacity: 0, scale: 0.9 }}
          className={`${bg} rounded-xl max-w-2xl w-full max-h-[80vh] overflow-hidden flex flex-col`}
        >
          {/* Header */}
          <div className="p-6 border-b border-gray-200 dark:border-gray-700">
            <div className="flex items-center justify-between mb-4">
              <h2 className={`text-2xl font-bold ${text}`}>Notifications</h2>
              <Button
                variant="ghost"
                size="sm"
                onClick={onClose}
                icon={<X className="w-4 h-4" />}
              />
            </div>
            
            {/* Tabs */}
            <div className="flex gap-2 mb-4">
              <button
                onClick={() => setActiveTab('all')}
                className={`px-4 py-2 rounded-lg text-sm font-medium transition-colors ${
                  activeTab === 'all'
                    ? 'bg-cyan-500 text-white'
                    : 'bg-gray-100 dark:bg-gray-800 text-gray-700 dark:text-gray-300'
                }`}
              >
                Toutes ({notifications.length})
              </button>
              <button
                onClick={() => setActiveTab('unread')}
                className={`px-4 py-2 rounded-lg text-sm font-medium transition-colors ${
                  activeTab === 'unread'
                    ? 'bg-cyan-500 text-white'
                    : 'bg-gray-100 dark:bg-gray-800 text-gray-700 dark:text-gray-300'
                }`}
              >
                Non lues ({unreadCount})
              </button>
              <button
                onClick={() => setActiveTab('achievements')}
                className={`px-4 py-2 rounded-lg text-sm font-medium transition-colors ${
                  activeTab === 'achievements'
                    ? 'bg-cyan-500 text-white'
                    : 'bg-gray-100 dark:bg-gray-800 text-gray-700 dark:text-gray-300'
                }`}
              >
                Succès ({achievementCount})
              </button>
            </div>
            
            {/* Actions */}
            <div className="flex gap-2">
              <Button
                variant="outline"
                size="sm"
                onClick={markAllAsRead}
                disabled={unreadCount === 0}
              >
                Marquer tout comme lu
              </Button>
              <Button
                variant="outline"
                size="sm"
                onClick={clearAll}
              >
                Tout effacer
              </Button>
            </div>
          </div>

          {/* Notifications List */}
          <div className="flex-1 overflow-y-auto p-6">
            {filteredNotifications.length > 0 ? (
              <div className="space-y-3">
                {filteredNotifications.map(notification => (
                  <NotificationItem
                    key={notification.id}
                    notification={notification}
                    onRead={(id) => console.log('Mark as read:', id)}
                    onDelete={(id) => console.log('Delete:', id)}
                    onAction={(id, action) => action()}
                    isDarkMode={isDarkMode}
                  />
                ))}
              </div>
            ) : (
              <div className="text-center py-12">
                <Bell className={`w-16 h-16 mx-auto mb-4 ${isDarkMode ? 'text-gray-600' : 'text-gray-400'}`} />
                <h3 className={`text-xl font-medium mb-2 ${text}`}>
                  {activeTab === 'unread' ? 'Aucune notification non lue' : 
                   activeTab === 'achievements' ? 'Aucun succès' : 
                   'Aucune notification'}
                </h3>
                <p className={`${isDarkMode ? 'text-gray-400' : 'text-gray-600'}`}>
                  Vous êtes à jour!
                </p>
              </div>
            )}
          </div>
        </motion.div>
      </div>
    </AnimatePresence>
  );
};

export const NotificationSystem: React.FC = () => {
  const { bg, text } = useThemeClasses();
  const [isDarkMode] = useState(false);
  const [notifications, setNotifications] = useState<Notification[]>([]);
  const [showCenter, setShowCenter] = useState(false);
  const [settings, setSettings] = useState<NotificationSettings>({
    enabled: true,
    sound: true,
    desktop: true,
    types: {
      info: true,
      success: true,
      warning: true,
      error: true,
      achievement: true,
      reminder: true,
      social: true,
      system: true
    },
    priorities: {
      low: true,
      medium: true,
      high: true,
      urgent: true
    },
    quietHours: {
      enabled: false,
      start: '22:00',
      end: '08:00'
    }
  });

  // Demo notifications
  const demoNotifications: Notification[] = [
    {
      id: '1',
      type: 'achievement',
      title: 'Nouveau Succès Débloqué!',
      message: 'Vous avez complété 10 tutoriels. Continuez comme ça!',
      timestamp: new Date(Date.now() - 1000 * 60 * 5),
      read: false,
      priority: 'high',
      metadata: {
        source: 'CODEL Academy',
        category: 'achievement'
      }
    },
    {
      id: '2',
      type: 'social',
      title: 'Nouveau message',
      message: 'Alice vous a envoyé un message concernant le projet React.',
      timestamp: new Date(Date.now() - 1000 * 60 * 30),
      read: false,
      priority: 'medium',
      actions: [
        {
          label: 'Voir',
          action: () => console.log('View message'),
          variant: 'primary'
        }
      ],
      metadata: {
        source: 'Community',
        category: 'message'
      }
    },
    {
      id: '3',
      type: 'reminder',
      title: 'Rappel: Workshop React',
      message: 'Le workshop sur React Hooks commence dans 1 heure.',
      timestamp: new Date(Date.now() - 1000 * 60 * 60),
      read: true,
      priority: 'high',
      actions: [
        {
          label: 'Rejoindre',
          action: () => console.log('Join workshop'),
          variant: 'primary'
        }
      ],
      metadata: {
        source: 'Calendar',
        category: 'event'
      }
    },
    {
      id: '4',
      type: 'success',
      title: 'Quiz Terminé!',
      message: 'Félicitations! Vous avez obtenu 85% au quiz JavaScript.',
      timestamp: new Date(Date.now() - 1000 * 60 * 60 * 2),
      read: true,
      priority: 'medium',
      metadata: {
        source: 'CODEL Academy',
        category: 'quiz'
      }
    },
    {
      id: '5',
      type: 'info',
      title: 'Nouveau tutoriel disponible',
      message: 'Découvrez notre nouveau tutoriel sur TypeScript avancé.',
      timestamp: new Date(Date.now() - 1000 * 60 * 60 * 24),
      read: true,
      priority: 'low',
      actions: [
        {
          label: 'Voir',
          action: () => console.log('View tutorial'),
          variant: 'secondary'
        }
      ],
      metadata: {
        source: 'CODEL Library',
        category: 'content'
      }
    }
  ];

  useEffect(() => {
    setNotifications(demoNotifications);
  }, []);

  const unreadCount = notifications.filter(n => !n.read).length;

  const requestNotificationPermission = async () => {
    if ('Notification' in window) {
      const permission = await Notification.requestPermission();
      if (permission === 'granted') {
        setSettings(prev => ({ ...prev, desktop: true }));
      }
    }
  };

  const showDesktopNotification = (notification: Notification) => {
    if (settings.desktop && 'Notification' in window && Notification.permission === 'granted') {
      new Notification(notification.title, {
        body: notification.message,
        icon: '/favicon.svg',
        tag: notification.id
      });
    }
  };

  const addNotification = useCallback((notification: Omit<Notification, 'id' | 'timestamp'>) => {
    const newNotification: Notification = {
      ...notification,
      id: Date.now().toString(),
      timestamp: new Date()
    };
    
    setNotifications(prev => [newNotification, ...prev]);
    
    if (settings.sound) {
      // Play notification sound
      const audio = new Audio('/notification.mp3');
      audio.play().catch(() => {});
    }
    
    showDesktopNotification(newNotification);
  }, [settings]);

  const markAsRead = (id: string) => {
    setNotifications(prev => 
      prev.map(n => n.id === id ? { ...n, read: true } : n)
    );
  };

  const deleteNotification = (id: string) => {
    setNotifications(prev => prev.filter(n => n.id !== id));
  };

  return (
    <div className="relative">
      {/* Notification Bell */}
      <button
        onClick={() => setShowCenter(true)}
        className="relative p-2 rounded-lg hover:bg-gray-100 dark:hover:bg-gray-800 transition-colors"
        aria-label="Notifications"
      >
        {settings.enabled ? (
          <Bell className="w-5 h-5" />
        ) : (
          <BellOff className="w-5 h-5 text-gray-400" />
        )}
        
        {unreadCount > 0 && (
          <span className="absolute -top-1 -right-1 w-5 h-5 bg-red-500 text-white text-xs rounded-full flex items-center justify-center">
            {unreadCount > 99 ? '99+' : unreadCount}
          </span>
        )}
      </button>

      {/* Notification Center */}
      <NotificationCenter
        isOpen={showCenter}
        onClose={() => setShowCenter(false)}
        notifications={notifications}
        settings={settings}
        onSettingsChange={setSettings}
        isDarkMode={isDarkMode}
      />

      {/* Toast Notifications */}
      <div className="fixed top-4 right-4 z-50 space-y-2">
        <AnimatePresence>
          {notifications.slice(0, 3).map(notification => (
            !notification.read && notification.priority === 'urgent' && (
              <motion.div
                key={notification.id}
                initial={{ opacity: 0, x: 100 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: 100 }}
                className={`${bg} rounded-lg shadow-lg p-4 max-w-sm border-l-4 ${
                  notification.type === 'error' ? 'border-red-500' :
                  notification.type === 'warning' ? 'border-yellow-500' :
                  notification.type === 'success' ? 'border-green-500' :
                  'border-blue-500'
                }`}
              >
                <div className="flex items-start gap-3">
                  <div className="flex-shrink-0">
                    {notification.type === 'error' && <XCircle className="w-5 h-5 text-red-500" />}
                    {notification.type === 'warning' && <AlertCircle className="w-5 h-5 text-yellow-500" />}
                    {notification.type === 'success' && <CheckCircle className="w-5 h-5 text-green-500" />}
                    {notification.type === 'info' && <Info className="w-5 h-5 text-blue-500" />}
                  </div>
                  <div className="flex-1">
                    <h4 className={`font-medium ${text} mb-1`}>{notification.title}</h4>
                    <p className={`text-sm ${isDarkMode ? 'text-gray-400' : 'text-gray-600'}`}>
                      {notification.message}
                    </p>
                  </div>
                  <button
                    onClick={() => deleteNotification(notification.id)}
                    className="flex-shrink-0 p-1 rounded hover:bg-gray-200 dark:hover:bg-gray-700"
                  >
                    <X className="w-4 h-4" />
                  </button>
                </div>
              </motion.div>
            )
          ))}
        </AnimatePresence>
      </div>
    </div>
  );
};

export default NotificationSystem;
