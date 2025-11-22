import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { ArrowRight, Sparkles, Video, Zap, TrendingUp, Play } from "lucide-react";
import heroImage from "@/assets/hero-video-ai.jpg";

const Hero = () => {
  const scrollToGenerator = () => {
    document.getElementById('video-generator')?.scrollIntoView({ behavior: 'smooth' });
  };

  const openDemo = () => {
    // Create a modal-like experience for demo
    const demoUrl = "https://www.youtube.com/embed/dQw4w9WgXcQ?autoplay=1";
    const newWindow = window.open(demoUrl, '_blank', 'width=800,height=600');
    if (!newWindow) {
      // Fallback if popup blocked
      window.open(demoUrl, '_blank');
    }
  };

  const stats = [
    { icon: Video, label: "Videos Generated", value: "100K+" },
    { icon: Zap, label: "Avg Generation Time", value: "30s" },
    { icon: TrendingUp, label: "Success Rate", value: "99%" },
  ];

  return (
    <section className="relative min-h-[85vh] sm:min-h-[75vh] md:min-h-[70vh] flex items-center justify-center overflow-hidden pt-16">
      {/* Animated Background */}
      <div className="absolute inset-0 animated-gradient-slow" />
      
      {/* Hero image with overlay */}
      <div className="absolute inset-0 opacity-20">
        <img 
          src={heroImage} 
          alt="AI Video Studio" 
          className="w-full h-full object-cover"
          loading="lazy"
        />
        <div className="absolute inset-0 bg-gradient-to-t from-background via-background/50 to-transparent" />
      </div>

      {/* Content */}
      <div className="relative z-10 max-w-7xl mx-auto px-4 sm:px-6 py-12 sm:py-16 md:py-20 text-center space-y-8 sm:space-y-10 md:space-y-12">
        {/* Badge */}
        <div className="animate-slide-up">
          <Badge variant="secondary" className="px-3 py-1.5 sm:px-4 sm:py-2 text-xs sm:text-sm font-medium border-primary/20">
            <Sparkles className="h-3 w-3 sm:h-4 sm:w-4 mr-1.5 sm:mr-2" />
            AI-Powered Video Creation
          </Badge>
        </div>

        {/* Headline */}
        <div className="space-y-4 sm:space-y-5 md:space-y-6 animate-slide-up" style={{ animationDelay: "0.1s" }}>
          <h1 className="text-3xl sm:text-4xl md:text-5xl lg:text-6xl xl:text-7xl font-bold leading-tight px-2">
            Turn Your Ideas into{" "}
            <span className="text-gradient block sm:inline">Viral Short Videos</span>
            <span className="hidden sm:inline"><br /></span>
            <span className="block sm:inline"> — Instantly!</span>
          </h1>
          <p className="text-base sm:text-lg md:text-xl lg:text-2xl text-muted-foreground max-w-3xl mx-auto leading-relaxed px-4">
            Transform your ideas into TikToks, Reels, and Shorts in seconds — no editing skills required. 
            Harness the power of AI to create stunning, engaging videos your audience will love.
          </p>
        </div>

        {/* CTA Buttons */}
        <div className="flex flex-col sm:flex-row gap-3 sm:gap-4 justify-center items-stretch sm:items-center animate-slide-up px-4" style={{ animationDelay: "0.2s" }}>
          <Button 
            onClick={scrollToGenerator}
            variant="premium" 
            size="lg" 
            className="w-full sm:w-auto px-6 sm:px-8 py-5 sm:py-6 text-base sm:text-lg h-auto animate-glow touch-manipulation"
          >
            Start Creating
            <ArrowRight className="h-4 w-4 sm:h-5 sm:w-5 ml-2" />
          </Button>
          <Button 
            onClick={openDemo}
            variant="glass" 
            size="lg" 
            className="w-full sm:w-auto px-6 sm:px-8 py-5 sm:py-6 text-base sm:text-lg h-auto touch-manipulation"
          >
            Watch Demo
            <Play className="h-4 w-4 sm:h-5 sm:w-5 ml-2" />
          </Button>
        </div>

        {/* Stats */}
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 sm:gap-6 md:gap-8 mt-12 sm:mt-14 md:mt-16 animate-slide-up px-4" style={{ animationDelay: "0.3s" }}>
          {stats.map((stat, index) => {
            const Icon = stat.icon;
            return (
              <div 
                key={index} 
                className="bg-card/50 backdrop-blur-sm border border-primary/10 rounded-xl p-4 sm:p-5 md:p-6 hover:border-primary/20 transition-all duration-300"
              >
                <div className="flex items-center justify-center mb-3 sm:mb-4">
                  <div className="h-10 w-10 sm:h-11 sm:w-11 md:h-12 md:w-12 rounded-full bg-primary/10 flex items-center justify-center">
                    <Icon className="h-5 w-5 sm:h-5.5 sm:w-5.5 md:h-6 md:w-6 text-primary" />
                  </div>
                </div>
                <div className="text-xl sm:text-2xl font-bold text-gradient mb-1">{stat.value}</div>
                <div className="text-xs sm:text-sm text-muted-foreground">{stat.label}</div>
              </div>
            );
          })}
        </div>

        {/* Mobile-friendly floating elements */}
        <div className="hidden md:block absolute top-20 left-10 w-20 h-20 bg-primary/5 rounded-full animate-float" style={{ animationDelay: "0s" }} />
        <div className="hidden md:block absolute top-40 right-20 w-16 h-16 bg-accent/5 rounded-full animate-float" style={{ animationDelay: "1s" }} />
        <div className="hidden md:block absolute bottom-40 left-20 w-12 h-12 bg-primary-glow/5 rounded-full animate-float" style={{ animationDelay: "2s" }} />
        <div className="hidden lg:block absolute top-1/2 left-5 w-8 h-8 bg-gradient-to-br from-primary/20 to-accent/20 rounded-full animate-float" style={{ animationDelay: "0.5s" }} />
        <div className="hidden lg:block absolute bottom-1/3 right-10 w-14 h-14 bg-gradient-to-br from-accent/10 to-primary/10 rounded-full animate-float" style={{ animationDelay: "2.5s" }} />
      </div>
    </section>
  );
};

export default Hero;