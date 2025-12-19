/**
 * Prerender specific problematic pages
 */
import puppeteer from 'puppeteer';
import fs from 'fs';
import path from 'path';

const BASE_URL = process.env.PRERENDER_URL || 'http://localhost:5000';
const OUTPUT_DIR = path.join(process.cwd(), 'dist', 'prerendered');

const PROBLEM_PAGES = [
  '/black-psychiatrist-orlando',
  '/female-therapist-orlando',
  '/new-patients',
  '/pricing',
  '/psychotherapist-orlando',
  '/request-appointment',
  '/stress-management',
  '/contact-us',
  '/psychiatrist-casselberry',
  '/psychiatrist-downtown-orlando',
  '/psychiatrist-lake-nona',
  '/psychiatrist-longwood',
  '/psychiatrist-winter-garden',
  '/psychiatry-orlando',
  '/psychiatry-clinic-orlando',
  '/adhd-testing-orlando',
];

async function prerenderPage(browser: any, route: string) {
  const page = await browser.newPage();
  await page.setViewport({ width: 1280, height: 1024 });
  
  try {
    await page.goto(`${BASE_URL}${route}`, { waitUntil: 'networkidle0', timeout: 30000 });
    
    // Wait for React to render - look for H1 or substantial content
    await page.waitForFunction(() => {
      const root = document.getElementById('root');
      if (!root) return false;
      const h1 = root.querySelector('h1');
      const hasContent = (root.textContent || '').length > 500;
      return h1 || hasContent;
    }, { timeout: 15000 }).catch(() => {});
    
    // Extra wait for React to finish
    await new Promise(r => setTimeout(r, 2000));
    
    const html = await page.content();
    
    // Write to file
    const filePath = route === '/' 
      ? path.join(OUTPUT_DIR, 'index.html')
      : path.join(OUTPUT_DIR, route.replace(/^\//, ''), 'index.html');
    
    fs.mkdirSync(path.dirname(filePath), { recursive: true });
    fs.writeFileSync(filePath, `<!-- Prerendered by Puppeteer at ${new Date().toISOString()} -->\n${html}`);
    
    const linkCount = (html.match(/<a [^>]*href=/gi) || []).length;
    const h1Match = html.match(/<h1[^>]*>([^<]+)</i);
    
    console.log(`✅ ${route}: ${Math.round(html.length/1024)}KB, ${linkCount} links, H1: ${h1Match?.[1]?.slice(0,40) || 'none'}`);
  } catch (e: any) {
    console.log(`❌ ${route}: ${e.message}`);
  } finally {
    await page.close();
  }
}

async function main() {
  console.log('🚀 Prerendering problem pages...\n');
  const browser = await puppeteer.launch({ 
    headless: true, 
    args: ['--no-sandbox', '--disable-setuid-sandbox'] 
  });
  
  for (const route of PROBLEM_PAGES) {
    await prerenderPage(browser, route);
  }
  
  await browser.close();
  console.log('\n✅ Done');
}

main().catch(err => {
  console.error('Fatal:', err);
  process.exit(1);
});
