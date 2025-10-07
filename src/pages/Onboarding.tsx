import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { TrendingUp, Briefcase, Flame, Video, Instagram, Youtube } from "lucide-react";
import { useAuth } from "@/hooks/useAuth";
import { supabase } from "@/integrations/supabase/client";
import { toast } from "sonner";

const Onboarding = () => {
  const [step, setStep] = useState(1);
  const [goal, setGoal] = useState("");
  const [platform, setPlatform] = useState("");
  const navigate = useNavigate();
  const { user } = useAuth();

  const goals = [
    { id: "social", icon: TrendingUp, label: "Grow my social media" },
    { id: "business", icon: Briefcase, label: "Promote my business" },
    { id: "viral", icon: Flame, label: "Create viral content" },
  ];

  const platforms = [
    { id: "tiktok", icon: Video, label: "TikTok", ratio: "9:16" },
    { id: "instagram", icon: Instagram, label: "Instagram Reels", ratio: "9:16" },
    { id: "youtube", icon: Youtube, label: "YouTube Shorts", ratio: "9:16" },
  ];

  const handleComplete = async () => {
    if (!user) return;

    try {
      // Save preferences
      await supabase
        .from("profiles")
        .update({
          account_type: "creator",
        })
        .eq("user_id", user.id);

      toast.success("Welcome to VideoBlitz AI!");
      navigate("/pricing");
    } catch (error) {
      console.error("Error completing onboarding:", error);
      toast.error("Something went wrong. Please try again.");
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center p-4 bg-gradient-to-br from-background via-primary/5 to-accent/5">
      <Card className="w-full max-w-2xl p-8">
        {step === 1 && (
          <div className="space-y-6 animate-fade-in">
            <div className="text-center space-y-4">
              <div className="text-6xl mb-4">✨</div>
              <h1 className="text-4xl font-bold">Welcome to VideoBlitz AI</h1>
              <p className="text-xl text-muted-foreground">
                Turn your ideas into viral short videos in seconds
              </p>
            </div>
            <Button onClick={() => setStep(2)} size="lg" className="w-full">
              Let's Get Started
            </Button>
          </div>
        )}

        {step === 2 && (
          <div className="space-y-6 animate-fade-in">
            <div className="text-center space-y-2">
              <h2 className="text-3xl font-bold">What's your goal?</h2>
              <p className="text-muted-foreground">Help us personalize your experience</p>
            </div>
            
            <div className="grid gap-4">
              {goals.map((item) => {
                const Icon = item.icon;
                return (
                  <Button
                    key={item.id}
                    variant={goal === item.id ? "default" : "outline"}
                    onClick={() => setGoal(item.id)}
                    className="h-20 text-lg justify-start"
                  >
                    <Icon className="mr-4 h-6 w-6" />
                    {item.label}
                  </Button>
                );
              })}
            </div>

            <div className="flex gap-4">
              <Button variant="outline" onClick={() => setStep(1)} className="w-full">
                Back
              </Button>
              <Button onClick={() => setStep(3)} disabled={!goal} className="w-full">
                Continue
              </Button>
            </div>
          </div>
        )}

        {step === 3 && (
          <div className="space-y-6 animate-fade-in">
            <div className="text-center space-y-2">
              <h2 className="text-3xl font-bold">Choose your platform</h2>
              <p className="text-muted-foreground">Where will you share your videos?</p>
            </div>
            
            <div className="grid gap-4">
              {platforms.map((item) => {
                const Icon = item.icon;
                return (
                  <Button
                    key={item.id}
                    variant={platform === item.id ? "default" : "outline"}
                    onClick={() => setPlatform(item.id)}
                    className="h-20 text-lg justify-between"
                  >
                    <div className="flex items-center">
                      <Icon className="mr-4 h-6 w-6" />
                      {item.label}
                    </div>
                    <span className="text-sm text-muted-foreground">{item.ratio}</span>
                  </Button>
                );
              })}
            </div>

            <div className="flex gap-4">
              <Button variant="outline" onClick={() => setStep(2)} className="w-full">
                Back
              </Button>
              <Button onClick={handleComplete} disabled={!platform} className="w-full">
                Complete Setup
              </Button>
            </div>
          </div>
        )}

        {/* Progress Indicator */}
        <div className="flex justify-center gap-2 mt-8">
          {[1, 2, 3].map((i) => (
            <div
              key={i}
              className={`h-2 w-12 rounded-full transition-colors ${
                i <= step ? "bg-primary" : "bg-muted"
              }`}
            />
          ))}
        </div>
      </Card>
    </div>
  );
};

export default Onboarding;
