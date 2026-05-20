import React from "react";
import { Link, NavLink, useNavigate } from "react-router-dom";
import { useAuth } from "../../context/AuthContext";

const Navbar = () => {
  const { user, logout } = useAuth();
  const navigate = useNavigate();

  const handleLogout = () => {
    logout();
    navigate("/login");
  };

  return (
    <header className="site-header">
      <Link to="/" className="brand-mark">
        CivicLift
      </Link>
      <nav className="nav-links">
        <NavLink to="/">Home</NavLink>
        <NavLink to="/recommender">Recommender</NavLink>
        {user && <NavLink to="/profile">Profile</NavLink>}
        {user?.accountType === "Admin" && <NavLink to="/admin">Admin</NavLink>}
      </nav>
      <div className="nav-actions">
        {user ? (
          <>
            <span className="user-pill">{user.name}</span>
            <button className="ghost-button" onClick={handleLogout}>
              Logout
            </button>
          </>
        ) : (
          <>
            <Link className="ghost-button" to="/login">
              Login
            </Link>
            <Link className="primary-button" to="/signup">
              Sign Up
            </Link>
          </>
        )}
      </div>
    </header>
  );
};

export default Navbar;
