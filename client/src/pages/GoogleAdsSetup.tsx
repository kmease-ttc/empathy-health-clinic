import { useState, useEffect } from "react";
import { useLocation } from "wouter";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Separator } from "@/components/ui/separator";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { 
  CheckCircle2, 
  XCircle, 
  Loader2, 
  ExternalLink,
  Key,
  Shield,
  Link as LinkIcon,
  TrendingUp
} from "lucide-react";
import { useToast } from "@/hooks/use-toast";
import SiteHeader from "@/components/SiteHeader";
import SiteFooter from "@/components/SiteFooter";

export default function GoogleAdsSetup() {
  const [, setLocation] = useLocation();
  const { toast } = useToast();
  const [loading, setLoading] = useState(false);
  const [testingConnection, setTestingConnection] = useState(false);
  const [status, setStatus] = useState<{
    hasBasicConfig: boolean;
    isFullyConfigured: boolean;
    connectionTest?: { success: boolean; message: string; accountName?: string };
  }>({ hasBasicConfig: false, isFullyConfigured: false });

  useEffect(() => {
    checkStatus();
    
    // Check for OAuth callback code and state
    const params = new URLSearchParams(window.location.search);
    const code = params.get('code');
    const state = params.get('state');
    if (code && state) {
      handleOAuthCallback(code, state);
    } else if (code) {
      toast({
        title: "OAuth Failed",
        description: "Missing state parameter - security validation failed",
        variant: "destructive",
      });
    }
  }, []);

  const checkStatus = async () => {
    try {
      const response = await fetch('/api/google-ads/status');
      const data = await response.json();
      setStatus(data);
    } catch (error) {
      console.error('Failed to check status:', error);
    }
  };

  const handleOAuthCallback = async (code: string, state: string) => {
    setLoading(true);
    try {
      const redirectUri = `${window.location.origin}/admin/google-ads-setup`;
      const response = await fetch('/api/google-ads/oauth-callback', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ code, redirectUri, state }),
      });

      if (!response.ok) {
        const error = await response.json();
        throw new Error(error.error || 'Failed to complete OAuth');
      }

      const data = await response.json();
      
      toast({
        title: "✅ OAuth Successful!",
        description: `Refresh token received. Please add it to your Replit Secrets as: GOOGLE_ADS_REFRESH_TOKEN`,
      });

      // Show the refresh token in an alert
      alert(`IMPORTANT: Add this refresh token to Replit Secrets:\n\nName: GOOGLE_ADS_REFRESH_TOKEN\nValue: ${data.refresh_token}\n\nThen refresh this page.`);

      // Clean up URL
      window.history.replaceState({}, document.title, '/admin/google-ads-setup');
      
      await checkStatus();
    } catch (error: any) {
      toast({
        title: "OAuth Failed",
        description: error.message,
        variant: "destructive",
      });
    } finally {
      setLoading(false);
    }
  };

  const startOAuth = async () => {
    setLoading(true);
    try {
      const redirectUri = `${window.location.origin}/admin/google-ads-setup`;
      const response = await fetch(`/api/google-ads/oauth-url?redirectUri=${encodeURIComponent(redirectUri)}`);
      const data = await response.json();
      
      // Redirect to Google OAuth
      window.location.href = data.url;
    } catch (error: any) {
      toast({
        title: "Failed to start OAuth",
        description: error.message,
        variant: "destructive",
      });
      setLoading(false);
    }
  };

  const testConnection = async () => {
    setTestingConnection(true);
    try {
      const response = await fetch('/api/google-ads/test');
      const data = await response.json();
      
      setStatus(prev => ({ ...prev, connectionTest: data }));
      
      if (data.success) {
        toast({
          title: "✅ Connection Successful!",
          description: `Connected to: ${data.accountName}`,
        });
      } else {
        toast({
          title: "Connection Failed",
          description: data.message,
          variant: "destructive",
        });
      }
    } catch (error: any) {
      toast({
        title: "Test Failed",
        description: error.message,
        variant: "destructive",
      });
    } finally {
      setTestingConnection(false);
    }
  };

  return (
    <div className="min-h-screen flex flex-col bg-background">
      <SiteHeader />
      
      <main className="flex-1 py-12">
        <div className="container max-w-4xl mx-auto px-4">
          <div className="mb-8">
            <Button
              variant="ghost"
              onClick={() => setLocation('/admin/analytics')}
              className="mb-4"
              data-testid="button-back"
            >
              ← Back to Analytics
            </Button>
            
            <h1 className="text-3xl font-bold mb-2">Google Ads Integration Setup</h1>
            <p className="text-muted-foreground">
              Connect your Google Ads account to track paid vs organic conversions
            </p>
          </div>

          <div className="space-y-6">
            {/* Configuration Status */}
            <Card data-testid="card-setup-status">
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Shield className="h-5 w-5" />
                  Configuration Status
                </CardTitle>
                <CardDescription>Current setup progress</CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="space-y-3">
                  <div className="flex items-center gap-3">
                    {status.hasBasicConfig ? (
                      <CheckCircle2 className="h-5 w-5 text-green-500" />
                    ) : (
                      <XCircle className="h-5 w-5 text-destructive" />
                    )}
                    <div className="flex-1">
                      <p className="font-medium">Basic Configuration</p>
                      <p className="text-sm text-muted-foreground">
                        Client ID, Client Secret, Developer Token, Customer ID
                      </p>
                    </div>
                    <Badge variant={status.hasBasicConfig ? "default" : "secondary"}>
                      {status.hasBasicConfig ? "Complete" : "Incomplete"}
                    </Badge>
                  </div>

                  <Separator />

                  <div className="flex items-center gap-3">
                    {status.isFullyConfigured ? (
                      <CheckCircle2 className="h-5 w-5 text-green-500" />
                    ) : (
                      <XCircle className="h-5 w-5 text-destructive" />
                    )}
                    <div className="flex-1">
                      <p className="font-medium">OAuth Refresh Token</p>
                      <p className="text-sm text-muted-foreground">
                        Required for ongoing API access
                      </p>
                    </div>
                    <Badge variant={status.isFullyConfigured ? "default" : "secondary"}>
                      {status.isFullyConfigured ? "Complete" : "Pending"}
                    </Badge>
                  </div>

                  {status.connectionTest && (
                    <>
                      <Separator />
                      <div className="flex items-center gap-3">
                        {status.connectionTest.success ? (
                          <CheckCircle2 className="h-5 w-5 text-green-500" />
                        ) : (
                          <XCircle className="h-5 w-5 text-destructive" />
                        )}
                        <div className="flex-1">
                          <p className="font-medium">API Connection Test</p>
                          <p className="text-sm text-muted-foreground">
                            {status.connectionTest.message}
                          </p>
                          {status.connectionTest.accountName && (
                            <p className="text-sm font-medium text-primary mt-1">
                              Account: {status.connectionTest.accountName}
                            </p>
                          )}
                        </div>
                      </div>
                    </>
                  )}
                </div>
              </CardContent>
            </Card>

            {/* Setup Instructions */}
            {!status.hasBasicConfig && (
              <Alert>
                <Key className="h-4 w-4" />
                <AlertDescription>
                  <strong>Missing basic configuration.</strong> Please ensure you've added these 4 secrets to Replit:
                  <ul className="list-disc list-inside mt-2 space-y-1">
                    <li>GOOGLE_ADS_CLIENT_ID</li>
                    <li>GOOGLE_ADS_CLIENT_SECRET</li>
                    <li>GOOGLE_ADS_DEVELOPER_TOKEN</li>
                    <li>GOOGLE_ADS_CUSTOMER_ID</li>
                  </ul>
                </AlertDescription>
              </Alert>
            )}

            {status.hasBasicConfig && !status.isFullyConfigured && (
              <Card data-testid="card-oauth-setup">
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <LinkIcon className="h-5 w-5" />
                    OAuth Authorization
                  </CardTitle>
                  <CardDescription>
                    Authorize access to your Google Ads account
                  </CardDescription>
                </CardHeader>
                <CardContent className="space-y-4">
                  <p className="text-sm text-muted-foreground">
                    Click the button below to authorize this application to access your Google Ads data.
                    You'll be redirected to Google to sign in and grant permissions.
                  </p>
                  
                  <Button
                    onClick={startOAuth}
                    disabled={loading}
                    size="lg"
                    className="w-full"
                    data-testid="button-start-oauth"
                  >
                    {loading ? (
                      <>
                        <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                        Redirecting to Google...
                      </>
                    ) : (
                      <>
                        <ExternalLink className="mr-2 h-4 w-4" />
                        Authorize with Google Ads
                      </>
                    )}
                  </Button>

                  <div className="p-4 bg-muted rounded-lg">
                    <p className="text-sm font-medium mb-2">What happens next:</p>
                    <ol className="text-sm text-muted-foreground space-y-1 list-decimal list-inside">
                      <li>You'll be redirected to Google's OAuth page</li>
                      <li>Sign in with your Google Ads account</li>
                      <li>Grant permission for this app to access your data</li>
                      <li>You'll receive a refresh token to add to Replit Secrets</li>
                      <li>Once added, the integration will be complete!</li>
                    </ol>
                  </div>
                </CardContent>
              </Card>
            )}

            {status.isFullyConfigured && (
              <Card data-testid="card-connection-test">
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <TrendingUp className="h-5 w-5" />
                    Integration Active
                  </CardTitle>
                  <CardDescription>
                    Your Google Ads account is connected
                  </CardDescription>
                </CardHeader>
                <CardContent className="space-y-4">
                  <Alert>
                    <CheckCircle2 className="h-4 w-4" />
                    <AlertDescription>
                      <strong>Setup complete!</strong> Your analytics dashboard will now show paid vs organic conversion data.
                    </AlertDescription>
                  </Alert>

                  <div className="flex gap-3 flex-wrap">
                    <Button
                      onClick={testConnection}
                      disabled={testingConnection}
                      variant="outline"
                      data-testid="button-test-connection"
                    >
                      {testingConnection ? (
                        <>
                          <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                          Testing...
                        </>
                      ) : (
                        'Test Connection'
                      )}
                    </Button>

                    <Button
                      onClick={startOAuth}
                      disabled={loading}
                      variant="outline"
                      data-testid="button-reconnect-oauth"
                    >
                      {loading ? (
                        <>
                          <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                          Reconnecting...
                        </>
                      ) : (
                        <>
                          <ExternalLink className="mr-2 h-4 w-4" />
                          Reconnect Account
                        </>
                      )}
                    </Button>

                    <Button
                      onClick={() => setLocation('/admin/analytics')}
                      data-testid="button-view-analytics"
                    >
                      View Analytics Dashboard
                    </Button>
                  </div>

                  {status.connectionTest && !status.connectionTest.success && (
                    <Alert variant="destructive">
                      <XCircle className="h-4 w-4" />
                      <AlertDescription>
                        <strong>Connection test failed.</strong> Your refresh token may be expired. Click "Reconnect Account" above to generate a new token.
                      </AlertDescription>
                    </Alert>
                  )}
                </CardContent>
              </Card>
            )}
          </div>
        </div>
      </main>

      <SiteFooter />
    </div>
  );
}
