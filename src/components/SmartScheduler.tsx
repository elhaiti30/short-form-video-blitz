import { useState, useEffect } from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Calendar } from "@/components/ui/calendar";
import { Switch } from "@/components/ui/switch";
import { supabase } from "@/integrations/supabase/client";
import { useAuth } from "@/hooks/useAuth";
import { toast } from "@/hooks/use-toast";
import { 
  Calendar as CalendarIcon, 
  Clock, 
  Brain, 
  Users, 
  TrendingUp, 
  Zap,
  Settings,
  Play,
  Pause,
  SkipForward,
  CheckCircle,
  AlertCircle,
  Globe,
  Target
} from "lucide-react";

export const SmartScheduler = () => {
  const { user } = useAuth();
  const [selectedDate, setSelectedDate] = useState<Date | undefined>(new Date());
  const [autoSchedule, setAutoSchedule] = useState(true);
  const [activeTab, setActiveTab] = useState("schedule");
  const [realContent, setRealContent] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchScheduledContent = async () => {
      if (!user) {
        setLoading(false);
        return;
      }

      try {
        const { data, error } = await supabase
          .from('video_projects')
          .select('*')
          .eq('user_id', user.id)
          .order('created_at', { ascending: false })
          .limit(10);

        if (error) throw error;

        const mappedContent = data.map(project => {
          const styleSettings = typeof project.style_settings === 'object' && project.style_settings ? project.style_settings as any : {};
          
          return {
            id: project.id,
            title: project.project_name,
            platform: styleSettings.platform || "YouTube",
            scheduledTime: new Date(project.created_at).toLocaleDateString(),
            status: project.generation_status || "draft",
            expectedViews: "5K", // Mock data for now
            confidenceScore: 85 + Math.floor(Math.random() * 15)
          };
        });

        setRealContent(mappedContent);
      } catch (error) {
        console.error('Error fetching scheduled content:', error);
        toast({
          title: "Error", 
          description: "Failed to load scheduled content",
          variant: "destructive"
        });
      } finally {
        setLoading(false);
      }
    };

    fetchScheduledContent();
  }, [user]);

  const optimalTimes = [
    { platform: "YouTube", time: "2:00 PM", day: "Tuesday", engagement: "+23%", audience: "2.4K" },
    { platform: "Instagram", time: "11:00 AM", day: "Wednesday", engagement: "+18%", audience: "1.8K" },
    { platform: "TikTok", time: "7:00 PM", day: "Friday", engagement: "+31%", audience: "3.2K" },
    { platform: "LinkedIn", time: "10:00 AM", day: "Thursday", engagement: "+15%", audience: "1.2K" },
  ];

  const scheduledContent = [
    {
      id: 1,
      title: "Product Demo Video",
      platform: "YouTube",
      scheduledTime: "Today 2:00 PM",
      status: "scheduled",
      expectedViews: "12K",
      confidenceScore: 92
    },
    {
      id: 2,
      title: "Behind the Scenes",
      platform: "Instagram",
      scheduledTime: "Tomorrow 11:00 AM",
      status: "scheduled",
      expectedViews: "8.5K",
      confidenceScore: 87
    },
    {
      id: 3,
      title: "Tutorial Series Ep.3",
      platform: "TikTok",
      scheduledTime: "Friday 7:00 PM",
      status: "pending",
      expectedViews: "15K",
      confidenceScore: 95
    },
    {
      id: 4,
      title: "Industry Insights",
      platform: "LinkedIn",
      scheduledTime: "Next Thursday 10:00 AM",
      status: "draft",
      expectedViews: "4.2K",
      confidenceScore: 78
    }
  ];

  const automationRules = [
    {
      name: "Peak Performance Auto-Post",
      description: "Automatically post when audience engagement is highest",
      enabled: true,
      trigger: "AI detects optimal timing",
      action: "Auto-publish approved content"
    },
    {
      name: "Cross-Platform Sync",
      description: "Coordinate posting across multiple platforms",
      enabled: true,
      trigger: "Content approval",
      action: "Schedule on all selected platforms"
    },
    {
      name: "Trending Topic Alert",
      description: "Notify when trending topics match your niche",
      enabled: false,
      trigger: "Trend detection",
      action: "Send notification + content suggestions"
    },
    {
      name: "Performance-Based Optimization",
      description: "Adjust future scheduling based on past performance",
      enabled: true,
      trigger: "Weekly analytics review",
      action: "Update optimal timing recommendations"
    }
  ];

  const contentQueue = [
    { title: "How to Create Engaging Videos", type: "Tutorial", priority: "High", aiScore: 94 },
    { title: "Marketing Trends 2024", type: "Educational", priority: "Medium", aiScore: 87 },
    { title: "Customer Success Stories", type: "Testimonial", priority: "High", aiScore: 91 },
    { title: "Team Interview Series", type: "Behind the Scenes", priority: "Low", aiScore: 82 },
  ];

  const getStatusColor = (status: string) => {
    switch (status) {
      case "scheduled": return "bg-blue-100 text-blue-800";
      case "pending": return "bg-yellow-100 text-yellow-800";
      case "draft": return "bg-gray-100 text-gray-800";
      default: return "bg-gray-100 text-gray-800";
    }
  };

  const getPriorityColor = (priority: string) => {
    switch (priority) {
      case "High": return "text-red-600";
      case "Medium": return "text-orange-600";
      case "Low": return "text-green-600";
      default: return "text-gray-600";
    }
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-3">
          <Brain className="h-8 w-8 text-primary" />
          <div>
            <h2 className="text-3xl font-bold tracking-tight">Smart Scheduler</h2>
            <p className="text-muted-foreground">AI-powered content scheduling and automation</p>
          </div>
        </div>
        <div className="flex items-center gap-3">
          <div className="flex items-center gap-2">
            <Switch checked={autoSchedule} onCheckedChange={setAutoSchedule} />
            <span className="text-sm">Auto-schedule</span>
          </div>
          <Button>
            <Settings className="h-4 w-4 mr-2" />
            Settings
          </Button>
        </div>
      </div>

      <Tabs value={activeTab} onValueChange={setActiveTab}>
        <TabsList className="grid w-full grid-cols-4">
          <TabsTrigger value="schedule">Schedule</TabsTrigger>
          <TabsTrigger value="optimal">Optimal Times</TabsTrigger>
          <TabsTrigger value="automation">Automation</TabsTrigger>
          <TabsTrigger value="queue">Content Queue</TabsTrigger>
        </TabsList>

        <TabsContent value="schedule" className="space-y-6">
          <div className="grid gap-6 md:grid-cols-2">
            {/* Calendar */}
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <CalendarIcon className="h-5 w-5" />
                  Content Calendar
                </CardTitle>
                <CardDescription>Plan and visualize your content schedule</CardDescription>
              </CardHeader>
              <CardContent>
                <Calendar
                  mode="single"
                  selected={selectedDate}
                  onSelect={setSelectedDate}
                  className="rounded-md border"
                />
              </CardContent>
            </Card>

            {/* Scheduled Content */}
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Clock className="h-5 w-5" />
                  Scheduled Content
                </CardTitle>
                <CardDescription>Upcoming posts and their AI predictions</CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                {(realContent.length > 0 ? realContent : scheduledContent).map((content) => (
                  <div key={content.id} className="p-3 border rounded-lg">
                    <div className="flex items-start justify-between mb-2">
                      <div>
                        <h4 className="font-medium">{content.title}</h4>
                        <p className="text-sm text-muted-foreground">{content.platform}</p>
                      </div>
                      <Badge className={getStatusColor(content.status)}>
                        {content.status}
                      </Badge>
                    </div>
                    <div className="flex items-center justify-between text-sm">
                      <span className="text-muted-foreground">{content.scheduledTime}</span>
                      <div className="flex items-center gap-2">
                        <span className="text-green-600">{content.expectedViews} views</span>
                        <Badge variant="outline">{content.confidenceScore}% confidence</Badge>
                      </div>
                    </div>
                  </div>
                ))}
              </CardContent>
            </Card>
          </div>
        </TabsContent>

        <TabsContent value="optimal" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <TrendingUp className="h-5 w-5" />
                AI-Optimized Posting Times
              </CardTitle>
              <CardDescription>When your audience is most engaged across platforms</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="grid gap-4 md:grid-cols-2">
                {optimalTimes.map((time, index) => (
                  <div key={index} className="p-4 border rounded-lg">
                    <div className="flex items-center justify-between mb-3">
                      <div className="flex items-center gap-2">
                        <Globe className="h-5 w-5 text-primary" />
                        <h4 className="font-medium">{time.platform}</h4>
                      </div>
                      <Badge variant="default">{time.engagement}</Badge>
                    </div>
                    <div className="space-y-2">
                      <div className="flex items-center justify-between">
                        <span className="text-sm text-muted-foreground">Optimal Time</span>
                        <span className="font-medium">{time.day} {time.time}</span>
                      </div>
                      <div className="flex items-center justify-between">
                        <span className="text-sm text-muted-foreground">Active Audience</span>
                        <span className="font-medium">{time.audience}</span>
                      </div>
                    </div>
                    <Button size="sm" className="w-full mt-3">
                      Schedule for This Time
                    </Button>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="automation" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Zap className="h-5 w-5" />
                Automation Rules
              </CardTitle>
              <CardDescription>Configure intelligent automation for your content</CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              {automationRules.map((rule, index) => (
                <div key={index} className="p-4 border rounded-lg">
                  <div className="flex items-start justify-between mb-3">
                    <div>
                      <div className="flex items-center gap-2 mb-1">
                        <h4 className="font-medium">{rule.name}</h4>
                        <Switch checked={rule.enabled} />
                      </div>
                      <p className="text-sm text-muted-foreground">{rule.description}</p>
                    </div>
                  </div>
                  <div className="grid grid-cols-2 gap-4 mt-3 text-sm">
                    <div>
                      <span className="text-muted-foreground">Trigger:</span>
                      <p className="font-medium">{rule.trigger}</p>
                    </div>
                    <div>
                      <span className="text-muted-foreground">Action:</span>
                      <p className="font-medium">{rule.action}</p>
                    </div>
                  </div>
                </div>
              ))}
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="queue" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Target className="h-5 w-5" />
                Content Queue
              </CardTitle>
              <CardDescription>AI-prioritized content ready for scheduling</CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              {contentQueue.map((content, index) => (
                <div key={index} className="p-4 border rounded-lg">
                  <div className="flex items-center justify-between mb-2">
                    <div>
                      <h4 className="font-medium">{content.title}</h4>
                      <Badge variant="outline" className="text-xs">{content.type}</Badge>
                    </div>
                    <div className="flex items-center gap-2">
                      <span className={`text-sm font-medium ${getPriorityColor(content.priority)}`}>
                        {content.priority}
                      </span>
                      <Badge variant="secondary">AI Score: {content.aiScore}</Badge>
                    </div>
                  </div>
                  <div className="flex items-center gap-2">
                    <Button size="sm" variant="default">
                      <Play className="h-3 w-3 mr-1" />
                      Schedule Now
                    </Button>
                    <Button size="sm" variant="outline">
                      <SkipForward className="h-3 w-3 mr-1" />
                      Queue Next
                    </Button>
                  </div>
                </div>
              ))}
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
};