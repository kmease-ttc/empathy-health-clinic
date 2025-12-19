import puppeteer from 'puppeteer';
import fs from 'fs';
import path from 'path';

const BASE_URL = 'http://localhost:5000';
const OUTPUT_DIR = path.join(process.cwd(), 'dist', 'prerendered');

const LOW_OUTLINK_PAGES = [
  '/black-psychiatrist-orlando',
  '/female-therapist-orlando',
  '/psychotherapist-orlando',
  '/stress-management',
  '/therapy',
  '/insurance',
  '/affordable-care',
  '/pricing',
  '/about',
  '/new-patients',
  '/request-appointment',
];

async function prerenderPage(browser: any, route: string) {
  const page = await browser.newPage();
  await page.setViewport({ width: 1280, height: 1024 });
  
  try {
    await page.goto(BASE_URL + route, { waitUntil: 'networkidle0', timeout: 25000 });
    await page.waitForFunction(() => {
      const root = document.getElementById('root');
      if (!root) return false;
      return (root.textContent || '').length > 300;
    }, { timeout: 10000 }).catch(() => {});
    await new Promise(r => setTimeout(r, 2000));
    
    const html = await page.content();
    const filePath = route === '/' ? path.join(OUTPUT_DIR, 'index.html') : path.join(OUTPUT_DIR, route.replace(/^\//, ''), 'index.html');
    fs.mkdirSync(path.dirname(filePath), { recursive: true });
    fs.writeFileSync(filePath, '<!-- Prerendered by Puppeteer at ' + new Date().toISOString() + ' -->\n' + html);
    
    const linkCount = (html.match(/<a [^>]*href=/gi) || []).length;
    console.log('✅ ' + route + ': ' + linkCount + ' links');
  } catch (e: any) {
    console.log('❌ ' + route + ': ' + e.message);
  } finally {
    await page.close();
  }
}

async function main() {
  console.log('🚀 Prerendering pages with low outlinks...\n');
  const browser = await puppeteer.launch({ headless: true, args: ['--no-sandbox', '--disable-setuid-sandbox'] });
  for (const route of LOW_OUTLINK_PAGES) {
    await prerenderPage(browser, route);
  }
  await browser.close();
  console.log('\n✅ Done');
}

main().catch(err => { console.error('Fatal:', err); process.exit(1); });
