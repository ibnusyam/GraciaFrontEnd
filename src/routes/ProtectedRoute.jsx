import React from "react";
import { Navigate, Outlet } from "react-router-dom";
import Cookies from "js-cookie";

const ProtectedRoute = ({ allowedDepartments }) => {
  const token = Cookies.get("accessToken");

  const userRole = localStorage.getItem("userRole");

  if (!token || !userRole) {
    localStorage.clear();

    Cookies.remove("accessToken");
    Cookies.remove("refreshToken");

    return <Navigate to="/login" replace />;
  }

  if (allowedDepartments && !allowedDepartments.includes(userRole)) {
    return <Navigate to="/" replace />;
  }

  return <Outlet />;
};

export default ProtectedRoute;
