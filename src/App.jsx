import AppLoading from "@/components/loadings/AppLoading";
import AdminLayout from "@/layouts/AdminLayout";
import AdminPage from "@/pages/admin/AdminPage";
import SchedulePage from "@/pages/admin/SchedulePage";
import NotFound from "@/pages/error/NotFound";
import Home from "@/pages/Home";
import Login from "@/pages/Login";
import { useEffect, useState } from "react";
import { createBrowserRouter, RouterProvider } from "react-router-dom";
import DashboardRedirect from "./components/DashboardRedirect";
import CoachLayout from "./layouts/CoachLayout";
import CoachPage from "./pages/coach/CoachPage";
import Resources from "./pages/Resources";
import MainLayout from "./layouts/MainLayout";
import Community from "./pages/Community";
import About from "./pages/About";
import News from "./pages/News";
import ToastProvider from "./components/ui/ToastProvider";
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
          path: "/admin/schedule",
          element: <SchedulePage />,
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
      <RouterProvider router={router} />
    </ToastProvider>
  );
}

export default App;
