import { Video, Layout, Users, BarChart3, Brain, Calendar, FileText, Palette, Share2, FolderOpen, Settings, Sparkles, Crown, LogOut } from "lucide-react";
import { NavLink, useNavigate } from "react-router-dom";
import { supabase } from "@/integrations/supabase/client";
import { Button } from "@/components/ui/button";
import { ThemeToggle } from "@/components/ThemeToggle";
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
    <Sidebar collapsible="icon" className="border-r border-border bg-sidebar">
      <SidebarContent className="flex flex-col justify-between h-full">
        <SidebarGroup>
          <SidebarGroupContent>
            <SidebarMenu className="gap-1">
              {mainItems.map((item) => (
                <SidebarMenuItem key={item.value}>
                  <SidebarMenuButton
                    onClick={() => onSectionChange(item.value)}
                    isActive={isActive(item.value)}
                    tooltip={open ? undefined : item.title}
                    className="hover:bg-accent data-[active=true]:bg-primary data-[active=true]:text-primary-foreground transition-all"
                  >
                    <item.icon className="h-5 w-5" />
                    <span>{item.title}</span>
                  </SidebarMenuButton>
                </SidebarMenuItem>
              ))}
            </SidebarMenu>
          </SidebarGroupContent>
        </SidebarGroup>
        
        <SidebarFooter className="pb-4 border-t border-border pt-3 space-y-2">
          <div className="px-2">
            <ThemeToggle />
          </div>
          <SidebarMenu className="gap-2">
            <SidebarMenuItem>
              <SidebarMenuButton
                onClick={handleUpgrade}
                tooltip={open ? undefined : "Upgrade"}
                className="hover:bg-accent py-6"
              >
                <Crown className="h-5 w-5 text-yellow-500" />
                <span className="font-medium">Upgrade to Pro</span>
              </SidebarMenuButton>
            </SidebarMenuItem>
            <SidebarMenuItem>
              <SidebarMenuButton
                onClick={handleLogout}
                tooltip={open ? undefined : "Log out"}
                className="hover:bg-destructive/10 text-destructive hover:text-destructive py-6"
              >
                <LogOut className="h-5 w-5" />
                <span className="font-medium">Log out</span>
              </SidebarMenuButton>
            </SidebarMenuItem>
          </SidebarMenu>
        </SidebarFooter>
      </SidebarContent>
    </Sidebar>
  );
}
