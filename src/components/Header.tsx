import React from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { Button } from "@/components/ui/button";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuSeparator, DropdownMenuTrigger } from "@/components/ui/dropdown-menu";
import { SidebarTrigger } from "@/components/ui/sidebar";
import { useAuth } from "@/hooks/useAuth";
import { Sparkles, Video, LogOut, User, Settings, CreditCard } from "lucide-react";
import { toast } from "@/hooks/use-toast";

const Header = () => {
  const { user, profile, signOut } = useAuth();
  const navigate = useNavigate();

  const handleSignOut = async () => {
    await signOut();
    navigate('/auth');
  };

  return (
    <header className="sticky top-0 z-50 w-full bg-background/95 backdrop-blur-md border-b border-border flex-shrink-0">
      <div className="flex h-14 sm:h-16 items-center px-4 gap-2">
        <SidebarTrigger className="lg:hidden text-foreground" />
        
        <div className="flex-1">
          <Link className="flex items-center space-x-2 sm:space-x-3" to={user ? "/dashboard" : "/"}>
            <div className="p-1.5 sm:p-2 rounded-lg sm:rounded-xl bg-primary">
              <Video className="h-4 w-4 sm:h-5 sm:w-5 text-primary-foreground" />
            </div>
            <div className="block">
              <span className="font-bold text-base sm:text-xl bg-gradient-to-r from-primary to-primary-glow bg-clip-text text-transparent">
                VideoBlitz AI
              </span>
            </div>
          </Link>
        </div>
        
        <div className="flex items-center justify-end space-x-1 sm:space-x-2">
          <nav className="flex items-center space-x-1 sm:space-x-2">
            <Button variant="ghost" className="hidden lg:inline-flex text-sm px-3 text-foreground hover:text-primary">
              Features
            </Button>
            <Button 
              variant="ghost" 
              className="hidden lg:inline-flex text-sm px-3 text-foreground hover:text-primary"
              onClick={() => navigate('/pricing')}
            >
              Pricing
            </Button>
            
            {user ? (
              <DropdownMenu>
                <DropdownMenuTrigger asChild>
                  <Button variant="ghost" className="relative h-8 w-8 sm:h-9 sm:w-9 rounded-full p-0 hover:bg-accent">
                    <Avatar className="h-8 w-8 sm:h-9 sm:w-9 border-2 border-primary/20">
                      <AvatarFallback className="text-xs sm:text-sm bg-primary/10 text-primary font-semibold">
                        {profile?.username?.charAt(0) || user.email?.charAt(0).toUpperCase()}
                      </AvatarFallback>
                    </Avatar>
                  </Button>
                </DropdownMenuTrigger>
                <DropdownMenuContent className="w-48 sm:w-56" align="end" forceMount>
                  <DropdownMenuItem className="text-sm">
                    <User className="mr-2 h-4 w-4" />
                    <span className="truncate">{profile?.username || user.email}</span>
                  </DropdownMenuItem>
                  <DropdownMenuItem onClick={() => navigate('/profile')} className="text-sm">
                    <Settings className="mr-2 h-4 w-4" />
                    <span>Profile Settings</span>
                  </DropdownMenuItem>
                  <DropdownMenuItem onClick={() => navigate('/billing')} className="text-sm">
                    <CreditCard className="mr-2 h-4 w-4" />
                    <span>Billing</span>
                  </DropdownMenuItem>
                  <DropdownMenuSeparator />
                  <DropdownMenuItem onClick={handleSignOut} className="text-sm">
                    <LogOut className="mr-2 h-4 w-4" />
                    <span>Log out</span>
                  </DropdownMenuItem>
                </DropdownMenuContent>
              </DropdownMenu>
            ) : (
              <Button 
                className="premium-button text-xs sm:text-sm font-medium px-3 sm:px-4 h-9 sm:h-10"
                onClick={() => navigate('/auth')}
              >
                <Sparkles className="w-3 h-3 sm:w-4 sm:h-4 mr-1 sm:mr-2" />
                <span className="hidden xs:inline">Get Started</span>
                <span className="xs:hidden">Start</span>
              </Button>
            )}
          </nav>
        </div>
      </div>
    </header>
  );
};

export default Header;