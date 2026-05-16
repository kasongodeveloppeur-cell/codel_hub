import React from 'react';
import { clsx } from 'clsx';
import { useThemeClasses } from '../../hooks/useTheme';

interface InputProps extends React.InputHTMLAttributes<HTMLInputElement> {
  label?: string;
  errorMessage?: string;
  helper?: string;
  icon?: React.ReactNode;
  iconPosition?: 'left' | 'right';
}

export const Input: React.FC<InputProps> = ({
  label,
  errorMessage,
  helper,
  icon,
  iconPosition = 'left',
  className,
  ...props
}) => {
  const { 
    bg, 
    text, 
    textMuted, 
    border, 
    error: errorColor,
    errorBg,
    errorBorder,
    transition 
  } = useThemeClasses();

  const inputClasses = clsx(
    'w-full px-4 py-2 rounded-lg border transition-all duration-200 focus:outline-none focus:ring-2 focus:ring-offset-2',
    bg,
    text,
    border,
    'placeholder:text-slate-500 dark:placeholder:text-slate-400',
    'focus:ring-cyan-500/50 focus:border-cyan-500',
    errorMessage && `${errorBorder} ${errorBg}`,
    transition,
    icon && iconPosition === 'left' && 'pl-10',
    icon && iconPosition === 'right' && 'pr-10',
    className
  );

  return (
    <div className="space-y-2">
      {label && (
        <label className={`block text-sm font-medium ${text}`}>
          {label}
        </label>
      )}
      
      <div className="relative">
        {icon && iconPosition === 'left' && (
          <div className="absolute left-3 top-1/2 transform -translate-y-1/2 text-slate-400">
            {icon}
          </div>
        )}
        
        <input
          className={inputClasses}
          {...props}
        />
        
        {icon && iconPosition === 'right' && (
          <div className="absolute right-3 top-1/2 transform -translate-y-1/2 text-slate-400">
            {icon}
          </div>
        )}
      </div>
      
      {errorMessage && (
        <p className={`text-sm ${errorColor} flex items-center gap-1`}>
          {errorMessage}
        </p>
      )}
      
      {helper && !errorMessage && (
        <p className={`text-sm ${textMuted}`}>
          {helper}
        </p>
      )}
    </div>
  );
};

interface TextareaProps extends React.TextareaHTMLAttributes<HTMLTextAreaElement> {
  label?: string;
  errorMessage?: string;
  helper?: string;
  resize?: 'none' | 'vertical' | 'horizontal' | 'both';
}

export const Textarea: React.FC<TextareaProps> = ({
  label,
  errorMessage,
  helper,
  resize = 'vertical',
  className,
  ...props
}) => {
  const { 
    bg, 
    text, 
    textMuted, 
    border, 
    error: errorColor,
    errorBg,
    errorBorder,
    transition 
  } = useThemeClasses();

  const textareaClasses = clsx(
    'w-full px-4 py-2 rounded-lg border transition-all duration-200 focus:outline-none focus:ring-2 focus:ring-offset-2',
    bg,
    text,
    border,
    'placeholder:text-slate-500 dark:placeholder:text-slate-400',
    'focus:ring-cyan-500/50 focus:border-cyan-500',
    errorMessage && `${errorBorder} ${errorBg}`,
    resize === 'none' && 'resize-none',
    resize === 'vertical' && 'resize-y',
    resize === 'horizontal' && 'resize-x',
    resize === 'both' && 'resize',
    transition,
    className
  );

  return (
    <div className="space-y-2">
      {label && (
        <label className={`block text-sm font-medium ${text}`}>
          {label}
        </label>
      )}
      
      <textarea
        className={textareaClasses}
        {...props}
      />
      
      {errorMessage && (
        <p className={`text-sm ${errorColor} flex items-center gap-1`}>
          {errorMessage}
        </p>
      )}
      
      {helper && !errorMessage && (
        <p className={`text-sm ${textMuted}`}>
          {helper}
        </p>
      )}
    </div>
  );
};

interface SelectProps extends React.SelectHTMLAttributes<HTMLSelectElement> {
  label?: string;
  errorMessage?: string;
  helper?: string;
  options: Array<{ value: string; label: string; disabled?: boolean }>;
}

export const Select: React.FC<SelectProps> = ({
  label,
  errorMessage,
  helper,
  options,
  className,
  ...props
}) => {
  const { 
    bg, 
    text, 
    textMuted, 
    border, 
    error: errorColor,
    errorBg,
    errorBorder,
    transition 
  } = useThemeClasses();

  const selectClasses = clsx(
    'w-full px-4 py-2 rounded-lg border transition-all duration-200 focus:outline-none focus:ring-2 focus:ring-offset-2 appearance-none cursor-pointer',
    bg,
    text,
    border,
    'focus:ring-cyan-500/50 focus:border-cyan-500',
    errorMessage && `${errorBorder} ${errorBg}`,
    transition,
    className
  );

  return (
    <div className="space-y-2">
      {label && (
        <label className={`block text-sm font-medium ${text}`}>
          {label}
        </label>
      )}
      
      <div className="relative">
        <select className={selectClasses} {...props}>
          {options.map((option) => (
            <option
              key={option.value}
              value={option.value}
              disabled={option.disabled}
            >
              {option.label}
            </option>
          ))}
        </select>
        
        {/* Custom dropdown arrow */}
        <div className="absolute right-3 top-1/2 transform -translate-y-1/2 pointer-events-none">
          <svg
            className="w-4 h-4 text-slate-400"
            fill="none"
            stroke="currentColor"
            viewBox="0 0 24 24"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={2}
              d="M19 9l-7 7-7-7"
            />
          </svg>
        </div>
      </div>
      
      {errorMessage && (
        <p className={`text-sm ${errorColor} flex items-center gap-1`}>
          {errorMessage}
        </p>
      )}
      
      {helper && !errorMessage && (
        <p className={`text-sm ${textMuted}`}>
          {helper}
        </p>
      )}
    </div>
  );
};

export default Input;
