import { useEffect, useState } from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { 
  Brain, 
  Lightbulb, 
  TrendingUp, 
  AlertTriangle, 
  CheckCircle, 
  Clock,
  Users,
  Target,
  Zap,
  BarChart3,
  Calendar,
  Eye,
  ThumbsUp,
  MessageSquare
} from "lucide-react";
import { supabase } from "@/integrations/supabase/client";
import { useAuth } from "@/hooks/useAuth";

export const AIInsights = () => {
  const [activeTab, setActiveTab] = useState("recommendations");
  const { user } = useAuth();
  const [insights, setInsights] = useState<any[]>([]);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    let isMounted = true;
    if (!user) {
      setInsights([]);
      return;
    }
    setLoading(true);
    supabase
      .from('ai_insights')
      .select('*')
      .eq('user_id', user.id)
      .order('created_at', { ascending: false })
      .then(({ data, error }) => {
        if (isMounted) {
          if (!error && data) setInsights(data);
          setLoading(false);
        }
      });
    return () => { isMounted = false };
  }, [user]);

  const getIconMeta = (type?: string) => {
    switch (type) {
      case 'optimization':
        return { icon: Clock, color: 'text-red-500' };
      case 'content':
        return { icon: TrendingUp, color: 'text-orange-500' };
      case 'technical':
        return { icon: BarChart3, color: 'text-red-500' };
      case 'engagement':
        return { icon: Target, color: 'text-green-500' };
      default:
        return { icon: Brain, color: 'text-primary' };
    }
  };

  const performancePredictions = [
    {
      metric: "Expected Views",
      current: "24.5K",
      predicted: "31.2K",
      confidence: 87,
      trend: "up"
    },
    {
      metric: "Engagement Rate",
      current: "6.8%",
      predicted: "8.4%",
      confidence: 92,
      trend: "up"
    },
    {
      metric: "Watch Time",
      current: "2:34",
      predicted: "3:12",
      confidence: 78,
      trend: "up"
    },
    {
      metric: "Conversion Rate",
      current: "3.2%",
      predicted: "4.1%",
      confidence: 85,
      trend: "up"
    }
  ];

  const competitorAnalysis = [
    {
      competitor: "TechChannel Pro",
      category: "Similar Content",
      performance: "Higher engagement",
      insight: "Uses more interactive elements and polls",
      opportunity: "Implement interactive features"
    },
    {
      competitor: "Digital Marketing Hub",
      category: "Target Audience",
      performance: "Better reach",
      insight: "Posts consistently at optimal times",
      opportunity: "Improve posting schedule"
    },
    {
      competitor: "Creative Studios",
      category: "Content Style",
      performance: "Higher retention",
      insight: "Shorter, more focused content",
      opportunity: "Optimize video length"
    }
  ];

  const abTestSuggestions = [
    {
      test: "Thumbnail A/B Test",
      description: "Test bright vs. dark thumbnail designs",
      potential: "+12% CTR improvement",
      duration: "7 days",
      status: "ready"
    },
    {
      test: "Title Optimization",
      description: "Test question vs. statement formats",
      potential: "+8% engagement boost",
      duration: "5 days",
      status: "ready"
    },
    {
      test: "Content Length",
      description: "Compare 2-minute vs. 4-minute videos",
      potential: "+15% watch time",
      duration: "14 days",
      status: "running"
    }
  ];

  const getPriorityColor = (priority: string) => {
    switch (priority) {
      case "high": return "bg-red-100 text-red-800 border-red-200";
      case "medium": return "bg-orange-100 text-orange-800 border-orange-200";
      case "low": return "bg-green-100 text-green-800 border-green-200";
      default: return "bg-gray-100 text-gray-800 border-gray-200";
    }
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center gap-3">
        <Brain className="h-8 w-8 text-primary" />
        <div>
          <h2 className="text-3xl font-bold tracking-tight">AI Insights</h2>
          <p className="text-muted-foreground">Smart recommendations powered by machine learning</p>
        </div>
      </div>

      <Tabs value={activeTab} onValueChange={setActiveTab}>
        <TabsList className="grid w-full grid-cols-4">
          <TabsTrigger value="recommendations">Recommendations</TabsTrigger>
          <TabsTrigger value="predictions">Predictions</TabsTrigger>
          <TabsTrigger value="competitors">Competitors</TabsTrigger>
          <TabsTrigger value="testing">A/B Testing</TabsTrigger>
        </TabsList>

        <TabsContent value="recommendations" className="space-y-4">
          <div className="grid gap-4">
            {(loading ? [] : insights).map((rec, index) => {
              const { icon: IconComponent, color } = getIconMeta(rec.insight_type);
              return (
                <Card key={index} className="border-l-4 border-l-primary">
                  <CardHeader className="pb-3">
                    <div className="flex items-start justify-between">
                      <div className="flex items-center gap-3">
                        <IconComponent className={`h-5 w-5 ${color}`} />
                        <div>
                          <CardTitle className="text-lg">{rec.title}</CardTitle>
                          <Badge className={`text-xs ${getPriorityColor(rec.priority || 'medium')}`}>
                            {(rec.priority || 'medium')} priority
                          </Badge>
                        </div>
                      </div>
                      <Button size="sm">{rec.data?.action || 'View Insight'}</Button>
                    </div>
                  </CardHeader>
                  <CardContent>
                    <p className="text-muted-foreground mb-2">{rec.description}</p>
                    {rec.data?.impact && (
                      <div className="flex items-center gap-2">
                        <Zap className="h-4 w-4 text-yellow-500" />
                        <span className="text-sm font-medium text-green-600">{rec.data.impact}</span>
                      </div>
                    )}
                  </CardContent>
                </Card>
              );
            })}
            {!loading && insights.length === 0 && (
              <Card>
                <CardHeader>
                  <CardTitle>No insights yet</CardTitle>
                  <CardDescription>Generate and publish videos to see AI insights here.</CardDescription>
                </CardHeader>
              </Card>
            )}
          </div>
        </TabsContent>

        <TabsContent value="predictions" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <TrendingUp className="h-5 w-5" />
                Performance Predictions
              </CardTitle>
              <CardDescription>AI-powered forecasts for your next content</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="grid gap-4 md:grid-cols-2">
                {performancePredictions.map((prediction, index) => (
                  <div key={index} className="p-4 border rounded-lg">
                    <div className="flex items-center justify-between mb-2">
                      <h4 className="font-medium">{prediction.metric}</h4>
                      <Badge variant="outline">{prediction.confidence}% confidence</Badge>
                    </div>
                    <div className="flex items-center gap-4">
                      <div className="text-center">
                        <p className="text-sm text-muted-foreground">Current</p>
                        <p className="text-lg font-bold">{prediction.current}</p>
                      </div>
                      <TrendingUp className="h-4 w-4 text-green-500" />
                      <div className="text-center">
                        <p className="text-sm text-muted-foreground">Predicted</p>
                        <p className="text-lg font-bold text-green-600">{prediction.predicted}</p>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="competitors" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Eye className="h-5 w-5" />
                Competitor Analysis
              </CardTitle>
              <CardDescription>Learn from top performers in your niche</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {competitorAnalysis.map((comp, index) => (
                  <div key={index} className="p-4 border rounded-lg">
                    <div className="flex items-start justify-between mb-3">
                      <div>
                        <h4 className="font-medium">{comp.competitor}</h4>
                        <Badge variant="secondary" className="text-xs">{comp.category}</Badge>
                      </div>
                      <span className="text-sm text-muted-foreground">{comp.performance}</span>
                    </div>
                    <p className="text-sm text-muted-foreground mb-2">{comp.insight}</p>
                    <div className="flex items-center gap-2">
                      <Lightbulb className="h-4 w-4 text-yellow-500" />
                      <span className="text-sm font-medium">{comp.opportunity}</span>
                    </div>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="testing" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <BarChart3 className="h-5 w-5" />
                A/B Testing Suggestions
              </CardTitle>
              <CardDescription>Data-driven experiments to optimize performance</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {abTestSuggestions.map((test, index) => (
                  <div key={index} className="p-4 border rounded-lg">
                    <div className="flex items-start justify-between mb-3">
                      <div>
                        <h4 className="font-medium">{test.test}</h4>
                        <div className="flex items-center gap-2 mt-1">
                          <Badge variant={test.status === "running" ? "default" : "outline"}>
                            {test.status}
                          </Badge>
                          <span className="text-sm text-muted-foreground">Duration: {test.duration}</span>
                        </div>
                      </div>
                      <Button size="sm" variant={test.status === "running" ? "outline" : "default"}>
                        {test.status === "running" ? "View Results" : "Start Test"}
                      </Button>
                    </div>
                    <p className="text-sm text-muted-foreground mb-2">{test.description}</p>
                    <div className="flex items-center gap-2">
                      <Target className="h-4 w-4 text-blue-500" />
                      <span className="text-sm font-medium text-blue-600">{test.potential}</span>
                    </div>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
};