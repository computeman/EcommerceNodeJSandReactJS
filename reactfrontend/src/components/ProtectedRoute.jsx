import React from "react";
import { Navigate, useNavigate } from "react-router-dom";

const ProtectedRoute = ({ component: Component, allowedRole }) => {
  const token = localStorage.getItem("token");
  const role = localStorage.getItem("role");
  const navigate = useNavigate();

  // If no token, redirect to the login page
  if (!token) {
    return <Navigate to="/login" />;
  }

  // If the role doesn't match, show the message and button
  if (role !== allowedRole) {
    const getLoginRoute = () => {
      switch (allowedRole) {
        case "user":
          return "/login";
        case "seller":
          return "/seller/login";
        case "owner":
          return "/owner/login";
        default:
          return "/login";
      }
    };

    return (
      <div style={{ textAlign: "center", marginTop: "50px" }}>
        <h2>You are not logged in as a {allowedRole}.</h2>
        <p>Please log in to access this content.</p>
        <button onClick={() => navigate(getLoginRoute())}>
          Go to {allowedRole.charAt(0).toUpperCase() + allowedRole.slice(1)} Login
        </button>
      </div>
    );
  }

  // If everything is fine, render the component
  return <Component />;
};

export default ProtectedRoute;
