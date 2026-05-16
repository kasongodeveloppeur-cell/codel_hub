import React from 'react';
import { motion } from 'motion/react';
import { Loader2 } from 'lucide-react';
import { clsx } from 'clsx';
import { useThemeClasses } from '../../hooks/useTheme';

interface ButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: 'primary' | 'secondary' | 'outline' | 'ghost' | 'danger';
  size?: 'sm' | 'md' | 'lg';
  loading?: boolean;
  icon?: React.ReactNode;
  children: React.ReactNode;
}

export const Button: React.FC<ButtonProps> = ({
  variant = 'primary',
  size = 'md',
  loading = false,
  icon,
  children,
  className,
  disabled,
  ...props
}) => {
  const { 
    bg, 
    bgHover, 
    text, 
    textSecondary, 
    border, 
    primary, 
    primaryBg,
    primaryBorder,
    success,
    successBg,
    error,
    errorBg,
    transition 
  } = useThemeClasses();

  const baseClasses = 'inline-flex items-center justify-center font-medium rounded-lg transition-all duration-200 focus:outline-none focus:ring-2 focus:ring-offset-2 disabled:opacity-50 disabled:cursor-not-allowed';

  const variantClasses = {
    primary: clsx(
      primaryBg,
      primary,
      'border border-transparent',
      'hover:opacity-90 focus:ring-cyan-500/50'
    ),
    secondary: clsx(
      bg,
      text,
      border,
      'hover:bg-opacity-80 focus:ring-slate-500/50'
    ),
    outline: clsx(
      'bg-transparent',
      primary,
      primaryBorder,
      'border',
      'hover:bg-opacity-10 focus:ring-cyan-500/50'
    ),
    ghost: clsx(
      'bg-transparent',
      textSecondary,
      'hover:bg-opacity-10 focus:ring-slate-500/50'
    ),
    danger: clsx(
      errorBg,
      error,
      'border border-transparent',
      'hover:opacity-90 focus:ring-red-500/50'
    )
  };

  const sizeClasses = {
    sm: 'px-3 py-1.5 text-sm',
    md: 'px-4 py-2 text-sm',
    lg: 'px-6 py-3 text-base'
  };

  return (
    <motion.button
      className={clsx(
        baseClasses,
        variantClasses[variant],
        sizeClasses[size],
        transition,
        className
      )}
      disabled={disabled || loading}
      whileHover={{ scale: disabled || loading ? 1 : 1.02 }}
      whileTap={{ scale: disabled || loading ? 1 : 0.98 }}
      {...props}
    >
      {loading && (
        <Loader2 className="w-4 h-4 mr-2 animate-spin" />
      )}
      {icon && !loading && (
        <span className="mr-2">{icon}</span>
      )}
      {children}
    </motion.button>
  );
};

export const IconButton: React.FC<{
  icon: React.ReactNode;
  variant?: 'primary' | 'secondary' | 'ghost';
  size?: 'sm' | 'md' | 'lg';
  tooltip?: string;
  className?: string;
  onClick?: () => void;
  disabled?: boolean;
}> = ({
  icon,
  variant = 'ghost',
  size = 'md',
  tooltip,
  className,
  onClick,
  disabled = false
}) => {
  const { 
    bgHover, 
    text, 
    textSecondary, 
    primary, 
    primaryBg,
    transition 
  } = useThemeClasses();

  const baseClasses = 'inline-flex items-center justify-center rounded-lg transition-all duration-200 focus:outline-none focus:ring-2 focus:ring-offset-2 disabled:opacity-50 disabled:cursor-not-allowed';

  const variantClasses = {
    primary: clsx(
      primaryBg,
      primary,
      'hover:opacity-90 focus:ring-cyan-500/50'
    ),
    secondary: clsx(
      bgHover,
      text,
      'focus:ring-slate-500/50'
    ),
    ghost: clsx(
      'bg-transparent',
      textSecondary,
      'hover:bg-opacity-10 focus:ring-slate-500/50'
    )
  };

  const sizeClasses = {
    sm: 'p-1.5',
    md: 'p-2',
    lg: 'p-3'
  };

  return (
    <motion.button
      className={clsx(
        baseClasses,
        variantClasses[variant],
        sizeClasses[size],
        transition,
        className
      )}
      onClick={onClick}
      disabled={disabled}
      title={tooltip}
      whileHover={{ scale: disabled ? 1 : 1.05 }}
      whileTap={{ scale: disabled ? 1 : 0.95 }}
    >
      {icon}
    </motion.button>
  );
};

export default Button;
