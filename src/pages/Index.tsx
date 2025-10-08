import { useState } from "react";
import Header from "@/components/Header";
import Hero from "@/components/Hero";
import AIAssistant from "@/components/AIAssistant";
import VideoGenerator from "@/components/VideoGenerator";
import { TemplateLibrary } from "@/components/TemplateLibrary";
import { Dashboard } from "@/components/Dashboard";
import { TeamCollaboration } from "@/components/TeamCollaboration";
import { AnalyticsDashboard } from "@/components/AnalyticsDashboard";
import { AIInsights } from "@/components/AIInsights";
import { SmartScheduler } from "@/components/SmartScheduler";
import { AIScriptGenerator } from "@/components/AIScriptGenerator";
import { BrandKitManager } from "@/components/BrandKitManager";
import { SocialMediaManager } from "@/components/SocialMediaManager";
import { EnhancedVideoLibrary } from "@/components/EnhancedVideoLibrary";
import { UserSettings } from "@/components/UserSettings";
import PlatformFeatures from "@/components/PlatformFeatures";
import PricingSection from "@/components/PricingSection";
import Footer from "@/components/Footer";
import { Button } from "@/components/ui/button";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Video, Layout, Users, Sparkles, BarChart3, Brain, Calendar, FileText, Palette, Share2, FolderOpen, Settings } from "lucide-react";

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
      <div className="py-8 md:py-16 bg-card/20">
        <div className="container mx-auto px-2 sm:px-4">
          <Tabs value={activeSection} onValueChange={setActiveSection} className="w-full">
            <div className="flex justify-start md:justify-center mb-6 md:mb-8 overflow-x-auto scrollbar-hide">
              <TabsList className="inline-flex w-auto md:grid md:w-full md:max-w-7xl md:grid-cols-12 h-11 md:h-12 min-w-max md:min-w-0">
                <TabsTrigger value="generator" className="flex items-center gap-1.5 px-3 md:px-4 text-xs md:text-sm">
                  <Video className="h-3.5 w-3.5 md:h-4 md:w-4 flex-shrink-0" />
                  <span>Create</span>
                </TabsTrigger>
                <TabsTrigger value="templates" className="flex items-center gap-1.5 px-3 md:px-4 text-xs md:text-sm">
                  <Sparkles className="h-3.5 w-3.5 md:h-4 md:w-4 flex-shrink-0" />
                  <span>Templates</span>
                </TabsTrigger>
                <TabsTrigger value="dashboard" className="flex items-center gap-1.5 px-3 md:px-4 text-xs md:text-sm">
                  <Layout className="h-3.5 w-3.5 md:h-4 md:w-4 flex-shrink-0" />
                  <span>Dashboard</span>
                </TabsTrigger>
                <TabsTrigger value="team" className="flex items-center gap-1.5 px-3 md:px-4 text-xs md:text-sm">
                  <Users className="h-3.5 w-3.5 md:h-4 md:w-4 flex-shrink-0" />
                  <span>Team</span>
                </TabsTrigger>
                <TabsTrigger value="analytics" className="flex items-center gap-1.5 px-3 md:px-4 text-xs md:text-sm">
                  <BarChart3 className="h-3.5 w-3.5 md:h-4 md:w-4 flex-shrink-0" />
                  <span>Analytics</span>
                </TabsTrigger>
                <TabsTrigger value="insights" className="flex items-center gap-1.5 px-3 md:px-4 text-xs md:text-sm">
                  <Brain className="h-3.5 w-3.5 md:h-4 md:w-4 flex-shrink-0" />
                  <span className="hidden sm:inline">AI Insights</span>
                  <span className="sm:hidden">Insights</span>
                </TabsTrigger>
                <TabsTrigger value="scheduler" className="flex items-center gap-1.5 px-3 md:px-4 text-xs md:text-sm">
                  <Calendar className="h-3.5 w-3.5 md:h-4 md:w-4 flex-shrink-0" />
                  <span className="hidden sm:inline">Scheduler</span>
                  <span className="sm:hidden">Schedule</span>
                </TabsTrigger>
                <TabsTrigger value="script" className="flex items-center gap-1.5 px-3 md:px-4 text-xs md:text-sm">
                  <FileText className="h-3.5 w-3.5 md:h-4 md:w-4 flex-shrink-0" />
                  <span className="hidden sm:inline">AI Scripts</span>
                  <span className="sm:hidden">Scripts</span>
                </TabsTrigger>
                <TabsTrigger value="brand" className="flex items-center gap-1.5 px-3 md:px-4 text-xs md:text-sm">
                  <Palette className="h-3.5 w-3.5 md:h-4 md:w-4 flex-shrink-0" />
                  <span className="hidden sm:inline">Brand Kit</span>
                  <span className="sm:hidden">Brand</span>
                </TabsTrigger>
                <TabsTrigger value="social" className="flex items-center gap-1.5 px-3 md:px-4 text-xs md:text-sm">
                  <Share2 className="h-3.5 w-3.5 md:h-4 md:w-4 flex-shrink-0" />
                  <span>Social</span>
                </TabsTrigger>
                <TabsTrigger value="library" className="flex items-center gap-1.5 px-3 md:px-4 text-xs md:text-sm">
                  <FolderOpen className="h-3.5 w-3.5 md:h-4 md:w-4 flex-shrink-0" />
                  <span>Library</span>
                </TabsTrigger>
                <TabsTrigger value="settings" className="flex items-center gap-1.5 px-3 md:px-4 text-xs md:text-sm">
                  <Settings className="h-3.5 w-3.5 md:h-4 md:w-4 flex-shrink-0" />
                  <span>Settings</span>
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

            <TabsContent value="script">
              <AIScriptGenerator />
            </TabsContent>

            <TabsContent value="brand">
              <BrandKitManager />
            </TabsContent>

            <TabsContent value="social">
              <SocialMediaManager />
            </TabsContent>

            <TabsContent value="library">
              <EnhancedVideoLibrary />
            </TabsContent>

            <TabsContent value="settings">
              <UserSettings />
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
      <AIAssistant />
    </div>
  );
};

export default Index;
