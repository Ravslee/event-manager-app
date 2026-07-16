import ReactDOM from "react-dom/client";
import { RouterProvider } from "react-router-dom";

import QueryProvider from "./providers/QueryProvider";
import { router } from "./routes/AppRoutes";
import "./index.css";
import { SidebarProvider } from "./context/SidebarContext";

ReactDOM.createRoot(document.getElementById("root")!).render(
  // <QueryProvider>
  //   <RouterProvider router={router} />
  // </QueryProvider>,

  <QueryProvider>
    <SidebarProvider>
      <RouterProvider router={router} />
    </SidebarProvider>
  </QueryProvider>,
);
