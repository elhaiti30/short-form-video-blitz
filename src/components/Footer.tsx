import React from 'react';
import { Video, Heart, Twitter, Github, Linkedin } from "lucide-react";
import { Button } from "@/components/ui/button";

const Footer = () => {
  return (
    <footer className="border-t border-border/50 bg-card/50 backdrop-blur-sm">
      <div className="container max-w-7xl mx-auto px-4 sm:px-6 py-10 sm:py-12 md:py-16">
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-8 md:gap-8">
          {/* Brand */}
          <div className="col-span-1 md:col-span-2">
            <div className="flex items-center space-x-3 mb-4">
              <div className="p-2 rounded-xl bg-gradient-primary">
                <Video className="h-5 w-5 text-white" />
              </div>
              <div>
                <span className="font-bold text-xl text-gradient">VideoBlitz AI</span>
                <p className="text-sm text-muted-foreground">Turn ideas into viral videos</p>
              </div>
            </div>
            <p className="text-muted-foreground mb-6 max-w-md">
              Create professional short-form videos instantly with AI. No editing experience required.
            </p>
            <div className="flex space-x-4">
              <Button variant="ghost" size="icon" className="hover:bg-primary/10">
                <Twitter className="h-4 w-4" />
              </Button>
              <Button variant="ghost" size="icon" className="hover:bg-primary/10">
                <Github className="h-4 w-4" />
              </Button>
              <Button variant="ghost" size="icon" className="hover:bg-primary/10">
                <Linkedin className="h-4 w-4" />
              </Button>
            </div>
          </div>

          {/* Product */}
          <div>
            <h3 className="font-semibold text-foreground mb-4">Product</h3>
            <ul className="space-y-3">
              <li><a href="#" className="text-muted-foreground hover:text-primary transition-colors">Features</a></li>
              <li><a href="#" className="text-muted-foreground hover:text-primary transition-colors">Pricing</a></li>
              <li><a href="#" className="text-muted-foreground hover:text-primary transition-colors">API</a></li>
              <li><a href="#" className="text-muted-foreground hover:text-primary transition-colors">Integrations</a></li>
            </ul>
          </div>

          {/* Company */}
          <div>
            <h3 className="font-semibold text-foreground mb-4">Company</h3>
            <ul className="space-y-3">
              <li><a href="#" className="text-muted-foreground hover:text-primary transition-colors">About</a></li>
              <li><a href="#" className="text-muted-foreground hover:text-primary transition-colors">Blog</a></li>
              <li><a href="#" className="text-muted-foreground hover:text-primary transition-colors">Privacy</a></li>
              <li><a href="#" className="text-muted-foreground hover:text-primary transition-colors">Terms</a></li>
            </ul>
          </div>
        </div>

        {/* Bottom */}
        <div className="border-t border-border/50 mt-10 sm:mt-12 pt-6 sm:pt-8 flex flex-col md:flex-row justify-between items-center gap-3 md:gap-0">
          <p className="text-xs sm:text-sm text-muted-foreground text-center md:text-left">
            © 2024 VideoBlitz AI. All rights reserved.
          </p>
          <p className="text-xs sm:text-sm text-muted-foreground flex items-center">
            Made with <Heart className="h-3.5 w-3.5 sm:h-4 sm:w-4 text-red-500 mx-1" /> for creators worldwide
          </p>
        </div>
      </div>
    </footer>
  );
};

export default Footer;