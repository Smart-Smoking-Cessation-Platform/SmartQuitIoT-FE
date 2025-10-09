import {
  Calendar,
  ChevronUp,
  Home,
  Inbox,
  MoonIcon,
  Search,
  Settings,
  SunIcon,
  User2,
} from "lucide-react";

import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import {
  Sidebar,
  SidebarContent,
  SidebarFooter,
  SidebarGroup,
  SidebarGroupContent,
  SidebarGroupLabel,
  SidebarHeader,
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
} from "@/components/ui/sidebar";
import { Switch } from "@/components/ui/switch";
import { useTheme } from "@/context/theme-provider";
import { useNavigate } from "react-router-dom";
import { useEffect, useState } from "react";
import { getAdminProfile } from "@/services/accountService";

const items = [
  {
    title: "Home",
    url: "#",
    icon: Home,
  },
  {
    title: "Inbox",
    url: "#",
    icon: Inbox,
  },
  {
    title: "Calendar",
    url: "#",
    icon: Calendar,
  },
  {
    title: "Search",
    url: "#",
    icon: Search,
  },
  {
    title: "Settings",
    url: "#",
    icon: Settings,
  },
];

const AdminSidebar = () => {
  const { theme, setTheme } = useTheme();
  const nav = useNavigate();
  const [admin, setAdmin] = useState({});

  const fetchAdminProfile = async () => {
    try {
      const response = await getAdminProfile();
      if (response.status === 200) {
        setAdmin(response.data);
      }
    } catch (error) {
      console.error("Error fetching admin profile:", error);
    }
  };

  useEffect(() => {
    fetchAdminProfile();
  }, []);

  const handleLogout = () => {
    localStorage.removeItem("accessToken");
    localStorage.removeItem("refreshToken");
    nav("/login");
  };

  return (
    <Sidebar>
      <SidebarHeader />
      <SidebarContent>
        <SidebarGroup>
          <SidebarGroupLabel>Application</SidebarGroupLabel>
          <SidebarGroupContent>
            <SidebarMenu>
              {items.map((item) => (
                <SidebarMenuItem key={item.title}>
                  <SidebarMenuButton asChild>
                    <a href={item.url}>
                      <item.icon />
                      <span>{item.title}</span>
                    </a>
                  </SidebarMenuButton>
                </SidebarMenuItem>
              ))}
            </SidebarMenu>
          </SidebarGroupContent>
        </SidebarGroup>
      </SidebarContent>
      <SidebarFooter>
        <SidebarMenu>
          <SidebarMenuItem>
            <Popover>
              <PopoverTrigger asChild>
                <SidebarMenuButton>
                  <User2 /> {admin.username}
                  <ChevronUp className="ml-auto" />
                </SidebarMenuButton>
              </PopoverTrigger>
              <PopoverContent className="w-80">
                <div className="grid gap-4">
                  <div className="space-y-2">
                    <h4 className="leading-none font-medium">Smart Quit IoT</h4>
                  </div>
                  <p className="text-muted-foreground text-sm">{admin.email}</p>
                  <div className="grid gap-2">
                    <div className="grid grid-cols-3 items-center gap-4">
                      <Switch
                        id="theme-mode"
                        className="data-[state=checked]:bg-white data-[state=unchecked]:bg-zinc-800"
                        checked={theme === "dark"}
                        onCheckedChange={() =>
                          setTheme(theme === "light" ? "dark" : "light")
                        }
                      />
                      <Label htmlFor="theme-mode" className="">
                        {theme === "dark" ? (
                          <MoonIcon className="w-5 h-5" />
                        ) : (
                          <SunIcon className="w-5 h-5" />
                        )}
                      </Label>
                    </div>
                    <div className="grid grid-cols-1 items-center gap-4">
                      <Button variant={"destructive"} onClick={handleLogout}>
                        Log Out
                      </Button>
                    </div>
                  </div>
                </div>
              </PopoverContent>
            </Popover>
          </SidebarMenuItem>
        </SidebarMenu>
      </SidebarFooter>
    </Sidebar>
  );
};

export default AdminSidebar;
