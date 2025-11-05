import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Check, Star, Zap, Crown } from "lucide-react";
import { useAuth } from "@/hooks/useAuth";
import { useNavigate } from "react-router-dom";
import { toast } from "@/hooks/use-toast";

const PricingSection = () => {
  const { user } = useAuth();
  const navigate = useNavigate();

  const handlePlanSelect = (planName: string) => {
    if (!user) {
      toast({
        title: "Sign in required",
        description: "Please sign in to select a plan",
        variant: "destructive"
      });
      navigate('/auth');
      return;
    }

    toast({
      title: "Plan Selected",
      description: `You've selected the ${planName} plan! Redirecting to checkout...`,
    });
    
    // In a real app, this would redirect to payment processing
    setTimeout(() => {
      toast({
        title: "Coming Soon",
        description: "Payment processing will be available soon!",
      });
    }, 1500);
  };

  const plans = [
    {
      name: "Starter",
      price: "Free",
      description: "Perfect for beginners and casual creators",
      features: [
        "5 videos per month",
        "Basic templates",
        "720p quality",
        "Community support",
        "Basic analytics"
      ],
      buttonText: "Get Started",
      popular: false,
      icon: Star
    },
    {
      name: "Creator",
      price: "$19",
      description: "For serious content creators and small businesses",
      features: [
        "50 videos per month",
        "Premium templates",
        "1080p quality",
        "Priority support",
        "Advanced analytics",
        "Custom branding",
        "Team collaboration"
      ],
      buttonText: "Start Creating",
      popular: true,
      icon: Zap
    },
    {
      name: "Pro",
      price: "$49",
      description: "For agencies and large-scale content production",
      features: [
        "Unlimited videos",
        "All templates",
        "4K quality",
        "24/7 support",
        "Enterprise analytics",
        "White-label solution",
        "API access",
        "Custom integrations"
      ],
      buttonText: "Go Pro",
      popular: false,
      icon: Crown
    }
  ];

  return (
    <section id="pricing" className="py-20 px-6">
      <div className="max-w-7xl mx-auto space-y-12">
        {/* Header */}
        <div className="text-center space-y-4">
          <h2 className="text-4xl md:text-5xl font-bold text-gradient">
            Choose Your Plan
          </h2>
          <p className="text-xl text-muted-foreground max-w-3xl mx-auto">
            Start free and scale as you grow. All plans include our core AI video generation features.
          </p>
        </div>

        {/* Pricing Cards */}
        <div className="grid md:grid-cols-3 gap-8 max-w-6xl mx-auto">
          {plans.map((plan, index) => {
            const Icon = plan.icon;
            return (
              <Card 
                key={index} 
                className={`relative ${plan.popular ? 'premium-card border-primary' : 'card-glow'} overflow-hidden`}
              >
                {plan.popular && (
                  <div className="absolute top-0 left-0 right-0 h-1 bg-gradient-to-r from-primary to-primary-glow" />
                )}
                
                <CardHeader className="text-center space-y-4">
                  {plan.popular && (
                    <Badge className="premium-button text-white mx-auto">
                      Most Popular
                    </Badge>
                  )}
                  
                  <div className="h-16 w-16 mx-auto rounded-full bg-primary/10 flex items-center justify-center">
                    <Icon className="h-8 w-8 text-primary" />
                  </div>
                  
                  <div>
                    <CardTitle className="text-2xl">{plan.name}</CardTitle>
                    <CardDescription className="mt-2">{plan.description}</CardDescription>
                  </div>
                  
                  <div className="space-y-1">
                    <div className="text-4xl font-bold text-gradient">
                      {plan.price}
                      {plan.price !== "Free" && <span className="text-base text-muted-foreground">/month</span>}
                    </div>
                  </div>
                </CardHeader>

                <CardContent className="space-y-6">
                  <Button 
                    onClick={() => handlePlanSelect(plan.name)}
                    className={`w-full ${plan.popular ? 'premium-button text-white' : ''}`}
                    variant={plan.popular ? undefined : "outline"}
                  >
                    {plan.buttonText}
                  </Button>
                  
                  <div className="space-y-3">
                    <h4 className="font-semibold text-sm uppercase tracking-wide text-muted-foreground">
                      What's included:
                    </h4>
                    <ul className="space-y-2">
                      {plan.features.map((feature, idx) => (
                        <li key={idx} className="flex items-center gap-3">
                          <Check className="h-4 w-4 flex-shrink-0" style={{ color: 'hsl(var(--success))' }} />
                          <span className="text-sm">{feature}</span>
                        </li>
                      ))}
                    </ul>
                  </div>
                </CardContent>
              </Card>
            );
          })}
        </div>

        {/* FAQ */}
        <div className="text-center space-y-4 pt-12">
          <h3 className="text-2xl font-bold">Frequently Asked Questions</h3>
          <div className="grid md:grid-cols-2 gap-6 max-w-4xl mx-auto text-left">
            <div>
              <h4 className="font-semibold mb-2">Can I change plans anytime?</h4>
              <p className="text-muted-foreground text-sm">Yes, you can upgrade or downgrade your plan at any time. Changes take effect immediately.</p>
            </div>
            <div>
              <h4 className="font-semibold mb-2">What happens to my videos?</h4>
              <p className="text-muted-foreground text-sm">All your created videos remain yours forever, regardless of your plan status.</p>
            </div>
            <div>
              <h4 className="font-semibold mb-2">Is there a free trial?</h4>
              <p className="text-muted-foreground text-sm">The Starter plan is completely free forever. No credit card required to get started.</p>
            </div>
            <div>
              <h4 className="font-semibold mb-2">Do you offer refunds?</h4>
              <p className="text-muted-foreground text-sm">Yes, we offer a 30-day money-back guarantee on all paid plans.</p>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default PricingSection;