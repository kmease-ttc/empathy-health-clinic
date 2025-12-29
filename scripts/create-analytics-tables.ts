#!/usr/bin/env tsx
/**
 * Create Analytics Tables Script
 * Creates the analytics tables if they don't exist.
 * Run during build to ensure tables are ready before deployment.
 */

import { neon } from '@neondatabase/serverless';

async function createAnalyticsTables(): Promise<void> {
  const databaseUrl = process.env.DATABASE_URL;
  if (!databaseUrl) {
    console.log('  ⚠️ DATABASE_URL not set - skipping table creation');
    return;
  }

  const sql = neon(databaseUrl);

  try {
    await sql`CREATE TABLE IF NOT EXISTS page_views (
      id VARCHAR PRIMARY KEY DEFAULT gen_random_uuid()::text,
      path TEXT NOT NULL,
      timestamp TEXT NOT NULL DEFAULT CURRENT_TIMESTAMP::text,
      user_agent TEXT,
      referrer TEXT,
      utm_source TEXT,
      utm_medium TEXT,
      utm_campaign TEXT,
      utm_term TEXT,
      utm_content TEXT
    )`;

    await sql`CREATE TABLE IF NOT EXISTS web_vitals (
      id VARCHAR PRIMARY KEY DEFAULT gen_random_uuid()::text,
      metric_name TEXT NOT NULL,
      value TEXT NOT NULL,
      rating TEXT NOT NULL,
      metric_id TEXT NOT NULL,
      navigation_type TEXT,
      page_design_type TEXT,
      timestamp TEXT NOT NULL DEFAULT CURRENT_TIMESTAMP::text
    )`;

    await sql`CREATE TABLE IF NOT EXISTS analytics_events (
      id VARCHAR PRIMARY KEY DEFAULT gen_random_uuid()::text,
      event_type TEXT NOT NULL,
      event_category TEXT NOT NULL,
      event_label TEXT,
      value TEXT,
      path TEXT NOT NULL,
      timestamp TEXT NOT NULL DEFAULT CURRENT_TIMESTAMP::text
    )`;

    await sql`CREATE TABLE IF NOT EXISTS conversion_events (
      id VARCHAR PRIMARY KEY DEFAULT gen_random_uuid()::text,
      conversion_type TEXT NOT NULL,
      conversion_value DECIMAL,
      source TEXT,
      url TEXT,
      session_id TEXT,
      timestamp TEXT NOT NULL DEFAULT CURRENT_TIMESTAMP::text
    )`;

    console.log('  ✅ Analytics tables created/verified');
  } catch (error: any) {
    console.error('  ⚠️ Table creation warning:', error.message);
  }
}

createAnalyticsTables().catch(console.error);
