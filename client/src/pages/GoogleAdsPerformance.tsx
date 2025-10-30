import { useQuery } from "@tanstack/react-query";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Skeleton } from "@/components/ui/skeleton";
import { Badge } from "@/components/ui/badge";
import { BarChart3, Target, MousePointerClick, FileText, AlertTriangle } from "lucide-react";

interface UTMData {
  utmSource?: string | null;
  utmCampaign?: string | null;
  utmTerm?: string | null;
  landingPage?: string | null;
  count: number;
}

interface Lead {
  id: string;
  firstName: string;
  lastName: string;
  email: string;
  phone: string;
  service: string;
  landingPage: string | null;
  utmSource: string | null;
  utmMedium: string | null;
  utmCampaign: string | null;
  utmTerm: string | null;
  utmContent: string | null;
  createdAt: string;
}

export default function GoogleAdsPerformance() {
  const { data: leadsBySource, isLoading: loadingSource } = useQuery<UTMData[]>({
    queryKey: ["/api/analytics/utm/leads-by-source"],
  });

  const { data: leadsByCampaign, isLoading: loadingCampaign } = useQuery<UTMData[]>({
    queryKey: ["/api/analytics/utm/leads-by-campaign"],
  });

  const { data: leadsByTerm, isLoading: loadingTerm } = useQuery<UTMData[]>({
    queryKey: ["/api/analytics/utm/leads-by-term"],
  });

  const { data: leadsByLandingPage, isLoading: loadingLandingPage } = useQuery<UTMData[]>({
    queryKey: ["/api/analytics/utm/leads-by-landing-page"],
  });

  const { data: pageViewsBySource } = useQuery<UTMData[]>({
    queryKey: ["/api/analytics/utm/page-views-by-source"],
  });

  const { data: pageViewsByCampaign } = useQuery<UTMData[]>({
    queryKey: ["/api/analytics/utm/page-views-by-campaign"],
  });

  const { data: allLeads, isLoading: loadingAllLeads } = useQuery<Lead[]>({
    queryKey: ["/api/leads"],
  });

  // Analyze landing page match quality
  const analyzeLandingPageMatches = () => {
    if (!allLeads) return [];
    
    const mismatches: Array<{
      keyword: string;
      landingPage: string;
      count: number;
      matchQuality: 'poor' | 'moderate' | 'good';
      reason: string;
    }> = [];

    // Group leads by keyword + landing page combination
    const combinations = allLeads.reduce((acc, lead) => {
      if (!lead.utmTerm || !lead.landingPage) return acc;
      
      const key = `${lead.utmTerm}|${lead.landingPage}`;
      acc[key] = (acc[key] || 0) + 1;
      return acc;
    }, {} as Record<string, number>);

    // Analyze each combination for match quality
    Object.entries(combinations).forEach(([key, count]) => {
      const [keyword, landingPage] = key.split('|');
      const keywordLower = keyword.toLowerCase();
      const pageLower = landingPage.toLowerCase();
      
      let matchQuality: 'poor' | 'moderate' | 'good' = 'good';
      let reason = 'Keyword aligns with landing page content';

      // Check for keyword-page alignment
      const keywordWords = keywordLower.split(/\s+/);
      const pageWords = pageLower.split(/[\/\-_]/);
      
      const overlap = keywordWords.filter(kw => 
        pageWords.some(pw => pw.includes(kw) || kw.includes(pw))
      );

      if (overlap.length === 0) {
        matchQuality = 'poor';
        reason = `Keyword "${keyword}" doesn't match landing page URL. Consider creating a dedicated landing page or updating ad targeting.`;
      } else if (overlap.length < keywordWords.length / 2) {
        matchQuality = 'moderate';
        reason = `Partial match between keyword and landing page. Could improve relevance.`;
      }

      // Only add if not perfect match
      if (matchQuality !== 'good') {
        mismatches.push({
          keyword,
          landingPage,
          count,
          matchQuality,
          reason
        });
      }
    });

    // Sort by count (most conversions first)
    return mismatches.sort((a, b) => b.count - a.count);
  };

  const landingPageMismatches = analyzeLandingPageMatches();

  // Calculate conversion rates
  const calculateConversionRate = (leads: number, views: number) => {
    if (views === 0) return "0.00";
    return ((leads / views) * 100).toFixed(2);
  };

  // Get conversion rate by source
  const getSourceConversionData = () => {
    if (!leadsBySource || !pageViewsBySource) return [];
    
    return leadsBySource.map(lead => {
      const sourceViews = pageViewsBySource.find(
        pv => pv.utmSource === lead.utmSource
      );
      return {
        source: lead.utmSource || "Direct",
        conversions: lead.count,
        views: sourceViews?.count || 0,
        conversionRate: calculateConversionRate(lead.count, sourceViews?.count || 0)
      };
    });
  };

  // Get conversion rate by campaign
  const getCampaignConversionData = () => {
    if (!leadsByCampaign || !pageViewsByCampaign) return [];
    
    return leadsByCampaign.map(lead => {
      const campaignViews = pageViewsByCampaign.find(
        pv => pv.utmCampaign === lead.utmCampaign
      );
      return {
        campaign: lead.utmCampaign || "None",
        conversions: lead.count,
        views: campaignViews?.count || 0,
        conversionRate: calculateConversionRate(lead.count, campaignViews?.count || 0)
      };
    });
  };

  const sourceConversionData = getSourceConversionData();
  const campaignConversionData = getCampaignConversionData();

  return (
    <div className="min-h-screen bg-background">
      <div className="container mx-auto px-4 py-8">
        <div className="mb-8">
          <h1 className="text-3xl font-bold mb-2" data-testid="title-google-ads">
            Google Ads Performance
          </h1>
          <p className="text-muted-foreground">
            Track conversions, optimize campaigns, and identify which keywords drive patient acquisition
          </p>
        </div>

        {/* Summary Cards */}
        <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-4 mb-8">
          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Total Conversions</CardTitle>
              <Target className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              {loadingSource ? (
                <Skeleton className="h-8 w-20" />
              ) : (
                <div className="text-2xl font-bold" data-testid="text-total-conversions">
                  {leadsBySource?.reduce((sum, item) => sum + item.count, 0) || 0}
                </div>
              )}
              <p className="text-xs text-muted-foreground mt-1">
                From all traffic sources
              </p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Google Ads Conversions</CardTitle>
              <MousePointerClick className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              {loadingSource ? (
                <Skeleton className="h-8 w-20" />
              ) : (
                <div className="text-2xl font-bold" data-testid="text-google-ads-conversions">
                  {leadsBySource?.find(s => s.utmSource?.toLowerCase().includes("google") || s.utmSource?.toLowerCase().includes("cpc"))?.count || 0}
                </div>
              )}
              <p className="text-xs text-muted-foreground mt-1">
                From Google Ads campaigns
              </p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Active Campaigns</CardTitle>
              <BarChart3 className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              {loadingCampaign ? (
                <Skeleton className="h-8 w-20" />
              ) : (
                <div className="text-2xl font-bold" data-testid="text-active-campaigns">
                  {leadsByCampaign?.filter(c => c.utmCampaign).length || 0}
                </div>
              )}
              <p className="text-xs text-muted-foreground mt-1">
                Campaigns with conversions
              </p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Top Keyword</CardTitle>
              <FileText className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              {loadingTerm ? (
                <Skeleton className="h-8 w-full" />
              ) : (
                <>
                  <div className="text-lg font-bold truncate" data-testid="text-top-keyword">
                    {leadsByTerm?.[0]?.utmTerm || "No data"}
                  </div>
                  <p className="text-xs text-muted-foreground mt-1">
                    {leadsByTerm?.[0]?.count || 0} conversions
                  </p>
                </>
              )}
            </CardContent>
          </Card>
        </div>

        <div className="grid gap-6 lg:grid-cols-2 mb-8">
          {/* Conversions by Source */}
          <Card>
            <CardHeader>
              <CardTitle>Conversions by Traffic Source</CardTitle>
              <CardDescription>
                Which channels drive the most leads
              </CardDescription>
            </CardHeader>
            <CardContent>
              {loadingSource ? (
                <div className="space-y-4">
                  {[1, 2, 3].map((i) => (
                    <Skeleton key={i} className="h-16 w-full" />
                  ))}
                </div>
              ) : sourceConversionData.length > 0 ? (
                <div className="space-y-4">
                  {sourceConversionData.map((item, index) => (
                    <div
                      key={index}
                      className="flex items-center justify-between p-4 bg-muted/30 rounded-lg hover-elevate"
                      data-testid={`card-source-${index}`}
                    >
                      <div className="flex-1">
                        <div className="font-medium" data-testid={`text-source-name-${index}`}>
                          {item.source}
                        </div>
                        <div className="text-sm text-muted-foreground">
                          {item.views} views
                        </div>
                      </div>
                      <div className="text-right">
                        <div className="text-2xl font-bold" data-testid={`text-source-conversions-${index}`}>
                          {item.conversions}
                        </div>
                        <div className="text-xs text-muted-foreground">
                          {item.conversionRate}% rate
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              ) : (
                <p className="text-muted-foreground text-center py-8">
                  No conversion data available yet
                </p>
              )}
            </CardContent>
          </Card>

          {/* Conversions by Campaign */}
          <Card>
            <CardHeader>
              <CardTitle>Conversions by Campaign</CardTitle>
              <CardDescription>
                Performance of individual campaigns
              </CardDescription>
            </CardHeader>
            <CardContent>
              {loadingCampaign ? (
                <div className="space-y-4">
                  {[1, 2, 3].map((i) => (
                    <Skeleton key={i} className="h-16 w-full" />
                  ))}
                </div>
              ) : campaignConversionData.length > 0 ? (
                <div className="space-y-4">
                  {campaignConversionData.map((item, index) => (
                    <div
                      key={index}
                      className="flex items-center justify-between p-4 bg-muted/30 rounded-lg hover-elevate"
                      data-testid={`card-campaign-${index}`}
                    >
                      <div className="flex-1">
                        <div className="font-medium" data-testid={`text-campaign-name-${index}`}>
                          {item.campaign}
                        </div>
                        <div className="text-sm text-muted-foreground">
                          {item.views} views
                        </div>
                      </div>
                      <div className="text-right">
                        <div className="text-2xl font-bold" data-testid={`text-campaign-conversions-${index}`}>
                          {item.conversions}
                        </div>
                        <div className="text-xs text-muted-foreground">
                          {item.conversionRate}% rate
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              ) : (
                <p className="text-muted-foreground text-center py-8">
                  No campaign data available yet
                </p>
              )}
            </CardContent>
          </Card>
        </div>

        {/* Keywords Performance */}
        <Card className="mb-8">
          <CardHeader>
            <CardTitle>Keyword Performance</CardTitle>
            <CardDescription>
              Which search terms convert best
            </CardDescription>
          </CardHeader>
          <CardContent>
            {loadingTerm ? (
              <div className="space-y-4">
                {[1, 2, 3, 4, 5].map((i) => (
                  <Skeleton key={i} className="h-12 w-full" />
                ))}
              </div>
            ) : leadsByTerm && leadsByTerm.length > 0 ? (
              <div className="space-y-3">
                {leadsByTerm.slice(0, 10).map((item, index) => (
                  <div
                    key={index}
                    className="flex items-center justify-between p-3 bg-muted/30 rounded-lg hover-elevate"
                    data-testid={`card-keyword-${index}`}
                  >
                    <div className="flex-1">
                      <span className="font-medium" data-testid={`text-keyword-term-${index}`}>
                        {item.utmTerm || "Unknown"}
                      </span>
                    </div>
                    <div className="text-right">
                      <span className="text-xl font-bold" data-testid={`text-keyword-conversions-${index}`}>
                        {item.count}
                      </span>
                      <span className="text-sm text-muted-foreground ml-2">conversions</span>
                    </div>
                  </div>
                ))}
              </div>
            ) : (
              <p className="text-muted-foreground text-center py-8">
                No keyword data available yet
              </p>
            )}
          </CardContent>
        </Card>

        {/* Landing Pages Performance */}
        <Card className="mb-8">
          <CardHeader>
            <CardTitle>Landing Page Performance</CardTitle>
            <CardDescription>
              Conversions by destination page
            </CardDescription>
          </CardHeader>
          <CardContent>
            {loadingLandingPage ? (
              <div className="space-y-4">
                {[1, 2, 3, 4].map((i) => (
                  <Skeleton key={i} className="h-12 w-full" />
                ))}
              </div>
            ) : leadsByLandingPage && leadsByLandingPage.length > 0 ? (
              <div className="space-y-3">
                {leadsByLandingPage.slice(0, 10).map((item, index) => (
                  <div
                    key={index}
                    className="flex items-center justify-between p-3 bg-muted/30 rounded-lg hover-elevate"
                    data-testid={`card-landing-page-${index}`}
                  >
                    <div className="flex-1">
                      <span className="font-medium text-sm" data-testid={`text-landing-page-url-${index}`}>
                        {item.landingPage || "Direct"}
                      </span>
                    </div>
                    <div className="text-right">
                      <span className="text-xl font-bold" data-testid={`text-landing-page-conversions-${index}`}>
                        {item.count}
                      </span>
                      <span className="text-sm text-muted-foreground ml-2">conversions</span>
                    </div>
                  </div>
                ))}
              </div>
            ) : (
              <p className="text-muted-foreground text-center py-8">
                No landing page data available yet
              </p>
            )}
          </CardContent>
        </Card>

        {/* Landing Page Match Quality */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <AlertTriangle className="h-5 w-5 text-warning" />
              Landing Page Match Quality
            </CardTitle>
            <CardDescription>
              Identify misaligned keyword-to-page combinations to improve Quality Score and conversion rates
            </CardDescription>
          </CardHeader>
          <CardContent>
            {loadingAllLeads ? (
              <div className="space-y-4">
                {[1, 2, 3].map((i) => (
                  <Skeleton key={i} className="h-24 w-full" />
                ))}
              </div>
            ) : landingPageMismatches.length > 0 ? (
              <div className="space-y-4">
                {landingPageMismatches.slice(0, 10).map((mismatch, index) => (
                  <div
                    key={index}
                    className="p-4 bg-muted/30 rounded-lg border-l-4"
                    style={{
                      borderLeftColor: mismatch.matchQuality === 'poor' ? 'hsl(var(--destructive))' : 'hsl(var(--warning))'
                    }}
                    data-testid={`card-mismatch-${index}`}
                  >
                    <div className="flex items-start justify-between mb-2">
                      <div className="flex-1">
                        <div className="flex items-center gap-2 mb-1">
                          <Badge 
                            variant={mismatch.matchQuality === 'poor' ? 'destructive' : 'secondary'}
                            data-testid={`badge-match-quality-${index}`}
                          >
                            {mismatch.matchQuality === 'poor' ? 'Poor Match' : 'Moderate Match'}
                          </Badge>
                          <span className="text-sm font-medium" data-testid={`text-mismatch-count-${index}`}>
                            {mismatch.count} conversions
                          </span>
                        </div>
                        <p className="text-sm font-medium mb-1" data-testid={`text-mismatch-keyword-${index}`}>
                          Keyword: <span className="text-primary">{mismatch.keyword}</span>
                        </p>
                        <p className="text-sm text-muted-foreground truncate" data-testid={`text-mismatch-landing-page-${index}`}>
                          Landing Page: {mismatch.landingPage}
                        </p>
                      </div>
                    </div>
                    <p className="text-sm text-muted-foreground" data-testid={`text-mismatch-reason-${index}`}>
                      {mismatch.reason}
                    </p>
                  </div>
                ))}
              </div>
            ) : (
              <div className="text-center py-8">
                <p className="text-muted-foreground mb-2">
                  {allLeads && allLeads.length > 0 
                    ? "✅ All keywords are well-aligned with landing pages!"
                    : "No conversion data available yet to analyze"}
                </p>
                <p className="text-sm text-muted-foreground">
                  {allLeads && allLeads.length > 0 
                    ? "Your Google Ads campaigns are well-optimized for keyword-to-page relevance."
                    : "Start driving traffic with UTM-tagged Google Ads to see match quality insights"}
                </p>
              </div>
            )}
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
