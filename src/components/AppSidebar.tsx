import { Video, Layout, Users, BarChart3, Brain, Calendar, FileText, Palette, Share2, FolderOpen, Settings, Sparkles, Crown, LogOut } from "lucide-react";
import { NavLink, useNavigate } from "react-router-dom";
import { supabase } from "@/integrations/supabase/client";
import { Button } from "@/components/ui/button";
import { toast } from "sonner";
import {
  Sidebar,
  SidebarContent,
  SidebarGroup,
  SidebarGroupContent,
  SidebarMenu,
  SidebarMenuItem,
  SidebarMenuButton,
  SidebarFooter,
  useSidebar,
} from "@/components/ui/sidebar";

const mainItems = [
  { title: "Create", value: "generator", icon: Video },
  { title: "Templates", value: "templates", icon: Sparkles },
  { title: "Dashboard", value: "dashboard", icon: Layout },
  { title: "Team", value: "team", icon: Users },
  { title: "Analytics", value: "analytics", icon: BarChart3 },
  { title: "AI Insights", value: "insights", icon: Brain },
  { title: "Scheduler", value: "scheduler", icon: Calendar },
  { title: "Scripts", value: "script", icon: FileText },
  { title: "Brand Kit", value: "brand", icon: Palette },
  { title: "Social", value: "social", icon: Share2 },
  { title: "Library", value: "library", icon: FolderOpen },
  { title: "Settings", value: "settings", icon: Settings },
];

interface AppSidebarProps {
  activeSection: string;
  onSectionChange: (section: string) => void;
}

export function AppSidebar({ activeSection, onSectionChange }: AppSidebarProps) {
  const { open } = useSidebar();
  const navigate = useNavigate();

  const isActive = (value: string) => activeSection === value;

  const handleLogout = async () => {
    try {
      await supabase.auth.signOut();
      toast.success("Logged out successfully");
      navigate("/auth");
    } catch (error) {
      toast.error("Failed to log out");
    }
  };

  const handleUpgrade = () => {
    navigate("/pricing");
  };

  return (
    <Sidebar collapsible="icon" className="border-r-2 border-primary/30 w-[70px] bg-card">
      <SidebarContent className="pt-16 flex flex-col justify-between h-full bg-card">
        <SidebarGroup>
          <SidebarGroupContent>
            <SidebarMenu className="gap-2">
              {mainItems.map((item) => (
                <SidebarMenuItem key={item.value}>
                  <SidebarMenuButton
                    onClick={() => onSectionChange(item.value)}
                    isActive={isActive(item.value)}
                    tooltip={item.title}
                    className="h-11 w-11 p-0 flex items-center justify-center mx-auto hover:bg-primary/20 data-[active=true]:bg-primary data-[active=true]:text-primary-foreground"
                  >
                    <item.icon className="h-5 w-5" />
                  </SidebarMenuButton>
                </SidebarMenuItem>
              ))}
            </SidebarMenu>
          </SidebarGroupContent>
        </SidebarGroup>
        
        <SidebarFooter className="pb-6 border-t-2 border-primary/30 pt-3 bg-card">
          <SidebarMenu className="gap-2">
            <SidebarMenuItem>
              <SidebarMenuButton
                onClick={handleUpgrade}
                tooltip="Upgrade"
                className="h-11 w-11 p-0 flex items-center justify-center mx-auto hover:bg-primary/20 bg-primary/10 rounded-lg"
              >
                <Crown className="h-5 w-5 text-primary" />
              </SidebarMenuButton>
            </SidebarMenuItem>
            <SidebarMenuItem>
              <SidebarMenuButton
                onClick={handleLogout}
                tooltip="Log out"
                className="h-11 w-11 p-0 flex items-center justify-center mx-auto hover:bg-destructive/20 bg-destructive/10 rounded-lg"
              >
                <LogOut className="h-5 w-5 text-destructive" />
              </SidebarMenuButton>
            </SidebarMenuItem>
          </SidebarMenu>
        </SidebarFooter>
      </SidebarContent>
    </Sidebar>
  );
}
