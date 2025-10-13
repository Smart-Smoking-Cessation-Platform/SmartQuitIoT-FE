import { SidebarProvider, SidebarTrigger } from "@/components/ui/sidebar";
import { Navigate, Outlet } from "react-router-dom";

import { isAuthenticated, isAuthenticatedRole } from "@/utils/jwtUtils";

const CoachLayout = () => {
  if (!isAuthenticated() || !isAuthenticatedRole("COACH")) {
    return <Navigate to="/login" replace />;
  }

  return (
    <SidebarProvider>
      <div>coach header</div>
      <Outlet />
    </SidebarProvider>
  );
};

export default CoachLayout;