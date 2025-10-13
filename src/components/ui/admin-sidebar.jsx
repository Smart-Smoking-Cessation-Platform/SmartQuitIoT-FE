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
        <NavAdminSidebar />
      </SidebarFooter>
    </Sidebar>
  );
};

export default AdminSidebar;
