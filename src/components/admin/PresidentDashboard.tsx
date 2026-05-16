import React, { useState, useEffect } from 'react';
import { motion } from 'motion/react';
import { 
  Users, 
  TrendingUp, 
  Calendar, 
  BookOpen, 
  Award, 
  Settings, 
  Download, 
  Upload,
  Eye,
  Edit,
  Trash2,
  Plus,
  Search,
  Filter,
  ChevronRight,
  Activity,
  Target,
  Zap,
  Shield,
  Crown,
  Globe,
  Database,
  BarChart3,
  PieChart,
  AlertCircle,
  CheckCircle,
  Clock,
  Star,
  MessageSquare,
  FileText,
  FolderOpen,
  HardDrive,
  Wifi,
  Cpu,
  MemoryStick,
  Server,
  Cloud,
  Lock,
  Unlock,
  RefreshCw,
  MoreHorizontal
} from 'lucide-react';
import { Button } from '../ui/Button';
import { Card, CardHeader, CardContent } from '../ui/Card';
import { Badge } from '../ui/Badge';
import { Input } from '../ui/Input';
import { useThemeClasses } from '../../hooks/useTheme';
import { useAuth } from '../../context/AuthContext';

interface PresidentStats {
  totalUsers: number;
  activeUsers: number;
  newUsers: number;
  totalProjects: number;
  activeProjects: number;
  completedProjects: number;
  totalEvents: number;
  upcomingEvents: number;
  pastEvents: number;
  totalResources: number;
  popularResources: number;
  systemHealth: 'excellent' | 'good' | 'warning' | 'critical';
  storageUsed: number;
  storageTotal: number;
  serverUptime: number;
  activeConnections: number;
}

interface SystemAlert {
  id: string;
  type: 'info' | 'warning' | 'error' | 'success';
  title: string;
  message: string;
  timestamp: Date;
  read: boolean;
  action?: {
    label: string;
    callback: () => void;
  };
}

interface RecentActivity {
  id: string;
  type: 'user' | 'project' | 'event' | 'resource' | 'system';
  title: string;
  description: string;
  timestamp: Date;
  user?: string;
  icon: React.ReactNode;
}

interface QuickAction {
  id: string;
  title: string;
  description: string;
  icon: React.ReactNode;
  color: string;
  callback: () => void;
}

export const PresidentDashboard: React.FC = () => {
  const { bg, text } = useThemeClasses();
  const { user } = useAuth();
  const [isDarkMode] = useState(false);
  const [stats, setStats] = useState<PresidentStats | null>(null);
  const [alerts, setAlerts] = useState<SystemAlert[]>([]);
  const [activities, setActivities] = useState<RecentActivity[]>([]);
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedFilter, setSelectedFilter] = useState('all');

  // Demo stats
  const demoStats: PresidentStats = {
    totalUsers: 1247,
    activeUsers: 892,
    newUsers: 45,
    totalProjects: 156,
    activeProjects: 89,
    completedProjects: 67,
    totalEvents: 34,
    upcomingEvents: 8,
    pastEvents: 26,
    totalResources: 892,
    popularResources: 234,
    systemHealth: 'excellent',
    storageUsed: 67.5,
    storageTotal: 100,
    serverUptime: 99.8,
    activeConnections: 156
  };

  // Demo alerts
  const demoAlerts: SystemAlert[] = [
    {
      id: '1',
      type: 'success',
      title: 'Nouveau record d\'utilisateurs',
      message: 'CODEL Hub a atteint 1247 utilisateurs ce mois',
      timestamp: new Date(Date.now() - 2 * 60 * 60 * 1000),
      read: false
    },
    {
      id: '2',
      type: 'warning',
      title: 'Stockage presque plein',
      message: '67.5% de l\'espace de stockage utilisé',
      timestamp: new Date(Date.now() - 4 * 60 * 60 * 1000),
      read: false,
      action: {
        label: 'Gérer le stockage',
        callback: () => console.log('Manage storage')
      }
    },
    {
      id: '3',
      type: 'info',
      title: 'Mise à jour système disponible',
      message: 'Version 2.1.0 prête pour déploiement',
      timestamp: new Date(Date.now() - 6 * 60 * 60 * 1000),
      read: true,
      action: {
        label: 'Voir les détails',
        callback: () => console.log('View update details')
      }
    }
  ];

  // Demo activities
  const demoActivities: RecentActivity[] = [
    {
      id: '1',
      type: 'user',
      title: 'Nouveau membre inscrit',
      description: 'Jean Dupont a rejoint CODEL Hub',
      timestamp: new Date(Date.now() - 15 * 60 * 1000),
      user: 'Jean Dupont',
      icon: <Users className="w-4 h-4" />
    },
    {
      id: '2',
      type: 'project',
      title: 'Projet soumis',
      description: 'Application de gestion des tâches',
      timestamp: new Date(Date.now() - 30 * 60 * 1000),
      user: 'Marie Curie',
      icon: <FileText className="w-4 h-4" />
    },
    {
      id: '3',
      type: 'event',
      title: 'Événement créé',
      description: 'Workshop React Avancé',
      timestamp: new Date(Date.now() - 45 * 60 * 1000),
      user: 'Admin',
      icon: <Calendar className="w-4 h-4" />
    },
    {
      id: '4',
      type: 'system',
      title: 'Sauvegarde automatique',
      description: 'Backup système complété avec succès',
      timestamp: new Date(Date.now() - 60 * 60 * 1000),
      icon: <Database className="w-4 h-4" />
    }
  ];

  // Demo quick actions
  const quickActions: QuickAction[] = [
    {
      id: '1',
      title: 'Gérer les utilisateurs',
      description: 'Ajouter, modifier ou supprimer des utilisateurs',
      icon: <Users className="w-5 h-5" />,
      color: 'text-blue-500 bg-blue-100 dark:bg-blue-900/20',
      callback: () => console.log('Manage users')
    },
    {
      id: '2',
      title: 'Créer un événement',
      description: 'Organiser un nouvel événement ou workshop',
      icon: <Calendar className="w-5 h-5" />,
      color: 'text-green-500 bg-green-100 dark:bg-green-900/20',
      callback: () => console.log('Create event')
    },
    {
      id: '3',
      title: 'Exporter les données',
      description: 'Télécharger les données système',
      icon: <Download className="w-5 h-5" />,
      color: 'text-purple-500 bg-purple-100 dark:bg-purple-900/20',
      callback: () => console.log('Export data')
    },
    {
      id: '4',
      title: 'Paramètres système',
      description: 'Configurer les paramètres globaux',
      icon: <Settings className="w-5 h-5" />,
      color: 'text-orange-500 bg-orange-100 dark:bg-orange-900/20',
      callback: () => console.log('System settings')
    }
  ];

  useEffect(() => {
    setStats(demoStats);
    setAlerts(demoAlerts);
    setActivities(demoActivities);
  }, []);

  const getHealthColor = (health: string) => {
    switch (health) {
      case 'excellent': return 'text-green-500';
      case 'good': return 'text-blue-500';
      case 'warning': return 'text-yellow-500';
      case 'critical': return 'text-red-500';
      default: return 'text-gray-500';
    }
  };

  const getHealthIcon = (health: string) => {
    switch (health) {
      case 'excellent': return <CheckCircle className="w-5 h-5" />;
      case 'good': return <CheckCircle className="w-5 h-5" />;
      case 'warning': return <AlertCircle className="w-5 h-5" />;
      case 'critical': return <AlertCircle className="w-5 h-5" />;
      default: return <AlertCircle className="w-5 h-5" />;
    }
  };

  const getAlertIcon = (type: string) => {
    switch (type) {
      case 'success': return <CheckCircle className="w-5 h-5 text-green-500" />;
      case 'warning': return <AlertCircle className="w-5 h-5 text-yellow-500" />;
      case 'error': return <AlertCircle className="w-5 h-5 text-red-500" />;
      case 'info': return <AlertCircle className="w-5 h-5 text-blue-500" />;
      default: return <AlertCircle className="w-5 h-5 text-gray-500" />;
    }
  };

  const formatTime = (date: Date) => {
    const now = new Date();
    const diff = now.getTime() - date.getTime();
    const minutes = Math.floor(diff / 60000);
    const hours = Math.floor(diff / 3600000);
    const days = Math.floor(diff / 86400000);

    if (minutes < 60) return `Il y a ${minutes} minute${minutes > 1 ? 's' : ''}`;
    if (hours < 24) return `Il y a ${hours} heure${hours > 1 ? 's' : ''}`;
    return `Il y a ${days} jour${days > 1 ? 's' : ''}`;
  };

  return (
    <div className={`min-h-screen ${bg} ${text} p-6`}>
      <div className="max-w-7xl mx-auto">
        {/* Header */}
        <div className="flex items-center justify-between mb-8">
          <div className="flex items-center gap-4">
            <div className="p-3 rounded-lg bg-gradient-to-r from-purple-500 to-pink-500 text-white">
              <Crown className="w-8 h-8" />
            </div>
            <div>
              <h1 className="text-3xl font-bold">Tableau de Bord Président</h1>
              <p className={`${isDarkMode ? 'text-gray-400' : 'text-gray-600'}`}>
                Bienvenue, {user?.name || 'Président'} • Gestion complète de CODEL Hub
              </p>
            </div>
          </div>
          
          <div className="flex items-center gap-3">
            <Button
              variant="outline"
              size="sm"
              onClick={() => console.log('Refresh data')}
              icon={<RefreshCw className="w-4 h-4" />}
            >
              Actualiser
            </Button>
            <Button
              variant="primary"
              size="sm"
              onClick={() => console.log('Export report')}
              icon={<Download className="w-4 h-4" />}
            >
              Exporter
            </Button>
          </div>
        </div>

        {/* System Health */}
        {stats && (
          <Card className="mb-6">
            <CardContent className="p-6">
              <div className="flex items-center justify-between mb-4">
                <h3 className={`font-semibold ${text}`}>Santé du Système</h3>
                <div className={`flex items-center gap-2 ${getHealthColor(stats.systemHealth)}`}>
                  {getHealthIcon(stats.systemHealth)}
                  <span className="font-medium capitalize">{stats.systemHealth}</span>
                </div>
              </div>
              
              <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                <div className="text-center">
                  <Server className="w-8 h-8 mx-auto mb-2 text-cyan-500" />
                  <div className="text-2xl font-bold">{stats.serverUptime}%</div>
                  <div className="text-sm text-gray-500">Uptime</div>
                </div>
                <div className="text-center">
                  <Wifi className="w-8 h-8 mx-auto mb-2 text-green-500" />
                  <div className="text-2xl font-bold">{stats.activeConnections}</div>
                  <div className="text-sm text-gray-500">Connexions</div>
                </div>
                <div className="text-center">
                  <HardDrive className="w-8 h-8 mx-auto mb-2 text-purple-500" />
                  <div className="text-2xl font-bold">{stats.storageUsed}%</div>
                  <div className="text-sm text-gray-500">Stockage</div>
                </div>
                <div className="text-center">
                  <Cpu className="w-8 h-8 mx-auto mb-2 text-orange-500" />
                  <div className="text-2xl font-bold">{stats.activeUsers}</div>
                  <div className="text-sm text-gray-500">Utilisateurs actifs</div>
                </div>
              </div>
            </CardContent>
          </Card>
        )}

        {/* Stats Grid */}
        {stats && (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-6">
            <Card>
              <CardContent className="p-6">
                <div className="flex items-center justify-between mb-4">
                  <div className="p-2 rounded-lg bg-blue-100 dark:bg-blue-900/20">
                    <Users className="w-6 h-6 text-blue-500" />
                  </div>
                  <Badge variant="secondary" size="sm">
                    +{stats.newUsers}
                  </Badge>
                </div>
                <div className="text-2xl font-bold mb-1">{stats.totalUsers}</div>
                <div className="text-sm text-gray-500">Utilisateurs totaux</div>
                <div className="text-xs text-green-500 mt-2">{stats.activeUsers} actifs</div>
              </CardContent>
            </Card>

            <Card>
              <CardContent className="p-6">
                <div className="flex items-center justify-between mb-4">
                  <div className="p-2 rounded-lg bg-green-100 dark:bg-green-900/20">
                    <FileText className="w-6 h-6 text-green-500" />
                  </div>
                  <Badge variant="secondary" size="sm">
                    +{stats.activeProjects}
                  </Badge>
                </div>
                <div className="text-2xl font-bold mb-1">{stats.totalProjects}</div>
                <div className="text-sm text-gray-500">Projets totaux</div>
                <div className="text-xs text-green-500 mt-2">{stats.completedProjects} complétés</div>
              </CardContent>
            </Card>

            <Card>
              <CardContent className="p-6">
                <div className="flex items-center justify-between mb-4">
                  <div className="p-2 rounded-lg bg-purple-100 dark:bg-purple-900/20">
                    <Calendar className="w-6 h-6 text-purple-500" />
                  </div>
                  <Badge variant="secondary" size="sm">
                    {stats.upcomingEvents}
                  </Badge>
                </div>
                <div className="text-2xl font-bold mb-1">{stats.totalEvents}</div>
                <div className="text-sm text-gray-500">Événements totaux</div>
                <div className="text-xs text-purple-500 mt-2">{stats.upcomingEvents} à venir</div>
              </CardContent>
            </Card>

            <Card>
              <CardContent className="p-6">
                <div className="flex items-center justify-between mb-4">
                  <div className="p-2 rounded-lg bg-orange-100 dark:bg-orange-900/20">
                    <BookOpen className="w-6 h-6 text-orange-500" />
                  </div>
                  <Badge variant="secondary" size="sm">
                    {stats.popularResources}
                  </Badge>
                </div>
                <div className="text-2xl font-bold mb-1">{stats.totalResources}</div>
                <div className="text-sm text-gray-500">Ressources totales</div>
                <div className="text-xs text-orange-500 mt-2">{stats.popularResources} populaires</div>
              </CardContent>
            </Card>
          </div>
        )}

        {/* Quick Actions */}
        <Card className="mb-6">
          <CardHeader>
            <h3 className={`font-semibold ${text}`}>Actions Rapides</h3>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
              {quickActions.map(action => (
                <motion.div
                  key={action.id}
                  whileHover={{ scale: 1.02 }}
                  whileTap={{ scale: 0.98 }}
                  className="cursor-pointer"
                  onClick={action.callback}
                >
                  <div className={`p-4 rounded-lg border ${bg} hover:shadow-md transition-all`}>
                    <div className={`p-3 rounded-lg ${action.color} w-fit mb-3`}>
                      {action.icon}
                    </div>
                    <h4 className={`font-medium ${text} mb-1`}>{action.title}</h4>
                    <p className="text-sm text-gray-500">{action.description}</p>
                  </div>
                </motion.div>
              ))}
            </div>
          </CardContent>
        </Card>

        {/* Alerts and Activities */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          {/* Alerts */}
          <Card>
            <CardHeader>
              <div className="flex items-center justify-between">
                <h3 className={`font-semibold ${text}`}>Alertes Système</h3>
                <Badge variant="secondary" size="sm">
                  {alerts.filter(a => !a.read).length} non lues
                </Badge>
              </div>
            </CardHeader>
            <CardContent>
              <div className="space-y-3">
                {alerts.slice(0, 5).map(alert => (
                  <div
                    key={alert.id}
                    className={`p-3 rounded-lg border ${bg} ${!alert.read ? 'border-l-4 border-l-blue-500' : ''}`}
                  >
                    <div className="flex items-start gap-3">
                      {getAlertIcon(alert.type)}
                      <div className="flex-1">
                        <h4 className={`font-medium ${text} mb-1`}>{alert.title}</h4>
                        <p className="text-sm text-gray-500 mb-2">{alert.message}</p>
                        <div className="flex items-center justify-between">
                          <span className="text-xs text-gray-400">{formatTime(alert.timestamp)}</span>
                          {alert.action && (
                            <Button
                              variant="outline"
                              size="sm"
                              onClick={alert.action.callback}
                            >
                              {alert.action.label}
                            </Button>
                          )}
                        </div>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>

          {/* Recent Activity */}
          <Card>
            <CardHeader>
              <div className="flex items-center justify-between">
                <h3 className={`font-semibold ${text}`}>Activité Récente</h3>
                <Button variant="outline" size="sm" icon={<MoreHorizontal className="w-4 h-4" />} />
              </div>
            </CardHeader>
            <CardContent>
              <div className="space-y-3">
                {activities.slice(0, 5).map(activity => (
                  <div key={activity.id} className={`p-3 rounded-lg border ${bg}`}>
                    <div className="flex items-start gap-3">
                      <div className="p-2 rounded-lg bg-gray-100 dark:bg-gray-800">
                        {activity.icon}
                      </div>
                      <div className="flex-1">
                        <h4 className={`font-medium ${text} mb-1`}>{activity.title}</h4>
                        <p className="text-sm text-gray-500 mb-1">{activity.description}</p>
                        <div className="flex items-center justify-between">
                          <span className="text-xs text-gray-400">{formatTime(activity.timestamp)}</span>
                          {activity.user && (
                            <span className="text-xs text-gray-500">par {activity.user}</span>
                          )}
                        </div>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
};

export default PresidentDashboard;
