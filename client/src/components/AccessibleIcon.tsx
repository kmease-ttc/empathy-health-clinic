import { ReactNode, cloneElement, isValidElement } from 'react';

interface AccessibleIconProps {
  children: ReactNode;
  label: string;
  className?: string;
}

export default function AccessibleIcon({ children, label, className = '' }: AccessibleIconProps) {
  if (!isValidElement(children)) {
    return null;
  }

  return cloneElement(children as React.ReactElement<{
    role?: string;
    'aria-label'?: string;
    className?: string;
  }>, {
    role: 'img',
    'aria-label': label,
    className: `${(children as React.ReactElement).props.className || ''} ${className}`.trim(),
  });
}

interface InsuranceLogoProps {
  name: string;
  src: string;
  className?: string;
  width?: number;
  height?: number;
}

export function InsuranceLogo({ name, src, className = '', width = 120, height = 60 }: InsuranceLogoProps) {
  return (
    <img
      src={src}
      alt={`${name} insurance accepted at Empathy Health Clinic Orlando FL`}
      role="img"
      aria-label={`${name} insurance logo`}
      className={className}
      width={width}
      height={height}
      loading="lazy"
      decoding="async"
      style={{ aspectRatio: `${width}/${height}` }}
      data-testid={`logo-insurance-${name.toLowerCase().replace(/\s+/g, '-')}`}
    />
  );
}

interface ProviderPhotoProps {
  name: string;
  title: string;
  specialty?: string;
  src: string;
  className?: string;
  width?: number;
  height?: number;
  priority?: boolean;
}

export function ProviderPhoto({ 
  name, 
  title, 
  specialty,
  src, 
  className = '', 
  width = 300, 
  height = 300,
  priority = false
}: ProviderPhotoProps) {
  const altText = specialty 
    ? `${name} ${title} - ${specialty} in Orlando FL - Empathy Health Clinic`
    : `${name} ${title} - Mental Health Provider Orlando FL - Empathy Health Clinic`;

  return (
    <img
      src={src}
      alt={altText}
      role="img"
      aria-label={`Photo of ${name}`}
      className={className}
      width={width}
      height={height}
      loading={priority ? 'eager' : 'lazy'}
      decoding={priority ? 'sync' : 'async'}
      fetchPriority={priority ? 'high' : 'auto'}
      style={{ aspectRatio: "1/1" }}
      data-testid={`photo-provider-${name.toLowerCase().replace(/\s+/g, '-')}`}
    />
  );
}

interface TrustBadgeProps {
  name: string;
  src: string;
  className?: string;
  width?: number;
  height?: number;
}

export function TrustBadge({ name, src, className = '', width = 100, height = 40 }: TrustBadgeProps) {
  return (
    <img
      src={src}
      alt={`${name} verified badge - Empathy Health Clinic`}
      role="img"
      aria-label={`${name} verification badge`}
      className={className}
      width={width}
      height={height}
      loading="lazy"
      decoding="async"
      style={{ aspectRatio: `${width}/${height}` }}
      data-testid={`badge-${name.toLowerCase().replace(/\s+/g, '-')}`}
    />
  );
}

interface BlogFeaturedImageProps {
  title: string;
  src: string;
  className?: string;
  width?: number;
  height?: number;
  priority?: boolean;
}

export function BlogFeaturedImage({ 
  title, 
  src, 
  className = '', 
  width = 800, 
  height = 450,
  priority = false
}: BlogFeaturedImageProps) {
  return (
    <img
      src={src}
      alt={`${title} - Mental Health Blog - Empathy Health Clinic Orlando`}
      role="img"
      aria-label={`Featured image for ${title}`}
      className={className}
      width={width}
      height={height}
      loading={priority ? 'eager' : 'lazy'}
      decoding={priority ? 'sync' : 'async'}
      fetchPriority={priority ? 'high' : 'auto'}
      style={{ aspectRatio: "16/9" }}
      data-testid={`img-blog-featured-${title.toLowerCase().replace(/[^a-z0-9]+/g, '-').slice(0, 30)}`}
    />
  );
}
