import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { Code2, Zap, BookOpen, Trophy, Users } from 'lucide-react';
import { useThemeClasses } from '../hooks/useTheme';

interface SplashScreenProps {
  onComplete: () => void;
  duration?: number;
}

export const SplashScreen: React.FC<SplashScreenProps> = ({ 
  onComplete, 
  duration = 3000 
}) => {
  const { bg, text, primary, primaryBg, gradient } = useThemeClasses();
  const [isVisible, setIsVisible] = useState(true);
  const [loadingProgress, setLoadingProgress] = useState(0);

  useEffect(() => {
    // Simuler le chargement progressif
    const progressInterval = setInterval(() => {
      setLoadingProgress(prev => {
        if (prev >= 100) {
          clearInterval(progressInterval);
          return 100;
        }
        return prev + 2;
      });
    }, duration / 50);

    // Timer pour masquer le splash screen
    const timer = setTimeout(() => {
      setIsVisible(false);
      setTimeout(onComplete, 500); // Attendre la fin de l'animation
    }, duration);

    return () => {
      clearTimeout(timer);
      clearInterval(progressInterval);
    };
  }, [duration, onComplete]);

  const features = [
    { icon: Code2, label: 'CODEL LABS' },
    { icon: BookOpen, label: 'Bibliothèque' },
    { icon: Trophy, label: 'Système XP' },
    { icon: Users, label: 'Communauté' }
  ];

  return (
    <AnimatePresence>
      {isVisible && (
        <motion.div
          initial={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          className={clsx(
            'fixed inset-0 z-50 flex flex-col items-center justify-center',
            bg, text
          )}
        >
          {/* Background gradient */}
          <div className={clsx(
            'absolute inset-0 opacity-20',
            gradient
          )} />
          
          {/* Logo principal */}
          <motion.div
            initial={{ scale: 0, rotate: -180 }}
            animate={{ scale: 1, rotate: 0 }}
            transition={{ 
              type: "spring", 
              stiffness: 260, 
              damping: 20,
              duration: 1.5
            }}
            className="relative mb-8"
          >
            {/* Logo CODEL */}
            <div className={clsx(
              'w-32 h-32 rounded-2xl flex items-center justify-center',
              'bg-gradient-to-br from-cyan-500 to-blue-600',
              'shadow-2xl shadow-cyan-500/25',
              'border border-cyan-400/20'
            )}>
              <Code2 className="w-16 h-16 text-white" />
            </div>
            
            {/* Particules animées autour du logo */}
            {[...Array(6)].map((_, i) => (
              <motion.div
                key={i}
                className="absolute w-2 h-2 bg-cyan-400 rounded-full"
                initial={{ 
                  scale: 0,
                  x: 0,
                  y: 0
                }}
                animate={{
                  scale: [0, 1, 0],
                  x: Math.cos((i * 60) * Math.PI / 180) * 80,
                  y: Math.sin((i * 60) * Math.PI / 180) * 80,
                }}
                transition={{
                  duration: 2,
                  repeat: Infinity,
                  delay: i * 0.2,
                  ease: "easeInOut"
                }}
              />
            ))}
          </motion.div>

          {/* Titre et slogan */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.5, duration: 0.8 }}
            className="text-center mb-12"
          >
            <h1 className="text-4xl md:text-6xl font-bold mb-3 bg-gradient-to-r from-cyan-400 to-blue-600 bg-clip-text text-transparent">
              CODEL HUB
            </h1>
            <p className="text-lg md:text-xl text-slate-400">
              La plateforme d'apprentissage du club informatique
            </p>
          </motion.div>

          {/* Features */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 1, duration: 0.8 }}
            className="grid grid-cols-2 md:grid-cols-4 gap-6 mb-12"
          >
            {features.map((feature, index) => {
              const Icon = feature.icon;
              return (
                <motion.div
                  key={feature.label}
                  initial={{ opacity: 0, scale: 0.8 }}
                  animate={{ opacity: 1, scale: 1 }}
                  transition={{ delay: 1.2 + index * 0.1, duration: 0.5 }}
                  className="flex flex-col items-center gap-2"
                >
                  <div className={clsx(
                    'p-3 rounded-xl',
                    primaryBg,
                    'border border-cyan-500/20'
                  )}>
                    <Icon className={clsx('w-6 h-6', primary)} />
                  </div>
                  <span className="text-sm text-slate-400">{feature.label}</span>
                </motion.div>
              );
            })}
          </motion.div>

          {/* Barre de progression */}
          <motion.div
            initial={{ opacity: 0, width: 0 }}
            animate={{ opacity: 1, width: '300px' }}
            transition={{ delay: 1.5, duration: 0.5 }}
            className="w-full max-w-xs"
          >
            <div className="text-center mb-3">
              <span className="text-sm text-slate-400">Chargement</span>
              <span className="text-sm text-cyan-400 ml-2">{loadingProgress}%</span>
            </div>
            
            <div className={clsx(
              'w-full h-2 rounded-full overflow-hidden',
              'bg-slate-800/50 border border-slate-700/50'
            )}>
              <motion.div
                className={clsx(
                  'h-full bg-gradient-to-r from-cyan-500 to-blue-600',
                  'shadow-lg shadow-cyan-500/25'
                )}
                initial={{ width: 0 }}
                animate={{ width: `${loadingProgress}%` }}
                transition={{ duration: 0.3, ease: "easeOut" }}
              />
            </div>
          </motion.div>

          {/* Version et copyright */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 2, duration: 0.5 }}
            className="absolute bottom-6 text-center"
          >
            <p className="text-xs text-slate-500">
              Version 1.0.0 • © 2024 CODEL Club
            </p>
          </motion.div>

          {/* Effet de particules en arrière-plan */}
          <div className="absolute inset-0 pointer-events-none">
            {[...Array(20)].map((_, i) => (
              <motion.div
                key={i}
                className="absolute w-1 h-1 bg-cyan-400/30 rounded-full"
                initial={{
                  x: Math.random() * window.innerWidth,
                  y: Math.random() * window.innerHeight,
                  scale: 0,
                }}
                animate={{
                  scale: [0, 1, 0],
                  y: -100,
                }}
                transition={{
                  duration: 3 + Math.random() * 2,
                  repeat: Infinity,
                  delay: Math.random() * 3,
                  ease: "linear"
                }}
              />
            ))}
          </div>
        </motion.div>
      )}
    </AnimatePresence>
  );
};

export default SplashScreen;
