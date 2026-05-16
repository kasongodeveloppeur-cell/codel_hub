import React from 'react';
import { motion } from 'motion/react';
import { clsx } from 'clsx';
import { useThemeClasses } from '../../hooks/useTheme';

interface CardProps extends React.HTMLAttributes<HTMLDivElement> {
  variant?: 'default' | 'elevated' | 'outlined' | 'glass';
  padding?: 'none' | 'sm' | 'md' | 'lg';
  hover?: boolean;
  children: React.ReactNode;
}

export const Card: React.FC<CardProps> = ({
  variant = 'default',
  padding = 'md',
  hover = false,
  children,
  className,
  ...props
}) => {
  const { 
    bg, 
    bgCard, 
    bgHover, 
    border, 
    borderLight, 
    shadow,
    transition 
  } = useThemeClasses();

  const baseClasses = 'rounded-xl transition-all duration-200';

  const variantClasses = {
    default: clsx(bgCard, border),
    elevated: clsx(bg, border, shadow),
    outlined: clsx('bg-transparent', borderLight, 'border-2'),
    glass: clsx(
      'backdrop-blur-md bg-opacity-80',
      'bg-white/10 dark:bg-slate-900/10',
      'border border-white/20 dark:border-slate-700/20'
    )
  };

  const paddingClasses = {
    none: 'p-0',
    sm: 'p-4',
    md: 'p-6',
    lg: 'p-8'
  };

  const hoverClasses = hover ? 'hover:scale-[1.02] hover:shadow-xl' : '';

  return (
    <motion.div
      className={clsx(
        baseClasses,
        variantClasses[variant],
        paddingClasses[padding],
        hoverClasses,
        transition,
        className
      )}
      whileHover={hover ? { y: -2 } : undefined}
      {...props}
    >
      {children}
    </motion.div>
  );
};

interface CardHeaderProps {
  title?: string;
  subtitle?: string;
  icon?: React.ReactNode;
  actions?: React.ReactNode;
  className?: string;
}

export const CardHeader: React.FC<CardHeaderProps> = ({
  title,
  subtitle,
  icon,
  actions,
  className
}) => {
  const { text, textSecondary, border } = useThemeClasses();

  return (
    <div className={clsx('flex items-center justify-between pb-4', border, 'border-b', className)}>
      <div className="flex items-center gap-3">
        {icon && <div className="text-cyan-500">{icon}</div>}
        <div>
          {title && <h3 className={`font-semibold ${text}`}>{title}</h3>}
          {subtitle && <p className={`text-sm ${textSecondary}`}>{subtitle}</p>}
        </div>
      </div>
      {actions && <div className="flex items-center gap-2">{actions}</div>}
    </div>
  );
};

interface CardContentProps {
  children: React.ReactNode;
  className?: string;
}

export const CardContent: React.FC<CardContentProps> = ({
  children,
  className
}) => {
  return (
    <div className={className}>
      {children}
    </div>
  );
};

interface CardFooterProps {
  children: React.ReactNode;
  className?: string;
}

export const CardFooter: React.FC<CardFooterProps> = ({
  children,
  className
}) => {
  const { border } = useThemeClasses();

  return (
    <div className={clsx('flex items-center justify-between pt-4', border, 'border-t', className)}>
      {children}
    </div>
  );
};

export default Card;
