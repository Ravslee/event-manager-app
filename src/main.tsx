import ReactDOM from "react-dom/client";
import { RouterProvider } from "react-router-dom";

import QueryProvider from "./providers/QueryProvider";
import { AuthProvider } from "./providers/AuthProvider";
import { router } from "./routes/AppRoutes";
import "./index.css";
import { SidebarProvider } from "./context/SidebarContext";

ReactDOM.createRoot(document.getElementById("root")!).render(
  <QueryProvider>
    <AuthProvider>
      <SidebarProvider>
        <RouterProvider router={router} />
      </SidebarProvider>
    </AuthProvider>
  </QueryProvider>,
);

