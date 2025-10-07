import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { CreditCard, Calendar, Download } from "lucide-react";
import { useAuth } from "@/hooks/useAuth";
import { useNavigate } from "react-router-dom";

const Billing = () => {
  const { user } = useAuth();
  const navigate = useNavigate();

  if (!user) {
    navigate("/auth");
    return null;
  }

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
              <h2 className="text-2xl font-bold mb-2">Creator Plan</h2>
              <p className="text-muted-foreground">$19/month • 50 videos/month</p>
            </div>
            <Badge>Active</Badge>
          </div>
          
          <div className="flex items-center gap-2 text-sm text-muted-foreground mb-4">
            <Calendar className="h-4 w-4" />
            <span>Next billing date: February 15, 2025</span>
          </div>

          <div className="flex gap-3">
            <Button onClick={() => navigate("/pricing")}>Upgrade Plan</Button>
            <Button variant="outline">Cancel Subscription</Button>
          </div>
        </Card>

        {/* Payment Method */}
        <Card className="p-6 mb-6">
          <h2 className="text-xl font-bold mb-4">Payment Method</h2>
          
          <div className="flex items-center justify-between p-4 border rounded-lg mb-4">
            <div className="flex items-center gap-3">
              <CreditCard className="h-6 w-6 text-muted-foreground" />
              <div>
                <div className="font-medium">•••• •••• •••• 4242</div>
                <div className="text-sm text-muted-foreground">Expires 12/2026</div>
              </div>
            </div>
            <Badge variant="outline">Default</Badge>
          </div>

          <Button variant="outline">Update Payment Method</Button>
        </Card>

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
