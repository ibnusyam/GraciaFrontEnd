import React from "react";
import { Navigate, Outlet } from "react-router-dom";

const ProtectedRoute = ({ allowedDepartments }) => {
  // 1. AMBIL DATA DARI LOCAL STORAGE
  // Gunakan 'accessToken' agar konsisten
  const token = localStorage.getItem("accessToken");
  const userRole = localStorage.getItem("userRole");

  // Debugging (bisa dihapus nanti)
  // console.log("Cek Auth - Token:", !!token, "Role:", userRole);

  // 2. LOGIKA CEK LOGIN (Authentication)
  if (!token || !userRole) {
    // Hapus sisa-sisa data jika token invalid/hilang sebagian
    localStorage.clear();
    return <Navigate to="/login" replace />;
  }

  // 3. LOGIKA CEK DEPARTEMEN (Authorization)
  // Jika allowedDepartments disediakan, cek apakah userRole ada di dalamnya
  if (allowedDepartments && !allowedDepartments.includes(userRole)) {
    // Redirect ke halaman unauthorized atau dashboard user tersebut
    // Disini kita lempar ke root (/) agar RootRedirect yang menangani dia harusnya kemana
    return <Navigate to="/" replace />;
  }

  // 4. Lolos
  return <Outlet />;
};

export default ProtectedRoute;
