import React from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { Button } from "@/components/ui/button";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuSeparator, DropdownMenuTrigger } from "@/components/ui/dropdown-menu";
import { useAuth } from "@/hooks/useAuth";
import { Sparkles, Menu, Video, LogOut, User, Settings } from "lucide-react";

const Header = () => {
  const { user, signOut } = useAuth();
  const navigate = useNavigate();

  const handleSignOut = async () => {
    await signOut();
    navigate('/auth');
  };

  return (
    <header className="fixed top-0 left-0 right-0 z-50 glass-effect border-b border-border/40">
      <div className="container flex h-16 max-w-screen-2xl items-center px-4">
        <div className="mr-4 flex">
          <Link className="mr-6 flex items-center space-x-3" to="/">
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
          </Link>
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
            
            {user ? (
              <DropdownMenu>
                <DropdownMenuTrigger asChild>
                  <Button variant="ghost" className="relative h-8 w-8 rounded-full">
                    <Avatar className="h-8 w-8">
                      <AvatarFallback>
                        {user.email?.charAt(0).toUpperCase()}
                      </AvatarFallback>
                    </Avatar>
                  </Button>
                </DropdownMenuTrigger>
                <DropdownMenuContent className="w-56" align="end" forceMount>
                  <DropdownMenuItem>
                    <User className="mr-2 h-4 w-4" />
                    <span>{user.email}</span>
                  </DropdownMenuItem>
                  <DropdownMenuItem>
                    <Settings className="mr-2 h-4 w-4" />
                    <span>Settings</span>
                  </DropdownMenuItem>
                  <DropdownMenuSeparator />
                  <DropdownMenuItem onClick={handleSignOut}>
                    <LogOut className="mr-2 h-4 w-4" />
                    <span>Log out</span>
                  </DropdownMenuItem>
                </DropdownMenuContent>
              </DropdownMenu>
            ) : (
              <Button 
                className="premium-button text-sm font-medium"
                onClick={() => navigate('/auth')}
              >
                <Sparkles className="w-4 h-4 mr-2" />
                Get Started Free
              </Button>
            )}
          </nav>
        </div>
      </div>
    </header>
  );
};

export default Header;