# CLAUDE.md - AI Assistant Guide for Empathy Health Clinic

## Project Overview

**Empathy Health Clinic** is a full-stack mental health practice website serving the Orlando/Winter Park, Florida area. It's a modern SPA with comprehensive SEO optimization, featuring:
- Patient-facing website with service pages, provider information, and appointment booking
- Automated blog system with AI-powered content generation
- Admin dashboard for analytics, blog management, and SEO monitoring
- Lead capture forms with detailed analytics tracking
- Server-side prerendering for search engine crawlability

## Technology Stack

### Frontend
- **Framework**: React 18.3 with TypeScript
- **Routing**: Wouter (lightweight client-side routing)
- **Styling**: Tailwind CSS 3.4 with shadcn/ui components (New York style)
- **Build Tool**: Vite 6.3
- **State Management**: TanStack React Query 5.60
- **Forms**: React Hook Form with Zod validation
- **Animations**: Framer Motion, Embla Carousel
- **Icons**: Lucide React, React Icons

### Backend
- **Runtime**: Node.js 20.x with Express 4.21
- **Language**: TypeScript (ESM modules)
- **ORM**: Drizzle ORM with Drizzle Kit
- **Database**: PostgreSQL (Neon serverless)
- **Email**: SendGrid
- **Prerendering**: Puppeteer for HTML snapshots

## Directory Structure

```
/
├── client/                          # React frontend
│   └── src/
│       ├── App.tsx                 # Main routing component
│       ├── components/
│       │   ├── ui/                 # Shadcn/ui components
│       │   └── admin/              # Admin dashboard components
│       ├── pages/                  # Route pages (100+)
│       ├── lib/                    # Utilities (analytics, utils, queryClient)
│       ├── hooks/                  # Custom React hooks
│       ├── config/                 # Page configurations
│       └── types/                  # TypeScript definitions
│
├── server/                          # Express backend
│   ├── index.ts                    # Express app setup
│   ├── routes.ts                   # API routes (3,300+ lines)
│   ├── storage.ts                  # Data layer (2,400+ lines)
│   ├── db.ts                       # Database connection
│   ├── auth.ts                     # Authentication
│   ├── email.ts                    # SendGrid service
│   ├── prerender-middleware.ts     # SEO prerendering
│   └── blog-generator-service.ts   # AI blog generation
│
├── shared/                          # Shared code
│   ├── schema.ts                   # Drizzle ORM schema + Zod
│   └── seoConfig.ts                # SEO configuration
│
├── scripts/                         # Build & utility scripts
│   ├── build-production.sh        # Production build
│   ├── build-fast.sh              # Fast compile-only
│   └── prerender-puppeteer.ts     # Prerender engine
│
├── e2e/                             # Playwright E2E tests
│   ├── lead-form.spec.ts
│   └── services-page.spec.ts
│
└── routes/                          # Generated route manifests
```

## Quick Commands

```bash
# Development
npm run dev                 # Start dev server with HMR

# Build
npm run build              # CI build (no prerendering)
npm run build:fast         # Fast compile-only
npm run build:full         # Full build with prerendering

# Production
npm run start              # Run production server

# Database
npm run db:push            # Push Drizzle migrations

# Validation
npm run check              # TypeScript check
npm run check:db           # Database validation
npm run check:seo          # SEO audit
npm run check:all          # Full validation
```

## TypeScript Path Aliases

```typescript
@/         → ./client/src/
@shared/   → ./shared/
@assets/   → ./attached_assets/
```

## Key Conventions

### Component Patterns

**Lazy Loading** - All pages except Home are lazy-loaded:
```typescript
import Home from "@/pages/Home";
const Insurance = lazy(() => import("@/pages/Insurance"));
```

**SEO Head** - Every page should include:
```typescript
<SEOHead
  title="Page Title"
  description="Meta description"
  canonical="/path"
  structuredData={organizationSchema}
/>
```

**Form Pattern** - Use React Hook Form + Zod:
```typescript
const form = useForm<z.infer<typeof schema>>({
  resolver: zodResolver(schema)
});
```

**Data Fetching** - Use TanStack React Query:
```typescript
const { data } = useQuery({
  queryKey: ["/api/endpoint"],
  queryFn: getQueryFn()
});
```

### Database Schema

Located in `shared/schema.ts`. Key tables:
- `users` - Admin authentication
- `leads` - Lead form submissions
- `blogPosts` - Blog content
- `treatments`, `conditions`, `locations` - Content types
- `pageViews`, `analyticsEvents` - Analytics
- `emailFailures` - Email error tracking

Pattern for schema definitions:
```typescript
export const treatments = pgTable("treatments", { ... });
export const insertTreatmentSchema = createInsertSchema(treatments).omit({ id: true });
export type InsertTreatment = z.infer<typeof insertTreatmentSchema>;
export type Treatment = typeof treatments.$inferSelect;
```

### API Routes

All routes under `/api/` with REST semantics. Key endpoints:
- `POST /api/leads` - Lead submission
- `POST /api/login`, `POST /api/logout`, `GET /api/user` - Auth
- `GET /api/health` - Health check
- `GET /api/treatments`, `/api/team`, `/api/blog` - Content

Rate limiting:
- Form submissions: 10 per 15 minutes per IP
- General API: 100 per minute per IP
- SEO crawlers: Exempt

### Styling

- Use Tailwind CSS utility classes
- Shadcn/ui components in `client/src/components/ui/`
- Use `cn()` utility from `@/lib/utils` for conditional classes:
```typescript
import { cn } from "@/lib/utils";
<div className={cn("base-class", condition && "conditional-class")} />
```

## Important Files

| File | Purpose |
|------|---------|
| `server/routes.ts` | All API routes and prerender logic |
| `server/storage.ts` | Database CRUD operations |
| `client/src/App.tsx` | All frontend routes |
| `shared/schema.ts` | Database schema definitions |
| `shared/seoConfig.ts` | SEO rules and noindex paths |
| `server/blog-posts-data.json` | Blog content (2.2MB) |

## Build Pipeline

1. **Frontend Build**: Vite compiles React to `dist/public/`
2. **Backend Build**: esbuild bundles server to `dist/index.js`
3. **Prerendering** (optional): Puppeteer generates HTML snapshots to `dist/prerendered/`
4. **Asset Fixing**: Scripts fix asset references in prerendered HTML

The build respects `PRERENDER_MODE`:
- `off` - Skip prerendering (CI/fast builds)
- `priority` - Prerender ~50 critical pages
- `full` - Prerender all 310+ pages

## Environment Variables

Required:
- `DATABASE_URL` - PostgreSQL connection string (Neon)

Optional:
- `SENDGRID_API_KEY` - Email sending
- `OPENAI_API_KEY` - Blog generation
- `GOOGLE_ADS_API_KEY` - Ads integration

## Testing

E2E tests use Playwright. Run with:
```bash
npx playwright test
```

Tests are in `/e2e/` directory. Configuration in `playwright.config.ts`.

## Security Considerations

- CSP headers configured in `server/index.ts`
- Rate limiting on all form submissions
- WordPress legacy URLs return 410 Gone
- Admin routes protected with Passport.js authentication
- No `.env` files should be committed (in `.gitignore`)

## Common Tasks

### Adding a New Page
1. Create component in `client/src/pages/`
2. Add route in `client/src/App.tsx` (use lazy loading)
3. Add SEOHead component with proper metadata
4. If needed, add to route manifest in `scripts/buildRouteManifest.ts`

### Adding an API Endpoint
1. Add route handler in `server/routes.ts`
2. Add data access methods in `server/storage.ts`
3. If new table needed, define in `shared/schema.ts`
4. Run `npm run db:push` to apply schema changes

### Modifying Database Schema
1. Edit `shared/schema.ts`
2. Run `npm run db:push` to push changes
3. Update `server/storage.ts` with new CRUD methods

### Creating Blog Posts
Blog posts are stored in `server/blog-posts-data.json`. The blog generator service in `server/blog-generator-service.ts` handles AI-powered content creation.

## Performance Notes

- Pages are lazy-loaded by default
- React Query caches API responses
- Prerendered HTML served to crawlers
- Compression middleware enabled
- Static assets served from `dist/public/`

## Deployment

The project deploys to Replit with autoscaling:
- Build: `npm run build`
- Start: `npm run start`
- Port: 5000 (internal), 80 (external)
- Health check: `/api/health`

## Git Workflow

- Never commit `node_modules/`, `dist/`, or `attached_assets/`
- Large data files like `*.csv`, `*.sql` are gitignored
- Blog markdown files in `/blogs/` are gitignored (content in JSON)
