import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { ArrowRight, Sparkles, Video, Zap, BarChart3, Users, Cloud } from "lucide-react";
import { useNavigate } from "react-router-dom";
import { useAuth } from "@/hooks/useAuth";

const Landing = () => {
  const navigate = useNavigate();
  const { user } = useAuth();

  const handleGetStarted = () => {
    if (user) {
      navigate("/dashboard");
    } else {
      navigate("/auth");
    }
  };

  const features = [
    { icon: Zap, title: "Fast Generation", description: "Videos ready in under 30 seconds." },
    { icon: Video, title: "Beautiful Templates", description: "Professionally designed templates for every niche." },
    { icon: Sparkles, title: "AI Voiceovers", description: "Natural-sounding narration in multiple languages." },
    { icon: BarChart3, title: "Analytics Dashboard", description: "Track views, engagement, and performance in real-time." },
    { icon: Users, title: "Team Collaboration", description: "Work together on projects seamlessly." },
    { icon: Cloud, title: "Cloud Storage", description: "Access your projects anytime, anywhere." },
  ];

  const steps = [
    { number: "1", title: "Enter Your Idea", description: "Type what you want to create — from tutorials to fun clips." },
    { number: "2", title: "AI Creates Video", description: "Our AI generates professional videos in seconds — templates, animations, and voiceovers included." },
    { number: "3", title: "Download & Share", description: "Publish instantly to TikTok, Instagram Reels, or YouTube Shorts." },
  ];

  const pricingPreview = [
    { name: "Starter", price: "Free", description: "Perfect for testing & beginners", highlight: false },
    { name: "Creator", price: "$19/mo", description: "Most popular — advanced features", highlight: true },
    { name: "Pro", price: "$49/mo", description: "Professional use & agencies", highlight: false },
  ];

  return (
    <div className="min-h-screen bg-gradient-to-b from-background via-background/95 to-primary/5">
      {/* Hero Section */}
      <section className="relative overflow-hidden py-20 px-4">
        <div className="absolute inset-0 bg-gradient-to-br from-primary/10 via-transparent to-accent/10 animate-pulse" />
        
        <div className="container mx-auto max-w-6xl relative z-10">
          <div className="text-center space-y-8">
            <div className="inline-block px-4 py-2 bg-primary/10 rounded-full text-sm font-medium text-primary">
              ✨ AI-Powered Video Creation
            </div>
            
            <h1 className="text-5xl md:text-7xl font-bold bg-gradient-to-r from-primary via-accent to-primary bg-clip-text text-transparent">
              Turn Your Ideas into Viral<br />Short Videos — Instantly!
            </h1>
            
            <p className="text-xl md:text-2xl text-muted-foreground max-w-3xl mx-auto">
              Transform your ideas into TikToks, Reels, and Shorts in seconds — no editing skills required. Harness the power of AI to create stunning, engaging videos your audience will love.
            </p>
            
            <div className="flex flex-col sm:flex-row gap-4 justify-center items-center">
              <Button size="lg" onClick={handleGetStarted} className="text-lg px-8 py-6 group">
                Start Creating Free
                <ArrowRight className="ml-2 group-hover:translate-x-1 transition-transform" />
              </Button>
              <Button size="lg" variant="outline" className="text-lg px-8 py-6">
                Watch Demo
              </Button>
            </div>
          </div>
        </div>
      </section>

      {/* How It Works */}
      <section className="py-20 px-4 bg-background/50">
        <div className="container mx-auto max-w-6xl">
          <h2 className="text-4xl font-bold text-center mb-12">How It Works</h2>
          
          <div className="grid md:grid-cols-3 gap-8">
            {steps.map((step, index) => (
              <Card key={index} className="p-8 text-center hover:shadow-lg transition-shadow">
                <div className="w-16 h-16 rounded-full bg-primary/10 flex items-center justify-center text-3xl font-bold text-primary mx-auto mb-4">
                  {step.number}
                </div>
                <h3 className="text-xl font-bold mb-2">{step.title}</h3>
                <p className="text-muted-foreground">{step.description}</p>
              </Card>
            ))}
          </div>
        </div>
      </section>

      {/* Key Features */}
      <section className="py-20 px-4">
        <div className="container mx-auto max-w-6xl">
          <h2 className="text-4xl font-bold text-center mb-12">Key Features</h2>
          
          <div className="grid md:grid-cols-3 gap-6">
            {features.map((feature, index) => {
              const Icon = feature.icon;
              return (
                <Card key={index} className="p-6 hover:scale-105 transition-transform">
                  <Icon className="w-12 h-12 text-primary mb-4" />
                  <h3 className="text-lg font-bold mb-2">{feature.title}</h3>
                  <p className="text-muted-foreground">{feature.description}</p>
                </Card>
              );
            })}
          </div>
        </div>
      </section>

      {/* Pricing Preview */}
      <section className="py-20 px-4 bg-background/50">
        <div className="container mx-auto max-w-6xl">
          <h2 className="text-4xl font-bold text-center mb-4">Simple, Transparent Pricing</h2>
          <p className="text-center text-muted-foreground mb-12">Choose the plan that fits your needs</p>
          
          <div className="grid md:grid-cols-3 gap-6 mb-8">
            {pricingPreview.map((plan, index) => (
              <Card key={index} className={`p-6 text-center hover:scale-105 transition-transform ${plan.highlight ? 'border-primary border-2 shadow-lg' : ''}`}>
                {plan.highlight && (
                  <div className="text-xs font-bold text-primary mb-2">MOST POPULAR</div>
                )}
                <h3 className="text-2xl font-bold mb-2">{plan.name}</h3>
                <div className="text-4xl font-bold text-primary mb-4">{plan.price}</div>
                <p className="text-muted-foreground text-sm">{plan.description}</p>
              </Card>
            ))}
          </div>
          
          <div className="text-center">
            <Button size="lg" onClick={handleGetStarted} className="px-8">
              Get Started Free — No Credit Card Needed
            </Button>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="py-12 px-4 border-t">
        <div className="container mx-auto max-w-6xl">
          <div className="flex flex-col md:flex-row justify-between items-center gap-4">
            <div className="text-muted-foreground">
              © 2025 VideoBlitz AI. All rights reserved.
            </div>
            <div className="flex gap-6">
              <a href="#" className="text-muted-foreground hover:text-primary">Privacy</a>
              <a href="#" className="text-muted-foreground hover:text-primary">Terms</a>
              <a href="#" className="text-muted-foreground hover:text-primary">Contact</a>
            </div>
          </div>
        </div>
      </footer>
    </div>
  );
};

export default Landing;
