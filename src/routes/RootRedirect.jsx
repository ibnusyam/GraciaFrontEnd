import { Navigate } from "react-router-dom";
import Cookies from "js-cookie";

const RootRedirect = () => {
  const token = Cookies.get("accessToken");

  // Ambil role dari LocalStorage
  const role = localStorage.getItem("userRole");

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
      return <Navigate to="/login" replace />;
  }
};

export default RootRedirect;
