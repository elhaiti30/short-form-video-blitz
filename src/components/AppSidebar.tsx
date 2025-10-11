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
    <Sidebar collapsible="icon" className="border-r border-border/40">
      <SidebarContent className="pt-14">
        <SidebarGroup>
          <SidebarGroupContent>
            <SidebarMenu className="gap-0.5">
              {mainItems.map((item) => (
                <SidebarMenuItem key={item.value}>
                  <SidebarMenuButton
                    onClick={() => onSectionChange(item.value)}
                    isActive={isActive(item.value)}
                    tooltip={item.title}
                    className="h-9 px-3"
                  >
                    <item.icon className="h-4 w-4 flex-shrink-0" />
                    <span className="text-sm">{item.title}</span>
                  </SidebarMenuButton>
                </SidebarMenuItem>
              ))}
            </SidebarMenu>
          </SidebarGroupContent>
        </SidebarGroup>
      </SidebarContent>
      
      <SidebarFooter className="p-2 border-t border-border/40">
        <SidebarMenu className="gap-1">
          <SidebarMenuItem>
            <SidebarMenuButton
              onClick={handleUpgrade}
              tooltip="Upgrade"
              className="h-9 px-3 hover:bg-primary/10"
            >
              <Crown className="h-4 w-4 flex-shrink-0 text-primary" />
              <span className="text-sm font-medium">Upgrade</span>
            </SidebarMenuButton>
          </SidebarMenuItem>
          <SidebarMenuItem>
            <SidebarMenuButton
              onClick={handleLogout}
              tooltip="Log out"
              className="h-9 px-3 hover:bg-destructive/10"
            >
              <LogOut className="h-4 w-4 flex-shrink-0 text-destructive" />
              <span className="text-sm">Log out</span>
            </SidebarMenuButton>
          </SidebarMenuItem>
        </SidebarMenu>
      </SidebarFooter>
    </Sidebar>
  );
}
