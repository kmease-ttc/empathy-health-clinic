import { useQuery, useMutation } from "@tanstack/react-query";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { Home, RefreshCw, AlertTriangle, TrendingDown, ExternalLink, Clock } from "lucide-react";
import { useLocation } from "wouter";
import { apiRequest, queryClient } from "@/lib/queryClient";

interface BounceRateData {
  path: string;
  views: number;
  bounces: number;
  bounceRate: number;
}

interface LinkMonitorData {
  bounceRates: BounceRateData[];
  clarityCache: {
    cached: boolean;
    age?: number;
  };
  note: string;
}

export default function AdminLinkMonitor() {
  const [, setLocation] = useLocation();

  const { data, isLoading } = useQuery<LinkMonitorData>({
    queryKey: ["/api/analytics/link-monitor"],
  });

  const refreshClarityMutation = useMutation({
    mutationFn: async () => {
      return apiRequest("POST", "/api/analytics/clarity/refresh", {});
    },
    onSuccess: (response: any) => {
      queryClient.invalidateQueries({ queryKey: ["/api/analytics/link-monitor"] });
      if (!response.success && response.warning) {
        console.warn('[Clarity API]', response.warning);
      }
    },
  });

  const highBouncePages = data?.bounceRates?.filter(p => p.bounceRate > 70) || [];
  const mediumBouncePages = data?.bounceRates?.filter(p => p.bounceRate > 40 && p.bounceRate <= 70) || [];

  return (
    <div className="min-h-screen bg-background">
      <header className="border-b border-border sticky top-0 bg-background/95 backdrop-blur-md z-50">
        <div className="max-w-7xl mx-auto px-6 py-4 flex items-center justify-between">
          <div>
            <h1 className="text-2xl font-sans font-medium">Link & Performance Monitor</h1>
            <p className="text-sm text-muted-foreground mt-1">
              Track bounce rates and identify problematic pages
            </p>
          </div>
          <Button
            variant="outline"
            onClick={() => setLocation("/admin")}
            data-testid="button-back-to-admin"
          >
            <Home className="w-4 h-4 mr-2" />
            Back to Admin
          </Button>
        </div>
      </header>

      <div className="max-w-7xl mx-auto px-6 py-8 space-y-6">
        {/* Microsoft Clarity Status */}
        <Card>
          <CardHeader>
            <div className="flex items-center justify-between">
              <div>
                <CardTitle>Microsoft Clarity Integration</CardTitle>
                <CardDescription>
                  API Rate Limit: 10 calls per day - Data cached for 24 hours
                </CardDescription>
              </div>
              <Button
                variant="outline"
                size="sm"
                onClick={() => refreshClarityMutation.mutate()}
                disabled={refreshClarityMutation.isPending}
                data-testid="button-refresh-clarity"
              >
                <RefreshCw className={`w-4 h-4 mr-2 ${refreshClarityMutation.isPending ? 'animate-spin' : ''}`} />
                {refreshClarityMutation.isPending ? "Refreshing..." : "Refresh Data"}
              </Button>
            </div>
          </CardHeader>
          <CardContent>
            {data?.clarityCache.cached ? (
              <Alert>
                <Clock className="h-4 w-4" />
                <AlertDescription>
                  {data.note}
                </AlertDescription>
              </Alert>
            ) : (
              <Alert>
                <AlertTriangle className="h-4 w-4" />
                <AlertDescription>
                  <div className="space-y-2">
                    <p>Clarity API integration is optional. Local bounce rate tracking is active and working.</p>
                    <p className="text-sm text-muted-foreground">
                      To enable Clarity API features, ensure valid CLARITY_API_TOKEN is configured and API endpoints are accessible.
                    </p>
                  </div>
                </AlertDescription>
              </Alert>
            )}
          </CardContent>
        </Card>

        {/* High Bounce Rate Pages */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <AlertTriangle className="h-5 w-5 text-destructive" />
              High Bounce Rate Pages (70%+)
            </CardTitle>
            <CardDescription>
              Pages where most visitors leave without viewing other pages. These may have issues or irrelevant content.
            </CardDescription>
          </CardHeader>
          <CardContent>
            {isLoading ? (
              <p className="text-sm text-muted-foreground">Loading data...</p>
            ) : highBouncePages.length === 0 ? (
              <Alert>
                <AlertDescription>
                  No pages with high bounce rates detected. Your content is performing well.
                </AlertDescription>
              </Alert>
            ) : (
              <div className="space-y-3">
                {highBouncePages.slice(0, 10).map((page) => (
                  <div
                    key={page.path}
                    className="flex items-center justify-between p-4 border rounded-lg hover-elevate"
                  >
                    <div className="flex-1 min-w-0">
                      <div className="flex items-center gap-2 mb-1">
                        <code className="text-sm font-mono text-foreground break-all">
                          {page.path}
                        </code>
                        <a
                          href={page.path}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="flex-shrink-0"
                        >
                          <ExternalLink className="h-4 w-4 text-muted-foreground hover:text-primary" />
                        </a>
                      </div>
                      <p className="text-sm text-muted-foreground">
                        {page.views} views • {page.bounces} bounces
                      </p>
                    </div>
                    <Badge variant="destructive" className="text-base font-semibold ml-4">
                      {page.bounceRate}%
                    </Badge>
                  </div>
                ))}
              </div>
            )}
          </CardContent>
        </Card>

        {/* Medium Bounce Rate Pages */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <TrendingDown className="h-5 w-5 text-yellow-600 dark:text-yellow-500" />
              Medium Bounce Rate Pages (40-70%)
            </CardTitle>
            <CardDescription>
              Pages with moderate bounce rates. Monitor these for potential improvements.
            </CardDescription>
          </CardHeader>
          <CardContent>
            {isLoading ? (
              <p className="text-sm text-muted-foreground">Loading data...</p>
            ) : mediumBouncePages.length === 0 ? (
              <Alert>
                <AlertDescription>
                  No pages in this range.
                </AlertDescription>
              </Alert>
            ) : (
              <div className="space-y-3">
                {mediumBouncePages.slice(0, 10).map((page) => (
                  <div
                    key={page.path}
                    className="flex items-center justify-between p-4 border rounded-lg hover-elevate"
                  >
                    <div className="flex-1 min-w-0">
                      <div className="flex items-center gap-2 mb-1">
                        <code className="text-sm font-mono text-foreground break-all">
                          {page.path}
                        </code>
                        <a
                          href={page.path}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="flex-shrink-0"
                        >
                          <ExternalLink className="h-4 w-4 text-muted-foreground hover:text-primary" />
                        </a>
                      </div>
                      <p className="text-sm text-muted-foreground">
                        {page.views} views • {page.bounces} bounces
                      </p>
                    </div>
                    <Badge variant="secondary" className="text-base font-semibold ml-4">
                      {page.bounceRate}%
                    </Badge>
                  </div>
                ))}
              </div>
            )}
          </CardContent>
        </Card>

        {/* Recommendations */}
        <Card>
          <CardHeader>
            <CardTitle>Recommendations</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="space-y-2">
              <h3 className="font-semibold text-foreground">For High Bounce Rate Pages:</h3>
              <ul className="list-disc list-inside space-y-1 text-sm text-muted-foreground">
                <li>Check for broken images or links</li>
                <li>Verify content matches user search intent</li>
                <li>Add clear calls-to-action (CTAs)</li>
                <li>Improve page load speed</li>
                <li>Add internal links to related content</li>
                <li>Review mobile responsiveness</li>
              </ul>
            </div>

            <div className="space-y-2">
              <h3 className="font-semibold text-foreground">External Tools:</h3>
              <div className="grid gap-2">
                <a
                  href="https://www.deadlinkchecker.com"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-sm text-primary hover:underline flex items-center gap-1"
                >
                  Dead Link Checker - Free automated monitoring
                  <ExternalLink className="h-3 w-3" />
                </a>
                <a
                  href="https://search.google.com/search-console"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-sm text-primary hover:underline flex items-center gap-1"
                >
                  Google Search Console - Check 404 errors
                  <ExternalLink className="h-3 w-3" />
                </a>
                <a
                  href="https://www.clarity.ms"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-sm text-primary hover:underline flex items-center gap-1"
                >
                  Microsoft Clarity Dashboard - View heatmaps & session recordings
                  <ExternalLink className="h-3 w-3" />
                </a>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
