import Header from "@/components/Header";
import Hero from "@/components/Hero";
import VideoGenerator from "@/components/VideoGenerator";
import PlatformFeatures from "@/components/PlatformFeatures";

const Index = () => {
  return (
    <div className="min-h-screen bg-background">
      <Header />
      <Hero />
      <div className="py-8">
        <PlatformFeatures />
      </div>
      <div id="video-generator" className="py-8">
        <VideoGenerator />
      </div>
    </div>
  );
};

export default Index;
