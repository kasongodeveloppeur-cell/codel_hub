import React from 'react';
import { motion } from 'motion/react';
import { clsx } from 'clsx';
import { useThemeClasses } from '../../hooks/useTheme';

interface BadgeProps {
  children: React.ReactNode;
  variant?: 'default' | 'primary' | 'secondary' | 'success' | 'warning' | 'error';
  size?: 'sm' | 'md' | 'lg';
  className?: string;
}

export const Badge: React.FC<BadgeProps> = ({
  children,
  variant = 'default',
  size = 'md',
  className
}) => {
  const { 
    bg, 
    text, 
    primary, 
    primaryBg,
    success,
    successBg,
    error,
    errorBg,
    warning,
    warningBg
  } = useThemeClasses();

  const variantClasses = {
    default: clsx(bg, text, 'border border-gray-200 dark:border-gray-700'),
    primary: clsx(primaryBg, primary, 'border border-transparent'),
    secondary: clsx('bg-gray-100 text-gray-800 dark:bg-gray-800 dark:text-gray-200 border border-transparent'),
    success: clsx(successBg, success, 'border border-transparent'),
    warning: clsx(warningBg, warning, 'border border-transparent'),
    error: clsx(errorBg, error, 'border border-transparent')
  };

  const sizeClasses = {
    sm: 'px-2 py-1 text-xs',
    md: 'px-3 py-1 text-sm',
    lg: 'px-4 py-2 text-base'
  };

  return (
    <motion.span
      className={clsx(
        'inline-flex items-center justify-center rounded-full font-medium',
        variantClasses[variant],
        sizeClasses[size],
        className
      )}
      initial={{ scale: 0.8, opacity: 0 }}
      animate={{ scale: 1, opacity: 1 }}
      transition={{ duration: 0.2 }}
    >
      {children}
    </motion.span>
  );
};

export default Badge;
