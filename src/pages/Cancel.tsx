import { useNavigate } from "react-router-dom";
import { XCircle, ArrowLeft, RefreshCw } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";

const Cancel = () => {
  const navigate = useNavigate();

  return (
    <div className="min-h-screen flex items-center justify-center bg-background p-4">
      <Card className="max-w-lg w-full premium-card">
        <CardContent className="p-8 text-center space-y-6">
          <div className="relative">
            <XCircle className="h-20 w-20 text-muted-foreground mx-auto" />
          </div>
          
          <div className="space-y-3">
            <h1 className="text-3xl font-bold">
              Checkout Cancelled
            </h1>
            <p className="text-muted-foreground text-lg">
              No charges were made. You can try again whenever you're ready.
            </p>
          </div>

          <div className="glass-effect rounded-lg p-6 text-left space-y-2">
            <h3 className="font-semibold text-lg">Why upgrade to premium?</h3>
            <ul className="space-y-2 text-sm text-muted-foreground">
              <li className="flex items-center gap-2">
                <div className="h-1.5 w-1.5 rounded-full bg-primary" />
                Generate unlimited AI videos
              </li>
              <li className="flex items-center gap-2">
                <div className="h-1.5 w-1.5 rounded-full bg-primary" />
                Access premium templates
              </li>
              <li className="flex items-center gap-2">
                <div className="h-1.5 w-1.5 rounded-full bg-primary" />
                Advanced customization options
              </li>
              <li className="flex items-center gap-2">
                <div className="h-1.5 w-1.5 rounded-full bg-primary" />
                Priority customer support
              </li>
            </ul>
          </div>

          <div className="flex flex-col sm:flex-row gap-3">
            <Button 
              onClick={() => navigate('/pricing')}
              className="flex-1 premium-button"
              size="lg"
            >
              <RefreshCw className="mr-2 h-4 w-4" />
              Try Again
            </Button>
            <Button 
              onClick={() => navigate('/dashboard')}
              variant="outline"
              className="flex-1"
              size="lg"
            >
              <ArrowLeft className="mr-2 h-4 w-4" />
              Back to Dashboard
            </Button>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default Cancel;
