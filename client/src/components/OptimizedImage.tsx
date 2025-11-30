import { ImgHTMLAttributes, useState, useEffect, useRef } from 'react';

interface OptimizedImageProps extends ImgHTMLAttributes<HTMLImageElement> {
  src: string;
  alt?: string;
  width?: number;
  height?: number;
  priority?: boolean;
  className?: string;
  aspectRatio?: string;
  fallbackKeyword?: string;
}

const DEFAULT_ASPECT_RATIO = "16/9";
const DEFAULT_WIDTH = 800;
const DEFAULT_HEIGHT = 450;

function generateAltText(src: string, fallbackKeyword?: string): string {
  if (fallbackKeyword) {
    return `${fallbackKeyword} - Empathy Health Clinic Orlando FL`;
  }
  
  const filename = src.split('/').pop()?.split('.')[0] || '';
  const cleanName = filename
    .replace(/[-_]/g, ' ')
    .replace(/\d+/g, '')
    .replace(/\s+/g, ' ')
    .trim();
  
  if (cleanName.length > 3) {
    return `${cleanName.charAt(0).toUpperCase() + cleanName.slice(1)} - Empathy Health Clinic Orlando FL`;
  }
  
  return "Mental Health Services - Empathy Health Clinic Orlando FL";
}

export default function OptimizedImage({
  src,
  alt,
  width,
  height,
  priority = false,
  className = '',
  aspectRatio,
  fallbackKeyword,
  ...props
}: OptimizedImageProps) {
  const [isLoaded, setIsLoaded] = useState(false);
  const [isInView, setIsInView] = useState(priority);
  const imgRef = useRef<HTMLImageElement>(null);

  const finalAlt = alt && alt.trim() !== '' ? alt : generateAltText(src, fallbackKeyword);
  const finalWidth = width || DEFAULT_WIDTH;
  const finalHeight = height || DEFAULT_HEIGHT;
  const finalAspectRatio = aspectRatio || DEFAULT_ASPECT_RATIO;

  useEffect(() => {
    if (priority) return;

    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          setIsInView(true);
          observer.disconnect();
        }
      },
      {
        rootMargin: '50px',
      }
    );

    if (imgRef.current) {
      observer.observe(imgRef.current);
    }

    return () => {
      observer.disconnect();
    };
  }, [priority]);

  const testId = `img-${finalAlt.toLowerCase().replace(/[^a-z0-9]+/g, '-').slice(0, 50)}`;

  return (
    <img
      ref={imgRef}
      src={isInView ? src : undefined}
      alt={finalAlt}
      width={finalWidth}
      height={finalHeight}
      loading={priority ? 'eager' : 'lazy'}
      decoding={priority ? 'sync' : 'async'}
      fetchPriority={priority ? 'high' : 'auto'}
      style={{ aspectRatio: finalAspectRatio }}
      className={`${className} ${isLoaded ? 'opacity-100' : 'opacity-0'} transition-opacity duration-300`}
      onLoad={() => setIsLoaded(true)}
      {...props}
      data-testid={testId}
    />
  );
}
