import React, { useState } from "react";
import { GoogleLogin } from "@react-oauth/google";
import { toast } from "react-toastify";
import { useLocation, useNavigate } from "react-router-dom";
import api from "../../api/axiosInstance";
import { useAuth } from "../../context/AuthContext";
import FormField from "../../components/common/FormField";
import "./LoginPage.css";

const googleClientId = import.meta.env.VITE_GOOGLE_CLIENT_ID?.trim();
const hasGoogleAuth = googleClientId && googleClientId !== "your_google_client_id";

const LoginPage = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const { syncSession } = useAuth();
  const [form, setForm] = useState({ email: "", password: "", resetEmail: "" });
  const [showReset, setShowReset] = useState(false);

  const redirectPath = location.state?.from || "/recommender";

  const handleChange = (event) => {
    const { name, value } = event.target;
    setForm((prev) => ({ ...prev, [name]: value }));
  };

  const handleLogin = async (event) => {
    event.preventDefault();
    const { data } = await api.post("/auth/login", form);
    syncSession(data);
    toast.success(data.message);
    navigate(redirectPath);
  };

  const handleForgotPassword = async () => {
    const { data } = await api.post("/auth/forgot-password", { email: form.resetEmail });
    toast.success(data.message);
    setShowReset(false);
  };

  const handleGoogleSuccess = async (credentialResponse) => {
    const { data } = await api.post("/auth/google", {
      credential: credentialResponse.credential
    });
    syncSession(data);
    toast.success(data.message);
    navigate(redirectPath);
  };

  return (
    <div className="auth-page login-layout">
      <div className="login-aside">
        <span className="eyebrow">Access your account</span>
        <h1>Return to your saved schemes and searches.</h1>
      </div>
      <form className="auth-card" onSubmit={handleLogin}>
        <FormField label="Email">
          <input name="email" value={form.email} onChange={handleChange} />
        </FormField>
        <FormField label="Password">
          <input type="password" name="password" value={form.password} onChange={handleChange} />
        </FormField>
        <button className="primary-button" type="submit">
          Login
        </button>
        <button type="button" className="text-button" onClick={() => setShowReset((prev) => !prev)}>
          Forgot password?
        </button>
        {showReset ? (
          <div className="reset-box">
            <input
              placeholder="Email for reset link"
              name="resetEmail"
              value={form.resetEmail}
              onChange={handleChange}
            />
            <button type="button" className="ghost-button" onClick={handleForgotPassword}>
              Send Reset Email
            </button>
          </div>
        ) : null}
        {hasGoogleAuth ? (
          <>
            <div className="divider">or</div>
            <GoogleLogin onSuccess={handleGoogleSuccess} onError={() => toast.error("Google login failed")} />
          </>
        ) : null}
      </form>
    </div>
  );
};

export default LoginPage;
