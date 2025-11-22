import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { CreditCard, Calendar, Download, Loader2 } from "lucide-react";
import { useAuth } from "@/hooks/useAuth";
import { useNavigate } from "react-router-dom";
import { supabase } from "@/integrations/supabase/client";
import { useState } from "react";
import { toast } from "sonner";

const Billing = () => {
  const { user, subscription } = useAuth();
  const navigate = useNavigate();
  const [isLoading, setIsLoading] = useState(false);

  if (!user) {
    navigate("/auth");
    return null;
  }

  const handleManageSubscription = async () => {
    try {
      setIsLoading(true);
      const { data, error } = await supabase.functions.invoke("customer-portal");
      
      if (error) throw error;
      if (data?.url) {
        window.open(data.url, "_blank");
      }
    } catch (error) {
      console.error("Error opening customer portal:", error);
      toast.error("Failed to open subscription management portal");
    } finally {
      setIsLoading(false);
    }
  };

  const getPlanName = () => {
    if (!subscription?.subscribed) return "Free Plan";
    if (subscription.product_id === "prod_STVPrpDC2jYuOp") return "Creator";
    if (subscription.product_id === "prod_STVQDhxqxWZJsS") return "Pro";
    return "Subscribed";
  };

  const getPlanPrice = () => {
    if (!subscription?.subscribed) return "$0/month";
    if (subscription.product_id === "prod_STVPrpDC2jYuOp") return "$19/month";
    if (subscription.product_id === "prod_STVQDhxqxWZJsS") return "$49/month";
    return "Active";
  };

  const billingHistory = [
    { date: "2025-01-15", plan: "Creator", amount: "$19.00", status: "paid" },
    { date: "2024-12-15", plan: "Creator", amount: "$19.00", status: "paid" },
    { date: "2024-11-15", plan: "Creator", amount: "$19.00", status: "paid" },
  ];

  return (
    <div className="min-h-screen py-12 px-4 bg-background">
      <div className="container mx-auto max-w-4xl">
        <div className="mb-8">
          <h1 className="text-4xl font-bold mb-2">Billing & Subscription</h1>
          <p className="text-muted-foreground">Manage your subscription and payment details</p>
        </div>

        {/* Current Plan */}
        <Card className="p-6 mb-6">
          <div className="flex items-start justify-between mb-4">
            <div>
              <h2 className="text-2xl font-bold mb-2">{getPlanName()}</h2>
              <p className="text-muted-foreground">{getPlanPrice()}</p>
            </div>
            <Badge variant={subscription?.subscribed ? "default" : "secondary"}>
              {subscription?.subscribed ? "Active" : "Free"}
            </Badge>
          </div>
          
          {subscription?.subscribed && subscription.subscription_end && (
            <div className="flex items-center gap-2 text-sm text-muted-foreground mb-4">
              <Calendar className="h-4 w-4" />
              <span>Next billing date: {new Date(subscription.subscription_end).toLocaleDateString()}</span>
            </div>
          )}

          <div className="flex gap-3">
            {!subscription?.subscribed ? (
              <Button onClick={() => navigate("/pricing")}>Subscribe Now</Button>
            ) : (
              <>
                <Button onClick={() => navigate("/pricing")}>Change Plan</Button>
                <Button 
                  variant="outline" 
                  onClick={handleManageSubscription}
                  disabled={isLoading}
                >
                  {isLoading ? (
                    <>
                      <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                      Loading...
                    </>
                  ) : (
                    "Manage Subscription"
                  )}
                </Button>
              </>
            )}
          </div>
        </Card>

        {/* Payment Method */}
        {subscription?.subscribed && (
          <Card className="p-6 mb-6">
            <h2 className="text-xl font-bold mb-4">Payment Method</h2>
            
            <p className="text-muted-foreground mb-4">
              Manage your payment methods through the Stripe Customer Portal
            </p>

            <Button 
              variant="outline"
              onClick={handleManageSubscription}
              disabled={isLoading}
            >
              {isLoading ? (
                <>
                  <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                  Loading...
                </>
              ) : (
                "Update Payment Method"
              )}
            </Button>
          </Card>
        )}

        {/* Billing History */}
        <Card className="p-6">
          <h2 className="text-xl font-bold mb-4">Billing History</h2>
          
          <div className="space-y-3">
            {billingHistory.map((item, index) => (
              <div
                key={index}
                className="flex items-center justify-between p-4 border rounded-lg hover:bg-muted/50 transition-colors"
              >
                <div className="flex items-center gap-4">
                  <div>
                    <div className="font-medium">{item.date}</div>
                    <div className="text-sm text-muted-foreground">{item.plan}</div>
                  </div>
                </div>
                
                <div className="flex items-center gap-4">
                  <div className="text-right">
                    <div className="font-medium">{item.amount}</div>
                    <Badge variant={item.status === "paid" ? "default" : "secondary"}>
                      {item.status}
                    </Badge>
                  </div>
                  <Button variant="ghost" size="sm">
                    <Download className="h-4 w-4" />
                  </Button>
                </div>
              </div>
            ))}
          </div>
        </Card>
      </div>
    </div>
  );
};

export default Billing;
