import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { 
  Download, 
  X, 
  CheckCircle, 
  AlertCircle, 
  Smartphone, 
  Monitor, 
  Tablet, 
  Wifi, 
  WifiOff, 
  RefreshCw,
  Info,
  ChevronRight,
  ChevronDown,
  Star,
  Shield,
  Zap,
  Globe,
  Home,
  Settings,
  HelpCircle,
  ExternalLink
} from 'lucide-react';
import { Button } from '../ui/Button';
import { Card, CardHeader, CardContent } from '../ui/Card';
import { Badge } from '../ui/Badge';
import { useThemeClasses } from '../../hooks/useTheme';

interface PWAInstallPrompt {
  platform: 'ios' | 'android' | 'desktop' | 'unknown';
  canInstall: boolean;
  instructions: string[];
  isInstalled: boolean;
  installMethod: 'native' | 'manual';
}

export const PWAInstaller: React.FC = () => {
  const { bg, text } = useThemeClasses();
  const [isDarkMode] = useState(false);
  const [deferredPrompt, setDeferredPrompt] = useState<any>(null);
  const [installPrompt, setInstallPrompt] = useState<PWAInstallPrompt | null>(null);
  const [showInstructions, setShowInstructions] = useState(false);
  const [isInstalling, setIsInstalling] = useState(false);
  const [isInstalled, setIsInstalled] = useState(false);

  useEffect(() => {
    // Detect platform and installation capabilities
    const detectPlatform = (): PWAInstallPrompt => {
      const userAgent = navigator.userAgent.toLowerCase();
      const platform = /iphone|ipad|ipod/.test(userAgent) ? 'ios' :
                      /android/.test(userAgent) ? 'android' : 'desktop';

      const canInstall = platform === 'desktop' ? 'beforeinstallprompt' in window :
                         platform === 'ios' ? 'standalone' in window.navigator :
                         true;

      const isInstalled = platform === 'ios' ? (window.navigator as any).standalone :
                          platform === 'android' ? window.matchMedia('(display-mode: standalone)').matches :
                          false;

      const installMethod = platform === 'desktop' && 'beforeinstallprompt' in window ? 'native' : 'manual';

      const instructions = getInstructions(platform);

      return {
        platform,
        canInstall,
        instructions,
        isInstalled,
        installMethod
      };
    };

    // Listen for beforeinstallprompt event (desktop)
    const handleBeforeInstallPrompt = (e: Event) => {
      e.preventDefault();
      setDeferredPrompt(e);
      setInstallPrompt(detectPlatform());
    };

    // Listen for appinstalled event
    const handleAppInstalled = () => {
      setIsInstalled(true);
      setDeferredPrompt(null);
    };

    // Initialize
    setInstallPrompt(detectPlatform());

    // Add event listeners
    window.addEventListener('beforeinstallprompt', handleBeforeInstallPrompt);
    window.addEventListener('appinstalled', handleAppInstalled);

    return () => {
      window.removeEventListener('beforeinstallprompt', handleBeforeInstallPrompt);
      window.removeEventListener('appinstalled', handleAppInstalled);
    };
  }, []);

  const getInstructions = (platform: string): string[] => {
    switch (platform) {
      case 'ios':
        return [
          'Ouvrez Safari sur votre iPhone/iPad',
          'Allez sur le site CODEL Hub',
          'Appuyez sur le bouton Partager (icône carrée avec flèche)',
          'Faites défiler vers le bas et appuyez sur "Sur l\'écran d\'accueil"',
          'Appuyez sur "Ajouter" pour installer l\'application'
        ];
      case 'android':
        return [
          'Ouvrez Chrome sur votre Android',
          'Allez sur le site CODEL Hub',
          'Appuyez sur le menu (trois points) en haut à droite',
          'Appuyez sur "Installer l\'application" ou "Ajouter à l\'écran d\'accueil"',
          'Appuyez sur "Installer" pour confirmer'
        ];
      case 'desktop':
        return [
          'Ouvrez Chrome, Edge ou Firefox sur votre ordinateur',
          'Allez sur le site CODEL Hub',
          'Cliquez sur le bouton d\'installation qui apparaît',
          'Suivez les instructions pour installer l\'application'
        ];
      default:
        return [];
    }
  };

  const handleInstall = async () => {
    if (!deferredPrompt) return;

    setIsInstalling(true);
    
    try {
      // Show the install prompt
      deferredPrompt.prompt();
      
      // Wait for the user to respond to the prompt
      const { outcome } = await deferredPrompt.userChoice;
      
      if (outcome === 'accepted') {
        setIsInstalled(true);
      }
      
      setDeferredPrompt(null);
    } catch (error) {
      console.error('Installation failed:', error);
    } finally {
      setIsInstalling(false);
    }
  };

  const getPlatformIcon = (platform: string) => {
    switch (platform) {
      case 'ios': return <Smartphone className="w-6 h-6" />;
      case 'android': return <Smartphone className="w-6 h-6" />;
      case 'desktop': return <Monitor className="w-6 h-6" />;
      default: return <Globe className="w-6 h-6" />;
    }
  };

  const getPlatformName = (platform: string) => {
    switch (platform) {
      case 'ios': return 'iOS';
      case 'android': return 'Android';
      case 'desktop': return 'Desktop';
      default: return 'Unknown';
    }
  };

  if (isInstalled || (installPrompt && installPrompt.isInstalled)) {
    return (
      <Card className="mb-6">
        <CardContent className="p-6">
          <div className="flex items-center gap-4">
            <div className="p-3 rounded-full bg-green-100 dark:bg-green-900/20">
              <CheckCircle className="w-6 h-6 text-green-500" />
            </div>
            <div className="flex-1">
              <h3 className={`font-semibold ${text} mb-1`}>Application installée</h3>
              <p className="text-sm text-gray-500">
                CODEL Hub est installée sur votre appareil
              </p>
            </div>
            <Button
              variant="outline"
              size="sm"
              onClick={() => window.location.reload()}
              icon={<RefreshCw className="w-4 h-4" />}
            >
              Actualiser
            </Button>
          </div>
        </CardContent>
      </Card>
    );
  }

  if (!installPrompt || !installPrompt.canInstall) {
    return null;
  }

  return (
    <AnimatePresence>
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        exit={{ opacity: 0, y: -20 }}
      >
        <Card className="mb-6">
          <CardContent className="p-6">
            <div className="flex items-start gap-4">
              <div className="p-3 rounded-lg bg-cyan-100 dark:bg-cyan-900/20">
                {getPlatformIcon(installPrompt.platform)}
              </div>
              
              <div className="flex-1">
                <div className="flex items-center justify-between mb-2">
                  <h3 className={`font-semibold ${text}`}>
                    Installer CODEL Hub
                  </h3>
                  <Badge variant="primary" size="sm">
                    {getPlatformName(installPrompt.platform)}
                  </Badge>
                </div>
                
                <p className={`${isDarkMode ? 'text-gray-300' : 'text-gray-700'} mb-4`}>
                  Installez CODEL Hub sur votre {getPlatformName(installPrompt.platform)} pour une expérience native avec :
                </p>
                
                <div className="grid grid-cols-1 md:grid-cols-2 gap-3 mb-4">
                  <div className="flex items-center gap-2 text-sm">
                    <Zap className="w-4 h-4 text-cyan-500" />
                    <span>Démarrage instantané</span>
                  </div>
                  <div className="flex items-center gap-2 text-sm">
                    <Wifi className="w-4 h-4 text-green-500" />
                    <span>Fonctionnement hors ligne</span>
                  </div>
                  <div className="flex items-center gap-2 text-sm">
                    <Star className="w-4 h-4 text-yellow-500" />
                    <span>Notifications natives</span>
                  </div>
                  <div className="flex items-center gap-2 text-sm">
                    <Shield className="w-4 h-4 text-purple-500" />
                    <span>Sécurité renforcée</span>
                  </div>
                </div>

                {installPrompt.installMethod === 'native' && deferredPrompt ? (
                  <div className="flex gap-3">
                    <Button
                      variant="primary"
                      onClick={handleInstall}
                      disabled={isInstalling}
                      icon={<Download className="w-4 h-4" />}
                      className="flex-1"
                    >
                      {isInstalling ? 'Installation...' : 'Installer maintenant'}
                    </Button>
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={() => setShowInstructions(!showInstructions)}
                      icon={<Info className="w-4 h-4" />}
                    >
                      Instructions
                    </Button>
                  </div>
                ) : (
                  <div>
                    <Button
                      variant="primary"
                      onClick={() => setShowInstructions(!showInstructions)}
                      icon={<HelpCircle className="w-4 h-4" />}
                      className="mb-3"
                    >
                      Voir les instructions d'installation
                    </Button>
                  </div>
                )}

                <AnimatePresence>
                  {showInstructions && (
                    <motion.div
                      initial={{ opacity: 0, height: 0 }}
                      animate={{ opacity: 1, height: 'auto' }}
                      exit={{ opacity: 0, height: 0 }}
                      className="mt-4"
                    >
                      <div className={`p-4 rounded-lg ${isDarkMode ? 'bg-gray-800' : 'bg-gray-50'}`}>
                        <h4 className={`font-medium ${text} mb-3`}>
                          Instructions pour {getPlatformName(installPrompt.platform)}:
                        </h4>
                        <ol className="space-y-2">
                          {installPrompt.instructions.map((instruction, index) => (
                            <li key={index} className="flex items-start gap-3">
                              <div className="w-6 h-6 rounded-full bg-cyan-500 text-white flex items-center justify-center text-xs font-medium flex-shrink-0 mt-0.5">
                                {index + 1}
                              </div>
                              <span className={`text-sm ${isDarkMode ? 'text-gray-300' : 'text-gray-700'}`}>
                                {instruction}
                              </span>
                            </li>
                          ))}
                        </ol>
                      </div>
                    </motion.div>
                  )}
                </AnimatePresence>
              </div>
            </div>
          </CardContent>
        </Card>
      </motion.div>
    </AnimatePresence>
  );
};

export default PWAInstaller;
