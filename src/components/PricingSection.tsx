import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Check, Star, Zap, Crown, Loader2 } from "lucide-react";
import { useAuth } from "@/hooks/useAuth";
import { useNavigate } from "react-router-dom";
import { toast } from "@/hooks/use-toast";
import { supabase } from "@/integrations/supabase/client";
import { useState } from "react";

const PricingSection = () => {
  const { user, subscription } = useAuth();
  const navigate = useNavigate();
  const [loadingPlan, setLoadingPlan] = useState<string | null>(null);

  const handlePlanSelect = async (planName: string, priceId: string | null) => {
    if (!user) {
      toast({
        title: "Sign in required",
        description: "Please sign in to select a plan",
        variant: "destructive"
      });
      navigate('/auth');
      return;
    }

    if (planName === "Starter") {
      toast({
        title: "Free Plan",
        description: "You're already on the free plan!",
      });
      return;
    }

    if (!priceId) return;

    setLoadingPlan(planName);

    try {
      const { data, error } = await supabase.functions.invoke('create-checkout', {
        body: { priceId }
      });

      if (error) throw error;

      if (data?.url) {
        window.open(data.url, '_blank');
        toast({
          title: "Redirecting to Checkout",
          description: "Opening Stripe checkout in a new tab...",
        });
      }
    } catch (error) {
      console.error('Error creating checkout:', error);
      toast({
        title: "Error",
        description: "Failed to start checkout. Please try again.",
        variant: "destructive"
      });
    } finally {
      setLoadingPlan(null);
    }
  };

  const handleManageSubscription = async () => {
    try {
      const { data, error } = await supabase.functions.invoke('customer-portal');

      if (error) throw error;

      if (data?.url) {
        window.open(data.url, '_blank');
      }
    } catch (error) {
      console.error('Error opening customer portal:', error);
      toast({
        title: "Error",
        description: "Failed to open subscription management. Please try again.",
        variant: "destructive"
      });
    }
  };

  const plans = [
    {
      name: "Starter",
      price: "Free",
      period: "",
      description: "Perfect for testing & hobby creators",
      features: [
        "5 videos per month",
        "720p quality max",
        "Watermarked videos",
        "Basic templates only",
        "Single platform export"
      ],
      buttonText: "Get Started",
      popular: false,
      icon: Star,
      priceId: null
    },
    {
      name: "Creator",
      price: "$39",
      period: "/month",
      description: "Perfect for content creators & influencers",
      features: [
        "50 videos per month",
        "Up to 1080p Full HD",
        "No watermark",
        "All templates & styles",
        "Multi-platform export",
        "AI script generation",
        "Basic analytics"
      ],
      buttonText: "Start Creating",
      popular: true,
      icon: Zap,
      priceId: "price_1STVSBGzdJfkQwRgfrI8JJ6j"
    },
    {
      name: "Pro",
      price: "$99",
      period: "/month",
      description: "Perfect for agencies & businesses",
      features: [
        "Unlimited videos",
        "4K quality",
        "Priority AI processing",
        "Custom branding (brand kits)",
        "Team collaboration (3-5 seats)",
        "Advanced analytics",
        "Social media scheduler",
        "API access",
        "White-label option",
        "24/7 priority support"
      ],
      buttonText: "Go Pro",
      popular: false,
      icon: Crown,
      priceId: "price_1STVSVGzdJfkQwRgdxVgsWQ0"
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
          
          {subscription?.subscribed && (
            <div className="flex flex-col items-center gap-3 pt-4">
              <Badge variant="outline" className="text-sm">
                Current Plan: {subscription.plan.charAt(0).toUpperCase() + subscription.plan.slice(1)}
              </Badge>
              <Button 
                onClick={handleManageSubscription}
                variant="outline"
                size="sm"
              >
                Manage Subscription
              </Button>
            </div>
          )}
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
                  {subscription?.plan === plan.name.toLowerCase() && (
                    <Badge className="w-full justify-center bg-primary text-white">
                      Your Current Plan
                    </Badge>
                  )}
                  
                  <Button 
                    onClick={() => handlePlanSelect(plan.name, plan.priceId)}
                    className={`w-full ${plan.popular ? 'premium-button text-white' : ''}`}
                    variant={plan.popular ? undefined : "outline"}
                    disabled={loadingPlan === plan.name || subscription?.plan === plan.name.toLowerCase()}
                  >
                    {loadingPlan === plan.name ? (
                      <>
                        <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                        Loading...
                      </>
                    ) : subscription?.plan === plan.name.toLowerCase() ? (
                      "Current Plan"
                    ) : (
                      plan.buttonText
                    )}
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