/**
 * Combines staticRoutes.json and blogRoutes.json into allRoutes.json
 * Validates routes and deduplicates
 */

import * as fs from 'fs';
import * as path from 'path';

const STATIC_ROUTES_PATH = path.join(process.cwd(), 'routes/staticRoutes.json');
const BLOG_ROUTES_PATH = path.join(process.cwd(), 'routes/blogRoutes.json');
const OUTPUT_PATH = path.join(process.cwd(), 'routes/allRoutes.json');

interface RouteManifest {
  totalRoutes: number;
  staticRoutes: number;
  blogRoutes: number;
  generatedAt: string;
  routes: string[];
}

function validateRoute(route: string): boolean {
  if (!route.startsWith('/')) {
    console.warn(`⚠️ Invalid route (missing leading /): ${route}`);
    return false;
  }
  if (route.includes(' ')) {
    console.warn(`⚠️ Invalid route (contains spaces): ${route}`);
    return false;
  }
  if (route.includes('?')) {
    console.warn(`⚠️ Invalid route (contains querystring): ${route}`);
    return false;
  }
  return true;
}

function main() {
  const staticRoutes: string[] = JSON.parse(fs.readFileSync(STATIC_ROUTES_PATH, 'utf-8'));
  const blogRoutes: string[] = JSON.parse(fs.readFileSync(BLOG_ROUTES_PATH, 'utf-8'));
  
  const allRoutes = new Set<string>();
  let invalidCount = 0;
  
  for (const route of staticRoutes) {
    if (validateRoute(route)) {
      allRoutes.add(route);
    } else {
      invalidCount++;
    }
  }
  
  for (const route of blogRoutes) {
    if (validateRoute(route)) {
      allRoutes.add(route);
    } else {
      invalidCount++;
    }
  }
  
  const sortedRoutes = Array.from(allRoutes).sort();
  
  const manifest: RouteManifest = {
    totalRoutes: sortedRoutes.length,
    staticRoutes: staticRoutes.length,
    blogRoutes: blogRoutes.length,
    generatedAt: new Date().toISOString(),
    routes: sortedRoutes,
  };
  
  fs.writeFileSync(OUTPUT_PATH, JSON.stringify(manifest, null, 2));
  
  console.log(`✅ Built route manifest with ${manifest.totalRoutes} total routes`);
  console.log(`   - Static routes: ${manifest.staticRoutes}`);
  console.log(`   - Blog routes: ${manifest.blogRoutes}`);
  if (invalidCount > 0) {
    console.log(`   - Invalid routes skipped: ${invalidCount}`);
  }
  
  if (manifest.totalRoutes < 250) {
    console.warn(`⚠️ Warning: Total routes (${manifest.totalRoutes}) is less than expected (310)`);
    console.warn('   Consider checking if all routes have been extracted correctly.');
  }
}

main();
