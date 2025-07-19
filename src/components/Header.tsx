import React from 'react';
import { Button } from "@/components/ui/button";
import { Sparkles, Menu, Video } from "lucide-react";

const Header = () => {
  return (
    <header className="fixed top-0 left-0 right-0 z-50 glass-effect border-b border-border/40">
      <div className="container flex h-16 max-w-screen-2xl items-center px-4">
        <div className="mr-4 flex">
          <a className="mr-6 flex items-center space-x-3" href="/">
            <div className="p-2 rounded-xl bg-gradient-primary animate-pulse-glow">
              <Video className="h-5 w-5 text-white" />
            </div>
            <div className="hidden sm:block">
              <span className="font-bold text-xl text-gradient">
                VideoBlitz AI
              </span>
              <p className="text-xs text-muted-foreground">
                Turn ideas into viral videos
              </p>
            </div>
          </a>
        </div>
        
        <div className="flex flex-1 items-center justify-between space-x-2 md:justify-end">
          <div className="w-full flex-1 md:w-auto md:flex-none">
            <Button variant="ghost" className="inline-flex items-center md:hidden">
              <Menu className="h-5 w-5" />
              <span className="sr-only">Toggle Menu</span>
            </Button>
          </div>
          
          <nav className="flex items-center space-x-2">
            <Button variant="ghost" className="hidden md:inline-flex text-sm">
              Features
            </Button>
            <Button variant="ghost" className="hidden md:inline-flex text-sm">
              Pricing
            </Button>
            <Button className="premium-button text-sm font-medium">
              <Sparkles className="w-4 h-4 mr-2" />
              Get Started Free
            </Button>
          </nav>
        </div>
      </div>
    </header>
  );
};

export default Header;