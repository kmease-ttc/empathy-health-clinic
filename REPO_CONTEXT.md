# empathy-health-clinic - ARQLO Demo/Production Client Site

## Role
**Client Site** - Production website serving as demo and testing ground for ARQLO features

## Intended Responsibilities
- Serve as a real-world production website
- Demonstrate ARQLO capabilities in action
- Test ARQLO features on live traffic
- Generate real SEO data for analysis
- Showcase blog generation integration
- Provide lead capture and analytics
- Serve as reference implementation for ARQLO clients

## Integration Points

### Database
- **Access**: Yes (full-stack application)
- **Tables**: Multiple (blog posts, leads, analytics, etc.)
- **Connection**: Via `DATABASE_URL` environment variable

### Queue
- **Uses queue-client**: Unknown (needs verification)
- **Pattern**: Likely submits jobs to ARQLO workers

### KBase
- **Writes to kbase_events**: Unknown (likely consumes, doesn't write)
- **Pattern**: ARQLO workers analyze this site and write to KBase

### HTTP
- **Exposes Public Website**: Yes (full React + Express application)
- **Admin Dashboard**: Yes (for site management)

## Service Name
N/A (client site, not a worker)

## Always-On Runtime
**Yes** - Production website must be continuously available

## Key Files
- **Storage Layer**: `storage.ts` (2,400+ lines - database operations)
- **API Routes**: `routes.ts` (3,300+ lines - REST endpoints)
- **Client**: React frontend
- **Server**: Express backend

## Application Architecture
**Full-Stack React + Express**:
- Frontend: React with SSR (Server-Side Rendering)
- Backend: Express REST API
- Database: Postgres (extensive schema)
- Hosting: Replit with auto-scaling

## Capabilities
- **Public Website**: Healthcare clinic website
- **Blog Platform**: SEO-optimized blog with ARQLO integration
- **Lead Capture**: Contact forms and lead tracking
- **Analytics**: Custom analytics tracking
- **Admin Dashboard**: Content and lead management
- **SEO Features**: Prerendering, meta tags, schema.org markup
- **Blog Generation**: Integration with Worker-Blog-Writer

## Website Features
- Healthcare services marketing
- Patient education blog
- Lead capture forms
- Appointment scheduling (likely)
- Service pages
- Contact information
- SEO-optimized content

## ARQLO Integration
- **Blog Generation**: Uses Worker-Blog-Writer for content
- **SEO Analysis**: Site is analyzed by ARQLO workers
- **Performance Monitoring**: Tracked by Worker-Vital-Monitor
- **Ranking Tracking**: Monitored by Worker-SERP
- **Technical SEO**: Audited by Worker-Technical-SEO

## Dependencies
- **Other Repos**:
  - Consumes: Worker-Blog-Writer (blog content generation)
  - Analyzed by: All ARQLO workers (is the target website)
- **External**: React, Express, Postgres

## Environment Variables
- `DATABASE_URL` - Postgres connection string
- `PORT` - Web server port
- `OPENAI_API_KEY` - For blog generation (via Blog-Writer integration)
- `REPLIT_DEPLOYMENT` - Hosting environment variables

## Deployment
- **Platform**: Replit
- **Features**: Auto-scaling, continuous deployment
- **Environment**: Production-ready

## Maturity Level
**Level 2-3**: Production-ready website with ARQLO integration

## Known Gaps
- **L4**: No comprehensive README for local development
- Integration pattern with ARQLO workers unclear
- No REPO_CONTEXT.md (now resolved)
