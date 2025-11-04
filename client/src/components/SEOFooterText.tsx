interface SEOFooterTextProps {
  children: React.ReactNode;
}

export default function SEOFooterText({ children }: SEOFooterTextProps) {
  return (
    <section className="py-8 md:py-10 bg-background border-t" data-testid="section-seo-footer-text">
      <div className="max-w-4xl mx-auto px-6 lg:px-8">
        <div className="text-base leading-relaxed text-muted-foreground" style={{ color: '#6b7280', fontSize: '16px' }}>
          {children}
        </div>
      </div>
    </section>
  );
}
