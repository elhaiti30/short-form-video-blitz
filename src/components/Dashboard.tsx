import { useState, useEffect } from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Progress } from "@/components/ui/progress";
import { Input } from "@/components/ui/input";
import { Checkbox } from "@/components/ui/checkbox";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { supabase } from "@/integrations/supabase/client";
import { useAuth } from "@/hooks/useAuth";
import { useVideoData } from "@/hooks/useVideoData";
import { toast } from "@/hooks/use-toast";
import { 
  Play, Download, Share2, Heart, Eye, MessageCircle, BarChart3, 
  TrendingUp, Users, Clock, Zap, Star, Crown, Calendar, Filter,
  Video, Image, FileText, Settings, Plus, Edit3, Trash2, Search,
  MoreHorizontal, Activity, Target, Sparkles, Bell, Copy, Archive,
  RefreshCw, Upload, ChevronDown, AlertCircle, CheckCircle2, Brain
} from "lucide-react";

interface VideoProject {
  id: string;
  title: string;
  description: string;
  thumbnail: string;
  duration: number;
  views: number;
  likes: number;
  comments: number;
  createdAt: string;
  status: "completed" | "processing" | "draft" | "failed";
  platform: string;
  isPublic: boolean;
  progress?: number;
  estimatedCompletion?: string;
}

interface ActivityItem {
  id: string;
  type: 'video_created' | 'video_completed' | 'video_shared' | 'template_used';
  title: string;
  description: string;
  timestamp: string;
  icon: 'video' | 'check' | 'share' | 'template';
}

interface DashboardStats {
  totalVideos: number;
  totalViews: number;
  totalLikes: number;
  avgEngagement: number;
  creditsUsed: number;
  creditsTotal: number;
}

const mockProjects: VideoProject[] = [
  {
    id: "1",
    title: "10 Morning Habits That Changed My Life",
    description: "A motivational video about productivity and wellness",
    thumbnail: "/api/placeholder/300/200",
    duration: 45,
    views: 12500,
    likes: 890,
    comments: 67,
    createdAt: "2024-01-15",
    status: "completed",
    platform: "tiktok",
    isPublic: true
  },
  {
    id: "2",
    title: "Quick Healthy Breakfast Recipe",
    description: "Fast and nutritious breakfast in under 5 minutes",
    thumbnail: "/api/placeholder/300/200",
    duration: 30,
    views: 8900,
    likes: 670,
    comments: 45,
    createdAt: "2024-01-12",
    status: "completed",
    platform: "instagram",
    isPublic: true
  },
  {
    id: "3",
    title: "Tech Review: Latest AI Tools",
    description: "Reviewing the newest AI productivity tools",
    thumbnail: "/api/placeholder/300/200",
    duration: 60,
    views: 0,
    likes: 0,
    comments: 0,
    createdAt: "2024-01-18",
    status: "processing",
    platform: "youtube",
    isPublic: false
  }
];

const stats: DashboardStats = {
  totalVideos: 24,
  totalViews: 156800,
  totalLikes: 12400,
  avgEngagement: 8.2,
  creditsUsed: 450,
  creditsTotal: 1000
};

export const Dashboard = () => {
  const { user } = useAuth();
  const { projects, loading: dataLoading, updateProject, deleteProject } = useVideoData();
  const [selectedFilter, setSelectedFilter] = useState("all");
  const [selectedTimeRange, setSelectedTimeRange] = useState("30d");
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedProjects, setSelectedProjects] = useState<string[]>([]);
  const [realStats, setRealStats] = useState(stats);
  const [recentActivity, setRecentActivity] = useState<ActivityItem[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const generateMockActivity = () => {
      const activities: ActivityItem[] = [
        {
          id: '1',
          type: 'video_completed',
          title: 'Video "Morning Routine Tips" completed',
          description: 'Your video has been processed and is ready to download',
          timestamp: '2 minutes ago',
          icon: 'check'
        },
        {
          id: '2',
          type: 'video_created',
          title: 'New project "Product Demo" started',
          description: 'Video generation is in progress (45% complete)',
          timestamp: '15 minutes ago',
          icon: 'video'
        },
        {
          id: '3',
          type: 'template_used',
          title: 'Corporate Overview template used',
          description: 'Template applied to new project successfully',
          timestamp: '1 hour ago',
          icon: 'template'
        },
        {
          id: '4',
          type: 'video_shared',
          title: 'Video shared to LinkedIn',
          description: '"10 Productivity Hacks" posted to your LinkedIn profile',
          timestamp: '3 hours ago',
          icon: 'share'
        }
      ];
      setRecentActivity(activities);
    };

    // Convert projects data to VideoProject format
    const convertedProjects: VideoProject[] = projects.map(project => ({
      id: project.id,
      title: project.project_name,
    description: project.script_content?.substring(0, 100) + "..." || "No description",
    thumbnail: "",
      duration: 30,
      views: Math.floor(Math.random() * 10000),
      likes: Math.floor(Math.random() * 1000),
      comments: Math.floor(Math.random() * 100),
      createdAt: project.created_at,
      status: project.generation_status === "completed" ? "completed" : 
               project.generation_status === "processing" ? "processing" : 
               project.generation_status === "failed" ? "failed" : "draft",
      platform: "youtube",
      isPublic: false,
      progress: project.generation_progress,
      estimatedCompletion: project.generation_status === "processing" ? "5 minutes" : undefined
    }));

    // Update stats
    setRealStats({
      totalVideos: convertedProjects.length,
      totalViews: convertedProjects.reduce((sum, p) => sum + p.views, 0),
      totalLikes: convertedProjects.reduce((sum, p) => sum + p.likes, 0),
      avgEngagement: convertedProjects.length > 0 ? 
        (convertedProjects.reduce((sum, p) => sum + p.likes, 0) / 
         Math.max(convertedProjects.reduce((sum, p) => sum + p.views, 0), 1) * 100) : 0,
      creditsUsed: convertedProjects.length * 15,
      creditsTotal: 1000
    });

    generateMockActivity();
    setLoading(dataLoading);
  }, [projects, dataLoading]);

  const projectsToShow: VideoProject[] = projects.map(project => ({
    id: project.id,
    title: project.project_name,
    description: project.script_content?.substring(0, 100) + "..." || "No description",
    thumbnail: "",
    duration: 30,
    views: Math.floor(Math.random() * 10000),
    likes: Math.floor(Math.random() * 1000),
    comments: Math.floor(Math.random() * 100),
    createdAt: project.created_at,
    status: project.generation_status === "completed" ? "completed" : 
             project.generation_status === "processing" ? "processing" : 
             project.generation_status === "failed" ? "failed" : "draft",
    platform: "youtube",
    isPublic: false,
    progress: project.generation_progress
  }));

  const filteredProjects = projectsToShow.filter(project => {
    const matchesFilter = selectedFilter === "all" || project.status === selectedFilter;
    const matchesSearch = searchQuery === "" || 
      project.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
      project.description.toLowerCase().includes(searchQuery.toLowerCase());
    return matchesFilter && matchesSearch;
  });

  const handleBulkAction = (action: string) => {
    if (selectedProjects.length === 0) {
      toast({
        title: "No projects selected",
        description: "Please select projects to perform bulk actions",
        variant: "destructive"
      });
      return;
    }

    switch (action) {
      case 'delete':
        selectedProjects.forEach(projectId => deleteProject(projectId));
        setSelectedProjects([]);
        toast({
          title: "Projects deleted",
          description: `${selectedProjects.length} projects have been deleted`
        });
        break;
      case 'archive':
        toast({
          title: "Projects archived",
          description: `${selectedProjects.length} projects have been archived`
        });
        setSelectedProjects([]);
        break;
    }
  };

  const toggleProjectSelection = (projectId: string) => {
    setSelectedProjects(prev => 
      prev.includes(projectId) 
        ? prev.filter(id => id !== projectId)
        : [...prev, projectId]
    );
  };

  return (
    <div className="space-y-8">
      {/* Header */}
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <div>
          <h1 className="text-3xl font-bold gradient-text">Dashboard</h1>
          <p className="text-muted-foreground mt-1">Manage your video projects and track performance</p>
        </div>
        <Button 
          className="premium-button"
          onClick={() => {
            const generatorTab = document.querySelector('[data-value="generator"]') as HTMLElement;
            if (generatorTab) generatorTab.click();
          }}
        >
          <Plus className="h-4 w-4 mr-2" />
          Create New Video
        </Button>
      </div>

      {/* Quick Stats & Activity Row */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Stats Cards */}
        <div className="lg:col-span-2 grid grid-cols-1 md:grid-cols-2 gap-6">
          <Card className="premium-card">
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-muted-foreground">Total Videos</p>
                  <p className="text-2xl font-bold">{realStats.totalVideos}</p>
                </div>
                <Video className="h-8 w-8 text-primary" />
              </div>
              <div className="mt-2 text-sm text-green-600 flex items-center">
                <TrendingUp className="h-3 w-3 mr-1" />
                +12% from last month
              </div>
            </CardContent>
          </Card>

          <Card className="premium-card">
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-muted-foreground">Total Views</p>
                  <p className="text-2xl font-bold">{realStats.totalViews.toLocaleString()}</p>
                </div>
                <Eye className="h-8 w-8 text-primary" />
              </div>
              <div className="mt-2 text-sm text-green-600 flex items-center">
                <TrendingUp className="h-3 w-3 mr-1" />
                +24% from last month
              </div>
            </CardContent>
          </Card>

          <Card className="premium-card">
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-muted-foreground">Engagement Rate</p>
                  <p className="text-2xl font-bold">{realStats.avgEngagement.toFixed(1)}%</p>
                </div>
                <Heart className="h-8 w-8 text-primary" />
              </div>
              <div className="mt-2 text-sm text-green-600 flex items-center">
                <TrendingUp className="h-3 w-3 mr-1" />
                +3.2% from last month
              </div>
            </CardContent>
          </Card>

          <Card className="premium-card">
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-muted-foreground">Credits Used</p>
                  <p className="text-2xl font-bold">{realStats.creditsUsed}/{realStats.creditsTotal}</p>
                </div>
                <Zap className="h-8 w-8 text-primary" />
              </div>
              <div className="mt-2">
                <Progress value={(realStats.creditsUsed / realStats.creditsTotal) * 100} className="h-2" />
                <p className="text-xs text-muted-foreground mt-1">
                  {realStats.creditsTotal - realStats.creditsUsed} credits remaining
                </p>
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Recent Activity */}
        <Card className="premium-card">
          <CardHeader className="pb-3">
            <CardTitle className="flex items-center gap-2 text-lg">
              <Activity className="h-5 w-5" />
              Recent Activity
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-3">
            {recentActivity.map((activity) => (
              <div key={activity.id} className="flex items-start gap-3 p-2 hover:bg-muted/50 rounded-lg transition-colors">
                <div className="mt-1">
                  {activity.icon === 'check' && <CheckCircle2 className="h-4 w-4 text-green-500" />}
                  {activity.icon === 'video' && <Video className="h-4 w-4 text-blue-500" />}
                  {activity.icon === 'share' && <Share2 className="h-4 w-4 text-purple-500" />}
                  {activity.icon === 'template' && <Sparkles className="h-4 w-4 text-orange-500" />}
                </div>
                <div className="flex-1 min-w-0">
                  <p className="text-sm font-medium truncate">{activity.title}</p>
                  <p className="text-xs text-muted-foreground">{activity.description}</p>
                  <p className="text-xs text-muted-foreground mt-1">{activity.timestamp}</p>
                </div>
              </div>
            ))}
            <Button variant="ghost" size="sm" className="w-full mt-3">
              View All Activity
            </Button>
          </CardContent>
        </Card>
      </div>

      {/* Main Content */}
      <Tabs defaultValue="projects" className="space-y-6">
        <TabsList className="grid w-full grid-cols-4 lg:w-[500px]">
          <TabsTrigger value="projects">My Projects</TabsTrigger>
          <TabsTrigger value="analytics">Analytics</TabsTrigger>
          <TabsTrigger value="insights">AI Insights</TabsTrigger>
          <TabsTrigger value="brand">Brand Kit</TabsTrigger>
        </TabsList>

        <TabsContent value="projects" className="space-y-6">
          {/* Enhanced Filters & Search */}
          <div className="flex flex-col lg:flex-row gap-4 items-start lg:items-center justify-between">
            <div className="flex flex-col sm:flex-row gap-4 flex-1">
              <div className="relative flex-1 max-w-md">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                <Input
                  placeholder="Search projects..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="pl-10"
                />
              </div>
              
              <Select value={selectedFilter} onValueChange={setSelectedFilter}>
                <SelectTrigger className="w-48">
                  <Filter className="h-4 w-4 mr-2" />
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">All Projects</SelectItem>
                  <SelectItem value="completed">Completed</SelectItem>
                  <SelectItem value="processing">Processing</SelectItem>
                  <SelectItem value="draft">Drafts</SelectItem>
                  <SelectItem value="failed">Failed</SelectItem>
                </SelectContent>
              </Select>

              <Select value={selectedTimeRange} onValueChange={setSelectedTimeRange}>
                <SelectTrigger className="w-36">
                  <Calendar className="h-4 w-4 mr-2" />
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="7d">Last 7 days</SelectItem>
                  <SelectItem value="30d">Last 30 days</SelectItem>
                  <SelectItem value="90d">Last 3 months</SelectItem>
                  <SelectItem value="1y">Last year</SelectItem>
                </SelectContent>
              </Select>
            </div>

            {/* Bulk Actions */}
            {selectedProjects.length > 0 && (
              <div className="flex gap-2">
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => handleBulkAction('archive')}
                >
                  <Archive className="h-4 w-4 mr-1" />
                  Archive ({selectedProjects.length})
                </Button>
                <Button
                  variant="destructive"
                  size="sm"
                  onClick={() => handleBulkAction('delete')}
                >
                  <Trash2 className="h-4 w-4 mr-1" />
                  Delete ({selectedProjects.length})
                </Button>
              </div>
            )}
          </div>

          {/* Project Stats */}
          {filteredProjects.length > 0 && (
            <div className="flex items-center gap-6 text-sm text-muted-foreground">
              <span>{filteredProjects.length} projects</span>
              <span>{filteredProjects.filter(p => p.status === 'completed').length} completed</span>
              <span>{filteredProjects.filter(p => p.status === 'processing').length} in progress</span>
              <span>{filteredProjects.filter(p => p.status === 'draft').length} drafts</span>
            </div>
          )}

          {/* Projects Grid */}
          {filteredProjects.length === 0 ? (
            <Card className="premium-card">
              <CardContent className="p-12 text-center">
                <Video className="h-16 w-16 text-muted-foreground mx-auto mb-4" />
                <h3 className="text-lg font-semibold mb-2">No projects found</h3>
                <p className="text-muted-foreground mb-6">
                  {searchQuery ? "Try adjusting your search terms" : "Create your first video project to get started"}
                </p>
                <Button 
                  className="premium-button"
                  onClick={() => window.location.href = "/#video-generator"}
                >
                  <Plus className="h-4 w-4 mr-2" />
                  Create New Video
                </Button>
              </CardContent>
            </Card>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {filteredProjects.map((project) => (
                <Card key={project.id} className="premium-card group">
                  <div className="relative">
                    <div className="aspect-video bg-gradient-to-br from-primary/20 to-secondary/20 rounded-t-lg flex items-center justify-center">
                      <Play className="h-12 w-12 text-primary/70 group-hover:scale-110 transition-transform" />
                    </div>
                    
                    {/* Project Status & Selection */}
                    <div className="absolute top-2 left-2 flex items-center gap-2">
                      <Checkbox
                        checked={selectedProjects.includes(project.id)}
                        onCheckedChange={() => toggleProjectSelection(project.id)}
                        className="bg-white/90 border-white/90"
                      />
                    </div>

                    <div className="absolute top-2 right-2 flex items-center gap-2">
                      <Badge 
                        className={`${
                          project.status === 'completed' ? 'bg-green-500' :
                          project.status === 'processing' ? 'bg-yellow-500' :
                          project.status === 'failed' ? 'bg-red-500' :
                          'bg-gray-500'
                        }`}
                      >
                        {project.status === 'processing' && project.progress ? (
                          <span className="flex items-center gap-1">
                            <RefreshCw className="h-3 w-3 animate-spin" />
                            {project.progress}%
                          </span>
                        ) : (
                          project.status
                        )}
                      </Badge>
                      {project.isPublic && (
                        <Badge className="bg-blue-500">
                          Public
                        </Badge>
                      )}
                    </div>

                    {/* Processing Progress */}
                    {project.status === 'processing' && project.progress && (
                      <div className="absolute bottom-0 left-0 right-0 bg-black/50 p-2 rounded-b-t-lg">
                        <Progress value={project.progress} className="h-1" />
                        <p className="text-xs text-white mt-1">
                          Processing... ETA: {project.estimatedCompletion}
                        </p>
                      </div>
                    )}
                  </div>

                  <CardContent className="p-4 space-y-3">
                    <div>
                      <h3 className="font-semibold text-lg group-hover:text-primary transition-colors line-clamp-1">
                        {project.title}
                      </h3>
                      <p className="text-sm text-muted-foreground line-clamp-2">
                        {project.description}
                      </p>
                    </div>

                    {/* Project Metrics */}
                    <div className="flex items-center justify-between text-sm text-muted-foreground">
                      <div className="flex items-center gap-3">
                        <div className="flex items-center gap-1">
                          <Eye className="h-4 w-4" />
                          {project.views.toLocaleString()}
                        </div>
                        <div className="flex items-center gap-1">
                          <Heart className="h-4 w-4" />
                          {project.likes.toLocaleString()}
                        </div>
                        <div className="flex items-center gap-1">
                          <Clock className="h-4 w-4" />
                          {project.duration}s
                        </div>
                      </div>
                      <Badge variant="outline" className="text-xs">
                        {project.platform}
                      </Badge>
                    </div>

                    {/* Project Actions */}
                    <div className="flex gap-2">
                      <Button 
                        variant="outline" 
                        size="sm" 
                        className="flex-1"
                        disabled={project.status === 'processing'}
                      >
                        <Edit3 className="h-4 w-4 mr-1" />
                        Edit
                      </Button>
                      <Button 
                        variant="outline" 
                        size="sm" 
                        className="flex-1"
                        disabled={project.status !== 'completed'}
                      >
                        <Share2 className="h-4 w-4 mr-1" />
                        Share
                      </Button>
                      <Button 
                        variant="outline" 
                        size="sm"
                        disabled={project.status !== 'completed'}
                      >
                        <Download className="h-4 w-4" />
                      </Button>
                      <Button variant="ghost" size="sm">
                        <MoreHorizontal className="h-4 w-4" />
                      </Button>
                    </div>

                    {/* Error State */}
                    {project.status === 'failed' && (
                      <Alert className="border-red-200 bg-red-50 text-red-800">
                        <AlertCircle className="h-4 w-4" />
                        <AlertDescription className="text-xs">
                          Video generation failed. Click to retry.
                        </AlertDescription>
                      </Alert>
                    )}
                  </CardContent>
                </Card>
              ))}
            </div>
          )}
        </TabsContent>

        <TabsContent value="analytics" className="space-y-6">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            <Card className="premium-card">
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <BarChart3 className="h-5 w-5" />
                  Performance Overview
                </CardTitle>
                <CardDescription>Key metrics for your video content</CardDescription>
              </CardHeader>
              <CardContent className="space-y-6">
                <div className="grid grid-cols-2 gap-4">
                  <div className="text-center p-4 bg-gradient-to-br from-blue-500/10 to-blue-600/10 rounded-lg">
                    <p className="text-2xl font-bold text-blue-600">{realStats.totalViews.toLocaleString()}</p>
                    <p className="text-sm text-muted-foreground">Total Views</p>
                  </div>
                  <div className="text-center p-4 bg-gradient-to-br from-green-500/10 to-green-600/10 rounded-lg">
                    <p className="text-2xl font-bold text-green-600">{realStats.avgEngagement.toFixed(1)}%</p>
                    <p className="text-sm text-muted-foreground">Avg. Engagement</p>
                  </div>
                  <div className="text-center p-4 bg-gradient-to-br from-purple-500/10 to-purple-600/10 rounded-lg">
                    <p className="text-2xl font-bold text-purple-600">{realStats.totalLikes.toLocaleString()}</p>
                    <p className="text-sm text-muted-foreground">Total Likes</p>
                  </div>
                  <div className="text-center p-4 bg-gradient-to-br from-orange-500/10 to-orange-600/10 rounded-lg">
                    <p className="text-2xl font-bold text-orange-600">{Math.round(realStats.totalViews / Math.max(realStats.totalVideos, 1)).toLocaleString()}</p>
                    <p className="text-sm text-muted-foreground">Avg. per Video</p>
                  </div>
                </div>
              </CardContent>
            </Card>

            <Card className="premium-card">
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Target className="h-5 w-5" />
                  Platform Performance
                </CardTitle>
                <CardDescription>Views breakdown by platform</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  {['YouTube', 'TikTok', 'Instagram', 'LinkedIn'].map((platform, index) => {
                    const percentage = [45, 30, 20, 5][index];
                    const views = Math.round((realStats.totalViews * percentage) / 100);
                    return (
                      <div key={platform} className="space-y-2">
                        <div className="flex justify-between text-sm">
                          <span className="font-medium">{platform}</span>
                          <span className="text-muted-foreground">{views.toLocaleString()} views</span>
                        </div>
                        <Progress value={percentage} className="h-2" />
                      </div>
                    );
                  })}
                </div>
              </CardContent>
            </Card>
          </div>

          <Card className="premium-card">
            <CardHeader>
              <CardTitle>Video Performance Trends</CardTitle>
              <CardDescription>Track your content performance over time</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="h-80 bg-gradient-to-br from-primary/5 to-secondary/5 rounded-lg flex items-center justify-center">
                <div className="text-center">
                  <BarChart3 className="h-16 w-16 text-primary/50 mx-auto mb-4" />
                  <p className="text-muted-foreground mb-2">Detailed analytics coming soon</p>
                  <p className="text-sm text-muted-foreground">Track views, engagement, and revenue over time</p>
                </div>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="insights" className="space-y-6">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            <Card className="premium-card">
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Brain className="h-5 w-5" />
                  AI Recommendations
                </CardTitle>
                <CardDescription>Personalized suggestions to improve your content</CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="flex items-start gap-3 p-3 bg-blue-500/10 rounded-lg">
                  <Sparkles className="h-5 w-5 text-blue-500 mt-0.5" />
                  <div>
                    <p className="font-medium text-sm">Optimize Upload Times</p>
                    <p className="text-xs text-muted-foreground">Your audience is most active at 2-4 PM. Consider scheduling uploads during this time.</p>
                  </div>
                </div>
                <div className="flex items-start gap-3 p-3 bg-green-500/10 rounded-lg">
                  <Target className="h-5 w-5 text-green-500 mt-0.5" />
                  <div>
                    <p className="font-medium text-sm">Trending Topics</p>
                    <p className="text-xs text-muted-foreground">AI productivity tools are trending. Create content about workflow automation.</p>
                  </div>
                </div>
                <div className="flex items-start gap-3 p-3 bg-purple-500/10 rounded-lg">
                  <TrendingUp className="h-5 w-5 text-purple-500 mt-0.5" />
                  <div>
                    <p className="font-medium text-sm">Engagement Boost</p>
                    <p className="text-xs text-muted-foreground">Videos with captions get 40% more engagement. Enable auto-captions for better reach.</p>
                  </div>
                </div>
              </CardContent>
            </Card>

            <Card className="premium-card">
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Bell className="h-5 w-5" />
                  Performance Alerts
                </CardTitle>
                <CardDescription>Important notifications about your content</CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <Alert className="border-green-200 bg-green-50">
                  <CheckCircle2 className="h-4 w-4 text-green-600" />
                  <AlertDescription className="text-green-800">
                    Your latest video "Morning Routine Tips" is performing 150% above average!
                  </AlertDescription>
                </Alert>
                <Alert className="border-yellow-200 bg-yellow-50">
                  <AlertCircle className="h-4 w-4 text-yellow-600" />
                  <AlertDescription className="text-yellow-800">
                    You're approaching your monthly credit limit (450/1000 used).
                  </AlertDescription>
                </Alert>
                <Alert className="border-blue-200 bg-blue-50">
                  <Sparkles className="h-4 w-4 text-blue-600" />
                  <AlertDescription className="text-blue-800">
                    New template "Corporate Overview" matches your content style. Try it now!
                  </AlertDescription>
                </Alert>
              </CardContent>
            </Card>
          </div>
        </TabsContent>

        <TabsContent value="brand" className="space-y-6">
          <Card className="premium-card">
            <CardHeader>
              <CardTitle>Brand Kit</CardTitle>
              <CardDescription>Manage your brand colors, fonts, and assets</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                <Card className="p-4">
                  <h3 className="font-semibold mb-3">Brand Colors</h3>
                  <div className="grid grid-cols-5 gap-2">
                    {['#3B82F6', '#EF4444', '#10B981', '#F59E0B', '#8B5CF6'].map((color) => (
                      <div
                        key={color}
                        className="aspect-square rounded-lg border-2 border-gray-200"
                        style={{ backgroundColor: color }}
                      />
                    ))}
                  </div>
                  <Button variant="outline" size="sm" className="w-full mt-3">
                    <Plus className="h-4 w-4 mr-1" />
                    Add Color
                  </Button>
                </Card>

                <Card className="p-4">
                  <h3 className="font-semibold mb-3">Fonts</h3>
                  <div className="space-y-2">
                    <div className="p-2 border rounded text-center font-bold">Inter</div>
                    <div className="p-2 border rounded text-center font-serif">Georgia</div>
                  </div>
                  <Button variant="outline" size="sm" className="w-full mt-3">
                    <Plus className="h-4 w-4 mr-1" />
                    Add Font
                  </Button>
                </Card>

                <Card className="p-4">
                  <h3 className="font-semibold mb-3">Logos & Assets</h3>
                  <div className="space-y-2">
                    <div className="aspect-video bg-gray-100 rounded flex items-center justify-center">
                      <Image className="h-8 w-8 text-gray-400" />
                    </div>
                  </div>
                  <Button variant="outline" size="sm" className="w-full mt-3">
                    <Plus className="h-4 w-4 mr-1" />
                    Upload Asset
                  </Button>
                </Card>
              </div>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
};