import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { ArrowRight, Sparkles, Video, Zap, TrendingUp } from "lucide-react";
import heroImage from "@/assets/hero-video-ai.jpg";

const Hero = () => {
  const scrollToGenerator = () => {
    document.getElementById('video-generator')?.scrollIntoView({ behavior: 'smooth' });
  };

  const stats = [
    { icon: Video, label: "Videos Generated", value: "100K+" },
    { icon: Zap, label: "Avg Generation Time", value: "30s" },
    { icon: TrendingUp, label: "Success Rate", value: "99%" },
  ];

  return (
    <section className="relative min-h-screen flex items-center justify-center overflow-hidden">
      {/* Background */}
      <div className="absolute inset-0 bg-gradient-to-br from-background via-background to-card" />
      
      {/* Hero image with overlay */}
      <div className="absolute inset-0 opacity-20">
        <img 
          src={heroImage} 
          alt="AI Video Studio" 
          className="w-full h-full object-cover"
        />
        <div className="absolute inset-0 bg-gradient-to-t from-background via-background/50 to-transparent" />
      </div>

      {/* Content */}
      <div className="relative z-10 max-w-7xl mx-auto px-6 py-20 text-center space-y-12">
        {/* Badge */}
        <div className="animate-slide-up">
          <Badge variant="secondary" className="px-4 py-2 text-sm font-medium border-primary/20">
            <Sparkles className="h-4 w-4 mr-2" />
            AI-Powered Video Creation
          </Badge>
        </div>

        {/* Headline */}
        <div className="space-y-6 animate-slide-up" style={{ animationDelay: "0.1s" }}>
          <h1 className="text-5xl md:text-7xl font-bold leading-tight">
            Create Viral{" "}
            <span className="text-gradient">Short Videos</span>
            <br />
            with AI Magic
          </h1>
          <p className="text-xl md:text-2xl text-muted-foreground max-w-3xl mx-auto leading-relaxed">
            Transform your ideas into engaging TikTok, Instagram Reels, and YouTube Shorts 
            in seconds. No editing skills required.
          </p>
        </div>

        {/* CTA Buttons */}
        <div className="flex flex-col sm:flex-row gap-4 justify-center items-center animate-slide-up" style={{ animationDelay: "0.2s" }}>
          <Button 
            onClick={scrollToGenerator}
            variant="ai" 
            size="lg" 
            className="px-8 py-6 text-lg h-auto animate-glow"
          >
            Start Creating
            <ArrowRight className="h-5 w-5 ml-2" />
          </Button>
          <Button 
            variant="ai-outline" 
            size="lg" 
            className="px-8 py-6 text-lg h-auto"
          >
            Watch Demo
            <Video className="h-5 w-5 ml-2" />
          </Button>
        </div>

        {/* Stats */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8 mt-16 animate-slide-up" style={{ animationDelay: "0.3s" }}>
          {stats.map((stat, index) => {
            const Icon = stat.icon;
            return (
              <div 
                key={index} 
                className="bg-card/50 backdrop-blur-sm border border-primary/10 rounded-xl p-6 hover:border-primary/20 transition-all duration-300"
              >
                <div className="flex items-center justify-center mb-4">
                  <div className="h-12 w-12 rounded-full bg-primary/10 flex items-center justify-center">
                    <Icon className="h-6 w-6 text-primary" />
                  </div>
                </div>
                <div className="text-2xl font-bold text-gradient mb-1">{stat.value}</div>
                <div className="text-sm text-muted-foreground">{stat.label}</div>
              </div>
            );
          })}
        </div>

        {/* Floating elements */}
        <div className="absolute top-20 left-10 w-20 h-20 bg-primary/5 rounded-full animate-float" style={{ animationDelay: "0s" }} />
        <div className="absolute top-40 right-20 w-16 h-16 bg-accent/5 rounded-full animate-float" style={{ animationDelay: "1s" }} />
        <div className="absolute bottom-40 left-20 w-12 h-12 bg-primary-glow/5 rounded-full animate-float" style={{ animationDelay: "2s" }} />
      </div>
    </section>
  );
};

export default Hero;