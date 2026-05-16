import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { 
  Wifi, 
  WifiOff, 
  Download, 
  Upload, 
  RefreshCw, 
  CheckCircle, 
  AlertCircle, 
  Clock, 
  Database, 
  Cloud, 
  CloudOff,
  Sync,
  X,
  Settings,
  HardDrive,
  FileText,
  Video,
  BookOpen
} from 'lucide-react';
import { Button } from '../ui/Button';
import { Card, CardHeader, CardContent } from '../ui/Card';
import { Badge } from '../ui/Badge';
import { useThemeClasses } from '../../hooks/useTheme';

interface OfflineData {
  tutorials: any[];
  resources: any[];
  projects: any[];
  quizzes: any[];
  events: any[];
  lastSync: Date;
  totalSize: number; // in MB
}

interface SyncItem {
  id: string;
  type: 'tutorial' | 'resource' | 'project' | 'quiz' | 'event';
  title: string;
  status: 'pending' | 'syncing' | 'completed' | 'error';
  size: number;
  priority: 'high' | 'medium' | 'low';
}

interface OfflineSettings {
  autoSync: boolean;
  syncInterval: number; // in minutes
  maxStorage: number; // in MB
  downloadOnWifi: boolean;
  compressData: boolean;
}

const SyncProgress: React.FC<{
  items: SyncItem[];
  isDarkMode: boolean;
}> = ({ items, isDarkMode }) => {
  const { bg, text } = useThemeClasses();

  const completedItems = items.filter(item => item.status === 'completed').length;
  const progress = items.length > 0 ? (completedItems / items.length) * 100 : 0;

  return (
    <div className={`${bg} rounded-lg p-4 border`}>
      <div className="flex items-center justify-between mb-3">
        <span className={`font-medium ${text}`}>Synchronisation</span>
        <span className={`text-sm ${isDarkMode ? 'text-gray-400' : 'text-gray-600'}`}>
          {completedItems}/{items.length}
        </span>
      </div>
      
      <div className="w-full bg-gray-200 dark:bg-gray-700 rounded-full h-2 mb-3">
        <motion.div
          className="bg-gradient-to-r from-cyan-500 to-blue-600 h-2 rounded-full"
          initial={{ width: 0 }}
          animate={{ width: `${progress}%` }}
          transition={{ duration: 0.5 }}
        />
      </div>
      
      <div className="space-y-2 max-h-32 overflow-y-auto">
        {items.slice(0, 3).map(item => (
          <div key={item.id} className="flex items-center justify-between text-xs">
            <div className="flex items-center gap-2">
              {item.status === 'completed' ? (
                <CheckCircle className="w-3 h-3 text-green-500" />
              ) : item.status === 'syncing' ? (
                <RefreshCw className="w-3 h-3 text-blue-500 animate-spin" />
              ) : item.status === 'error' ? (
                <AlertCircle className="w-3 h-3 text-red-500" />
              ) : (
                <Clock className="w-3 h-3 text-gray-400" />
              )}
              <span className={`${isDarkMode ? 'text-gray-300' : 'text-gray-700'} truncate max-w-[150px]`}>
                {item.title}
              </span>
            </div>
            <span className={`${isDarkMode ? 'text-gray-400' : 'text-gray-600'}`}>
              {(item.size / 1024).toFixed(1)} KB
            </span>
          </div>
        ))}
        {items.length > 3 && (
          <div className="text-xs text-gray-500 text-center">
            +{items.length - 3} autres éléments
          </div>
        )}
      </div>
    </div>
  );
};

const StorageInfo: React.FC<{
  data: OfflineData;
  settings: OfflineSettings;
  isDarkMode: boolean;
}> = ({ data, settings, isDarkMode }) => {
  const { bgCard, text } = useThemeClasses();

  const usagePercentage = (data.totalSize / settings.maxStorage) * 100;
  const isNearLimit = usagePercentage > 80;

  const typeBreakdown = [
    { type: 'Tutoriels', count: data.tutorials.length, icon: <Video className="w-4 h-4" />, color: 'text-blue-500' },
    { type: 'Ressources', count: data.resources.length, icon: <BookOpen className="w-4 h-4" />, color: 'text-green-500' },
    { type: 'Projets', count: data.projects.length, icon: <FileText className="w-4 h-4" />, color: 'text-purple-500' },
    { type: 'Quiz', count: data.quizzes.length, icon: <Database className="w-4 h-4" />, color: 'text-yellow-500' },
    { type: 'Événements', count: data.events.length, icon: <Clock className="w-4 h-4" />, color: 'text-cyan-500' }
  ];

  return (
    <Card>
      <CardHeader
        title="Stockage Hors Ligne"
        subtitle={`${data.totalSize.toFixed(1)} MB utilisés sur ${settings.maxStorage} MB`}
        icon={<HardDrive className="w-5 h-5" />}
      />
      <CardContent>
        <div className="space-y-4">
          {/* Storage Bar */}
          <div>
            <div className="flex justify-between text-sm mb-2">
              <span className={isDarkMode ? 'text-gray-300' : 'text-gray-700'}>
                Espace utilisé
              </span>
              <span className={isNearLimit ? 'text-red-500' : 'text-gray-500'}>
                {usagePercentage.toFixed(1)}%
              </span>
            </div>
            <div className="w-full bg-gray-200 dark:bg-gray-700 rounded-full h-3">
              <div
                className={`h-3 rounded-full transition-all duration-300 ${
                  isNearLimit ? 'bg-red-500' : 'bg-gradient-to-r from-cyan-500 to-blue-600'
                }`}
                style={{ width: `${Math.min(usagePercentage, 100)}%` }}
              />
            </div>
            {isNearLimit && (
              <p className="text-xs text-red-500 mt-2">
                ⚠️ Espace de stockage presque plein
              </p>
            )}
          </div>

          {/* Type Breakdown */}
          <div>
            <h4 className={`font-medium ${text} mb-3`}>Contenu disponible hors ligne</h4>
            <div className="space-y-2">
              {typeBreakdown.map((item, index) => (
                <div key={index} className="flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <div className={item.color}>{item.icon}</div>
                    <span className={`text-sm ${isDarkMode ? 'text-gray-300' : 'text-gray-700'}`}>
                      {item.type}
                    </span>
                  </div>
                  <Badge variant="outline" size="sm">
                    {item.count}
                  </Badge>
                </div>
              ))}
            </div>
          </div>

          {/* Last Sync */}
          <div className={`p-3 rounded-lg border ${isDarkMode ? 'bg-gray-800' : 'bg-gray-50'}`}>
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                <RefreshCw className="w-4 h-4 text-cyan-500" />
                <span className={`text-sm ${isDarkMode ? 'text-gray-300' : 'text-gray-700'}`}>
                  Dernière synchronisation
                </span>
              </div>
              <span className="text-sm text-gray-500">
                {data.lastSync.toLocaleString('fr-FR', {
                  day: 'numeric',
                  month: 'short',
                  hour: '2-digit',
                  minute: '2-digit'
                })}
              </span>
            </div>
          </div>
        </div>
      </CardContent>
    </Card>
  );
};

const OfflineSettings: React.FC<{
  settings: OfflineSettings;
  onSettingsChange: (settings: OfflineSettings) => void;
  isDarkMode: boolean;
}> = ({ settings, onSettingsChange, isDarkMode }) => {
  const { bgCard, text } = useThemeClasses();

  return (
    <Card>
      <CardHeader
        title="Paramètres Hors Ligne"
        icon={<Settings className="w-5 h-5" />}
      />
      <CardContent>
        <div className="space-y-4">
          <div className="flex items-center justify-between">
            <div>
              <h4 className={`font-medium ${text}`}>Synchronisation automatique</h4>
              <p className={`text-sm ${isDarkMode ? 'text-gray-400' : 'text-gray-600'}`}>
                Synchroniser les données automatiquement
              </p>
            </div>
            <label className="relative inline-flex items-center cursor-pointer">
              <input
                type="checkbox"
                checked={settings.autoSync}
                onChange={(e) => onSettingsChange({ ...settings, autoSync: e.target.checked })}
                className="sr-only peer"
              />
              <div className="w-11 h-6 bg-gray-200 peer-focus:outline-none rounded-full peer dark:bg-gray-700 peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-cyan-500"></div>
            </label>
          </div>

          <div>
            <label className={`block text-sm font-medium ${text} mb-2`}>
              Intervalle de synchronisation
            </label>
            <select
              value={settings.syncInterval}
              onChange={(e) => onSettingsChange({ ...settings, syncInterval: Number(e.target.value) })}
              className={`w-full px-3 py-2 rounded-lg border ${bgCard} ${text} border-gray-200 dark:border-gray-700`}
            >
              <option value={15}>15 minutes</option>
              <option value={30}>30 minutes</option>
              <option value={60}>1 heure</option>
              <option value={240}>4 heures</option>
              <option value={1440}>24 heures</option>
            </select>
          </div>

          <div>
            <label className={`block text-sm font-medium ${text} mb-2`}>
              Espace de stockage maximal (MB)
            </label>
            <input
              type="number"
              value={settings.maxStorage}
              onChange={(e) => onSettingsChange({ ...settings, maxStorage: Number(e.target.value) })}
              min="100"
              max="1000"
              step="100"
              className={`w-full px-3 py-2 rounded-lg border ${bgCard} ${text} border-gray-200 dark:border-gray-700`}
            />
          </div>

          <div className="flex items-center justify-between">
            <div>
              <h4 className={`font-medium ${text}`}>Télécharger uniquement en Wi-Fi</h4>
              <p className={`text-sm ${isDarkMode ? 'text-gray-400' : 'text-gray-600'}`}>
                Économiser les données mobiles
              </p>
            </div>
            <label className="relative inline-flex items-center cursor-pointer">
              <input
                type="checkbox"
                checked={settings.downloadOnWifi}
                onChange={(e) => onSettingsChange({ ...settings, downloadOnWifi: e.target.checked })}
                className="sr-only peer"
              />
              <div className="w-11 h-6 bg-gray-200 peer-focus:outline-none rounded-full peer dark:bg-gray-700 peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-cyan-500"></div>
            </label>
          </div>

          <div className="flex items-center justify-between">
            <div>
              <h4 className={`font-medium ${text}`}>Compresser les données</h4>
              <p className={`text-sm ${isDarkMode ? 'text-gray-400' : 'text-gray-600'}`}>
                Réduire l'espace de stockage utilisé
              </p>
            </div>
            <label className="relative inline-flex items-center cursor-pointer">
              <input
                type="checkbox"
                checked={settings.compressData}
                onChange={(e) => onSettingsChange({ ...settings, compressData: e.target.checked })}
                className="sr-only peer"
              />
              <div className="w-11 h-6 bg-gray-200 peer-focus:outline-none rounded-full peer dark:bg-gray-700 peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-cyan-500"></div>
            </label>
          </div>
        </div>
      </CardContent>
    </Card>
  );
};

export const OfflineMode: React.FC = () => {
  const { bg, text } = useThemeClasses();
  const [isDarkMode] = useState(false);
  const [isOnline, setIsOnline] = useState(navigator.onLine);
  const [isSyncing, setIsSyncing] = useState(false);
  
  const [offlineData, setOfflineData] = useState<OfflineData>({
    tutorials: [],
    resources: [],
    projects: [],
    quizzes: [],
    events: [],
    lastSync: new Date(),
    totalSize: 245.6
  });

  const [syncQueue, setSyncQueue] = useState<SyncItem[]>([
    {
      id: '1',
      type: 'tutorial',
      title: 'React Hooks Avancés',
      status: 'completed',
      size: 2048,
      priority: 'high'
    },
    {
      id: '2',
      type: 'resource',
      title: 'Guide CSS Grid',
      status: 'syncing',
      size: 1536,
      priority: 'medium'
    },
    {
      id: '3',
      type: 'quiz',
      title: 'JavaScript Fundamentals',
      status: 'pending',
      size: 512,
      priority: 'low'
    }
  ]);

  const [settings, setSettings] = useState<OfflineSettings>({
    autoSync: true,
    syncInterval: 30,
    maxStorage: 500,
    downloadOnWifi: true,
    compressData: true
  });

  useEffect(() => {
    const handleOnline = () => setIsOnline(true);
    const handleOffline = () => setIsOnline(false);

    window.addEventListener('online', handleOnline);
    window.addEventListener('offline', handleOffline);

    return () => {
      window.removeEventListener('online', handleOnline);
      window.removeEventListener('offline', handleOffline);
    };
  }, []);

  const handleManualSync = async () => {
    setIsSyncing(true);
    
    // Simuler la synchronisation
    setTimeout(() => {
      setSyncQueue(prev => prev.map(item => ({
        ...item,
        status: 'completed' as const
      })));
      
      setOfflineData(prev => ({
        ...prev,
        lastSync: new Date()
      }));
      
      setIsSyncing(false);
    }, 3000);
  };

  const handleClearCache = () => {
    if (confirm('Êtes-vous sûr de vouloir effacer toutes les données hors ligne?')) {
      setOfflineData({
        tutorials: [],
        resources: [],
        projects: [],
        quizzes: [],
        events: [],
        lastSync: new Date(),
        totalSize: 0
      });
      setSyncQueue([]);
    }
  };

  return (
    <div className={`min-h-screen ${bg} ${text} p-6`}>
      <div className="max-w-6xl mx-auto">
        {/* Header */}
        <div className="flex items-center justify-between mb-8">
          <div className="flex items-center gap-4">
            <div className={`p-3 rounded-lg ${
              isOnline ? 'bg-green-100 text-green-600' : 'bg-red-100 text-red-600'
            }`}>
              {isOnline ? <Wifi className="w-6 h-6" /> : <WifiOff className="w-6 h-6" />}
            </div>
            <div>
              <h1 className="text-3xl font-bold">Mode Hors Ligne</h1>
              <p className={`${isDarkMode ? 'text-gray-400' : 'text-gray-600'}`}>
                {isOnline ? 'Connecté' : 'Hors ligne'} • Accès aux données locales
              </p>
            </div>
          </div>
          
          <div className="flex gap-3">
            <Button
              variant="outline"
              onClick={handleManualSync}
              disabled={!isOnline || isSyncing}
              loading={isSyncing}
              icon={<RefreshCw className="w-4 h-4" />}
            >
              Synchroniser
            </Button>
            
            <Button
              variant="danger"
              onClick={handleClearCache}
              icon={<X className="w-4 h-4" />}
            >
              Vider le cache
            </Button>
          </div>
        </div>

        {/* Status Alert */}
        <AnimatePresence>
          {!isOnline && (
            <motion.div
              initial={{ opacity: 0, y: -20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -20 }}
              className="mb-6"
            >
              <Card className="border-red-200 bg-red-50 dark:bg-red-900/20">
                <CardContent className="p-4">
                  <div className="flex items-center gap-3">
                    <WifiOff className="w-5 h-5 text-red-500" />
                    <div className="flex-1">
                      <h4 className="font-medium text-red-800 dark:text-red-200">
                        Mode Hors Ligne Activé
                      </h4>
                      <p className="text-sm text-red-600 dark:text-red-300">
                        Vous utilisez les données locales. Certaines fonctionnalités peuvent être limitées.
                      </p>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </motion.div>
          )}
        </AnimatePresence>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Main Content */}
          <div className="lg:col-span-2 space-y-6">
            {/* Sync Progress */}
            {isSyncing && (
              <SyncProgress items={syncQueue} isDarkMode={isDarkMode} />
            )}

            {/* Available Content */}
            <Card>
              <CardHeader
                title="Contenu Disponible Hors Ligne"
                subtitle={`${offlineData.tutorials.length + offlineData.resources.length + offlineData.projects.length} éléments`}
                icon={<CloudOff className="w-5 h-5" />}
              />
              <CardContent>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div className={`p-4 rounded-lg border ${isDarkMode ? 'bg-gray-800' : 'bg-gray-50'}`}>
                    <div className="flex items-center gap-3 mb-2">
                      <Video className="w-5 h-5 text-blue-500" />
                      <span className={`font-medium ${text}`}>Tutoriels</span>
                    </div>
                    <div className="text-2xl font-bold text-blue-500 mb-1">
                      {offlineData.tutorials.length}
                    </div>
                    <div className="text-sm text-gray-500">
                      Disponibles hors ligne
                    </div>
                  </div>
                  
                  <div className={`p-4 rounded-lg border ${isDarkMode ? 'bg-gray-800' : 'bg-gray-50'}`}>
                    <div className="flex items-center gap-3 mb-2">
                      <BookOpen className="w-5 h-5 text-green-500" />
                      <span className={`font-medium ${text}`}>Ressources</span>
                    </div>
                    <div className="text-2xl font-bold text-green-500 mb-1">
                      {offlineData.resources.length}
                    </div>
                    <div className="text-sm text-gray-500">
                      Disponibles hors ligne
                    </div>
                  </div>
                  
                  <div className={`p-4 rounded-lg border ${isDarkMode ? 'bg-gray-800' : 'bg-gray-50'}`}>
                    <div className="flex items-center gap-3 mb-2">
                      <FileText className="w-5 h-5 text-purple-500" />
                      <span className={`font-medium ${text}`}>Projets</span>
                    </div>
                    <div className="text-2xl font-bold text-purple-500 mb-1">
                      {offlineData.projects.length}
                    </div>
                    <div className="text-sm text-gray-500">
                      Disponibles hors ligne
                    </div>
                  </div>
                  
                  <div className={`p-4 rounded-lg border ${isDarkMode ? 'bg-gray-800' : 'bg-gray-50'}`}>
                    <div className="flex items-center gap-3 mb-2">
                      <Database className="w-5 h-5 text-yellow-500" />
                      <span className={`font-medium ${text}`}>Quiz</span>
                    </div>
                    <div className="text-2xl font-bold text-yellow-500 mb-1">
                      {offlineData.quizzes.length}
                    </div>
                    <div className="text-sm text-gray-500">
                      Disponibles hors ligne
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>

            {/* Download Queue */}
            <Card>
              <CardHeader
                title="File de Téléchargement"
                subtitle={`${syncQueue.filter(item => item.status !== 'completed').length} en attente`}
                icon={<Download className="w-5 h-5" />}
              />
              <CardContent>
                <div className="space-y-3">
                  {syncQueue.map(item => (
                    <div key={item.id} className={`p-3 rounded-lg border ${isDarkMode ? 'bg-gray-800' : 'bg-gray-50'}`}>
                      <div className="flex items-center justify-between">
                        <div className="flex items-center gap-3">
                          {item.type === 'tutorial' && <Video className="w-4 h-4 text-blue-500" />}
                          {item.type === 'resource' && <BookOpen className="w-4 h-4 text-green-500" />}
                          {item.type === 'project' && <FileText className="w-4 h-4 text-purple-500" />}
                          {item.type === 'quiz' && <Database className="w-4 h-4 text-yellow-500" />}
                          
                          <div>
                            <div className={`font-medium ${text}`}>{item.title}</div>
                            <div className="text-sm text-gray-500">
                              {(item.size / 1024).toFixed(1)} KB
                            </div>
                          </div>
                        </div>
                        
                        <div className="flex items-center gap-2">
                          {item.status === 'completed' && (
                            <CheckCircle className="w-4 h-4 text-green-500" />
                          )}
                          {item.status === 'syncing' && (
                            <RefreshCw className="w-4 h-4 text-blue-500 animate-spin" />
                          )}
                          {item.status === 'error' && (
                            <AlertCircle className="w-4 h-4 text-red-500" />
                          )}
                          {item.status === 'pending' && (
                            <Clock className="w-4 h-4 text-gray-400" />
                          )}
                          
                          <Badge
                            variant={item.priority === 'high' ? 'danger' : item.priority === 'medium' ? 'warning' : 'secondary'}
                            size="sm"
                          >
                            {item.priority === 'high' ? 'Haute' : item.priority === 'medium' ? 'Moyenne' : 'Basse'}
                          </Badge>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          </div>

          {/* Sidebar */}
          <div className="space-y-6">
            <StorageInfo data={offlineData} settings={settings} isDarkMode={isDarkMode} />
            <OfflineSettings settings={settings} onSettingsChange={setSettings} isDarkMode={isDarkMode} />
          </div>
        </div>
      </div>
    </div>
  );
};

export default OfflineMode;
