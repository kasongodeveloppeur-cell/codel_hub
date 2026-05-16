import React, { useState, useRef, useEffect } from 'react';
import { motion } from 'motion/react';
import { clsx } from 'clsx';

interface LazyImageProps {
  src: string;
  alt: string;
  className?: string;
  placeholder?: string;
  onLoad?: () => void;
  onError?: () => void;
}

export const LazyImage: React.FC<LazyImageProps> = ({
  src,
  alt,
  className,
  placeholder = '/api/placeholder/400/300',
  onLoad,
  onError
}) => {
  const [isLoaded, setIsLoaded] = useState(false);
  const [isInView, setIsInView] = useState(false);
  const [hasError, setHasError] = useState(false);
  const imgRef = useRef<HTMLImageElement>(null);

  useEffect(() => {
    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          setIsInView(true);
          observer.disconnect();
        }
      },
      {
        threshold: 0.1,
        rootMargin: '50px'
      }
    );

    if (imgRef.current) {
      observer.observe(imgRef.current);
    }

    return () => observer.disconnect();
  }, []);

  const handleLoad = () => {
    setIsLoaded(true);
    onLoad?.();
  };

  const handleError = () => {
    setHasError(true);
    onError?.();
  };

  return (
    <div ref={imgRef} className={clsx('relative overflow-hidden', className)}>
      {/* Placeholder */}
      <motion.div
        className="absolute inset-0 bg-gray-200 dark:bg-gray-700"
        animate={{
          opacity: isLoaded ? 0 : 1
        }}
        transition={{ duration: 0.3 }}
      />
      
      {/* Image */}
      {isInView && !hasError && (
        <motion.img
          src={src}
          alt={alt}
          className={clsx(
            'w-full h-full object-cover',
            'transition-opacity duration-300'
          )}
          initial={{ opacity: 0 }}
          animate={{ opacity: isLoaded ? 1 : 0 }}
          onLoad={handleLoad}
          onError={handleError}
        />
      )}
      
      {/* Error state */}
      {hasError && (
        <div className="absolute inset-0 flex items-center justify-center bg-gray-100 dark:bg-gray-800">
          <div className="text-center">
            <div className="text-gray-400 text-4xl mb-2">🖼️</div>
            <p className="text-gray-500 text-sm">Image non disponible</p>
          </div>
        </div>
      )}
    </div>
  );
};

export default LazyImage;
