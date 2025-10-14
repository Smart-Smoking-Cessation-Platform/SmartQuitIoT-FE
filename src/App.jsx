import AppLoading from "@/components/loadings/AppLoading";
import AdminLayout from "@/layouts/AdminLayout";
import AdminPage from "@/pages/admin/AdminPage";
import ManageCoaches from "@/pages/admin/ManageCoaches";
import ManageMembershipPackage from "@/pages/admin/ManageMembershipPackage";
import SchedulePage from "@/pages/admin/schedule/SchedulePage";
import NotFound from "@/pages/error/NotFound";
import Home from "@/pages/Home";
import Login from "@/pages/Login";
import { useEffect, useState } from "react";
import { createBrowserRouter, RouterProvider } from "react-router-dom";
import DashboardRedirect from "./components/DashboardRedirect";
import ConfirmProvider from "./context/ConfirmProvider";
import ToastProvider from "./context/ToastProvider";
import CoachLayout from "./layouts/CoachLayout";
import MainLayout from "./layouts/MainLayout";
import About from "./pages/About";
import CoachPage from "./pages/coach/CoachPage";
import Community from "./pages/Community";
import News from "./pages/News";
import Resources from "./pages/Resources";
import ManageSlots from "@/pages/admin/ManageSlots";
import AddCoachPage from "@/pages/admin/AddCoachPage";
function App() {
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    setTimeout(() => {
      setIsLoading(false);
    }, 1500);
  }, []);
  if (isLoading) {
    return <AppLoading />;
  }

  const router = createBrowserRouter([
    {
      path: "*",
      element: <NotFound />,
    },
    { path: "/dashboard", element: <DashboardRedirect /> },
    {
      path: "/login",
      element: <Login />,
    },

    {
      element: <MainLayout />,
      children: [
        { path: "/", element: <Home /> },
        { path: "/resources", element: <Resources /> },
        { path: "/community", element: <Community /> },
        { path: "/news", element: <News /> },
        { path: "/about", element: <About /> },
      ],
    },
    {
      element: <AdminLayout />,
      children: [
        {
          path: "/admin",
          element: <AdminPage />,
        },
        {
          path: "/admin/manage-schedule",
          element: <SchedulePage />,
        },
        {
          path: "/admin/manage-coaches",
          element: <ManageCoaches />,
        },
        {
          path: "/admin/manage-coaches/create",
          element: <AddCoachPage />,
        },
        {
          path: "/admin/manage-membership-packages",
          element: <ManageMembershipPackage />,
        },
        {
          path: "/admin/manage-slot-times",
          element: <ManageSlots />,
        },
      ],
    },
    {
      element: <CoachLayout />,
      children: [
        {
          path: "/coach",
          element: <CoachPage />,
        },
      ],
    },
  ]);

  return (
    <ToastProvider>
      <ConfirmProvider>
        <RouterProvider router={router} />
      </ConfirmProvider>
    </ToastProvider>
  );
}

export default App;
