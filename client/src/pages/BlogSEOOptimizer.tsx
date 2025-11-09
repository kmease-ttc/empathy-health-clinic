import { useState } from "react";
import { useQuery, useMutation } from "@tanstack/react-query";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Label } from "@/components/ui/label";
import { useToast } from "@/hooks/use-toast";
import { apiRequest, queryClient } from "@/lib/queryClient";
import { Home, Search, TrendingUp, AlertCircle, CheckCircle2, Star } from "lucide-react";
import { useLocation } from "wouter";
import type { BlogPost } from "@shared/schema";

interface SEOAnalysis {
  wordCount: number;
  titleKeywordMatch: boolean;
  h1KeywordMatch: boolean;
  bodyKeywordDensity: number;
  readabilityScore: number;
  hasMetaDescription: boolean;
  hasKeywords: boolean;
  hasRatings: boolean;
  overallScore: number;
}

function analyzeSEO(post: BlogPost, targetKeyword?: string): SEOAnalysis {
  const content = post.content.toLowerCase();
  const title = (post.metaTitle || post.title).toLowerCase();
  const wordCount = post.content.split(/\s+/).length;
  
  const keyword = targetKeyword?.toLowerCase() || '';
  const titleKeywordMatch = keyword ? title.includes(keyword) : false;
  
  const h1Match = content.match(/^#\s+(.+)$/m);
  const h1 = h1Match ? h1Match[1].toLowerCase() : '';
  const h1KeywordMatch = keyword ? h1.includes(keyword) : false;
  
  const keywordMatches = keyword ? (content.match(new RegExp(keyword.replace(/\s+/g, '\\s+'), 'gi')) || []).length : 0;
  const bodyKeywordDensity = keyword ? (keywordMatches / wordCount) * 100 : 0;
  
  const avgSentenceLength = content.split(/[.!?]+/).filter(s => s.trim()).length / wordCount * 100;
  const readabilityScore = Math.max(0, Math.min(100, 100 - avgSentenceLength * 5));
  
  const hasMetaDescription = !!post.metaDescription && post.metaDescription.length >= 120;
  const hasKeywords = !!post.keywords && post.keywords.length > 0;
  const hasRatings = !!(post.averageRating && post.ratingCount);
  
  let score = 0;
  if (wordCount >= 1800) score += 20;
  else if (wordCount >= 1200) score += 15;
  else if (wordCount >= 800) score += 10;
  
  if (titleKeywordMatch) score += 15;
  if (h1KeywordMatch) score += 15;
  if (bodyKeywordDensity >= 0.5 && bodyKeywordDensity <= 2.5) score += 15;
  if (readabilityScore >= 60) score += 10;
  if (hasMetaDescription) score += 10;
  if (hasKeywords) score += 10;
  if (hasRatings) score += 5;
  
  return {
    wordCount,
    titleKeywordMatch,
    h1KeywordMatch,
    bodyKeywordDensity,
    readabilityScore,
    hasMetaDescription,
    hasKeywords,
    hasRatings,
    overallScore: Math.min(100, score)
  };
}

function SEOScoreBadge({ score }: { score: number }) {
  if (score >= 80) return <Badge className="bg-green-600">Excellent: {score}%</Badge>;
  if (score >= 60) return <Badge className="bg-yellow-600">Good: {score}%</Badge>;
  if (score >= 40) return <Badge className="bg-orange-600">Fair: {score}%</Badge>;
  return <Badge variant="destructive">Poor: {score}%</Badge>;
}

export default function BlogSEOOptimizer() {
  const [, setLocation] = useLocation();
  const { toast } = useToast();
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedPost, setSelectedPost] = useState<BlogPost | null>(null);
  const [targetKeyword, setTargetKeyword] = useState("");
  const [editedPost, setEditedPost] = useState<Partial<BlogPost>>({});

  const { data: response, isLoading } = useQuery<{ posts: BlogPost[] }>({
    queryKey: ["/api/blog-posts"],
  });

  const updateMutation = useMutation({
    mutationFn: async (data: { id: string; updates: Partial<BlogPost> }) => {
      return await apiRequest("PATCH", `/api/blog-posts/${data.id}`, data.updates);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["/api/blog-posts"] });
      toast({
        title: "Success",
        description: "Blog post updated successfully",
      });
      setSelectedPost(null);
      setEditedPost({});
      setTargetKeyword("");
    },
    onError: (error: Error) => {
      toast({
        title: "Error",
        description: error.message,
        variant: "destructive",
      });
    },
  });

  const posts = response?.posts || [];
  const filteredPosts = posts.filter(post =>
    post.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
    post.slug.toLowerCase().includes(searchQuery.toLowerCase())
  );

  const postsWithAnalysis = filteredPosts.map(post => ({
    post,
    analysis: analyzeSEO(post, post.keywords?.[0] || '')
  })).sort((a, b) => a.analysis.overallScore - b.analysis.overallScore);

  const handleEditPost = (post: BlogPost) => {
    setSelectedPost(post);
    setEditedPost({
      title: post.title,
      metaTitle: post.metaTitle || post.title,
      metaDescription: post.metaDescription || post.excerpt,
      keywords: post.keywords || [],
      content: post.content,
      averageRating: post.averageRating || undefined,
      ratingCount: post.ratingCount || undefined,
      bestRating: post.bestRating || 5,
      worstRating: post.worstRating || 1,
    });
    setTargetKeyword("");
  };

  const handleSave = () => {
    if (!selectedPost) return;
    updateMutation.mutate({
      id: selectedPost.id,
      updates: editedPost,
    });
  };

  const currentAnalysis = selectedPost ? analyzeSEO({...selectedPost, ...editedPost} as BlogPost, targetKeyword) : null;

  if (isLoading) {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin h-8 w-8 border-4 border-primary border-t-transparent rounded-full mx-auto mb-4" />
          <p className="text-muted-foreground">Loading blog posts...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-background">
      <header className="border-b border-border sticky top-0 bg-background/95 backdrop-blur-md z-50">
        <div className="max-w-7xl mx-auto px-6 py-4 flex items-center justify-between">
          <div>
            <h1 className="text-2xl font-sans font-medium">Blog SEO Optimizer</h1>
            <p className="text-sm text-muted-foreground">Optimize blog posts for search engines</p>
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

      <div className="max-w-7xl mx-auto px-6 py-8">
        {!selectedPost ? (
          <>
            <div className="mb-6">
              <div className="relative">
                <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                <Input
                  placeholder="Search blog posts..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="pl-10"
                  data-testid="input-search-posts"
                />
              </div>
            </div>

            <div className="grid gap-4">
              {postsWithAnalysis.map(({ post, analysis }) => (
                <Card key={post.id} className="hover-elevate">
                  <CardHeader>
                    <div className="flex items-start justify-between gap-4">
                      <div className="flex-1">
                        <CardTitle className="text-lg">{post.title}</CardTitle>
                        <CardDescription className="mt-1">
                          /{post.slug}
                        </CardDescription>
                      </div>
                      <SEOScoreBadge score={analysis.overallScore} />
                    </div>
                  </CardHeader>
                  <CardContent>
                    <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-4">
                      <div className="text-sm">
                        <p className="text-muted-foreground">Word Count</p>
                        <p className="font-medium">{analysis.wordCount}</p>
                      </div>
                      <div className="text-sm">
                        <p className="text-muted-foreground">Readability</p>
                        <p className="font-medium">{Math.round(analysis.readabilityScore)}%</p>
                      </div>
                      <div className="text-sm">
                        <p className="text-muted-foreground">Meta Desc</p>
                        <p className="font-medium">{analysis.hasMetaDescription ? <CheckCircle2 className="h-4 w-4 text-green-600 inline" /> : <AlertCircle className="h-4 w-4 text-orange-600 inline" />}</p>
                      </div>
                      <div className="text-sm">
                        <p className="text-muted-foreground">Ratings</p>
                        <p className="font-medium">{analysis.hasRatings ? <Star className="h-4 w-4 text-yellow-600 inline" /> : <AlertCircle className="h-4 w-4 text-muted-foreground inline" />}</p>
                      </div>
                    </div>
                    <Button
                      onClick={() => handleEditPost(post)}
                      className="w-full"
                      data-testid={`button-edit-${post.slug}`}
                    >
                      <TrendingUp className="w-4 h-4 mr-2" />
                      Optimize SEO
                    </Button>
                  </CardContent>
                </Card>
              ))}
            </div>
          </>
        ) : (
          <div className="space-y-6">
            <div className="flex items-center justify-between">
              <div>
                <h2 className="text-2xl font-bold">{selectedPost.title}</h2>
                <p className="text-sm text-muted-foreground">/{selectedPost.slug}</p>
              </div>
              <Button
                variant="outline"
                onClick={() => {
                  setSelectedPost(null);
                  setEditedPost({});
                  setTargetKeyword("");
                }}
                data-testid="button-cancel-edit"
              >
                Cancel
              </Button>
            </div>

            {currentAnalysis && (
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center justify-between">
                    <span>SEO Score</span>
                    <SEOScoreBadge score={currentAnalysis.overallScore} />
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                    <div className="text-sm">
                      <p className="text-muted-foreground">Word Count</p>
                      <p className="font-medium">{currentAnalysis.wordCount} {currentAnalysis.wordCount >= 1800 ? '✓' : '❌'}</p>
                    </div>
                    <div className="text-sm">
                      <p className="text-muted-foreground">Title Keyword</p>
                      <p className="font-medium">{currentAnalysis.titleKeywordMatch ? '✓' : '❌'}</p>
                    </div>
                    <div className="text-sm">
                      <p className="text-muted-foreground">H1 Keyword</p>
                      <p className="font-medium">{currentAnalysis.h1KeywordMatch ? '✓' : '❌'}</p>
                    </div>
                    <div className="text-sm">
                      <p className="text-muted-foreground">Keyword Density</p>
                      <p className="font-medium">{currentAnalysis.bodyKeywordDensity.toFixed(2)}%</p>
                    </div>
                  </div>
                </CardContent>
              </Card>
            )}

            <Tabs defaultValue="metadata" className="w-full">
              <TabsList className="grid w-full grid-cols-3">
                <TabsTrigger value="metadata">Metadata</TabsTrigger>
                <TabsTrigger value="content">Content</TabsTrigger>
                <TabsTrigger value="ratings">Ratings</TabsTrigger>
              </TabsList>

              <TabsContent value="metadata" className="space-y-4">
                <div className="space-y-2">
                  <Label>Target Keyword (for analysis)</Label>
                  <Input
                    placeholder="e.g., define love bombing"
                    value={targetKeyword}
                    onChange={(e) => setTargetKeyword(e.target.value)}
                    data-testid="input-target-keyword"
                  />
                  <p className="text-xs text-muted-foreground">Enter the keyword you want to optimize for</p>
                </div>

                <div className="space-y-2">
                  <Label>Page Title (H1)</Label>
                  <Input
                    value={editedPost.title || ""}
                    onChange={(e) => setEditedPost({ ...editedPost, title: e.target.value })}
                    placeholder="Blog post title"
                    data-testid="input-title"
                  />
                </div>

                <div className="space-y-2">
                  <Label>Meta Title (SEO Title)</Label>
                  <Input
                    value={editedPost.metaTitle || ""}
                    onChange={(e) => setEditedPost({ ...editedPost, metaTitle: e.target.value })}
                    placeholder="SEO title for search engines"
                    data-testid="input-meta-title"
                  />
                  <p className="text-xs text-muted-foreground">{(editedPost.metaTitle || "").length}/60 characters</p>
                </div>

                <div className="space-y-2">
                  <Label>Meta Description</Label>
                  <Textarea
                    value={editedPost.metaDescription || ""}
                    onChange={(e) => setEditedPost({ ...editedPost, metaDescription: e.target.value })}
                    placeholder="Brief description for search engines"
                    rows={3}
                    data-testid="textarea-meta-description"
                  />
                  <p className="text-xs text-muted-foreground">{(editedPost.metaDescription || "").length}/160 characters</p>
                </div>

                <div className="space-y-2">
                  <Label>Keywords (comma-separated)</Label>
                  <Input
                    value={(editedPost.keywords || []).join(", ")}
                    onChange={(e) => setEditedPost({ ...editedPost, keywords: e.target.value.split(",").map(k => k.trim()).filter(Boolean) })}
                    placeholder="keyword1, keyword2, keyword3"
                    data-testid="input-keywords"
                  />
                </div>
              </TabsContent>

              <TabsContent value="content" className="space-y-4">
                <div className="space-y-2">
                  <Label>Content (Markdown)</Label>
                  <Textarea
                    value={editedPost.content || ""}
                    onChange={(e) => setEditedPost({ ...editedPost, content: e.target.value })}
                    placeholder="Blog post content in markdown format"
                    rows={20}
                    className="font-mono text-sm"
                    data-testid="textarea-content"
                  />
                  <p className="text-xs text-muted-foreground">{(editedPost.content || "").split(/\s+/).length} words</p>
                </div>
              </TabsContent>

              <TabsContent value="ratings" className="space-y-4">
                <p className="text-sm text-muted-foreground mb-4">
                  Add aggregate ratings to show star ratings in search results (SERP features)
                </p>

                <div className="grid grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label>Average Rating</Label>
                    <Input
                      type="number"
                      step="0.1"
                      min="0"
                      max="5"
                      value={editedPost.averageRating || ""}
                      onChange={(e) => setEditedPost({ ...editedPost, averageRating: parseFloat(e.target.value) || undefined })}
                      placeholder="4.8"
                      data-testid="input-average-rating"
                    />
                  </div>

                  <div className="space-y-2">
                    <Label>Number of Ratings</Label>
                    <Input
                      type="number"
                      min="0"
                      value={editedPost.ratingCount || ""}
                      onChange={(e) => setEditedPost({ ...editedPost, ratingCount: parseInt(e.target.value) || undefined })}
                      placeholder="245"
                      data-testid="input-rating-count"
                    />
                  </div>

                  <div className="space-y-2">
                    <Label>Best Rating</Label>
                    <Input
                      type="number"
                      min="1"
                      value={editedPost.bestRating || 5}
                      onChange={(e) => setEditedPost({ ...editedPost, bestRating: parseInt(e.target.value) || 5 })}
                      placeholder="5"
                      data-testid="input-best-rating"
                    />
                  </div>

                  <div className="space-y-2">
                    <Label>Worst Rating</Label>
                    <Input
                      type="number"
                      min="1"
                      value={editedPost.worstRating || 1}
                      onChange={(e) => setEditedPost({ ...editedPost, worstRating: parseInt(e.target.value) || 1 })}
                      placeholder="1"
                      data-testid="input-worst-rating"
                    />
                  </div>
                </div>

                {editedPost.averageRating && editedPost.ratingCount && (
                  <div className="p-4 bg-muted rounded-lg">
                    <p className="text-sm font-medium mb-2">Preview:</p>
                    <div className="flex items-center gap-2">
                      {[...Array(5)].map((_, i) => (
                        <Star
                          key={i}
                          className={`h-5 w-5 ${i < Math.round(editedPost.averageRating || 0) ? 'fill-yellow-500 text-yellow-500' : 'text-muted-foreground'}`}
                        />
                      ))}
                      <span className="text-sm text-muted-foreground">
                        {editedPost.averageRating}/5 ({editedPost.ratingCount} ratings)
                      </span>
                    </div>
                  </div>
                )}
              </TabsContent>
            </Tabs>

            <div className="flex gap-3">
              <Button
                onClick={handleSave}
                disabled={updateMutation.isPending}
                className="flex-1"
                data-testid="button-save-changes"
              >
                {updateMutation.isPending ? "Saving..." : "Save Changes"}
              </Button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
