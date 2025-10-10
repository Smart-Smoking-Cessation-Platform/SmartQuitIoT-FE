import React from "react";
import AdminSidebar from "@/components/ui/admin-sidebar";
import { SidebarProvider } from "@/components/ui/sidebar";
import { Outlet } from "react-router-dom";

/**
 * Layout: left fixed sidebar (w-64), right content flex-1
 * - SidebarProvider giữ context cho sidebar components
 * - main area is flex-1 and will take full remaining width
 */
export default function AdminLayout() {
  // NOTE: auth guard already handled inside AdminSidebar or upstream
  return (
    <SidebarProvider>
      <div className="min-h-screen flex bg-slate-50">
        <aside className="w-64 flex-shrink-0">
          <AdminSidebar />
        </aside>

        {/* Main content */}
        <main className="flex-1 min-h-screen overflow-auto">
          <div className=" border-b bg-white"></div>

          {/* Page content from routes */}
          <div className="">
            <Outlet />
          </div>
        </main>
      </div>
    </SidebarProvider>
  );
}
