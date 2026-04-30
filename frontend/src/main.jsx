import React from "react";
import ReactDOM from "react-dom/client";
import { BrowserRouter } from "react-router-dom";
import { GoogleOAuthProvider } from "@react-oauth/google";
import { ToastContainer } from "react-toastify";
import App from "./App.jsx";
import { AuthProvider } from "./context/AuthContext.jsx";
import AppErrorBoundary from "./components/common/AppErrorBoundary.jsx";
import "react-toastify/dist/ReactToastify.css";
import "./styles/global.css";

const googleClientId = import.meta.env.VITE_GOOGLE_CLIENT_ID?.trim();
const hasGoogleAuth = googleClientId && googleClientId !== "your_google_client_id";

const appTree = (
  <BrowserRouter>
    <AuthProvider>
      <AppErrorBoundary>
        <App />
      </AppErrorBoundary>
      <ToastContainer position="top-right" autoClose={2500} />
    </AuthProvider>
  </BrowserRouter>
);

ReactDOM.createRoot(document.getElementById("root")).render(
  <React.StrictMode>
    {hasGoogleAuth ? (
      <GoogleOAuthProvider clientId={googleClientId}>{appTree}</GoogleOAuthProvider>
    ) : (
      appTree
    )}
  </React.StrictMode>
);
