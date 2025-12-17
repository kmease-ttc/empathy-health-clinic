/**
 * Extracts all static routes from App.tsx and generates routes/staticRoutes.json
 * Excludes dynamic routes (containing :slug or similar) and admin/auth routes
 */

import * as fs from 'fs';
import * as path from 'path';

const APP_TSX_PATH = path.join(process.cwd(), 'client/src/App.tsx');
const OUTPUT_PATH = path.join(process.cwd(), 'routes/staticRoutes.json');

function extractStaticRoutes(): string[] {
  const content = fs.readFileSync(APP_TSX_PATH, 'utf-8');
  
  const routeRegex = /path=["']([^"']+)["']/g;
  const routes = new Set<string>();
  
  let match;
  while ((match = routeRegex.exec(content)) !== null) {
    const route = match[1];
    
    if (route.includes(':')) continue;
    if (route.startsWith('/admin')) continue;
    if (route.startsWith('/auth')) continue;
    if (route === '/*') continue;
    
    routes.add(route);
  }
  
  return Array.from(routes).sort();
}

function main() {
  const routes = extractStaticRoutes();
  
  const outputDir = path.dirname(OUTPUT_PATH);
  if (!fs.existsSync(outputDir)) {
    fs.mkdirSync(outputDir, { recursive: true });
  }
  
  fs.writeFileSync(OUTPUT_PATH, JSON.stringify(routes, null, 2));
  
  console.log(`✅ Extracted ${routes.length} static routes to ${OUTPUT_PATH}`);
  console.log('Sample routes:', routes.slice(0, 10));
}

main();
