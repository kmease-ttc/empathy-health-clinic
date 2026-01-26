# Deployment Guide - Empathy Health Clinic

## Quick Reference

| Command | Purpose |
|---------|---------|
| `npm run build` | Production build with priority prerender (~50 pages) |
| `PRERENDER_MODE=full npm run build` | Full prerender (310+ pages, use locally) |
| `PRERENDER_MODE=off npm run build` | Quick build, no prerender (CI/dev) |

## Deployment Architecture

### Critical Principle
**Prerender NEVER blocks deployment.** The app must deploy even if prerendering fails. React CSR (Client-Side Rendering) handles any pages without static HTML.

### Build Phases

**Phase 1: Core Build (BLOCKING)**
- Frontend: Vite builds React app to `dist/public/`
- Backend: esbuild compiles Express server to `dist/index.js`
- Database: Schema sync (non-blocking - runtime handles failures)

**Phase 2: Prerender (NON-BLOCKING)**
- Chrome/Puppeteer installation
- Route manifest generation
- HTML snapshot generation
- Asset reference fixing
- Verification (informational only)

## Prerender Modes

### Priority Mode (Default)
```bash
npm run build
# or
PRERENDER_MODE=priority npm run build
```
- Prerenders ~50 critical SEO pages
- Fast, reliable builds (2-3 minutes)
- Non-priority pages use React CSR
- **Recommended for Replit deployments**

Priority routes include:
- Homepage and navigation pages
- High-intent keywords: psychiatrist-orlando, psychiatry-orlando, psychiatrist-near-me
- Condition pages: anxiety, depression, ADHD, PTSD, OCD, trauma
- Location pages: Winter Park, Lake Mary, Altamonte Springs
- Treatment pages: medication management, psychiatric evaluation, therapy

### Full Mode
```bash
PRERENDER_MODE=full npm run build
```
- Prerenders all 310+ pages
- Slower builds (10-15 minutes)
- **Use locally only** - may timeout in Replit deployment
- Required for complete SEO coverage

### Off Mode
```bash
PRERENDER_MODE=off npm run build
```
- Skips all prerendering
- Fastest build (< 1 minute)
- Use for CI, development, or debugging

## Replit Configuration

### .replit file
```toml
[deployment]
build = ["bash", "scripts/build-production.sh"]
run = ["node", "dist/index.js"]
```

### Environment Variables
| Variable | Default | Description |
|----------|---------|-------------|
| `PRERENDER_MODE` | `priority` | Prerender mode: priority/full/off |
| `PRERENDER_CONCURRENCY` | `10` | Concurrent browser pages |
| `SKIP_DB_CHECK` | `false` | Skip database validation |
| `NODE_ENV` | - | Set to `production` in deployment |

## Troubleshooting

### Build Timeouts
1. Ensure `PRERENDER_MODE=priority` (default)
2. Check logs for which step is slow
3. If still timing out, use `PRERENDER_MODE=off` temporarily

### Missing Prerendered Pages
- Not critical - React CSR handles missing pages
- Pages still work, just render client-side
- Run full prerender locally and commit results if needed

### Server Won't Start for Prerender
- Check `PORT` isn't conflicting (uses 5002 for prerender)
- Verify `dist/index.js` was built successfully
- Check for runtime errors in build logs

### Asset Reference Errors
- Usually self-healing via `fix-prerender-assets.ts`
- If persistent, rebuild with `PRERENDER_MODE=off` then run prerender separately

## Diagnostics

Build output includes diagnostics header:
```
==========================================
DEPLOY DIAGNOSTICS
==========================================
Timestamp: 2026-01-12T20:00:00Z
Node: v20.x.x
NPM: 10.x.x
PRERENDER_MODE: priority
PRERENDER_CONCURRENCY: 10
```

Final summary shows:
```
==========================================
BUILD COMPLETE
==========================================
  Backend: dist/index.js
  Frontend: dist/public/
  Prerendered: 45 pages
  Prerender: SUCCESS
```

## SEO Impact

| Mode | Prerendered Pages | SEO Quality | Build Time |
|------|-------------------|-------------|------------|
| Priority | ~50 critical | High for main keywords | 2-3 min |
| Full | 310+ | Complete coverage | 10-15 min |
| Off | 0 | CSR only (lower) | < 1 min |

For maximum SEO:
1. Deploy with priority mode for reliability
2. Run full prerender locally
3. Commit prerendered files to repo
4. Re-deploy to serve full static HTML
