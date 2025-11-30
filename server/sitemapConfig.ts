const BASE_URL = 'https://empathyhealthclinic.com';

const NOINDEX_PATHS = [
  '/admin', '/login', '/auth', '/config', '/debug',
  '/examples', '/test', '/preview',
  '/privacy', '/terms', '/disclaimer',
  '/thank-you', '/confirmed', '/appointment-confirmed',
  '/404', '/500', '/error',
  '/search', '/filter',
  '/api', '/attachment', '/uploads', '/media',
  '/wp-includes', '/wp-content', '/wp-admin',
];

const CANONICAL_CONSOLIDATION_PATHS: Record<string, string> = {
  '/psychiatry-orlando': '/psychiatrist-orlando',
  '/psychiatry-clinic-orlando': '/psychiatrist-orlando',
  '/anxiety-psychiatrist-orlando': '/psychiatrist-orlando',
  '/depression-psychiatrist-orlando': '/psychiatrist-orlando',
  '/medication-management-orlando': '/psychiatrist-orlando',
  '/telepsychiatry-orlando': '/psychiatrist-orlando',
  '/bipolar-psychiatrist-orlando': '/psychiatrist-orlando',
  '/same-day-psychiatrist-orlando': '/psychiatrist-orlando',
};

const STATIC_PAGES: { path: string; changefreq: string; priority: number }[] = [
  { path: '/', changefreq: 'daily', priority: 1.0 },
  { path: '/services', changefreq: 'weekly', priority: 0.9 },
  { path: '/psychiatrist-orlando', changefreq: 'weekly', priority: 0.9 },
  { path: '/therapist-orlando', changefreq: 'weekly', priority: 0.85 },
  { path: '/team', changefreq: 'weekly', priority: 0.85 },
  { path: '/insurance', changefreq: 'weekly', priority: 0.8 },
  { path: '/blog', changefreq: 'daily', priority: 0.8 },
  { path: '/new-patients', changefreq: 'weekly', priority: 0.8 },
  { path: '/virtual-therapy', changefreq: 'weekly', priority: 0.8 },
  { path: '/request-appointment', changefreq: 'weekly', priority: 0.85 },
  { path: '/therapy', changefreq: 'weekly', priority: 0.8 },
  { path: '/psychotherapist-orlando', changefreq: 'weekly', priority: 0.8 },
  { path: '/couples-counseling', changefreq: 'weekly', priority: 0.75 },
  { path: '/counselor-near-me', changefreq: 'weekly', priority: 0.75 },
  { path: '/mental-health-near-me', changefreq: 'weekly', priority: 0.75 },
  { path: '/therapy-near-me', changefreq: 'weekly', priority: 0.75 },
  { path: '/psychiatrist-near-me', changefreq: 'weekly', priority: 0.9 },
  { path: '/counseling-orlando', changefreq: 'weekly', priority: 0.75 },
  { path: '/therapy-oviedo', changefreq: 'monthly', priority: 0.7 },
  { path: '/therapist-maitland', changefreq: 'monthly', priority: 0.7 },
  { path: '/child-psychiatrist-orlando', changefreq: 'weekly', priority: 0.85 },
  { path: '/adhd-psychiatrist-orlando', changefreq: 'weekly', priority: 0.85 },
  { path: '/anxiety-therapy', changefreq: 'weekly', priority: 0.8 },
  { path: '/depression-counseling', changefreq: 'weekly', priority: 0.8 },
  { path: '/cognitive-behavioral-therapy', changefreq: 'monthly', priority: 0.75 },
  { path: '/emdr-therapy', changefreq: 'monthly', priority: 0.8 },
  { path: '/tms-treatment', changefreq: 'monthly', priority: 0.8 },
  { path: '/adhd-testing-orlando', changefreq: 'weekly', priority: 0.85 },
  { path: '/anxiety-treatment', changefreq: 'weekly', priority: 0.8 },
  { path: '/depression-treatment', changefreq: 'weekly', priority: 0.8 },
  { path: '/medication-management', changefreq: 'weekly', priority: 0.85 },
  { path: '/psychiatric-services', changefreq: 'weekly', priority: 0.8 },
];

const ORLANDO_CLUSTER_PAGES: { path: string; changefreq: string; priority: number }[] = [
  { path: '/psychiatrist-orlando', changefreq: 'weekly', priority: 0.9 },
  { path: '/child-psychiatrist-orlando', changefreq: 'weekly', priority: 0.85 },
  { path: '/adhd-psychiatrist-orlando', changefreq: 'weekly', priority: 0.85 },
];

const LOCATION_PAGES: { path: string; changefreq: string; priority: number }[] = [
  { path: '/psychiatrist-winter-park', changefreq: 'weekly', priority: 0.8 },
  { path: '/locations/winter-park', changefreq: 'monthly', priority: 0.75 },
  { path: '/locations/orlando', changefreq: 'monthly', priority: 0.75 },
  { path: '/locations/altamonte-springs', changefreq: 'monthly', priority: 0.7 },
  { path: '/locations/kissimmee', changefreq: 'monthly', priority: 0.7 },
  { path: '/locations/apopka', changefreq: 'monthly', priority: 0.7 },
  { path: '/locations/lake-mary', changefreq: 'monthly', priority: 0.7 },
  { path: '/locations/sanford', changefreq: 'monthly', priority: 0.7 },
  { path: '/locations/maitland', changefreq: 'monthly', priority: 0.7 },
  { path: '/locations/casselberry', changefreq: 'monthly', priority: 0.7 },
];

function isNoindexPath(path: string): boolean {
  const normalizedPath = path.toLowerCase().replace(/\/+$/, '');
  if (NOINDEX_PATHS.some(pattern => normalizedPath.startsWith(pattern))) {
    return true;
  }
  if (normalizedPath.includes('page=')) return true;
  if (normalizedPath.includes('?')) return true;
  if (normalizedPath.includes('attachment')) return true;
  if (normalizedPath.includes('wp-')) return true;
  return false;
}

function isNonCanonicalPath(path: string): boolean {
  const normalizedPath = path.toLowerCase().replace(/\/+$/, '');
  return normalizedPath in CANONICAL_CONSOLIDATION_PATHS;
}

function getCanonicalPath(path: string): string {
  const normalizedPath = path.toLowerCase().replace(/\/+$/, '');
  return CANONICAL_CONSOLIDATION_PATHS[normalizedPath] || path;
}

function normalizeUrl(url: string): string {
  return url
    .replace(/^http:\/\//, 'https://')
    .replace('www.empathyhealthclinic.com', 'empathyhealthclinic.com')
    .replace('.replit.app', '.com')
    .replace('.replit.dev', '.com')
    .replace(/\/+$/, '');
}

function shouldIncludeInSitemap(path: string): boolean {
  if (isNoindexPath(path)) return false;
  if (isNonCanonicalPath(path)) return false;
  return true;
}

function escapeXml(text: string): string {
  return text
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;')
    .replace(/'/g, '&apos;');
}

interface SitemapEntry {
  loc: string;
  lastmod?: string;
  changefreq: string;
  priority: number;
}

function generateUrlEntry(entry: SitemapEntry, includeHreflang: boolean = true): string {
  const fullUrl = `${BASE_URL}${entry.loc}`;
  let xml = `  <url>\n`;
  xml += `    <loc>${escapeXml(fullUrl)}</loc>\n`;
  if (entry.lastmod) {
    xml += `    <lastmod>${entry.lastmod}</lastmod>\n`;
  }
  xml += `    <changefreq>${entry.changefreq}</changefreq>\n`;
  xml += `    <priority>${entry.priority.toFixed(1)}</priority>\n`;
  if (includeHreflang) {
    xml += `    <xhtml:link rel="alternate" hreflang="en-us" href="${escapeXml(fullUrl)}" />\n`;
    xml += `    <xhtml:link rel="alternate" hreflang="x-default" href="${escapeXml(fullUrl)}" />\n`;
  }
  xml += `  </url>\n`;
  return xml;
}

function getToday(): string {
  return new Date().toISOString().split('T')[0];
}

export {
  BASE_URL,
  NOINDEX_PATHS,
  CANONICAL_CONSOLIDATION_PATHS,
  STATIC_PAGES,
  ORLANDO_CLUSTER_PAGES,
  LOCATION_PAGES,
  isNoindexPath,
  isNonCanonicalPath,
  getCanonicalPath,
  normalizeUrl,
  shouldIncludeInSitemap,
  escapeXml,
  generateUrlEntry,
  getToday,
  SitemapEntry,
};
