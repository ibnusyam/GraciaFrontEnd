import React from "react";
import { Navigate, Outlet } from "react-router-dom";
import Cookies from "js-cookie";

// Tambahkan allowedPositions disini
const ProtectedRoute = ({ allowedDepartments, allowedPositions }) => {
  const token = Cookies.get("accessToken");

  const userRole = localStorage.getItem("userRole");
  const userPosition = localStorage.getItem("userPosition");

  if (!token || !userRole) {
    localStorage.clear();

    Cookies.remove("accessToken");
    Cookies.remove("refreshToken");

    return <Navigate to="/login" replace />;
  }

  if (allowedDepartments && !allowedDepartments.includes(userRole)) {
    return <Navigate to="/" replace />;
  }

  if (allowedPositions && !allowedPositions.includes(userPosition)) {
    return (
      <div className="flex items-center justify-center h-screen bg-gray-100">
        <div className="text-center">
          <h1 className="text-4xl font-bold text-red-600">403</h1>
          <p className="text-xl font-semibold mt-2">Akses Ditolak</p>
          <p className="text-gray-600 mt-1">
            Halaman ini khusus untuk jabatan: {allowedPositions.join(", ")}
          </p>
          <button
            onClick={() => window.history.back()}
            className="mt-4 px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700"
          >
            Kembali
          </button>
        </div>
      </div>
    );
  }

  return <Outlet />;
};

export default ProtectedRoute;
