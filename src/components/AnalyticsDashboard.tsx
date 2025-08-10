import { useEffect, useState } from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Progress } from "@/components/ui/progress";
import { 
  BarChart, 
  LineChart, 
  Eye, 
  Users, 
  Clock, 
  TrendingUp, 
  Target, 
  Zap,
  Download,
  Share,
  Play,
  Heart,
  MessageCircle,
  RefreshCw
} from "lucide-react";
import { supabase } from "@/integrations/supabase/client";
import { useAuth } from "@/hooks/useAuth";

export const AnalyticsDashboard = () => {
  const [selectedPeriod, setSelectedPeriod] = useState("7d");
  const [activeMetric, setActiveMetric] = useState("engagement");
  const { user } = useAuth();
  const [videos, setVideos] = useState<any[]>([]);

  useEffect(() => {
    if (!user) {
      setVideos([]);
      return;
    }
    supabase
      .from('videos')
      .select('*')
      .eq('user_id', user.id)
      .then(({ data }) => setVideos(data || []));
  }, [user]);

  const totalViews = videos.reduce((acc, v) => acc + (Number(v.views_count) || 0), 0);
  const totalLikes = videos.reduce((acc, v) => acc + (Number(v.likes_count) || 0), 0);
  const totalComments = videos.reduce((acc, v) => acc + (Number(v.comments_count) || 0), 0);
  const publicCount = videos.filter(v => v.is_public !== false).length;

  const performanceMetrics = [
    { label: "Total Views", value: totalViews.toLocaleString(), change: "", trend: "up" },
    { label: "Total Likes", value: totalLikes.toLocaleString(), change: "", trend: "up" },
    { label: "Total Comments", value: totalComments.toLocaleString(), change: "", trend: "up" },
    { label: "Public Videos", value: String(publicCount), change: "", trend: "up" },
  ];

  const topVideos = videos
    .slice()
    .sort((a, b) => (Number(b.views_count) || 0) - (Number(a.views_count) || 0))
    .slice(0, 4)
    .map(v => ({
      title: v.title,
      views: (Number(v.views_count) || 0).toLocaleString(),
      engagement: 0,
      duration: ''
    }));

  const audienceInsights = [
    { demographic: "25-34 years", percentage: 42, color: "bg-primary" },
    { demographic: "35-44 years", percentage: 28, color: "bg-secondary" },
    { demographic: "18-24 years", percentage: 18, color: "bg-accent" },
    { demographic: "45+ years", percentage: 12, color: "bg-muted" },
  ];

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-3xl font-bold tracking-tight">Analytics Dashboard</h2>
          <p className="text-muted-foreground">Track performance and get AI-powered insights</p>
        </div>
        <div className="flex items-center gap-2">
          <Button variant="outline" size="sm">
            <Download className="h-4 w-4 mr-2" />
            Export Report
          </Button>
          <Button variant="outline" size="sm">
            <RefreshCw className="h-4 w-4 mr-2" />
            Refresh
          </Button>
        </div>
      </div>

      <Tabs value={selectedPeriod} onValueChange={setSelectedPeriod}>
        <TabsList>
          <TabsTrigger value="24h">Last 24h</TabsTrigger>
          <TabsTrigger value="7d">Last 7 days</TabsTrigger>
          <TabsTrigger value="30d">Last 30 days</TabsTrigger>
          <TabsTrigger value="90d">Last 90 days</TabsTrigger>
        </TabsList>

        <TabsContent value={selectedPeriod} className="space-y-6">
          {/* Performance Overview */}
          <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
            {performanceMetrics.map((metric, index) => (
              <Card key={index}>
                <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                  <CardTitle className="text-sm font-medium">{metric.label}</CardTitle>
                  <TrendingUp className={`h-4 w-4 ${metric.trend === 'up' ? 'text-green-600' : 'text-red-600'}`} />
                </CardHeader>
                <CardContent>
                  <div className="text-2xl font-bold">{metric.value}</div>
                  <p className={`text-xs ${metric.trend === 'up' ? 'text-green-600' : 'text-red-600'}`}>
                    {metric.change} from last period
                  </p>
                </CardContent>
              </Card>
            ))}
          </div>

          {/* Detailed Analytics */}
          <div className="grid gap-6 md:grid-cols-2">
            {/* Top Performing Videos */}
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <BarChart className="h-5 w-5" />
                  Top Performing Videos
                </CardTitle>
                <CardDescription>Your best content this period</CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                {topVideos.map((video, index) => (
                  <div key={index} className="flex items-center justify-between p-3 border rounded-lg">
                    <div>
                      <p className="font-medium">{video.title}</p>
                      <div className="flex items-center gap-4 text-sm text-muted-foreground">
                        <span className="flex items-center gap-1">
                          <Eye className="h-3 w-3" />
                          {video.views}
                        </span>
                        <span className="flex items-center gap-1">
                          <Clock className="h-3 w-3" />
                          {video.duration}
                        </span>
                      </div>
                    </div>
                    <Badge variant="secondary">{video.engagement}% engagement</Badge>
                  </div>
                ))}
              </CardContent>
            </Card>

            {/* Audience Demographics */}
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Users className="h-5 w-5" />
                  Audience Demographics
                </CardTitle>
                <CardDescription>Age distribution of your viewers</CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                {audienceInsights.map((insight, index) => (
                  <div key={index} className="space-y-2">
                    <div className="flex justify-between text-sm">
                      <span>{insight.demographic}</span>
                      <span>{insight.percentage}%</span>
                    </div>
                    <Progress value={insight.percentage} className="h-2" />
                  </div>
                ))}
              </CardContent>
            </Card>

            {/* Engagement Metrics */}
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Heart className="h-5 w-5" />
                  Engagement Breakdown
                </CardTitle>
                <CardDescription>How viewers interact with your content</CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="grid grid-cols-2 gap-4">
                  <div className="text-center p-4 border rounded-lg">
                    <Play className="h-8 w-8 mx-auto mb-2 text-primary" />
                    <p className="text-2xl font-bold">87%</p>
                    <p className="text-sm text-muted-foreground">Play Rate</p>
                  </div>
                  <div className="text-center p-4 border rounded-lg">
                    <Heart className="h-8 w-8 mx-auto mb-2 text-red-500" />
                    <p className="text-2xl font-bold">12.4K</p>
                    <p className="text-sm text-muted-foreground">Likes</p>
                  </div>
                  <div className="text-center p-4 border rounded-lg">
                    <Share className="h-8 w-8 mx-auto mb-2 text-blue-500" />
                    <p className="text-2xl font-bold">1.8K</p>
                    <p className="text-sm text-muted-foreground">Shares</p>
                  </div>
                  <div className="text-center p-4 border rounded-lg">
                    <MessageCircle className="h-8 w-8 mx-auto mb-2 text-green-500" />
                    <p className="text-2xl font-bold">856</p>
                    <p className="text-sm text-muted-foreground">Comments</p>
                  </div>
                </div>
              </CardContent>
            </Card>

            {/* ROI Tracking */}
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Target className="h-5 w-5" />
                  ROI Analysis
                </CardTitle>
                <CardDescription>Return on investment metrics</CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="space-y-3">
                  <div className="flex justify-between items-center">
                    <span className="text-sm">Total Investment</span>
                    <span className="font-medium">$12,450</span>
                  </div>
                  <div className="flex justify-between items-center">
                    <span className="text-sm">Generated Revenue</span>
                    <span className="font-medium text-green-600">$38,920</span>
                  </div>
                  <div className="flex justify-between items-center">
                    <span className="text-sm">ROI</span>
                    <Badge variant="default" className="bg-green-600">+212%</Badge>
                  </div>
                  <Progress value={75} className="h-2" />
                  <p className="text-xs text-muted-foreground">
                    25% above industry average
                  </p>
                </div>
              </CardContent>
            </Card>
          </div>
        </TabsContent>
      </Tabs>
    </div>
  );
};