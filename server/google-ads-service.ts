import { GoogleAdsApi, services } from 'google-ads-api';

interface GoogleAdsConfig {
  client_id: string;
  client_secret: string;
  developer_token: string;
}

interface GoogleAdsClient {
  customer_id: string;
  refresh_token: string;
}

const config: GoogleAdsConfig = {
  client_id: process.env.GOOGLE_ADS_CLIENT_ID || '',
  client_secret: process.env.GOOGLE_ADS_CLIENT_SECRET || '',
  developer_token: process.env.GOOGLE_ADS_DEVELOPER_TOKEN || '',
};

const clientConfig: GoogleAdsClient = {
  customer_id: process.env.GOOGLE_ADS_CUSTOMER_ID || '',
  refresh_token: process.env.GOOGLE_ADS_REFRESH_TOKEN || '',
};

export function getOAuthUrl(redirectUri: string): string {
  const params = new URLSearchParams({
    client_id: config.client_id,
    redirect_uri: redirectUri,
    response_type: 'code',
    access_type: 'offline',
    prompt: 'consent',
    scope: 'https://www.googleapis.com/auth/adwords',
  });

  return `https://accounts.google.com/o/oauth2/v2/auth?${params.toString()}`;
}

export async function exchangeCodeForToken(code: string, redirectUri: string): Promise<{
  access_token: string;
  refresh_token: string;
  expires_in: number;
}> {
  const response = await fetch('https://oauth2.googleapis.com/token', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/x-www-form-urlencoded',
    },
    body: new URLSearchParams({
      code,
      client_id: config.client_id,
      client_secret: config.client_secret,
      redirect_uri: redirectUri,
      grant_type: 'authorization_code',
    }),
  });

  if (!response.ok) {
    const error = await response.text();
    throw new Error(`Failed to exchange code for token: ${error}`);
  }

  return response.json();
}

export function isConfigured(): boolean {
  return !!(
    config.client_id &&
    config.client_secret &&
    config.developer_token &&
    clientConfig.customer_id &&
    clientConfig.refresh_token
  );
}

export function hasBasicConfig(): boolean {
  return !!(
    config.client_id &&
    config.client_secret &&
    config.developer_token &&
    clientConfig.customer_id
  );
}

export async function getConversionData(startDate: string, endDate: string) {
  if (!isConfigured()) {
    throw new Error('Google Ads API not fully configured');
  }

  const client = new GoogleAdsApi({
    client_id: config.client_id,
    client_secret: config.client_secret,
    developer_token: config.developer_token,
  });

  const customer = client.Customer({
    customer_id: clientConfig.customer_id,
    refresh_token: clientConfig.refresh_token,
  });

  try {
    // Query conversions with source/medium data
    const query = `
      SELECT
        segments.date,
        segments.conversion_action_name,
        metrics.conversions,
        metrics.conversions_value,
        metrics.all_conversions,
        metrics.all_conversions_value,
        campaign.name,
        campaign.id,
        metrics.cost_micros
      FROM conversion_action
      WHERE segments.date BETWEEN '${startDate}' AND '${endDate}'
      ORDER BY segments.date DESC
    `;

    const results = await customer.query(query);
    
    return results.map((row: any) => ({
      date: row.segments?.date,
      conversionAction: row.segments?.conversion_action_name,
      conversions: row.metrics?.conversions || 0,
      conversionsValue: row.metrics?.conversions_value || 0,
      allConversions: row.metrics?.all_conversions || 0,
      allConversionsValue: row.metrics?.all_conversions_value || 0,
      campaign: row.campaign?.name,
      campaignId: row.campaign?.id,
      costMicros: row.metrics?.cost_micros || 0,
      cost: (row.metrics?.cost_micros || 0) / 1000000, // Convert micros to dollars
    }));
  } catch (error: any) {
    console.error('Google Ads API Error:', error);
    throw new Error(`Failed to fetch Google Ads data: ${error.message}`);
  }
}

export async function getCampaignPerformance(startDate: string, endDate: string) {
  if (!isConfigured()) {
    throw new Error('Google Ads API not fully configured');
  }

  const client = new GoogleAdsApi({
    client_id: config.client_id,
    client_secret: config.client_secret,
    developer_token: config.developer_token,
  });

  const customer = client.Customer({
    customer_id: clientConfig.customer_id,
    refresh_token: clientConfig.refresh_token,
  });

  try {
    const query = `
      SELECT
        campaign.name,
        campaign.id,
        campaign.status,
        metrics.impressions,
        metrics.clicks,
        metrics.conversions,
        metrics.conversions_value,
        metrics.cost_micros,
        metrics.ctr,
        metrics.average_cpc
      FROM campaign
      WHERE segments.date BETWEEN '${startDate}' AND '${endDate}'
        AND campaign.status = 'ENABLED'
      ORDER BY metrics.conversions DESC
    `;

    const results = await customer.query(query);
    
    return results.map((row: any) => ({
      campaignName: row.campaign?.name,
      campaignId: row.campaign?.id,
      status: row.campaign?.status,
      impressions: row.metrics?.impressions || 0,
      clicks: row.metrics?.clicks || 0,
      conversions: row.metrics?.conversions || 0,
      conversionsValue: row.metrics?.conversions_value || 0,
      cost: (row.metrics?.cost_micros || 0) / 1000000,
      ctr: row.metrics?.ctr || 0,
      averageCpc: (row.metrics?.average_cpc || 0) / 1000000,
      conversionRate: row.metrics?.clicks > 0 
        ? (row.metrics?.conversions || 0) / row.metrics.clicks * 100 
        : 0,
      costPerConversion: row.metrics?.conversions > 0
        ? (row.metrics?.cost_micros || 0) / 1000000 / row.metrics.conversions
        : 0,
    }));
  } catch (error: any) {
    console.error('Google Ads API Error:', error);
    throw new Error(`Failed to fetch campaign data: ${error.message}`);
  }
}

export async function testConnection(): Promise<{ success: boolean; message: string; accountName?: string }> {
  if (!isConfigured()) {
    return {
      success: false,
      message: 'Missing configuration. Please complete OAuth setup to get refresh token.',
    };
  }

  try {
    const client = new GoogleAdsApi({
      client_id: config.client_id,
      client_secret: config.client_secret,
      developer_token: config.developer_token,
    });

    const customer = client.Customer({
      customer_id: clientConfig.customer_id,
      refresh_token: clientConfig.refresh_token,
    });

    // Simple query to test connection
    const query = `
      SELECT
        customer.descriptive_name,
        customer.id
      FROM customer
      LIMIT 1
    `;

    const results = await customer.query(query);
    const account = results[0];

    return {
      success: true,
      message: 'Successfully connected to Google Ads',
      accountName: account?.customer?.descriptive_name || 'Unknown',
    };
  } catch (error: any) {
    return {
      success: false,
      message: `Connection failed: ${error.message}`,
    };
  }
}
