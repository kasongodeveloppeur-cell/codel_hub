import { useState, useEffect, createContext, useContext, ReactNode } from 'react';

export type ThemeMode = 'light' | 'dark' | 'system';

interface ThemeContextType {
  theme: ThemeMode;
  resolvedTheme: 'light' | 'dark';
  toggleTheme: () => void;
  setTheme: (theme: ThemeMode) => void;
}

const ThemeContext = createContext<ThemeContextType | undefined>(undefined);

export const useTheme = () => {
  const context = useContext(ThemeContext);
  if (!context) {
    throw new Error('useTheme must be used within a ThemeProvider');
  }
  return context;
};

interface ThemeProviderProps {
  children: ReactNode;
  defaultTheme?: ThemeMode;
}

export const ThemeProvider: React.FC<ThemeProviderProps> = ({ 
  children, 
  defaultTheme = 'system' 
}) => {
  const [theme, setThemeState] = useState<ThemeMode>(() => {
    // Récupérer le thème depuis localStorage ou utiliser le défaut
    const saved = localStorage.getItem('codel-theme');
    return (saved as ThemeMode) || defaultTheme;
  });

  const [resolvedTheme, setResolvedTheme] = useState<'light' | 'dark'>('light');

  // Appliquer le thème au document
  useEffect(() => {
    const root = window.document.documentElement;
    
    // Supprimer les classes de thème existantes
    root.classList.remove('light', 'dark');
    
    // Déterminer le thème résolu
    let resolved: 'light' | 'dark';
    if (theme === 'system') {
      resolved = window.matchMedia('(prefers-color-scheme: dark)').matches 
        ? 'dark' 
        : 'light';
    } else {
      resolved = theme;
    }
    
    // Appliquer la classe du thème résolu
    root.classList.add(resolved);
    setResolvedTheme(resolved);
    
    // Sauvegarder dans localStorage
    localStorage.setItem('codel-theme', theme);
  }, [theme]);

  // Écouter les changements de préférence système
  useEffect(() => {
    if (theme === 'system') {
      const mediaQuery = window.matchMedia('(prefers-color-scheme: dark)');
      
      const handleChange = () => {
        const resolved = mediaQuery.matches ? 'dark' : 'light';
        const root = window.document.documentElement;
        root.classList.remove('light', 'dark');
        root.classList.add(resolved);
        setResolvedTheme(resolved);
      };
      
      mediaQuery.addEventListener('change', handleChange);
      return () => mediaQuery.removeEventListener('change', handleChange);
    }
  }, [theme]);

  const toggleTheme = () => {
    setThemeState(prev => {
      if (prev === 'light') return 'dark';
      if (prev === 'dark') return 'light';
      return 'light'; // system -> light
    });
  };

  const setTheme = (newTheme: ThemeMode) => {
    setThemeState(newTheme);
  };

  const value: ThemeContextType = {
    theme,
    resolvedTheme,
    toggleTheme,
    setTheme
  };

  return (
    <ThemeContext.Provider value={value}>
      {children}
    </ThemeContext.Provider>
  );
};

// Hook pour les classes CSS conditionnelles
export const useThemeClasses = () => {
  const { resolvedTheme } = useTheme();
  
  return {
    // Classes principales
    bg: resolvedTheme === 'dark' ? 'bg-slate-950' : 'bg-white',
    bgSecondary: resolvedTheme === 'dark' ? 'bg-slate-900' : 'bg-slate-50',
    bgTertiary: resolvedTheme === 'dark' ? 'bg-slate-800' : 'bg-slate-100',
    bgCard: resolvedTheme === 'dark' ? 'bg-slate-800/50' : 'bg-white/80',
    bgHover: resolvedTheme === 'dark' ? 'bg-slate-700/50' : 'bg-slate-100/80',
    
    // Textes
    text: resolvedTheme === 'dark' ? 'text-slate-100' : 'text-slate-900',
    textSecondary: resolvedTheme === 'dark' ? 'text-slate-400' : 'text-slate-600',
    textMuted: resolvedTheme === 'dark' ? 'text-slate-500' : 'text-slate-500',
    textAccent: resolvedTheme === 'dark' ? 'text-blue-400' : 'text-blue-600',
    
    // Bordures
    border: resolvedTheme === 'dark' ? 'border-slate-700' : 'border-slate-200',
    borderLight: resolvedTheme === 'dark' ? 'border-slate-800' : 'border-slate-100',
    
    // Couleurs principales (CODEL branding)
    primary: resolvedTheme === 'dark' ? 'text-cyan-400' : 'text-cyan-600',
    primaryBg: resolvedTheme === 'dark' ? 'bg-cyan-500/10' : 'bg-cyan-50',
    primaryBorder: resolvedTheme === 'dark' ? 'border-cyan-500/30' : 'border-cyan-200',
    
    // Success
    success: resolvedTheme === 'dark' ? 'text-green-400' : 'text-green-600',
    successBg: resolvedTheme === 'dark' ? 'bg-green-500/10' : 'bg-green-50',
    
    // Warning
    warning: resolvedTheme === 'dark' ? 'text-yellow-400' : 'text-yellow-600',
    warningBg: resolvedTheme === 'dark' ? 'bg-yellow-500/10' : 'bg-yellow-50',
    
    // Error
    error: resolvedTheme === 'dark' ? 'text-red-400' : 'text-red-600',
    errorBg: resolvedTheme === 'dark' ? 'bg-red-500/10' : 'bg-red-50',
    errorBorder: resolvedTheme === 'dark' ? 'border-red-500/30' : 'border-red-200',
    
    // Shadows
    shadow: resolvedTheme === 'dark' 
      ? 'shadow-lg shadow-black/20' 
      : 'shadow-lg shadow-slate-200/50',
    
    // Gradients
    gradient: resolvedTheme === 'dark'
      ? 'bg-gradient-to-r from-cyan-500/20 to-blue-500/20'
      : 'bg-gradient-to-r from-cyan-100 to-blue-100',
    
    // Animations et transitions
    transition: 'transition-all duration-200 ease-in-out'
  };
};
