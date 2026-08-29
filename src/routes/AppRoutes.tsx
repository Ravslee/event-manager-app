import { createBrowserRouter } from "react-router-dom";

import AuthLayout from "@/layouts/AuthLayout";

import LandingPage from "@/features/landing/pages/LandingPage";
import LoginPage from "@/features/auth/pages/LoginPage";
import RegisterPage from "@/features/auth/pages/RegisterPage";

import DashboardPage from "@/features/dashboard/pages/DashboardPage";
import CalendarPage from "@/features/calendar/pages/CalendarPage";
import EventsPage from "@/features/events/pages/EventsPage";
import PaymentsPage from "@/features/payments/pages/PaymentsPage";
import PaymentDetailsPage from "@/features/payments/pages/PaymentDetailsPage";
import ServicesPage from "@/features/services/pages/ServicesPage";
import ServiceDetailsPage from "@/features/services/pages/ServiceDetailsPage";
import EventTypesPage from "@/features/event-types/pages/EventTypesPage";
import SettingsPage from "@/features/settings/pages/SettingsPage";
import MainLayout from "@/layouts/MainLayout";
import ProtectedRoute from "./ProtectedRoute";

import { Navigate } from "react-router-dom";
import { useAuth } from "@/context/AuthContext";
import { Loader2 } from "lucide-react";

function RootIndexRoute() {
  const { isAuthenticated, isLoading } = useAuth();

  if (isLoading) {
    return (
      <div className="flex h-screen w-full items-center justify-center bg-background">
        <Loader2 className="h-8 w-8 animate-spin text-primary" />
      </div>
    );
  }

  if (isAuthenticated) {
    return <Navigate to="/dashboard" replace />;
  }

  return <LandingPage />;
}

export const router = createBrowserRouter([
  // Public Routes
  {
    path: "/",
    element: <RootIndexRoute />,
  },
  {
    path: "/landing",
    element: <LandingPage />,
  },
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
            path: "payments/:eventId",
            element: <PaymentDetailsPage />,
          },
          {
            path: "services",
            element: <ServicesPage />,
          },
          {
            path: "services/:id",
            element: <ServiceDetailsPage />,
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
