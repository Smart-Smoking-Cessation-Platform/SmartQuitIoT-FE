import { LayoutDashboard, List } from "lucide-react";

import logo from "@/assets/logo.png";
import NavAdminSidebar from "@/components/ui/nav-admin-sidebar";
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

const items = [
  { title: "Home", url: "/admin", icon: Home },
  { title: "Schedule", url: "/admin/schedule", icon: Calendar },
  { title: "Inbox", url: "/admin/inbox", icon: Inbox },
  { title: "Calendar", url: "/admin/calendar", icon: Calendar },
  { title: "Search", url: "/admin/search", icon: Search },
  { title: "Settings", url: "/admin/settings", icon: Settings },
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
];

function initialsFromName(name = "") {
  if (!name) return "AD";
  const parts = name.trim().split(/\s+/);
  if (parts.length === 1) return parts[0].slice(0, 2).toUpperCase();
  return (parts[0][0] + parts[parts.length - 1][0]).toUpperCase();
}

const AdminSidebar = () => {
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
      <SidebarFooter>
        <NavAdminSidebar />
      </SidebarFooter>
    </Sidebar>
  );
};

export default AdminSidebar;
