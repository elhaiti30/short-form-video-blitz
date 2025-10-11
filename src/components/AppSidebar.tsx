import { Video, Layout, Users, BarChart3, Brain, Calendar, FileText, Palette, Share2, FolderOpen, Settings, Sparkles } from "lucide-react";
import { NavLink } from "react-router-dom";
import {
  Sidebar,
  SidebarContent,
  SidebarGroup,
  SidebarGroupContent,
  SidebarMenu,
  SidebarMenuItem,
  SidebarMenuButton,
  SidebarTrigger,
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

  const isActive = (value: string) => activeSection === value;

  return (
    <Sidebar collapsible="icon" className="border-r border-border/40">
      <SidebarContent className="pt-16">
        <SidebarGroup>
          <SidebarGroupContent>
            <SidebarMenu>
              {mainItems.map((item) => (
                <SidebarMenuItem key={item.value}>
                  <SidebarMenuButton
                    onClick={() => onSectionChange(item.value)}
                    isActive={isActive(item.value)}
                    tooltip={item.title}
                    className="h-11"
                  >
                    <item.icon className="h-5 w-5 flex-shrink-0" />
                    <span className="text-sm">{item.title}</span>
                  </SidebarMenuButton>
                </SidebarMenuItem>
              ))}
            </SidebarMenu>
          </SidebarGroupContent>
        </SidebarGroup>
      </SidebarContent>
    </Sidebar>
  );
}
