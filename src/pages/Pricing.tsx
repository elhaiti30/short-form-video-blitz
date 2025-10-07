import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Check } from "lucide-react";
import { useNavigate } from "react-router-dom";
import { useAuth } from "@/hooks/useAuth";
import { toast } from "sonner";

const Pricing = () => {
  const navigate = useNavigate();
  const { user } = useAuth();
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
      popular: false,
    },
    {
      name: "Creator",
      price: "$19",
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
      popular: true,
    },
    {
      name: "Pro",
      price: "$49",
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
      popular: false,
    },
  ];

  const handleSelectPlan = async (tier: string) => {
    if (!user) {
      navigate("/auth");
      return;
    }

    setLoading(true);
    
    if (tier === "free") {
      toast.success("Starter plan activated!");
      navigate("/dashboard");
      setLoading(false);
      return;
    }

    // For paid plans, integrate with Stripe here
    toast.info("Stripe integration coming soon!");
    navigate("/dashboard");
    setLoading(false);
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
              {plan.popular && (
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
                  onClick={() => handleSelectPlan(plan.tier)}
                  disabled={loading}
                  className="w-full"
                  variant={plan.popular ? "default" : "outline"}
                >
                  {plan.tier === "free" ? "Start Free" : "Upgrade"}
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
