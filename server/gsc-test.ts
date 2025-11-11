import { google } from 'googleapis';

export async function testGSCConnection() {
  try {
    // Parse the service account JSON from environment variable
    const serviceAccountJson = process.env.GOOGLE_SEARCH_CONSOLE_SERVICE_ACCOUNT_JSON;
    
    if (!serviceAccountJson) {
      throw new Error('GOOGLE_SEARCH_CONSOLE_SERVICE_ACCOUNT_JSON not found');
    }
    
    const credentials = JSON.parse(serviceAccountJson);
    
    // Create auth client
    const auth = new google.auth.GoogleAuth({
      credentials,
      scopes: ['https://www.googleapis.com/auth/webmasters.readonly'],
    });
    
    const authClient = await auth.getClient();
    
    // Create Search Console client
    const searchconsole = google.searchconsole({
      version: 'v1',
      auth: authClient as any,
    });
    
    // Test query: Get top 5 search queries from Nov 1-10, 2025
    const siteUrl = 'sc-domain:empathyhealthclinic.com';
    const response = await searchconsole.searchanalytics.query({
      siteUrl,
      requestBody: {
        startDate: '2025-11-01',
        endDate: '2025-11-10',
        dimensions: ['query'],
        rowLimit: 5,
      },
    });
    
    return {
      success: true,
      data: response.data,
      message: 'Successfully connected to Google Search Console!',
    };
  } catch (error: any) {
    console.error('GSC Connection Error:', error);
    return {
      success: false,
      error: error.message,
      details: error.response?.data || error.stack,
    };
  }
}
