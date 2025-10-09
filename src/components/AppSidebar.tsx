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
  { title: "إنشاء", value: "generator", icon: Video },
  { title: "القوالب", value: "templates", icon: Sparkles },
  { title: "لوحة التحكم", value: "dashboard", icon: Layout },
  { title: "الفريق", value: "team", icon: Users },
  { title: "التحليلات", value: "analytics", icon: BarChart3 },
  { title: "رؤى AI", value: "insights", icon: Brain },
  { title: "الجدولة", value: "scheduler", icon: Calendar },
  { title: "النصوص", value: "script", icon: FileText },
  { title: "العلامة", value: "brand", icon: Palette },
  { title: "المنصات", value: "social", icon: Share2 },
  { title: "المكتبة", value: "library", icon: FolderOpen },
  { title: "الإعدادات", value: "settings", icon: Settings },
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
