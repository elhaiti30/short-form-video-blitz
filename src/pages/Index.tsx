import { useState } from "react";
import Header from "@/components/Header";
import Hero from "@/components/Hero";
import VideoGenerator from "@/components/VideoGenerator";
import { TemplateLibrary } from "@/components/TemplateLibrary";
import { Dashboard } from "@/components/Dashboard";
import { TeamCollaboration } from "@/components/TeamCollaboration";
import { AnalyticsDashboard } from "@/components/AnalyticsDashboard";
import { AIInsights } from "@/components/AIInsights";
import { SmartScheduler } from "@/components/SmartScheduler";
import PlatformFeatures from "@/components/PlatformFeatures";
import PricingSection from "@/components/PricingSection";
import Footer from "@/components/Footer";
import { Button } from "@/components/ui/button";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Video, Layout, Users, Sparkles, BarChart3, Brain, Calendar } from "lucide-react";

const Index = () => {
  const [activeSection, setActiveSection] = useState("generator");

  const handleTemplateSelect = (template: any) => {
    // Apply template settings to video generator
    setActiveSection("generator");
    // You can pass template data to VideoGenerator here
  };

  return (
    <div className="min-h-screen bg-background">
      <Header />
      <Hero />
      
      {/* Main Application Tabs */}
      <div className="py-16 bg-card/20">
        <div className="container mx-auto px-4">
          <Tabs value={activeSection} onValueChange={setActiveSection} className="w-full">
            <div className="flex justify-center mb-8">
              <TabsList className="grid w-full max-w-4xl grid-cols-7 h-12">
                <TabsTrigger value="generator" className="flex items-center gap-2">
                  <Video className="h-4 w-4" />
                  <span className="hidden sm:inline">Create</span>
                </TabsTrigger>
                <TabsTrigger value="templates" className="flex items-center gap-2">
                  <Sparkles className="h-4 w-4" />
                  <span className="hidden sm:inline">Templates</span>
                </TabsTrigger>
                <TabsTrigger value="dashboard" className="flex items-center gap-2">
                  <Layout className="h-4 w-4" />
                  <span className="hidden sm:inline">Dashboard</span>
                </TabsTrigger>
                <TabsTrigger value="team" className="flex items-center gap-2">
                  <Users className="h-4 w-4" />
                  <span className="hidden sm:inline">Team</span>
                </TabsTrigger>
                <TabsTrigger value="analytics" className="flex items-center gap-2">
                  <BarChart3 className="h-4 w-4" />
                  <span className="hidden sm:inline">Analytics</span>
                </TabsTrigger>
                <TabsTrigger value="insights" className="flex items-center gap-2">
                  <Brain className="h-4 w-4" />
                  <span className="hidden sm:inline">AI Insights</span>
                </TabsTrigger>
                <TabsTrigger value="scheduler" className="flex items-center gap-2">
                  <Calendar className="h-4 w-4" />
                  <span className="hidden sm:inline">Scheduler</span>
                </TabsTrigger>
              </TabsList>
            </div>

            <TabsContent value="generator" id="video-generator">
              <VideoGenerator />
            </TabsContent>

            <TabsContent value="templates">
              <TemplateLibrary onSelectTemplate={handleTemplateSelect} />
            </TabsContent>

            <TabsContent value="dashboard">
              <Dashboard />
            </TabsContent>

            <TabsContent value="team">
              <TeamCollaboration />
            </TabsContent>

            <TabsContent value="analytics">
              <AnalyticsDashboard />
            </TabsContent>

            <TabsContent value="insights">
              <AIInsights />
            </TabsContent>

            <TabsContent value="scheduler">
              <SmartScheduler />
            </TabsContent>
          </Tabs>
        </div>
      </div>

      <div className="py-16">
        <PlatformFeatures />
      </div>

      <div className="py-16 bg-card/20">
        <PricingSection />
      </div>
      
      <Footer />
    </div>
  );
};

export default Index;
