import axios from 'axios';

interface OrganicResult {
  position: number;
  link: string;
  title: string;
  snippet?: string;
}

interface RankingResult {
  position: number | null;
  url: string | null;
  top10: OrganicResult[];
  competitor_positions?: { [domain: string]: number | null };
}

const DOMAIN = 'empathyhealthclinic.com';
const CITY = 'Orlando, Florida, United States';
const COMPETITORS = [
  'healingpsychiatryflorida.com',
  'mymindcarecenter.com',
  'orlandohealth.com',
];

export async function getGoogleRanking(query: string): Promise<RankingResult> {
  try {
    const apiKey = process.env.SERP_API_KEY;
    
    if (!apiKey) {
      throw new Error('SERP_API_KEY not found in environment');
    }
    
    const response = await axios.post(
      'https://google.serper.dev/search',
      {
        q: query,
        gl: 'us',
        hl: 'en',
        location: CITY,
        num: 20,
      },
      {
        headers: {
          'X-API-KEY': apiKey,
          'Content-Type': 'application/json',
        },
      }
    );
    
    if (response.status !== 200) {
      throw new Error(`Serper API returned status ${response.status}`);
    }
    
    const data = response.data;
    const organic: OrganicResult[] = [];
    
    for (let i = 0; i < (data.organic || []).length; i++) {
      const result = data.organic[i];
      organic.push({
        position: i + 1,
        link: result.link || '',
        title: result.title || '',
        snippet: result.snippet || '',
      });
    }
    
    let position: number | null = null;
    let url: string | null = null;
    
    for (const result of organic) {
      if (result.link.includes(DOMAIN)) {
        position = result.position;
        url = result.link;
        break;
      }
    }
    
    const competitor_positions: { [domain: string]: number | null } = {};
    for (const competitor of COMPETITORS) {
      const competitorResult = organic.find((r) => r.link.includes(competitor));
      competitor_positions[competitor] = competitorResult ? competitorResult.position : null;
    }
    
    return {
      position,
      url,
      top10: organic.slice(0, 10),
      competitor_positions,
    };
  } catch (error: any) {
    console.error('SERP API Error:', error.response?.data || error.message);
    throw new Error(`Failed to fetch ranking: ${error.message}`);
  }
}

export async function checkOrlandoKeywordRankings() {
  const targetKeywords = [
    'psychiatry orlando fl',
    'psychiatrist orlando',
    'adhd evaluation near me',
    'anxiety psychiatrist orlando',
    'child psychiatrist orlando',
    'telepsychiatry orlando',
  ];
  
  const results = [];
  
  for (const keyword of targetKeywords) {
    try {
      const ranking = await getGoogleRanking(keyword);
      results.push({
        keyword,
        position: ranking.position,
        url: ranking.url,
        competitors: ranking.competitor_positions,
        top3: ranking.top10.slice(0, 3).map((r) => ({
          position: r.position,
          domain: new URL(r.link).hostname,
          title: r.title,
        })),
      });
      
      // Rate limiting: wait 1 second between requests
      await new Promise((resolve) => setTimeout(resolve, 1000));
    } catch (error: any) {
      console.error(`Failed to check ranking for "${keyword}":`, error.message);
      results.push({
        keyword,
        error: error.message,
      });
    }
  }
  
  return {
    success: true,
    timestamp: new Date().toISOString(),
    results,
  };
}
