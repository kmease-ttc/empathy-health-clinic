import { ReactNode } from 'react';

interface HeroBackgroundProps {
  imageSrc: string;
  children: ReactNode;
  priority?: boolean;
  altText?: string;
  pageKeyword?: string;
}

function generateHeroAltText(imageSrc: string, pageKeyword?: string): string {
  if (pageKeyword) {
    return `${pageKeyword} - Mental Health Services in Orlando FL - Empathy Health Clinic`;
  }
  
  const filename = imageSrc.split('/').pop()?.split('.')[0] || '';
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

export default function HeroBackground({ 
  imageSrc, 
  children, 
  priority = false,
  altText,
  pageKeyword
}: HeroBackgroundProps) {
  const finalAlt = altText || generateHeroAltText(imageSrc, pageKeyword);
  
  return (
    <div className="relative py-16 px-4 min-h-[400px]">
      <div className="absolute inset-0 overflow-hidden">
        <img
          src={imageSrc}
          alt={finalAlt}
          className="w-full h-full object-cover"
          loading={priority ? 'eager' : 'lazy'}
          decoding={priority ? 'sync' : 'async'}
          fetchPriority={priority ? 'high' : 'auto'}
          width={1920}
          height={400}
          style={{ aspectRatio: "1920/400" }}
          data-testid="img-hero-background"
        />
        <div className="absolute inset-0 bg-gradient-to-b from-black/60 via-black/50 to-black/60" aria-hidden="true" />
      </div>
      <div className="container mx-auto max-w-4xl relative z-10">
        {children}
      </div>
    </div>
  );
}
