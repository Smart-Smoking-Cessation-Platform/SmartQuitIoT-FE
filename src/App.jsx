import AppLoading from "@/components/loadings/AppLoading";
import AdminLayout from "@/layouts/AdminLayout";
import AdminPage from "@/pages/admin/AdminPage";
import NotFound from "@/pages/error/NotFound";
import Home from "@/pages/Home";
import Login from "@/pages/Login";
import { useEffect, useState } from "react";
import { createBrowserRouter, RouterProvider } from "react-router-dom";

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
    {
      path: "/",
      element: <Home />,
    },
    {
      path: "/login",
      element: <Login />,
    },
    {
      element: <AdminLayout />,
      children: [
        {
          path: "/admin",
          element: <AdminPage />,
        },
      ],
    },
  ]);

  return <RouterProvider router={router} />;
}

export default App;
