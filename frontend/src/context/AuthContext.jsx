import React, { createContext, useContext, useEffect, useState } from "react";
import api from "../api/axiosInstance";

const AuthContext = createContext(null);

const getStoredUser = () => {
  const storedUser = localStorage.getItem("gb_user");

  if (!storedUser) {
    return null;
  }

  try {
    return JSON.parse(storedUser);
  } catch {
    localStorage.removeItem("gb_user");
    localStorage.removeItem("gb_token");
    return null;
  }
};

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(getStoredUser);
  const [loading, setLoading] = useState(false);

  const syncSession = (payload) => {
    setUser(payload.user);
    localStorage.setItem("gb_token", payload.token);
    localStorage.setItem("gb_user", JSON.stringify(payload.user));
  };

  const logout = () => {
    setUser(null);
    localStorage.removeItem("gb_token");
    localStorage.removeItem("gb_user");
  };

  const refreshProfile = async () => {
    try {
      setLoading(true);
      const { data } = await api.get("/profile");
      setUser(data);
      localStorage.setItem("gb_user", JSON.stringify(data));
      return data;
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (localStorage.getItem("gb_token") && !user) {
      refreshProfile().catch(logout);
    }
  }, []);

  return (
    <AuthContext.Provider value={{ user, setUser, syncSession, logout, refreshProfile, loading }}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => useContext(AuthContext);
