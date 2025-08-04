import { useState } from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Progress } from "@/components/ui/progress";
import { 
  Play, Download, Share2, Heart, Eye, MessageCircle, BarChart3, 
  TrendingUp, Users, Clock, Zap, Star, Crown, Calendar, Filter,
  Video, Image, FileText, Settings, Plus, Edit3, Trash2
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
  status: "completed" | "processing" | "draft";
  platform: string;
  isPublic: boolean;
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
  const [selectedFilter, setSelectedFilter] = useState("all");
  const [selectedTimeRange, setSelectedTimeRange] = useState("30d");

  const filteredProjects = mockProjects.filter(project => {
    if (selectedFilter === "all") return true;
    return project.status === selectedFilter;
  });

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
          onClick={() => window.location.href = "/#video-generator"}
        >
          <Plus className="h-4 w-4 mr-2" />
          Create New Video
        </Button>
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        <Card className="premium-card">
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-muted-foreground">Total Videos</p>
                <p className="text-2xl font-bold">{stats.totalVideos}</p>
              </div>
              <Video className="h-8 w-8 text-primary" />
            </div>
            <div className="mt-2 text-sm text-green-600">
              +12% from last month
            </div>
          </CardContent>
        </Card>

        <Card className="premium-card">
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-muted-foreground">Total Views</p>
                <p className="text-2xl font-bold">{stats.totalViews.toLocaleString()}</p>
              </div>
              <Eye className="h-8 w-8 text-primary" />
            </div>
            <div className="mt-2 text-sm text-green-600">
              +24% from last month
            </div>
          </CardContent>
        </Card>

        <Card className="premium-card">
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-muted-foreground">Engagement</p>
                <p className="text-2xl font-bold">{stats.avgEngagement}%</p>
              </div>
              <Heart className="h-8 w-8 text-primary" />
            </div>
            <div className="mt-2 text-sm text-green-600">
              +3.2% from last month
            </div>
          </CardContent>
        </Card>

        <Card className="premium-card">
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-muted-foreground">Credits Used</p>
                <p className="text-2xl font-bold">{stats.creditsUsed}/{stats.creditsTotal}</p>
              </div>
              <Zap className="h-8 w-8 text-primary" />
            </div>
            <div className="mt-2">
              <Progress value={(stats.creditsUsed / stats.creditsTotal) * 100} className="h-2" />
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Main Content */}
      <Tabs defaultValue="projects" className="space-y-6">
        <TabsList className="grid w-full grid-cols-3 lg:w-96">
          <TabsTrigger value="projects">My Projects</TabsTrigger>
          <TabsTrigger value="analytics">Analytics</TabsTrigger>
          <TabsTrigger value="brand">Brand Kit</TabsTrigger>
        </TabsList>

        <TabsContent value="projects" className="space-y-6">
          {/* Filters */}
          <div className="flex flex-col sm:flex-row gap-4">
            <Select value={selectedFilter} onValueChange={setSelectedFilter}>
              <SelectTrigger className="w-48">
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All Projects</SelectItem>
                <SelectItem value="completed">Completed</SelectItem>
                <SelectItem value="processing">Processing</SelectItem>
                <SelectItem value="draft">Drafts</SelectItem>
              </SelectContent>
            </Select>

            <Select value={selectedTimeRange} onValueChange={setSelectedTimeRange}>
              <SelectTrigger className="w-36">
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

          {/* Projects Grid */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {filteredProjects.map((project) => (
              <Card key={project.id} className="premium-card group">
                <div className="relative">
                  <div className="aspect-video bg-gradient-to-br from-primary/20 to-secondary/20 rounded-t-lg flex items-center justify-center">
                    <Play className="h-12 w-12 text-primary/70 group-hover:scale-110 transition-transform" />
                  </div>
                  <Badge 
                    className={`absolute top-2 right-2 ${
                      project.status === 'completed' ? 'bg-green-500' :
                      project.status === 'processing' ? 'bg-yellow-500' :
                      'bg-gray-500'
                    }`}
                  >
                    {project.status}
                  </Badge>
                  {project.isPublic && (
                    <Badge className="absolute top-2 left-2 bg-blue-500">
                      Public
                    </Badge>
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
                  </div>

                  <div className="flex gap-2">
                    <Button variant="outline" size="sm" className="flex-1">
                      <Edit3 className="h-4 w-4 mr-1" />
                      Edit
                    </Button>
                    <Button variant="outline" size="sm" className="flex-1">
                      <Share2 className="h-4 w-4 mr-1" />
                      Share
                    </Button>
                    <Button variant="outline" size="sm">
                      <Download className="h-4 w-4" />
                    </Button>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        </TabsContent>

        <TabsContent value="analytics" className="space-y-6">
          <Card className="premium-card">
            <CardHeader>
              <CardTitle>Performance Analytics</CardTitle>
              <CardDescription>Track your video performance over time</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="h-80 bg-gradient-to-br from-primary/5 to-secondary/5 rounded-lg flex items-center justify-center">
                <div className="text-center">
                  <BarChart3 className="h-16 w-16 text-primary/50 mx-auto mb-4" />
                  <p className="text-muted-foreground">Analytics dashboard coming soon</p>
                </div>
              </div>
            </CardContent>
          </Card>
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