import React, { Suspense, lazy } from "react";
import { Routes, Route } from "react-router-dom";
import AppShell from "./components/layout/AppShell.jsx";
import ProtectedRoute from "./routes/ProtectedRoute.jsx";
import AdminRoute from "./routes/AdminRoute.jsx";

const HomePage = lazy(() => import("./pages/Home/HomePage.jsx"));
const SignupPage = lazy(() => import("./pages/Signup/SignupPage.jsx"));
const LoginPage = lazy(() => import("./pages/Login/LoginPage.jsx"));
const RecommenderPage = lazy(() => import("./pages/Recommender/RecommenderPage.jsx"));
const ProfilePage = lazy(() => import("./pages/Profile/ProfilePage.jsx"));
const AdminDashboardPage = lazy(() => import("./pages/Admin/AdminDashboardPage.jsx"));
const ResetPasswordPage = lazy(() => import("./pages/ResetPassword/ResetPasswordPage.jsx"));

const App = () => (
  <Suspense fallback={<div className="app-loading">Loading application...</div>}>
    <Routes>
      <Route element={<AppShell />}>
        <Route path="/" element={<HomePage />} />
        <Route path="/signup" element={<SignupPage />} />
        <Route path="/login" element={<LoginPage />} />
        <Route path="/reset-password" element={<ResetPasswordPage />} />
        <Route
          path="/recommender"
          element={
            <ProtectedRoute>
              <RecommenderPage />
            </ProtectedRoute>
          }
        />
        <Route
          path="/profile"
          element={
            <ProtectedRoute>
              <ProfilePage />
            </ProtectedRoute>
          }
        />
        <Route
          path="/admin"
          element={
            <AdminRoute>
              <AdminDashboardPage />
            </AdminRoute>
          }
        />
      </Route>
    </Routes>
  </Suspense>
);

export default App;
