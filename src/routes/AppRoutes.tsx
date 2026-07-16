import { createBrowserRouter } from "react-router-dom";

import AppLayout from "@/layouts/AppLayout";
import AuthLayout from "@/layouts/AuthLayout";

import LoginPage from "@/features/auth/pages/LoginPage";
import RegisterPage from "@/features/auth/pages/RegisterPage";

import DashboardPage from "@/features/dashboard/pages/DashboardPage";
import CalendarPage from "@/features/calendar/pages/CalendarPage";
import EventsPage from "@/features/events/pages/EventsPage";
import PaymentsPage from "@/features/payments/pages/PaymentsPage";
import ServicesPage from "@/features/services/pages/ServicesPage";
import EventTypesPage from "@/features/event-types/pages/EventTypesPage";
import SettingsPage from "@/features/settings/pages/SettingsPage";
import MainLayout from "@/layouts/MainLayout";
import ProtectedRoute from "./ProtectedRoute";

export const router = createBrowserRouter([
  // Public Routes
  {
    element: <AuthLayout />,
    children: [
      {
        path: "/login",
        element: <LoginPage />,
      },
      {
        path: "/register",
        element: <RegisterPage />,
      },
    ],
  },

  {
    element: <ProtectedRoute />,
    children: [
      {
        element: <MainLayout />,
        children: [
          {
            index: true,
            element: <DashboardPage />,
          },
          {
            path: "dashboard",
            element: <DashboardPage />,
          },
          {
            path: "calendar",
            element: <CalendarPage />,
          },
          {
            path: "events",
            element: <EventsPage />,
          },
          {
            path: "payments",
            element: <PaymentsPage />,
          },
          {
            path: "services",
            element: <ServicesPage />,
          },
          {
            path: "event-types",
            element: <EventTypesPage />,
          },
          {
            path: "settings",
            element: <SettingsPage />,
          },
        ],
      },
    ],
  },
]);
