import Header from "@/components/Header";
import Hero from "@/components/Hero";
import VideoGenerator from "@/components/VideoGenerator";
import PlatformFeatures from "@/components/PlatformFeatures";
import Footer from "@/components/Footer";

const Index = () => {
  return (
    <div className="min-h-screen bg-background">
      <Header />
      <Hero />
      <div className="py-16">
        <PlatformFeatures />
      </div>
      <div id="video-generator" className="py-16 bg-card/20">
        <VideoGenerator />
      </div>
      <Footer />
    </div>
  );
};

export default Index;
