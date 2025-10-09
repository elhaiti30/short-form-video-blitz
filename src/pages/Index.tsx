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
import { AppSidebar } from "@/components/AppSidebar";
import { SidebarProvider, SidebarInset, SidebarTrigger } from "@/components/ui/sidebar";

const Index = () => {
  const [activeSection, setActiveSection] = useState("generator");

  const handleTemplateSelect = (template: any) => {
    // Apply template settings to video generator
    setActiveSection("generator");
    // You can pass template data to VideoGenerator here
  };

  const renderContent = () => {
    switch (activeSection) {
      case "generator":
        return <VideoGenerator />;
      case "templates":
        return <TemplateLibrary onSelectTemplate={handleTemplateSelect} />;
      case "dashboard":
        return <Dashboard />;
      case "team":
        return <TeamCollaboration />;
      case "analytics":
        return <AnalyticsDashboard />;
      case "insights":
        return <AIInsights />;
      case "scheduler":
        return <SmartScheduler />;
      case "script":
        return <AIScriptGenerator />;
      case "brand":
        return <BrandKitManager />;
      case "social":
        return <SocialMediaManager />;
      case "library":
        return <EnhancedVideoLibrary />;
      case "settings":
        return <UserSettings />;
      default:
        return <VideoGenerator />;
    }
  };

  return (
    <SidebarProvider>
      <div className="min-h-screen w-full flex bg-background">
        <AppSidebar activeSection={activeSection} onSectionChange={setActiveSection} />
        
        <SidebarInset className="flex-1">
          <Header />
          
          {activeSection === "generator" && <Hero />}
          
          <main className="flex-1">
            <div className="py-8 md:py-16 bg-card/20">
              <div className="container mx-auto px-4">
                {renderContent()}
              </div>
            </div>

            {activeSection === "generator" && (
              <>
                <div className="py-16">
                  <PlatformFeatures />
                </div>

                <div className="py-16 bg-card/20">
                  <PricingSection />
                </div>
              </>
            )}
          </main>
          
          <Footer />
        </SidebarInset>
        
        <AIAssistant />
      </div>
    </SidebarProvider>
  );
};

export default Index;
