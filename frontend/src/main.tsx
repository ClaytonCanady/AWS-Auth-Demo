import { StrictMode } from "react";
import { createRoot } from "react-dom/client";
import { createBrowserRouter, RouterProvider } from "react-router-dom";
import "./index.css";
import App from "./App.tsx";

import AuthenticatedRoute from "../components/auth/AuthenticatedRoute.tsx";

import { amplifyConfig } from "./aws-exports.ts";
import { Amplify } from "aws-amplify";

Amplify.configure(amplifyConfig);

const router = createBrowserRouter([
  {
    path: "/",
    element: (
      <AuthenticatedRoute>
        <App />
      </AuthenticatedRoute>
    ),
  },
]);

createRoot(document.getElementById("root") as HTMLElement).render(
  <StrictMode>
    <RouterProvider router={router} />
  </StrictMode>
);
