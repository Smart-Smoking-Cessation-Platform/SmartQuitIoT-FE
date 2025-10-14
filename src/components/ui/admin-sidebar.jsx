<<<<<<< HEAD
import React, { useEffect, useState } from "react";
import { NavLink } from "react-router-dom";
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
  Menu,
  LogOut,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
=======
import { LayoutDashboard, List } from "lucide-react";

import logo from "@/assets/logo.png";
import NavAdminSidebar from "@/components/ui/nav-admin-sidebar";
>>>>>>> 208df09 (feat: modified admin layout, fix error message at login)
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
<<<<<<< HEAD
import { Switch } from "@/components/ui/switch";
import { useTheme } from "@/context/theme-provider";
import { useNavigate } from "react-router-dom";
import { getAdminProfile } from "@/services/accountService";
=======
>>>>>>> 208df09 (feat: modified admin layout, fix error message at login)

/**
 * Polished AdminSidebar
 * - consistent accent palette (emerald)
 * - clear active / hover states
 * - profile avatar from initials
 * - accessible NavLink usage (no full page reload)
 */

const items = [
<<<<<<< HEAD
  { title: "Home", url: "/admin", icon: Home },
  { title: "Schedule", url: "/admin/schedule", icon: Calendar },
  { title: "Inbox", url: "/admin/inbox", icon: Inbox },
  { title: "Calendar", url: "/admin/calendar", icon: Calendar },
  { title: "Search", url: "/admin/search", icon: Search },
  { title: "Settings", url: "/admin/settings", icon: Settings },
=======
  {
    title: "Dashboard",
    url: "#",
    icon: LayoutDashboard,
  },
  {
    title: "Manage Blogs",
    url: "#blogs",
    icon: List,
  },
  {
    title: "Manage Missions",
    url: "#missions",
    icon: List,
  },
  {
    title: "Manage Achievements",
    url: "#achievements",
    icon: List,
  },
  {
    title: "Manage Users",
    url: "#users",
    icon: List,
  },
  {
    title: "Manage Membership Packages",
    url: "#membership-packages",
    icon: List,
  },
  {
    title: "Manage Pass Conditions",
    url: "#pass-conditions",
    icon: List,
  },
  {
    title: "Manage Phases",
    url: "#phases",
    icon: List,
  },
  {
    title: "Manage Coaches",
    url: "#coaches",
    icon: List,
  },
  {
    title: "Manage Subscriptions",
    url: "#subscriptions",
    icon: List,
  },
  {
    title: "Manage Payments",
    url: "#payments",
    icon: List,
  },
>>>>>>> 208df09 (feat: modified admin layout, fix error message at login)
];

function initialsFromName(name = "") {
  if (!name) return "AD";
  const parts = name.trim().split(/\s+/);
  if (parts.length === 1) return parts[0].slice(0, 2).toUpperCase();
  return (parts[0][0] + parts[parts.length - 1][0]).toUpperCase();
}

const AdminSidebar = () => {
<<<<<<< HEAD
  const { theme, setTheme } = useTheme();
  const nav = useNavigate();
  const [admin, setAdmin] = useState({});
  const [collapsed, setCollapsed] = useState(false);

  useEffect(() => {
    let mounted = true;
    getAdminProfile()
      .then((response) => {
        if (mounted && response?.status === 200) setAdmin(response.data);
      })
      .catch((err) => console.error(err));
    return () => (mounted = false);
  }, []);

  const handleLogout = () => {
    localStorage.removeItem("accessToken");
    localStorage.removeItem("refreshToken");
    nav("/login");
  };

  const accent = "emerald"; // single source of truth for color naming in classes

  return (
    <Sidebar
      className={`h-screen bg-white border-r shadow-sm transition-all ${
        collapsed ? "w-20" : "w-64"
      }`}
    >
      {/* Header */}
      <SidebarHeader>
        <div
          className={`flex items-center justify-between px-4 py-3 ${
            collapsed ? "flex-col gap-2" : ""
          }`}
        >
          <div className="flex items-center gap-3">
            <div
              className={`flex items-center justify-center rounded-lg ${
                collapsed ? "w-8 h-8" : "w-10 h-10"
              } bg-gradient-to-br from-emerald-400 to-emerald-600 shadow`}
            >
              <Calendar className="w-5 h-5 text-white" />
            </div>

            {!collapsed && (
              <div>
                <div className="text-lg font-semibold text-slate-800">
                  SmartQuitIoT
                </div>
                <div className="text-xs text-slate-400">Admin panel</div>
              </div>
            )}
          </div>

          {/* collapse toggle (small) */}
          <button
            aria-label={collapsed ? "Mở sidebar" : "Thu gọn sidebar"}
            title={collapsed ? "Mở sidebar" : "Thu gọn sidebar"}
            onClick={() => setCollapsed((s) => !s)}
            className="p-1 rounded-md hover:bg-slate-100"
          >
            <Menu className="w-5 h-5 text-slate-600" />
          </button>
        </div>
      </SidebarHeader>

      {/* Content / Menu */}
      <SidebarContent className="overflow-auto">
        <SidebarGroup>
          {!collapsed && <SidebarGroupLabel>Application</SidebarGroupLabel>}
=======
  return (
    <Sidebar>
      <SidebarHeader>
        <div className="flex justify-center items-center space-x-2">
          <img src={logo} alt="Logo" className="h-12 w-auto" />
          <h1 className="text-2xl font-bold">
            <span className="text-green-600">Smart</span>
            <span className="text-emerald-950">Quit</span>
          </h1>
        </div>
      </SidebarHeader>
      <SidebarContent>
        <SidebarGroup>
          <SidebarGroupLabel>Administrator</SidebarGroupLabel>
>>>>>>> 208df09 (feat: modified admin layout, fix error message at login)
          <SidebarGroupContent>
            <SidebarMenu>
              {items.map((item) => (
                <SidebarMenuItem key={item.title}>
                  <SidebarMenuButton asChild>
                    <NavLink
                      to={item.url}
                      className={({ isActive }) =>
                        [
                          "flex items-center gap-3 px-3 py-2 rounded-md transition-colors",
                          isActive
                            ? `bg-${accent}-50 text-${accent}-700 font-semibold`
                            : "text-slate-700 hover:bg-slate-100",
                          collapsed ? "justify-center px-0" : "",
                        ].join(" ")
                      }
                    >
                      <item.icon
                        className={`w-5 h-5 ${
                          // color icon when active for better contrast
                          "text-slate-600"
                        }`}
                      />
                      {!collapsed && (
                        <span className="truncate">{item.title}</span>
                      )}
                    </NavLink>
                  </SidebarMenuButton>
                </SidebarMenuItem>
              ))}
            </SidebarMenu>
          </SidebarGroupContent>
        </SidebarGroup>
      </SidebarContent>
<<<<<<< HEAD

      {/* Footer / Profile */}
      <SidebarFooter className="px-3 py-4">
        <SidebarMenu>
          <SidebarMenuItem>
            <Popover>
              <PopoverTrigger asChild>
                <SidebarMenuButton
                  className={`w-full flex items-center gap-3 rounded-md px-2 py-2 hover:bg-slate-100 transition ${
                    collapsed ? "justify-center" : ""
                  }`}
                >
                  <div
                    className={`flex items-center justify-center rounded-full bg-emerald-100 text-emerald-700 ${
                      collapsed ? "w-8 h-8" : "w-10 h-10"
                    } font-bold`}
                    title={admin.username || "Admin"}
                    aria-hidden={collapsed}
                  >
                    {initialsFromName(admin.username)}
                  </div>

                  {!collapsed && (
                    <>
                      <div className="flex-1 text-left">
                        <div className="font-medium text-slate-800 truncate">
                          {admin.username || "Admin"}
                        </div>
                        <div className="text-xs text-slate-400 truncate">
                          {admin.email || ""}
                        </div>
                      </div>
                      <ChevronUp className="w-4 h-4 text-slate-400" />
                    </>
                  )}
                </SidebarMenuButton>
              </PopoverTrigger>

              <PopoverContent className="w-72">
                <div className="grid gap-4">
                  <div>
                    <div className="text-sm font-semibold">Smart Quit IoT</div>
                    <div className="text-xs text-slate-500">
                      {admin.email || "—"}
                    </div>
                  </div>

                  <div className="flex items-center justify-between gap-4">
                    <div className="flex items-center gap-3">
                      <Switch
                        id="theme-mode"
                        checked={theme === "dark"}
                        onCheckedChange={() =>
                          setTheme(theme === "light" ? "dark" : "light")
                        }
                      />
                      <Label htmlFor="theme-mode" className="text-sm">
                        {theme === "dark" ? (
                          <div className="flex items-center gap-2">
                            <MoonIcon className="w-4 h-4" />
                            <span>Dark</span>
                          </div>
                        ) : (
                          <div className="flex items-center gap-2">
                            <SunIcon className="w-4 h-4" />
                            <span>Light</span>
                          </div>
                        )}
                      </Label>
                    </div>

                    <div>
                      <Button
                        variant={"destructive"}
                        size="sm"
                        onClick={handleLogout}
                        className="flex items-center gap-2"
                      >
                        <LogOut className="w-4 h-4" />
                        Log out
                      </Button>
                    </div>
                  </div>
                </div>
              </PopoverContent>
            </Popover>
          </SidebarMenuItem>
        </SidebarMenu>
=======
      <SidebarFooter>
        <NavAdminSidebar />
>>>>>>> 208df09 (feat: modified admin layout, fix error message at login)
      </SidebarFooter>
    </Sidebar>
  );
};

export default AdminSidebar;
