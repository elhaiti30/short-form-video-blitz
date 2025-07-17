import Hero from "@/components/Hero";
import VideoGenerator from "@/components/VideoGenerator";
import PlatformFeatures from "@/components/PlatformFeatures";

const Index = () => {
  return (
    <div className="min-h-screen bg-background">
      <Hero />
      <PlatformFeatures />
      <div id="video-generator">
        <VideoGenerator />
      </div>
    </div>
  );
};

export default Index;
