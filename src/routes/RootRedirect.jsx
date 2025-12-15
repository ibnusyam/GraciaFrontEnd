// src/routes/RootRedirect.jsx
import { Navigate } from "react-router-dom";

const RootRedirect = () => {
  // Ubah key menjadi 'accessToken' sesuai yang disimpan di Login Page
  const token = localStorage.getItem("accessToken");
  const role = localStorage.getItem("userRole");

  // 1. Jika tidak ada access token, lempar ke login
  if (!token) {
    return <Navigate to="/login" replace />;
  }

  // 2. Redirect sesuai Role
  switch (role) {
    case "IT":
      return <Navigate to="/it/dashboard" replace />;
    case "HRD":
      return <Navigate to="/hrd/dashboard" replace />;
    case "CS":
      return <Navigate to="/hrd/cleaningform" replace />;
    case "PRODUKSI":
      return <Navigate to="/produksi/dashboard" replace />;
    default:
      // Jika login tapi role tidak dikenali
      return <Navigate to="/login" replace />;
  }
};

export default RootRedirect;
