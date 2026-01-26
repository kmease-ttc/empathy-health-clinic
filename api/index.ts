import type { VercelRequest, VercelResponse } from '@vercel/node';
import { drizzle } from "drizzle-orm/neon-http";
import { neon } from "@neondatabase/serverless";
import { eq } from "drizzle-orm";

const sql = neon(process.env.DATABASE_URL!);
const db = drizzle(sql);

export default async function handler(req: VercelRequest, res: VercelResponse) {
  const { url, method } = req;
  const path = url?.split('?')[0] || '';

  res.setHeader("Access-Control-Allow-Origin", "*");
  res.setHeader("Access-Control-Allow-Methods", "GET, POST, OPTIONS");
  res.setHeader("Access-Control-Allow-Headers", "Content-Type");

  if (method === 'OPTIONS') {
    return res.status(200).end();
  }

  try {
    if (path === '/api/health') {
      return res.status(200).json({ status: 'ok', timestamp: Date.now() });
    }

    if (path === '/api/treatments') {
      const result = await sql`SELECT * FROM treatments ORDER BY name`;
      return res.status(200).json(result);
    }

    if (path === '/api/therapies') {
      const result = await sql`SELECT * FROM therapies ORDER BY name`;
      return res.status(200).json(result);
    }

    if (path === '/api/team-members') {
      const result = await sql`SELECT * FROM team_members ORDER BY name`;
      return res.status(200).json(result);
    }

    if (path.startsWith('/api/team-members/')) {
      const id = path.replace('/api/team-members/', '');
      const result = await sql`SELECT * FROM team_members WHERE id = ${id} OR slug = ${id} LIMIT 1`;
      if (result.length === 0) {
        return res.status(404).json({ error: "Team member not found" });
      }
      return res.status(200).json(result[0]);
    }

    if (path === '/api/blog-posts') {
      const result = await sql`SELECT * FROM blog_posts WHERE status = 'published' ORDER BY published_at DESC`;
      return res.status(200).json(result);
    }

    if (path.startsWith('/api/blog-posts/')) {
      const slug = path.replace('/api/blog-posts/', '');
      const result = await sql`SELECT * FROM blog_posts WHERE slug = ${slug} LIMIT 1`;
      if (result.length === 0) {
        return res.status(404).json({ error: "Blog post not found" });
      }
      return res.status(200).json(result[0]);
    }

    if (path === '/api/conditions') {
      const result = await sql`SELECT * FROM conditions ORDER BY name`;
      return res.status(200).json(result);
    }

    if (path === '/api/insurance-providers') {
      const result = await sql`SELECT * FROM insurance_providers ORDER BY name`;
      return res.status(200).json(result);
    }

    if (path === '/api/locations') {
      const result = await sql`SELECT * FROM locations ORDER BY name`;
      return res.status(200).json(result);
    }

    if (path === '/api/testimonials') {
      const result = await sql`SELECT * FROM testimonials`;
      return res.status(200).json(result);
    }

    if (path === '/api/site-content') {
      const result = await sql`SELECT * FROM site_content LIMIT 1`;
      return res.status(200).json(result[0] || {});
    }

    if (path === '/api/leads' && method === 'POST') {
      const body = req.body;
      const result = await sql`
        INSERT INTO leads (name, email, phone, message, source, page_url, utm_source, utm_medium, utm_campaign, utm_term, utm_content)
        VALUES (${body.name}, ${body.email}, ${body.phone || null}, ${body.message || null}, ${body.source || null}, ${body.pageUrl || null}, ${body.utmSource || null}, ${body.utmMedium || null}, ${body.utmCampaign || null}, ${body.utmTerm || null}, ${body.utmContent || null})
        RETURNING *
      `;
      return res.status(201).json(result[0]);
    }

    if (path === '/api/analytics/page-view' && method === 'POST') {
      return res.status(201).json({ success: true });
    }

    if (path === '/api/analytics/event' && method === 'POST') {
      return res.status(201).json({ success: true });
    }

    if (path === '/api/analytics/web-vital' && method === 'POST') {
      return res.status(201).json({ success: true });
    }

    if (path === '/api/analytics/vitals' && method === 'POST') {
      return res.status(201).json({ success: true });
    }

    if (path === '/api/user') {
      return res.status(401).json({ error: "Not authenticated" });
    }

    return res.status(404).json({ error: "Not found" });
  } catch (error: any) {
    console.error('API Error:', error);
    return res.status(500).json({ error: error.message || "Internal server error" });
  }
}
