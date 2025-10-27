// src/layouts/CoachLayout.jsx
import CoachSidebar from "@/components/ui/coach-sidebar/CoachSidebar";
import { SidebarProvider, SidebarTrigger } from "@/components/ui/sidebar";
import { Navigate, Outlet } from "react-router-dom";

import { isAuthenticated, isAuthenticatedRole } from "@/utils/jwtUtils";

const CoachLayout = () => {
  if (!isAuthenticated() || !isAuthenticatedRole("COACH")) {
    return <Navigate to="/login" replace />;
  }

  return (
    <SidebarProvider>
      <CoachSidebar />
      <div className="w-full min-h-screen">
        <SidebarTrigger />
        <main className="p-4">
          <Outlet />
        </main>
      </div>
    </SidebarProvider>
  );
};

export default CoachLayout;
