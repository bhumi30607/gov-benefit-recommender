import React, { useState } from "react";
import { useNavigate, useSearchParams } from "react-router-dom";
import { toast } from "react-toastify";
import api from "../../api/axiosInstance";
import FormField from "../../components/common/FormField";

const ResetPasswordPage = () => {
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();
  const [password, setPassword] = useState("");

  const handleSubmit = async (event) => {
    event.preventDefault();
    const { data } = await api.post("/auth/reset-password", {
      email: searchParams.get("email"),
      token: searchParams.get("token"),
      password
    });
    toast.success(data.message);
    navigate("/login");
  };

  return (
    <div className="auth-page">
      <form className="auth-card" onSubmit={handleSubmit}>
        <div>
          <span className="eyebrow">Reset password</span>
          <h1>Create a new password</h1>
        </div>
        <FormField label="New Password">
          <input type="password" value={password} onChange={(e) => setPassword(e.target.value)} />
        </FormField>
        <button className="primary-button" type="submit">
          Update Password
        </button>
      </form>
    </div>
  );
};

export default ResetPasswordPage;
