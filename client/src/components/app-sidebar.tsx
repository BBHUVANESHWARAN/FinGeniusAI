import { LayoutDashboard, ArrowLeftRight, Wallet, FileText, Sparkles, Languages, Moon, Sun } from "lucide-react";
import {
  Sidebar,
  SidebarContent,
  SidebarGroup,
  SidebarGroupContent,
  SidebarGroupLabel,
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
  SidebarFooter,
} from "@/components/ui/sidebar";
import { Button } from "@/components/ui/button";
import { useLanguage } from "@/contexts/LanguageContext";
import { useTheme } from "@/contexts/ThemeContext";
import { useLocation } from "wouter";

export function AppSidebar() {
  const { t, language, setLanguage } = useLanguage();
  const { theme, toggleTheme } = useTheme();
  const [location] = useLocation();

  const items = [
    {
      title: t("nav.dashboard"),
      url: "/",
      icon: LayoutDashboard,
    },
    {
      title: t("nav.transactions"),
      url: "/transactions",
      icon: ArrowLeftRight,
    },
    {
      title: t("nav.budgets"),
      url: "/budgets",
      icon: Wallet,
    },
    {
      title: t("nav.bills"),
      url: "/bills",
      icon: FileText,
    },
    {
      title: t("nav.insights"),
      url: "/insights",
      icon: Sparkles,
    },
  ];

  return (
    <Sidebar>
      <SidebarContent>
        <SidebarGroup>
          <SidebarGroupLabel className="text-xl font-bold px-4 py-6 flex items-center gap-2">
            <Sparkles className="h-6 w-6 text-primary" />
            <span className="bg-gradient-to-r from-primary to-primary/70 bg-clip-text text-transparent">
              FinGenius AI
            </span>
          </SidebarGroupLabel>
          <SidebarGroupContent>
            <SidebarMenu>
              {items.map((item) => (
                <SidebarMenuItem key={item.title}>
                  <SidebarMenuButton asChild isActive={location === item.url} data-testid={`link-${item.url.slice(1) || 'dashboard'}`}>
                    <a href={item.url} className="flex items-center gap-3">
                      <item.icon className="h-5 w-5" />
                      <span>{item.title}</span>
                    </a>
                  </SidebarMenuButton>
                </SidebarMenuItem>
              ))}
            </SidebarMenu>
          </SidebarGroupContent>
        </SidebarGroup>
      </SidebarContent>
      
      <SidebarFooter className="p-4 space-y-2">
        <Button
          variant="outline"
          size="sm"
          onClick={() => setLanguage(language === "en" ? "ta" : "en")}
          className="w-full justify-start gap-2"
          data-testid="button-language-toggle"
        >
          <Languages className="h-4 w-4" />
          <span>{language === "en" ? "தமிழ்" : "English"}</span>
        </Button>
        <Button
          variant="outline"
          size="sm"
          onClick={toggleTheme}
          className="w-full justify-start gap-2"
          data-testid="button-theme-toggle"
        >
          {theme === "light" ? <Moon className="h-4 w-4" /> : <Sun className="h-4 w-4" />}
          <span>{theme === "light" ? "Dark" : "Light"}</span>
        </Button>
      </SidebarFooter>
    </Sidebar>
  );
}
