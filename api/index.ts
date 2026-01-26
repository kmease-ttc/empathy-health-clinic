import type { VercelRequest, VercelResponse } from '@vercel/node';
import express, { type Request, Response, NextFunction } from "express";
import compression from "compression";
import rateLimit from "express-rate-limit";
import { storage, initBlogSlugCache, isBlogPostSlug } from "../server/storage";
import { sendLeadNotification } from "../server/email";
import { db } from "../server/db";
import { sql } from "drizzle-orm";
import {
  insertLeadSchema,
  insertPageViewSchema,
  insertAnalyticsEventSchema,
  insertWebVitalSchema,
  insertBlogPostSchema,
  insertNewsletterSubscriberSchema,
  blogPosts as blogPostsTable,
} from "../shared/schema";
import { initializeDatabase } from "../server/db";

const app = express();

app.use(compression());
app.use(express.json());
app.use(express.urlencoded({ extended: false }));

app.use((req, res, next) => {
  res.setHeader("X-Frame-Options", "DENY");
  res.setHeader("X-Content-Type-Options", "nosniff");
  res.setHeader("Referrer-Policy", "strict-origin-when-cross-origin");
  next();
});

const formLimiter = rateLimit({
  windowMs: 15 * 60 * 1000,
  max: 10,
  message: { error: "Too many form submissions. Please try again later." },
});

app.get('/api/health', (req, res) => {
  res.status(200).json({ status: 'ok', timestamp: Date.now() });
});

app.get("/api/team-members", async (req, res) => {
  try {
    const members = await storage.getAllTeamMembers();
    res.json(members);
  } catch (error) {
    res.status(500).json({ error: "Failed to fetch team members" });
  }
});

app.get("/api/team-members/:id", async (req, res) => {
  try {
    const member = await storage.getTeamMember(req.params.id);
    if (!member) {
      return res.status(404).json({ error: "Team member not found" });
    }
    res.json(member);
  } catch (error) {
    res.status(500).json({ error: "Failed to fetch team member" });
  }
});

app.get("/api/blog-posts", async (req, res) => {
  try {
    const posts = await storage.getAllBlogPosts();
    res.json(posts);
  } catch (error) {
    res.status(500).json({ error: "Failed to fetch blog posts" });
  }
});

app.get("/api/blog-posts/:slug", async (req, res) => {
  try {
    const post = await storage.getBlogPostBySlug(req.params.slug);
    if (!post) {
      return res.status(404).json({ error: "Blog post not found" });
    }
    res.json(post);
  } catch (error) {
    res.status(500).json({ error: "Failed to fetch blog post" });
  }
});

app.post("/api/leads", formLimiter, async (req, res) => {
  try {
    const validatedData = insertLeadSchema.parse(req.body);
    const lead = await storage.createLead(validatedData);
    
    try {
      await sendLeadNotification(lead);
    } catch (emailError) {
      console.error("Failed to send lead notification:", emailError);
    }
    
    res.status(201).json(lead);
  } catch (error: any) {
    res.status(400).json({ error: error.message || "Invalid lead data" });
  }
});

app.post("/api/analytics/page-view", async (req, res) => {
  try {
    const data = insertPageViewSchema.parse(req.body);
    await storage.createPageView(data);
    res.status(201).json({ success: true });
  } catch (error) {
    res.status(400).json({ error: "Invalid page view data" });
  }
});

app.post("/api/analytics/event", async (req, res) => {
  try {
    const data = insertAnalyticsEventSchema.parse(req.body);
    await storage.createAnalyticsEvent(data);
    res.status(201).json({ success: true });
  } catch (error) {
    res.status(400).json({ error: "Invalid event data" });
  }
});

app.post("/api/analytics/web-vital", async (req, res) => {
  try {
    const data = insertWebVitalSchema.parse(req.body);
    await storage.createWebVital(data);
    res.status(201).json({ success: true });
  } catch (error) {
    res.status(400).json({ error: "Invalid web vital data" });
  }
});

app.post("/api/newsletter", formLimiter, async (req, res) => {
  try {
    const data = insertNewsletterSubscriberSchema.parse(req.body);
    const subscriber = await storage.createNewsletterSubscriber(data);
    res.status(201).json(subscriber);
  } catch (error: any) {
    if (error.message?.includes("duplicate")) {
      return res.status(409).json({ error: "Email already subscribed" });
    }
    res.status(400).json({ error: "Invalid subscriber data" });
  }
});

app.get("/api/insurance-providers", async (req, res) => {
  try {
    const providers = await storage.getAllInsuranceProviders();
    res.json(providers);
  } catch (error) {
    res.status(500).json({ error: "Failed to fetch insurance providers" });
  }
});

app.get("/api/conditions", async (req, res) => {
  try {
    const conditions = await storage.getAllConditions();
    res.json(conditions);
  } catch (error) {
    res.status(500).json({ error: "Failed to fetch conditions" });
  }
});

app.get("/api/therapies", async (req, res) => {
  try {
    const therapies = await storage.getAllTherapies();
    res.json(therapies);
  } catch (error) {
    res.status(500).json({ error: "Failed to fetch therapies" });
  }
});

app.get("/api/treatments", async (req, res) => {
  try {
    const treatments = await storage.getAllTreatments();
    res.json(treatments);
  } catch (error) {
    res.status(500).json({ error: "Failed to fetch treatments" });
  }
});

app.get("/api/testimonials", async (req, res) => {
  try {
    const testimonials = await storage.getAllTestimonials();
    res.json(testimonials);
  } catch (error) {
    res.status(500).json({ error: "Failed to fetch testimonials" });
  }
});

app.get("/api/site-content", async (req, res) => {
  try {
    const content = await storage.getSiteContent();
    res.json(content);
  } catch (error) {
    res.status(500).json({ error: "Failed to fetch site content" });
  }
});

app.get("/api/locations", async (req, res) => {
  try {
    const locations = await storage.getAllLocations();
    res.json(locations);
  } catch (error) {
    res.status(500).json({ error: "Failed to fetch locations" });
  }
});

let initialized = false;

async function ensureInitialized() {
  if (!initialized) {
    try {
      await initializeDatabase();
      await initBlogSlugCache();
      initialized = true;
    } catch (err) {
      console.error('Initialization error:', err);
    }
  }
}

export default async function handler(req: VercelRequest, res: VercelResponse) {
  await ensureInitialized();
  return new Promise((resolve, reject) => {
    app(req as any, res as any, (result: any) => {
      if (result instanceof Error) {
        reject(result);
      } else {
        resolve(result);
      }
    });
  });
}
