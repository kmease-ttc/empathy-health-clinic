import puppeteer from 'puppeteer';
import fs from 'fs';
import path from 'path';

const BASE_URL = process.env.PRERENDER_URL || 'http://localhost:5000';
const OUTPUT_DIR = path.join(process.cwd(), 'dist', 'prerendered');

const PAGES_TO_REFRESH = [
  '/about',
  '/bipolar-psychiatrist-orlando',
  '/ptsd-psychiatrist-orlando',
  '/urgent-psychiatric-care-orlando',
  '/new-patients',
  '/therapy',
  '/blog',
  '/services',
  '/what-we-treat',
  '/request-appointment',
];

async function prerenderPage(browser: any, route: string) {
  const page = await browser.newPage();
  await page.setViewport({ width: 1280, height: 1024 });
  
  try {
    await page.goto(`${BASE_URL}${route}`, { waitUntil: 'networkidle0', timeout: 25000 });
    await page.waitForFunction(() => {
      const root = document.getElementById('root');
      if (!root) return false;
      return (root.textContent || '').length > 300;
    }, { timeout: 10000 }).catch(() => {});
    await new Promise(r => setTimeout(r, 2000));
    
    const html = await page.content();
    const filePath = route === '/' ? path.join(OUTPUT_DIR, 'index.html') : path.join(OUTPUT_DIR, route.replace(/^\//, ''), 'index.html');
    fs.mkdirSync(path.dirname(filePath), { recursive: true });
    fs.writeFileSync(filePath, `<!-- Prerendered by Puppeteer at ${new Date().toISOString()} -->\n${html}`);
    
    const canonicalMatch = html.match(/<link[^>]*rel="canonical"[^>]*href="([^"]+)"/i);
    const h1Match = html.match(/<h1[^>]*>([^<]+)</i);
    console.log(`✅ ${route}: canonical=${canonicalMatch?.[1]?.replace('https://empathyhealthclinic.com', '') || 'none'}, H1=${h1Match?.[1]?.slice(0,30) || 'none'}`);
  } catch (e: any) {
    console.log(`❌ ${route}: ${e.message}`);
  } finally {
    await page.close();
  }
}

async function main() {
  console.log('🚀 Prerendering pages with canonical fixes...\n');
  const browser = await puppeteer.launch({ headless: true, args: ['--no-sandbox', '--disable-setuid-sandbox'] });
  for (const route of PAGES_TO_REFRESH) {
    await prerenderPage(browser, route);
  }
  await browser.close();
  console.log('\n✅ Done');
}

main().catch(err => { console.error('Fatal:', err); process.exit(1); });
