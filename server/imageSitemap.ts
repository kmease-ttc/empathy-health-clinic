import type { Express } from 'express';

interface ImageEntry {
  loc: string;
  images: {
    loc: string;
    title?: string;
    caption?: string;
    geoLocation?: string;
    license?: string;
  }[];
}

const BASE_URL = 'https://empathyhealthclinic.com';
const GEO_LOCATION = 'Orlando, Florida, USA';

const PROVIDER_IMAGES: ImageEntry[] = [
  {
    loc: '/team',
    images: [
      { loc: '/img/providers/alex-regan.webp', title: 'Alex Regan PA-C - Psychiatrist Orlando FL', geoLocation: GEO_LOCATION },
      { loc: '/img/providers/marjorie-felix.webp', title: 'Marjorie Felix PMHNP - Psychiatric Nurse Practitioner Orlando FL', geoLocation: GEO_LOCATION },
      { loc: '/img/providers/christine-orr.webp', title: 'Christine Orr LCSW - Therapist Winter Park FL', geoLocation: GEO_LOCATION },
    ]
  }
];

const SERVICE_PAGE_IMAGES: ImageEntry[] = [
  {
    loc: '/psychiatrist-orlando',
    images: [
      { loc: '/img/hero-psychiatry.webp', title: 'Psychiatrist Orlando FL - Expert Mental Health Care', geoLocation: GEO_LOCATION }
    ]
  },
  {
    loc: '/therapist-orlando',
    images: [
      { loc: '/img/hero-therapy.webp', title: 'Licensed Therapist Orlando FL - Counseling Services', geoLocation: GEO_LOCATION }
    ]
  },
  {
    loc: '/anxiety-treatment',
    images: [
      { loc: '/img/anxiety-treatment.webp', title: 'Anxiety Treatment Orlando FL - Expert Care', geoLocation: GEO_LOCATION }
    ]
  },
  {
    loc: '/depression-treatment',
    images: [
      { loc: '/img/depression-treatment.webp', title: 'Depression Treatment Orlando FL - Compassionate Care', geoLocation: GEO_LOCATION }
    ]
  },
  {
    loc: '/adhd-testing-orlando',
    images: [
      { loc: '/img/adhd-testing.webp', title: 'ADHD Testing Orlando FL - Comprehensive Evaluation', geoLocation: GEO_LOCATION }
    ]
  },
  {
    loc: '/tms-treatment',
    images: [
      { loc: '/img/tms-treatment.webp', title: 'TMS Treatment Orlando FL - FDA Approved Therapy', geoLocation: GEO_LOCATION }
    ]
  },
  {
    loc: '/emdr-therapy',
    images: [
      { loc: '/img/emdr-therapy.webp', title: 'EMDR Therapy Orlando FL - Trauma Treatment', geoLocation: GEO_LOCATION }
    ]
  }
];

const LOCATION_IMAGES: ImageEntry[] = [
  {
    loc: '/psychiatrist-winter-park',
    images: [
      { loc: '/img/locations/winter-park.webp', title: 'Psychiatrist Winter Park FL - Mental Health Services', geoLocation: 'Winter Park, Florida, USA' }
    ]
  },
  {
    loc: '/locations/altamonte-springs',
    images: [
      { loc: '/img/locations/altamonte-springs.webp', title: 'Psychiatrist Altamonte Springs FL - Mental Health Services', geoLocation: 'Altamonte Springs, Florida, USA' }
    ]
  },
  {
    loc: '/locations/kissimmee',
    images: [
      { loc: '/img/locations/kissimmee.webp', title: 'Psychiatrist Kissimmee FL - Mental Health Services', geoLocation: 'Kissimmee, Florida, USA' }
    ]
  },
  {
    loc: '/locations/apopka',
    images: [
      { loc: '/img/locations/apopka.webp', title: 'Psychiatrist Apopka FL - Mental Health Services', geoLocation: 'Apopka, Florida, USA' }
    ]
  }
];

const INSURANCE_IMAGES: ImageEntry[] = [
  {
    loc: '/insurance',
    images: [
      { loc: '/img/insurance/aetna.webp', title: 'Aetna Insurance Accepted - Empathy Health Clinic Orlando', geoLocation: GEO_LOCATION },
      { loc: '/img/insurance/bcbs.webp', title: 'Blue Cross Blue Shield Insurance Accepted - Empathy Health Clinic Orlando', geoLocation: GEO_LOCATION },
      { loc: '/img/insurance/cigna.webp', title: 'Cigna Insurance Accepted - Empathy Health Clinic Orlando', geoLocation: GEO_LOCATION },
      { loc: '/img/insurance/united.webp', title: 'UnitedHealthcare Insurance Accepted - Empathy Health Clinic Orlando', geoLocation: GEO_LOCATION },
      { loc: '/img/insurance/medicare.webp', title: 'Medicare Accepted - Empathy Health Clinic Orlando', geoLocation: GEO_LOCATION },
    ]
  }
];

function generateImageSitemapXML(): string {
  const allEntries: ImageEntry[] = [
    ...PROVIDER_IMAGES,
    ...SERVICE_PAGE_IMAGES,
    ...LOCATION_IMAGES,
    ...INSURANCE_IMAGES
  ];

  let xml = `<?xml version="1.0" encoding="UTF-8"?>
<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9"
        xmlns:image="http://www.google.com/schemas/sitemap-image/1.1">
`;

  for (const entry of allEntries) {
    xml += `  <url>
    <loc>${BASE_URL}${entry.loc}</loc>
`;
    for (const image of entry.images) {
      xml += `    <image:image>
      <image:loc>${BASE_URL}${image.loc}</image:loc>
`;
      if (image.title) {
        xml += `      <image:title>${escapeXml(image.title)}</image:title>
`;
      }
      if (image.caption) {
        xml += `      <image:caption>${escapeXml(image.caption)}</image:caption>
`;
      }
      if (image.geoLocation) {
        xml += `      <image:geo_location>${escapeXml(image.geoLocation)}</image:geo_location>
`;
      }
      xml += `    </image:image>
`;
    }
    xml += `  </url>
`;
  }

  xml += `</urlset>`;
  return xml;
}

function escapeXml(text: string): string {
  return text
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;')
    .replace(/'/g, '&apos;');
}

export function registerImageSitemap(app: Express): void {
  app.get('/image-sitemap.xml', (_req, res) => {
    const xml = generateImageSitemapXML();
    res.set('Content-Type', 'application/xml');
    res.set('Cache-Control', 'public, max-age=86400');
    res.send(xml);
  });
}

export { generateImageSitemapXML };
