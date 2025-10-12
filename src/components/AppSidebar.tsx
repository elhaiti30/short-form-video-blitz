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
    <Sidebar collapsible="icon" className="border-r-2 border-[#ff6b9d] w-[70px] bg-[#1a1a2e]">
      <SidebarContent className="pt-16 flex flex-col justify-between h-full bg-[#1a1a2e]">
        <SidebarGroup>
          <SidebarGroupContent>
            <SidebarMenu className="gap-2">
              {mainItems.map((item) => (
                <SidebarMenuItem key={item.value}>
                  <SidebarMenuButton
                    onClick={() => onSectionChange(item.value)}
                    isActive={isActive(item.value)}
                    tooltip={item.title}
                    className="h-11 w-11 p-0 flex items-center justify-center mx-auto hover:bg-[#ff6b9d]/20 data-[active=true]:bg-[#ff6b9d] data-[active=true]:text-white text-white/70 hover:text-white transition-all rounded-lg"
                  >
                    <item.icon className="h-5 w-5" />
                  </SidebarMenuButton>
                </SidebarMenuItem>
              ))}
            </SidebarMenu>
          </SidebarGroupContent>
        </SidebarGroup>
        
        <SidebarFooter className="pb-6 border-t-2 border-[#ff6b9d] pt-3 bg-[#1a1a2e]">
          <SidebarMenu className="gap-2">
            <SidebarMenuItem>
              <SidebarMenuButton
                onClick={handleUpgrade}
                tooltip="Upgrade"
                className="h-11 w-11 p-0 flex items-center justify-center mx-auto hover:bg-[#ff6b9d]/30 bg-[#ff6b9d]/20 rounded-lg"
              >
                <Crown className="h-5 w-5 text-[#ff6b9d]" />
              </SidebarMenuButton>
            </SidebarMenuItem>
            <SidebarMenuItem>
              <SidebarMenuButton
                onClick={handleLogout}
                tooltip="Log out"
                className="h-11 w-11 p-0 flex items-center justify-center mx-auto hover:bg-red-500/30 bg-red-500/20 rounded-lg"
              >
                <LogOut className="h-5 w-5 text-red-500" />
              </SidebarMenuButton>
            </SidebarMenuItem>
          </SidebarMenu>
        </SidebarFooter>
      </SidebarContent>
    </Sidebar>
  );
}
