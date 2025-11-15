import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Check, Loader2 } from "lucide-react";
import { useNavigate } from "react-router-dom";
import { useAuth } from "@/hooks/useAuth";
import { toast } from "sonner";
import { supabase } from "@/integrations/supabase/client";

const Pricing = () => {
  const navigate = useNavigate();
  const { user, subscription } = useAuth();
  const [loading, setLoading] = useState(false);

  const plans = [
    {
      name: "Starter",
      price: "Free",
      description: "Perfect for trying out VideoBlitz AI",
      features: [
        "5 videos/month",
        "720p quality",
        "Basic templates",
        "Community support",
      ],
      tier: "free",
      priceId: null,
      popular: false,
    },
    {
      name: "Creator",
      price: "$39",
      period: "/month",
      description: "For serious content creators",
      features: [
        "50 videos/month",
        "1080p quality",
        "Premium templates",
        "Custom branding",
        "Team collaboration",
        "Priority support",
      ],
      tier: "creator",
      priceId: "price_1STVSBGzdJfkQwRgfrI8JJ6j",
      popular: true,
    },
    {
      name: "Pro",
      price: "$99",
      period: "/month",
      description: "For professionals and agencies",
      features: [
        "Unlimited videos",
        "4K quality",
        "White-label access",
        "API access",
        "Advanced analytics",
        "Dedicated support",
      ],
      tier: "pro",
      priceId: "price_1STVSVGzdJfkQwRgdxVgsWQ0",
      popular: false,
    },
  ];

  const handleSelectPlan = async (priceId: string | null, tier: string) => {
    if (!user) {
      navigate("/auth");
      return;
    }

    setLoading(true);
    
    if (tier === "free" || !priceId) {
      toast.success("Starter plan activated!");
      navigate("/dashboard");
      setLoading(false);
      return;
    }

    try {
      const { data, error } = await supabase.functions.invoke("create-checkout", {
        body: { priceId },
      });

      if (error) throw error;

      if (data?.url) {
        window.open(data.url, "_blank");
        toast.success("Opening checkout...");
      }
    } catch (error: any) {
      console.error("Checkout error:", error);
      toast.error(error.message || "Failed to start checkout");
    } finally {
      setLoading(false);
    }
  };

  const isCurrentPlan = (tier: string) => {
    if (tier === "free") return !subscription?.subscribed;
    if (tier === "creator") return subscription?.product_id === "prod_RlWVXaVwmE32wG";
    if (tier === "pro") return subscription?.product_id === "prod_RlWW8QOVNlW6i1";
    return false;
  };

  return (
    <div className="min-h-screen py-20 px-4 bg-gradient-to-b from-background via-background/95 to-primary/5">
      <div className="container mx-auto max-w-7xl">
        <div className="text-center space-y-4 mb-16">
          <h1 className="text-5xl font-bold">Choose Your Plan</h1>
          <p className="text-xl text-muted-foreground">
            Start free, upgrade when you're ready
          </p>
        </div>

        <div className="grid md:grid-cols-3 gap-8">
          {plans.map((plan, index) => (
            <Card
              key={index}
              className={`p-8 relative ${
                plan.popular ? "border-primary border-2 shadow-2xl scale-105" : ""
              }`}
            >
              {isCurrentPlan(plan.tier) && (
                <div className="absolute -top-4 left-1/2 -translate-x-1/2 bg-green-500 text-white px-4 py-1 rounded-full text-sm font-bold">
                  YOUR CURRENT PLAN
                </div>
              )}
              {plan.popular && !isCurrentPlan(plan.tier) && (
                <div className="absolute -top-4 left-1/2 -translate-x-1/2 bg-primary text-primary-foreground px-4 py-1 rounded-full text-sm font-bold">
                  MOST POPULAR
                </div>
              )}

              <div className="space-y-4">
                <h3 className="text-2xl font-bold">{plan.name}</h3>
                <div className="flex items-baseline gap-1">
                  <span className="text-5xl font-bold">{plan.price}</span>
                  {plan.period && (
                    <span className="text-muted-foreground">{plan.period}</span>
                  )}
                </div>
                <p className="text-muted-foreground">{plan.description}</p>

                <Button
                  onClick={() => handleSelectPlan(plan.priceId, plan.tier)}
                  disabled={loading || isCurrentPlan(plan.tier)}
                  className="w-full"
                  variant={plan.popular ? "default" : "outline"}
                >
                  {loading ? (
                    <>
                      <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                      Processing...
                    </>
                  ) : isCurrentPlan(plan.tier) ? (
                    "Current Plan"
                  ) : plan.tier === "free" ? (
                    "Start Free"
                  ) : (
                    "Upgrade"
                  )}
                </Button>

                <div className="space-y-3 pt-6">
                  {plan.features.map((feature, idx) => (
                    <div key={idx} className="flex items-start gap-3">
                      <Check className="h-5 w-5 text-primary flex-shrink-0 mt-0.5" />
                      <span className="text-sm">{feature}</span>
                    </div>
                  ))}
                </div>
              </div>
            </Card>
          ))}
        </div>

        <div className="text-center mt-12">
          <p className="text-muted-foreground">
            All plans include cloud storage and basic analytics
          </p>
        </div>
      </div>
    </div>
  );
};

export default Pricing;
