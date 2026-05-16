import React from 'react';
import { motion } from 'motion/react';
import { Sun, Moon, Monitor } from 'lucide-react';
import { useTheme } from '../../hooks/useTheme';
import { useThemeClasses } from '../../hooks/useTheme';

export const ThemeToggle: React.FC = () => {
  const { theme, toggleTheme, setTheme } = useTheme();
  const { bgCard, border, text, transition } = useThemeClasses();

  const handleThemeChange = (newTheme: 'light' | 'dark' | 'system') => {
    setTheme(newTheme);
  };

  return (
    <div className={`relative ${bgCard} ${border} rounded-lg p-1 ${transition}`}>
      <div className="flex items-center gap-1">
        {/* Light Mode */}
        <button
          onClick={() => handleThemeChange('light')}
          className={`p-2 rounded-md transition-all duration-200 ${
            theme === 'light' 
              ? 'bg-yellow-500/20 text-yellow-500' 
              : 'text-slate-400 hover:text-slate-200'
          }`}
          title="Mode clair"
        >
          <Sun className="w-4 h-4" />
        </button>

        {/* Dark Mode */}
        <button
          onClick={() => handleThemeChange('dark')}
          className={`p-2 rounded-md transition-all duration-200 ${
            theme === 'dark' 
              ? 'bg-blue-500/20 text-blue-400' 
              : 'text-slate-400 hover:text-slate-200'
          }`}
          title="Mode sombre"
        >
          <Moon className="w-4 h-4" />
        </button>

        {/* System Mode */}
        <button
          onClick={() => handleThemeChange('system')}
          className={`p-2 rounded-md transition-all duration-200 ${
            theme === 'system' 
              ? 'bg-purple-500/20 text-purple-400' 
              : 'text-slate-400 hover:text-slate-200'
          }`}
          title="Mode système"
        >
          <Monitor className="w-4 h-4" />
        </button>
      </div>
    </div>
  );
};

export const CompactThemeToggle: React.FC = () => {
  const { theme, toggleTheme } = useTheme();
  const { text, transition } = useThemeClasses();

  return (
    <motion.button
      onClick={toggleTheme}
      className={`p-2 rounded-lg ${transition} ${
        theme === 'dark' 
          ? 'bg-slate-800 text-yellow-400 hover:bg-slate-700' 
          : 'bg-slate-100 text-slate-700 hover:bg-slate-200'
      }`}
      whileHover={{ scale: 1.05 }}
      whileTap={{ scale: 0.95 }}
      title={theme === 'dark' ? 'Passer en mode clair' : 'Passer en mode sombre'}
    >
      {theme === 'dark' ? (
        <Sun className="w-5 h-5" />
      ) : (
        <Moon className="w-5 h-5" />
      )}
    </motion.button>
  );
};

export default ThemeToggle;
