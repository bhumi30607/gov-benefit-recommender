import React, { useState } from "react";
import { GoogleLogin } from "@react-oauth/google";
import { toast } from "react-toastify";
import { useNavigate } from "react-router-dom";
import api from "../../api/axiosInstance";
import { useAuth } from "../../context/AuthContext";
import FormField from "../../components/common/FormField";
import { required, validateEmail, validatePassword } from "../../utils/validators";
import "./SignupPage.css";

const googleClientId = import.meta.env.VITE_GOOGLE_CLIENT_ID?.trim();
const hasGoogleAuth = googleClientId && googleClientId !== "your_google_client_id";

const defaultForm = {
  name: "",
  email: "",
  password: "",
  age: "",
  income: "",
  occupation: "",
  otp: ""
};

const SignupPage = () => {
  const navigate = useNavigate();
  const { syncSession } = useAuth();
  const [form, setForm] = useState(defaultForm);
  const [preview, setPreview] = useState("");
  const [file, setFile] = useState(null);
  const [errors, setErrors] = useState({});
  const [awaitingOtp, setAwaitingOtp] = useState(false);

  const validate = () => {
    const nextErrors = {};
    if (!required(form.name)) nextErrors.name = "Full name is required";
    if (!validateEmail(form.email)) nextErrors.email = "Enter a valid email";
    if (!validatePassword(form.password)) nextErrors.password = "Minimum 6 characters";
    if (!required(form.age)) nextErrors.age = "Age is required";
    if (!required(form.income)) nextErrors.income = "Income is required";
    if (!required(form.occupation)) nextErrors.occupation = "Occupation is required";
    return nextErrors;
  };

  const handleChange = (event) => {
    const { name, value } = event.target;
    setForm((prev) => ({ ...prev, [name]: value }));
  };

  const handleFileChange = (event) => {
    const nextFile = event.target.files?.[0];
    setFile(nextFile || null);
    if (!nextFile) {
      setPreview("");
      return;
    }

    const reader = new FileReader();
    reader.onload = () => setPreview(reader.result);
    reader.readAsDataURL(nextFile);
  };

  const handleSignup = async (event) => {
    event.preventDefault();
    const nextErrors = validate();
    setErrors(nextErrors);
    if (Object.keys(nextErrors).length) return;

    const payload = new FormData();
    Object.entries(form).forEach(([key, value]) => {
      if (key !== "otp") payload.append(key, value);
    });
    if (file) payload.append("profilePicture", file);

    const { data } = await api.post("/auth/signup", payload, {
      headers: { "Content-Type": "multipart/form-data" }
    });
    toast.success(data.message);
    setAwaitingOtp(true);
  };

  const handleOtpVerification = async (event) => {
    event.preventDefault();
    const { data } = await api.post("/auth/verify-otp", {
      email: form.email,
      otp: form.otp
    });
    syncSession(data);
    toast.success(data.message);
    navigate("/recommender");
  };

  const handleGoogleSuccess = async (credentialResponse) => {
    const { data } = await api.post("/auth/google", {
      credential: credentialResponse.credential,
      age: form.age,
      income: form.income,
      occupation: form.occupation
    });
    syncSession(data);
    toast.success(data.message);
    navigate("/recommender");
  };

  return (
    <div className="auth-page">
      <form className="auth-card" onSubmit={awaitingOtp ? handleOtpVerification : handleSignup}>
        <div>
          <span className="eyebrow">Create your account</span>
          <h1>Citizen signup</h1>
        </div>

        {!awaitingOtp ? (
          <>
            <FormField label="Full Name" error={errors.name}>
              <input name="name" value={form.name} onChange={handleChange} />
            </FormField>
            <FormField label="Email" error={errors.email}>
              <input name="email" value={form.email} onChange={handleChange} />
            </FormField>
            <FormField label="Password" error={errors.password}>
              <input type="password" name="password" value={form.password} onChange={handleChange} />
            </FormField>
            <div className="form-row">
              <FormField label="Age" error={errors.age}>
                <input name="age" value={form.age} onChange={handleChange} />
              </FormField>
              <FormField label="Income" error={errors.income}>
                <input name="income" value={form.income} onChange={handleChange} />
              </FormField>
            </div>
            <FormField label="Occupation" error={errors.occupation}>
              <input name="occupation" value={form.occupation} onChange={handleChange} />
            </FormField>
            <FormField label="Profile Picture">
              <input type="file" accept="image/*" onChange={handleFileChange} />
            </FormField>
            {preview ? <img src={preview} alt="Preview" className="profile-preview" /> : null}
            <button className="primary-button" type="submit">
              Sign Up
            </button>
            {hasGoogleAuth ? (
              <>
                <div className="divider">or</div>
                <GoogleLogin onSuccess={handleGoogleSuccess} onError={() => toast.error("Google login failed")} />
              </>
            ) : null}
          </>
        ) : (
          <>
            <p>We sent a verification code to {form.email}.</p>
            <FormField label="OTP Code">
              <input name="otp" value={form.otp} onChange={handleChange} />
            </FormField>
            <button className="primary-button" type="submit">
              Verify OTP
            </button>
          </>
        )}
      </form>
    </div>
  );
};

export default SignupPage;
