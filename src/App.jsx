import AppLoading from "@/components/loadings/AppLoading";
import AdminLayout from "@/layouts/AdminLayout";
import AddCoachPage from "@/pages/admin/pages/AddCoachPage";
import AdminPage from "@/pages/admin/pages/AdminPage";
import CreateNewsPage from "@/pages/admin/pages/CreateNewsPage";
import ManageCoaches from "@/pages/admin/pages/ManageCoaches";
import ManageMembershipPackage from "@/pages/admin/pages/ManageMembershipPackage";
import ManageMissions from "@/pages/admin/pages/ManageMissions";
import ManageNews from "@/pages/admin/pages/ManageNews";
import ManageSlots from "@/pages/admin/pages/ManageSlots";
import SchedulePage from "@/pages/admin/pages/SchedulePage";
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
import CoachSchedulePage from "@/pages/coach/CoachSchedulePage";
import CoachAppointmentsPage from "@/pages/coach/CoachAppointmentsPage";
import CoachChatPage from "@/pages/coach/CoachChatPage";
import MeetingPage from "@/pages/coach/MeetingPage";
import ManageAchievements from "@/pages/admin/pages/ManageAchievements";
import ManagePhases from "@/pages/admin/pages/ManagePhases";
import ManagePassCondition from "@/pages/admin/pages/ManagePassCondition";
import ManagePayment from "@/pages/admin/pages/ManagePayment";
import ManageSubscriptions from "@/pages/admin/pages/ManageSubscriptions";
import ManageMembers from "@/pages/admin/pages/ManageMembers";
import ManageBlogs from "@/pages/admin/pages/ManageBlogs";
import MemberDetail from "@/pages/admin/pages/MemberDetail";
import CoachDetail from "@/pages/admin/pages/CoachDetail";
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
      element: <CoachLayout />,
      children: [
        { path: "/coach", element: <CoachPage /> },
        { path: "/coach/schedule", element: <CoachSchedulePage /> },
        { path: "/coach/appointments", element: <CoachAppointmentsPage /> },
        { path: "/coach/chat", element: <CoachChatPage /> },
        { path: "/meeting/:appointmentId", element: <MeetingPage /> },
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
        {
          path: "/admin/manage-news",
          element: <ManageNews />,
        },
        {
          path: "/admin/manage-news/create",
          element: <CreateNewsPage />,
        },
        {
          path: "/admin/manage-missions",
          element: <ManageMissions />,
        },
        {
          path: "/admin/manage-achievements",
          element: <ManageAchievements />,
        },
        {
          path: "/admin/manage-phases",
          element: <ManagePhases />,
        },
        {
          path: "/admin/manage-pass-conditions",
          element: <ManagePassCondition />,
        },
        {
          path: "/admin/manage-payments",
          element: <ManagePayment />,
        },
        {
          path: "/admin/manage-subscriptions",
          element: <ManageSubscriptions />,
        },
        {
          path: "/admin/manage-members",
          element: <ManageMembers />,
        },
        {
          path: "/admin/manage-blogs",
          element: <ManageBlogs />,
        },
        {
          path: "/admin/manage-members/:memberId",
          element: <MemberDetail />,
        },
        {
          path: "/admin/manage-coaches/:coachId",
          element: <CoachDetail />,
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
