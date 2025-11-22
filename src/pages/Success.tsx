import { useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { CheckCircle, Sparkles, ArrowRight } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { useAuth } from "@/hooks/useAuth";

const Success = () => {
  const navigate = useNavigate();
  const { checkSubscription } = useAuth();

  useEffect(() => {
    // Refresh subscription status after successful checkout
    checkSubscription();
  }, [checkSubscription]);

  return (
    <div className="min-h-screen flex items-center justify-center bg-background p-4">
      <Card className="max-w-lg w-full premium-card animate-scale-in">
        <CardContent className="p-8 text-center space-y-6">
          <div className="relative">
            <div className="absolute inset-0 animate-pulse-glow" />
            <CheckCircle className="h-20 w-20 text-primary mx-auto animate-scale-in" />
          </div>
          
          <div className="space-y-3">
            <h1 className="text-3xl font-bold text-gradient">
              Payment Successful!
            </h1>
            <p className="text-muted-foreground text-lg">
              Welcome to premium! Your subscription is now active.
            </p>
          </div>

          <div className="glass-effect rounded-lg p-6 space-y-3 text-left">
            <div className="flex items-start gap-3">
              <Sparkles className="h-5 w-5 text-primary flex-shrink-0 mt-0.5" />
              <div>
                <h3 className="font-semibold">Unlimited AI Videos</h3>
                <p className="text-sm text-muted-foreground">Generate as many videos as you need</p>
              </div>
            </div>
            <div className="flex items-start gap-3">
              <Sparkles className="h-5 w-5 text-primary flex-shrink-0 mt-0.5" />
              <div>
                <h3 className="font-semibold">Premium Templates</h3>
                <p className="text-sm text-muted-foreground">Access to exclusive professional templates</p>
              </div>
            </div>
            <div className="flex items-start gap-3">
              <Sparkles className="h-5 w-5 text-primary flex-shrink-0 mt-0.5" />
              <div>
                <h3 className="font-semibold">Priority Support</h3>
                <p className="text-sm text-muted-foreground">Get help faster when you need it</p>
              </div>
            </div>
          </div>

          <div className="flex flex-col sm:flex-row gap-3">
            <Button 
              onClick={() => navigate('/dashboard')}
              className="flex-1 premium-button"
              size="lg"
            >
              Start Creating
              <ArrowRight className="ml-2 h-4 w-4" />
            </Button>
            <Button 
              onClick={() => navigate('/billing')}
              variant="outline"
              className="flex-1"
              size="lg"
            >
              View Billing
            </Button>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default Success;
