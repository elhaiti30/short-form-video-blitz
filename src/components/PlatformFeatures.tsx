import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Smartphone, MonitorPlay, Camera, Users, Hash, Music } from "lucide-react";

const PlatformFeatures = () => {
  const platforms = [
    {
      name: "TikTok",
      icon: Smartphone,
      description: "Optimized for TikTok's algorithm and trending content",
      features: ["Vertical 9:16 format", "15-60s duration", "Trending sounds", "Auto hashtags"],
      color: "from-pink-500 to-red-500",
      stats: { users: "1B+", engagement: "18%" }
    },
    {
      name: "Instagram Reels",
      icon: Camera,
      description: "Perfect for Instagram's visual storytelling platform",
      features: ["Square & vertical formats", "Visual effects", "Music integration", "Story sync"],
      color: "from-purple-500 to-pink-500",
      stats: { users: "2B+", engagement: "22%" }
    },
    {
      name: "YouTube Shorts",
      icon: MonitorPlay,
      description: "Built for YouTube's growing short-form content",
      features: ["YouTube algorithm", "Long-term discovery", "Monetization ready", "Analytics"],
      color: "from-red-500 to-orange-500",
      stats: { users: "2.7B+", engagement: "15%" }
    }
  ];

  const features = [
    {
      icon: Hash,
      title: "Smart Hashtags",
      description: "AI-generated hashtags optimized for each platform's algorithm"
    },
    {
      icon: Music,
      title: "Trending Audio",
      description: "Access to royalty-free music and trending sound effects"
    },
    {
      icon: Users,
      title: "Audience Insights",
      description: "Understand what content performs best for your audience"
    }
  ];

  return (
    <section className="py-20 px-6">
      <div className="max-w-7xl mx-auto space-y-16">
        {/* Header */}
        <div className="text-center space-y-4">
          <h2 className="text-4xl md:text-5xl font-bold text-gradient">
            Optimized for Every Platform
          </h2>
          <p className="text-xl text-muted-foreground max-w-3xl mx-auto">
            Our AI understands the unique requirements and best practices for each social media platform
          </p>
        </div>

        {/* Platform Cards */}
        <div className="grid md:grid-cols-3 gap-8">
          {platforms.map((platform, index) => {
            const Icon = platform.icon;
            return (
              <Card key={index} className="card-glow relative overflow-hidden">
                <div className={`absolute inset-0 bg-gradient-to-br ${platform.color} opacity-5`} />
                <CardHeader className="relative">
                  <div className="flex items-center gap-3 mb-2">
                    <div className={`h-10 w-10 rounded-lg bg-gradient-to-br ${platform.color} flex items-center justify-center`}>
                      <Icon className="h-5 w-5 text-white" />
                    </div>
                    <CardTitle className="text-xl">{platform.name}</CardTitle>
                  </div>
                  <CardDescription className="text-base">
                    {platform.description}
                  </CardDescription>
                </CardHeader>
                <CardContent className="relative space-y-6">
                  {/* Platform Stats */}
                  <div className="flex gap-4">
                    <div className="text-center">
                      <div className="text-lg font-bold text-gradient">{platform.stats.users}</div>
                      <div className="text-xs text-muted-foreground">Users</div>
                    </div>
                    <div className="text-center">
                      <div className="text-lg font-bold text-gradient">{platform.stats.engagement}</div>
                      <div className="text-xs text-muted-foreground">Engagement</div>
                    </div>
                  </div>

                  {/* Features */}
                  <div className="space-y-2">
                    <h4 className="text-sm font-medium text-muted-foreground uppercase tracking-wide">
                      Features
                    </h4>
                    <div className="flex flex-wrap gap-2">
                      {platform.features.map((feature, idx) => (
                        <Badge key={idx} variant="secondary" className="text-xs">
                          {feature}
                        </Badge>
                      ))}
                    </div>
                  </div>
                </CardContent>
              </Card>
            );
          })}
        </div>

        {/* Additional Features */}
        <div className="grid md:grid-cols-3 gap-8 mt-16">
          {features.map((feature, index) => {
            const Icon = feature.icon;
            return (
              <div key={index} className="text-center space-y-4">
                <div className="h-16 w-16 mx-auto rounded-full bg-primary/10 flex items-center justify-center">
                  <Icon className="h-8 w-8 text-primary" />
                </div>
                <h3 className="text-xl font-semibold">{feature.title}</h3>
                <p className="text-muted-foreground">{feature.description}</p>
              </div>
            );
          })}
        </div>
      </div>
    </section>
  );
};

export default PlatformFeatures;