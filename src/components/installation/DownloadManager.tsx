import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { 
  Download, 
  Package, 
  CheckCircle, 
  AlertCircle, 
  Clock, 
  Wifi, 
  WifiOff, 
  Play, 
  Pause, 
  X, 
  RefreshCw,
  HardDrive,
  Monitor,
  Smartphone,
  Globe,
  Shield,
  Zap,
  Settings,
  Info,
  ChevronRight,
  ChevronDown,
  FolderOpen,
  FileText,
  Code,
  Database,
  Cloud,
  ExternalLink,
  Terminal,
  Cpu,
  MemoryStick,
  HardDrive as HardDriveIcon
} from 'lucide-react';
import { Button } from '../ui/Button';
import { Card, CardHeader, CardContent } from '../ui/Card';
import { Badge } from '../ui/Badge';
import { useThemeClasses } from '../../hooks/useTheme';

interface DownloadPackage {
  id: string;
  name: string;
  version: string;
  size: number;
  description: string;
  type: 'web' | 'desktop' | 'mobile' | 'server';
  platform: 'all' | 'windows' | 'macos' | 'linux' | 'ios' | 'android';
  requirements: {
    os: string;
    memory: string;
    storage: string;
    network?: string;
  };
  features: string[];
  downloadUrl: string;
  isRecommended: boolean;
  isNew: boolean;
  downloadCount: number;
  rating: number;
}

interface DownloadProgress {
  packageId: string;
  status: 'idle' | 'downloading' | 'paused' | 'completed' | 'error';
  progress: number;
  speed: number;
  downloaded: number;
  total: number;
  timeRemaining: number;
  error?: string;
}

interface SystemInfo {
  platform: string;
  os: string;
  browser: string;
  memory: number;
  storage: number;
  network: 'online' | 'offline';
  supportedPackages: string[];
}

const PackageCard: React.FC<{
  package: DownloadPackage;
  progress?: DownloadProgress;
  onDownload: (packageId: string) => void;
  onPause: (packageId: string) => void;
  onResume: (packageId: string) => void;
  onCancel: (packageId: string) => void;
  isDarkMode: boolean;
}> = ({ package: pkg, progress, onDownload, onPause, onResume, onCancel, isDarkMode }) => {
  const { bgCard, text } = useThemeClasses();

  const getPlatformIcon = (platform: string) => {
    switch (platform) {
      case 'windows': return <Monitor className="w-5 h-5" />;
      case 'macos': return <Monitor className="w-5 h-5" />;
      case 'linux': return <Terminal className="w-5 h-5" />;
      case 'ios': return <Smartphone className="w-5 h-5" />;
      case 'android': return <Smartphone className="w-5 h-5" />;
      case 'all': return <Globe className="w-5 h-5" />;
      default: return <Package className="w-5 h-5" />;
    }
  };

  const getTypeIcon = (type: string) => {
    switch (type) {
      case 'web': return <Globe className="w-5 h-5" />;
      case 'desktop': return <Monitor className="w-5 h-5" />;
      case 'mobile': return <Smartphone className="w-5 h-5" />;
      case 'server': return <Database className="w-5 h-5" />;
      default: return <Package className="w-5 h-5" />;
    }
  };

  const getTypeColor = (type: string) => {
    switch (type) {
      case 'web': return 'text-blue-500 bg-blue-100 dark:bg-blue-900/20';
      case 'desktop': return 'text-green-500 bg-green-100 dark:bg-green-900/20';
      case 'mobile': return 'text-purple-500 bg-purple-100 dark:bg-purple-900/20';
      case 'server': return 'text-orange-500 bg-orange-100 dark:bg-orange-900/20';
      default: return 'text-gray-500 bg-gray-100 dark:bg-gray-900/20';
    }
  };

  const formatFileSize = (bytes: number) => {
    if (bytes === 0) return '0 Bytes';
    const k = 1024;
    const sizes = ['Bytes', 'KB', 'MB', 'GB'];
    const i = Math.floor(Math.log(bytes) / Math.log(k));
    return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + ' ' + sizes[i];
  };

  const formatSpeed = (bytesPerSecond: number) => {
    return formatFileSize(bytesPerSecond) + '/s';
  };

  const formatTime = (seconds: number) => {
    if (seconds < 60) return `${Math.round(seconds)}s`;
    if (seconds < 3600) return `${Math.round(seconds / 60)}m`;
    return `${Math.round(seconds / 3600)}h`;
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'downloading': return 'text-blue-500';
      case 'completed': return 'text-green-500';
      case 'error': return 'text-red-500';
      case 'paused': return 'text-yellow-500';
      default: return 'text-gray-500';
    }
  };

  return (
    <motion.div
      className={`${bgCard} rounded-xl border p-6 hover:shadow-lg transition-all`}
      whileHover={{ y: -2 }}
    >
      {/* Header */}
      <div className="flex items-start justify-between mb-4">
        <div className="flex items-center gap-3">
          <div className={`p-3 rounded-lg ${getTypeColor(pkg.type)}`}>
            {getTypeIcon(pkg.type)}
          </div>
          <div>
            <h3 className={`font-bold ${text} mb-1`}>{pkg.name}</h3>
            <div className="flex items-center gap-2">
              <Badge variant="outline" size="sm">
                v{pkg.version}
              </Badge>
              <Badge variant="outline" size="sm">
                {pkg.type}
              </Badge>
              {pkg.isRecommended && (
                <Badge variant="primary" size="sm">
                  Recommandé
                </Badge>
              )}
              {pkg.isNew && (
                <Badge variant="secondary" size="sm">
                  Nouveau
                </Badge>
              )}
            </div>
          </div>
        </div>
        
        <div className="flex items-center gap-2">
          <div className="text-right">
            <div className="text-sm font-medium">{formatFileSize(pkg.size)}</div>
            <div className="text-xs text-gray-500">{pkg.downloadCount} téléchargements</div>
          </div>
          <div className={`p-2 rounded-lg ${getTypeColor(pkg.type)}`}>
            {getPlatformIcon(pkg.platform)}
          </div>
        </div>
      </div>

      {/* Description */}
      <p className={`${isDarkMode ? 'text-gray-300' : 'text-gray-700'} mb-4`}>
        {pkg.description}
      </p>

      {/* Features */}
      <div className="mb-4">
        <h4 className={`font-medium ${text} mb-2`}>Fonctionnalités:</h4>
        <div className="flex flex-wrap gap-2">
          {pkg.features.slice(0, 4).map((feature, index) => (
            <Badge key={index} variant="secondary" size="sm">
              {feature}
            </Badge>
          ))}
          {pkg.features.length > 4 && (
            <Badge variant="secondary" size="sm">
              +{pkg.features.length - 4}
            </Badge>
          )}
        </div>
      </div>

      {/* Requirements */}
      <div className="mb-4">
        <h4 className={`font-medium ${text} mb-2`}>Configuration requise:</h4>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-3 text-sm">
          <div className="flex items-center gap-2">
            <Terminal className="w-4 h-4 text-gray-500" />
            <span>{pkg.requirements.os}</span>
          </div>
          <div className="flex items-center gap-2">
            <MemoryStick className="w-4 h-4 text-gray-500" />
            <span>{pkg.requirements.memory}</span>
          </div>
          <div className="flex items-center gap-2">
            <HardDriveIcon className="w-4 h-4 text-gray-500" />
            <span>{pkg.requirements.storage}</span>
          </div>
        </div>
      </div>

      {/* Download Progress */}
      {progress && progress.status !== 'idle' && (
        <div className="mb-4 p-4 bg-gray-100 dark:bg-gray-800 rounded-lg">
          <div className="flex items-center justify-between mb-2">
            <div className="flex items-center gap-2">
              <div className={`w-3 h-3 rounded-full ${getStatusColor(progress.status)} ${
                progress.status === 'downloading' ? 'animate-pulse' : ''
              }`} />
              <span className={`text-sm font-medium ${getStatusColor(progress.status)}`}>
                {progress.status === 'downloading' && 'Téléchargement...'}
                {progress.status === 'paused' && 'En pause'}
                {progress.status === 'completed' && 'Terminé'}
                {progress.status === 'error' && 'Erreur'}
              </span>
            </div>
            <span className="text-sm text-gray-500">
              {Math.round(progress.progress)}%
            </span>
          </div>
          
          <div className="w-full bg-gray-200 dark:bg-gray-700 rounded-full h-2 mb-2">
            <motion.div
              className="bg-gradient-to-r from-cyan-500 to-blue-600 h-2 rounded-full"
              initial={{ width: 0 }}
              animate={{ width: `${progress.progress}%` }}
              transition={{ duration: 0.3 }}
            />
          </div>
          
          <div className="flex items-center justify-between text-xs text-gray-500">
            <span>{formatFileSize(progress.downloaded)} / {formatFileSize(progress.total)}</span>
            {progress.status === 'downloading' && (
              <span>{formatSpeed(progress.speed)} - {formatTime(progress.timeRemaining)}</span>
            )}
          </div>
          
          {progress.error && (
            <div className="mt-2 text-sm text-red-500">
              {progress.error}
            </div>
          )}
        </div>
      )}

      {/* Actions */}
      <div className="flex gap-3">
        {!progress || progress.status === 'idle' ? (
          <Button
            variant="primary"
            onClick={() => onDownload(pkg.id)}
            icon={<Download className="w-4 h-4" />}
            className="flex-1"
          >
            Télécharger
          </Button>
        ) : progress.status === 'downloading' ? (
          <>
            <Button
              variant="outline"
              onClick={() => onPause(pkg.id)}
              icon={<Pause className="w-4 h-4" />}
            >
              Pause
            </Button>
            <Button
              variant="outline"
              onClick={() => onCancel(pkg.id)}
              icon={<X className="w-4 h-4" />}
            >
              Annuler
            </Button>
          </>
        ) : progress.status === 'paused' ? (
          <>
            <Button
              variant="primary"
              onClick={() => onResume(pkg.id)}
              icon={<Play className="w-4 h-4" />}
              className="flex-1"
            >
              Reprendre
            </Button>
            <Button
              variant="outline"
              onClick={() => onCancel(pkg.id)}
              icon={<X className="w-4 h-4" />}
            >
              Annuler
            </Button>
          </>
        ) : progress.status === 'completed' ? (
          <Button
            variant="primary"
            onClick={() => window.open(pkg.downloadUrl, '_blank')}
            icon={<ExternalLink className="w-4 h-4" />}
            className="flex-1"
          >
            Ouvrir
          </Button>
        ) : progress.status === 'error' ? (
          <>
            <Button
              variant="primary"
              onClick={() => onDownload(pkg.id)}
              icon={<RefreshCw className="w-4 h-4" />}
              className="flex-1"
            >
              Réessayer
            </Button>
            <Button
              variant="outline"
              onClick={() => onCancel(pkg.id)}
              icon={<X className="w-4 h-4" />}
            >
              Annuler
            </Button>
          </>
        ) : null}
      </div>
    </motion.div>
  );
};

export const DownloadManager: React.FC = () => {
  const { bg, text } = useThemeClasses();
  const [isDarkMode] = useState(false);
  
  const [packages, setPackages] = useState<DownloadPackage[]>([]);
  const [downloads, setDownloads] = useState<Record<string, DownloadProgress>>({});
  const [systemInfo, setSystemInfo] = useState<SystemInfo | null>(null);
  const [filter, setFilter] = useState({
    type: 'all',
    platform: 'all'
  });

  // Demo packages
  const demoPackages: DownloadPackage[] = [
    {
      id: '1',
      name: 'CODEL Hub Web Application',
      version: '2.0.0',
      size: 15728640, // 15MB
      description: 'Application web complète avec toutes les fonctionnalités modernes',
      type: 'web',
      platform: 'all',
      requirements: {
        os: 'Navigateur moderne',
        memory: '4GB RAM',
        storage: '100MB',
        network: 'Connexion internet'
      },
      features: ['Responsive', 'PWA', 'Offline', 'Notifications', 'Chat'],
      downloadUrl: '/download/codel-hub-web.zip',
      isRecommended: true,
      isNew: false,
      downloadCount: 1250,
      rating: 4.8
    },
    {
      id: '2',
      name: 'CODEL Hub Desktop',
      version: '2.0.0',
      size: 52428800, // 50MB
      description: 'Application desktop native pour Windows, macOS et Linux',
      type: 'desktop',
      platform: 'all',
      requirements: {
        os: 'Windows 10+, macOS 10.14+, Ubuntu 18.04+',
        memory: '8GB RAM',
        storage: '500MB'
      },
      features: ['Native', 'Performance', 'Notifications système', 'Auto-update'],
      downloadUrl: '/download/codel-hub-desktop.exe',
      isRecommended: true,
      isNew: true,
      downloadCount: 890,
      rating: 4.9
    },
    {
      id: '3',
      name: 'CODEL Hub Mobile',
      version: '2.0.0',
      size: 31457280, // 30MB
      description: 'Application mobile native pour iOS et Android',
      type: 'mobile',
      platform: 'all',
      requirements: {
        os: 'iOS 13+, Android 8.0+',
        memory: '4GB RAM',
        storage: '200MB'
      },
      features: ['Mobile native', 'Push notifications', 'Offline', 'Biometrics'],
      downloadUrl: '/download/codel-hub-mobile.apk',
      isRecommended: false,
      isNew: true,
      downloadCount: 567,
      rating: 4.7
    },
    {
      id: '4',
      name: 'CODEL Hub Server',
      version: '2.0.0',
      size: 104857600, // 100MB
      description: 'Package serveur complet avec Docker et configuration',
      type: 'server',
      platform: 'all',
      requirements: {
        os: 'Linux, Windows Server, macOS',
        memory: '16GB RAM',
        storage: '2GB'
      },
      features: ['Docker', 'Auto-scaling', 'Load balancer', 'Monitoring'],
      downloadUrl: '/download/codel-hub-server.tar.gz',
      isRecommended: false,
      isNew: false,
      downloadCount: 234,
      rating: 4.6
    }
  ];

  const demoSystemInfo: SystemInfo = {
    platform: navigator.platform,
    os: navigator.userAgent.includes('Windows') ? 'Windows' : 
          navigator.userAgent.includes('Mac') ? 'macOS' : 
          navigator.userAgent.includes('Linux') ? 'Linux' : 'Unknown',
    browser: navigator.userAgent.split(' ').slice(-2)[0],
    memory: 8, // GB
    storage: 500, // GB
    network: navigator.onLine ? 'online' : 'offline',
    supportedPackages: ['1', '2'] // Web and Desktop
  };

  useEffect(() => {
    setPackages(demoPackages);
    setSystemInfo(demoSystemInfo);
  }, []);

  const filteredPackages = packages.filter(pkg => {
    if (filter.type !== 'all' && pkg.type !== filter.type) return false;
    if (filter.platform !== 'all' && pkg.platform !== filter.platform && pkg.platform !== 'all') return false;
    return true;
  });

  const simulateDownload = (packageId: string) => {
    const pkg = packages.find(p => p.id === packageId);
    if (!pkg) return;

    const progress: DownloadProgress = {
      packageId,
      status: 'downloading',
      progress: 0,
      speed: 1024 * 1024, // 1MB/s
      downloaded: 0,
      total: pkg.size,
      timeRemaining: pkg.size / (1024 * 1024)
    };

    setDownloads(prev => ({ ...prev, [packageId]: progress }));

    const interval = setInterval(() => {
      setDownloads(prev => {
        const current = prev[packageId];
        if (!current || current.status !== 'downloading') {
          clearInterval(interval);
          return prev;
        }

        const newProgress = Math.min(current.progress + 2, 100);
        const newDownloaded = (pkg.size * newProgress) / 100;
        const newTimeRemaining = ((pkg.size - newDownloaded) / (1024 * 1024));

        if (newProgress >= 100) {
          clearInterval(interval);
          return {
            ...prev,
            [packageId]: {
              ...current,
              status: 'completed',
              progress: 100,
              downloaded: pkg.size,
              timeRemaining: 0
            }
          };
        }

        return {
          ...prev,
          [packageId]: {
            ...current,
            progress: newProgress,
            downloaded: newDownloaded,
            timeRemaining: newTimeRemaining
          }
        };
      });
    }, 100);
  };

  const handleDownload = (packageId: string) => {
    simulateDownload(packageId);
  };

  const handlePause = (packageId: string) => {
    setDownloads(prev => ({
      ...prev,
      [packageId]: {
        ...prev[packageId],
        status: 'paused'
      }
    }));
  };

  const handleResume = (packageId: string) => {
    setDownloads(prev => ({
      ...prev,
      [packageId]: {
        ...prev[packageId],
        status: 'downloading'
      }
    }));
    simulateDownload(packageId);
  };

  const handleCancel = (packageId: string) => {
    setDownloads(prev => {
      const newDownloads = { ...prev };
      delete newDownloads[packageId];
      return newDownloads;
    });
  };

  return (
    <div className={`min-h-screen ${bg} ${text} p-6`}>
      <div className="max-w-7xl mx-auto">
        {/* Header */}
        <div className="text-center mb-8">
          <div className="flex items-center justify-center mb-4">
            <Download className="w-12 h-12 text-cyan-500 mr-3" />
            <h1 className="text-4xl font-bold">Centre de Téléchargement</h1>
          </div>
          <p className={`text-lg ${isDarkMode ? 'text-gray-400' : 'text-gray-600'}`}>
            Téléchargez et installez CODEL Hub sur votre plateforme préférée
          </p>
        </div>

        {/* System Info */}
        {systemInfo && (
          <Card className="mb-6">
            <CardContent className="p-6">
              <div className="flex items-center justify-between mb-4">
                <h3 className={`font-semibold ${text}`}>Votre système</h3>
                <div className="flex items-center gap-2">
                  {systemInfo.network === 'online' ? (
                    <Wifi className="w-5 h-5 text-green-500" />
                  ) : (
                    <WifiOff className="w-5 h-5 text-red-500" />
                  )}
                  <span className="text-sm text-gray-500">
                    {systemInfo.network === 'online' ? 'En ligne' : 'Hors ligne'}
                  </span>
                </div>
              </div>
              
              <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                <div className="text-center">
                  <Monitor className="w-8 h-8 mx-auto mb-2 text-cyan-500" />
                  <div className="text-sm font-medium">{systemInfo.os}</div>
                  <div className="text-xs text-gray-500">Système</div>
                </div>
                <div className="text-center">
                  <Globe className="w-8 h-8 mx-auto mb-2 text-blue-500" />
                  <div className="text-sm font-medium">{systemInfo.browser}</div>
                  <div className="text-xs text-gray-500">Navigateur</div>
                </div>
                <div className="text-center">
                  <MemoryStick className="w-8 h-8 mx-auto mb-2 text-green-500" />
                  <div className="text-sm font-medium">{systemInfo.memory}GB</div>
                  <div className="text-xs text-gray-500">RAM</div>
                </div>
                <div className="text-center">
                  <HardDriveIcon className="w-8 h-8 mx-auto mb-2 text-purple-500" />
                  <div className="text-sm font-medium">{systemInfo.storage}GB</div>
                  <div className="text-xs text-gray-500">Stockage</div>
                </div>
              </div>
            </CardContent>
          </Card>
        )}

        {/* Filters */}
        <Card className="mb-6">
          <CardContent className="p-6">
            <div className="flex flex-wrap gap-4">
              <div>
                <label className={`block text-sm font-medium ${text} mb-2`}>Type</label>
                <select
                  value={filter.type}
                  onChange={(e) => setFilter(prev => ({ ...prev, type: e.target.value as any }))}
                  className={`px-3 py-2 rounded-lg border ${bg} ${text} border-gray-200 dark:border-gray-700`}
                >
                  <option value="all">Tous les types</option>
                  <option value="web">Web</option>
                  <option value="desktop">Desktop</option>
                  <option value="mobile">Mobile</option>
                  <option value="server">Serveur</option>
                </select>
              </div>
              
              <div>
                <label className={`block text-sm font-medium ${text} mb-2`}>Plateforme</label>
                <select
                  value={filter.platform}
                  onChange={(e) => setFilter(prev => ({ ...prev, platform: e.target.value as any }))}
                  className={`px-3 py-2 rounded-lg border ${bg} ${text} border-gray-200 dark:border-gray-700`}
                >
                  <option value="all">Toutes plateformes</option>
                  <option value="windows">Windows</option>
                  <option value="macos">macOS</option>
                  <option value="linux">Linux</option>
                  <option value="ios">iOS</option>
                  <option value="android">Android</option>
                </select>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Packages Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {filteredPackages.map(pkg => (
            <PackageCard
              key={pkg.id}
              package={pkg}
              progress={downloads[pkg.id]}
              onDownload={handleDownload}
              onPause={handlePause}
              onResume={handleResume}
              onCancel={handleCancel}
              isDarkMode={isDarkMode}
            />
          ))}
        </div>

        {/* Empty State */}
        {filteredPackages.length === 0 && (
          <div className="text-center py-12">
            <Package className={`w-16 h-16 mx-auto mb-4 ${isDarkMode ? 'text-gray-600' : 'text-gray-400'}`} />
            <h3 className={`text-xl font-medium mb-2 ${text}`}>
              Aucun package trouvé
            </h3>
            <p className={`${isDarkMode ? 'text-gray-400' : 'text-gray-600'}`}>
              Essayez de modifier vos filtres pour voir plus de packages
            </p>
          </div>
        )}
      </div>
    </div>
  );
};

export default DownloadManager;
