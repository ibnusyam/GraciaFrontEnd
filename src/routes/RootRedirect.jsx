import { Navigate } from "react-router-dom";
import Cookies from "js-cookie";

const RootRedirect = () => {
  const token = Cookies.get("accessToken");

  // Ambil role dari LocalStorage
  const role = localStorage.getItem("userRole");
  const position = localStorage.getItem("userPosition");

  if (!token) {
    return <Navigate to="/login" replace />;
  }

  // 2. Redirect sesuai Role
  switch (role) {
    case "IT":
      return <Navigate to="/it/dashboard" replace />;
    case "HRD":
      if (position === "CS") {
        return <Navigate to="/hrd/cleaningform" replace />;
      } else if (position === "DRIVER") {
        return <Navigate to="/hrd/inputkendaraan" replace />;
      } else if (position === "SPV") {
        return <Navigate to="/hrd/dashboard" replace />;
      }
    case "PRODUKSI":
      return <Navigate to="/produksi/dashboard" replace />;
    default:
      return <Navigate to="/login" replace />;
  }
};

export default RootRedirect;
