import { useState } from "react";
import { useNavigate } from "react-router-dom";
import Cookies from "js-cookie";
import { jwtDecode } from "jwt-decode";
import { loginAPI } from "../services";

const ROLE_MAPPING = {
  1: "IT",
  2: "HRD",
  4: "CS",
  5: "PRODUKSI",
};

const Position_Mapping = {
  1: "PROGRAMMER",
  2: "SPV",
  3: "STAF",
  4: "CS",
  5: "MANAGER",
  6: "DRIVER",
};

const LoginPage = () => {
  const navigate = useNavigate();

  const [formData, setFormData] = useState({ username: "", password: "" });
  const [error, setError] = useState("");
  const [isLoading, setIsLoading] = useState(false);

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const getRoleByDeptId = (id) => {
    const deptId = parseInt(id, 10);
    return ROLE_MAPPING[deptId] || "USER";
  };

  const getPositionByPostId = (id) => {
    const postId = parseInt(id, 10);
    return Position_Mapping[postId] || "USER";
  };

  // --- FUNGSI SIMPAN DATA ---
  // Fungsi ini HANYA dipanggil setelah data (userData) sudah siap/terdecode
  const saveAuthData = (accessToken, refreshToken, userData) => {
    // 1. Simpan Token di Cookies
    const cookieOptions = {
      secure: window.location.protocol === "https:",
      sameSite: "Strict",
      expires: 1,
    };
    Cookies.set("accessToken", accessToken, cookieOptions);
    Cookies.set("refreshToken", refreshToken, { ...cookieOptions, expires: 7 });

    // 2. Simpan Info User di LocalStorage
    // Pastikan userData tidak undefined sebelum disimpan
    if (userData) {
      localStorage.setItem("userRole", String(userData.role || ""));
      localStorage.setItem("siteId", String(userData.siteId || ""));
      localStorage.setItem("deptId", String(userData.deptId || ""));
      localStorage.setItem("userLogin", String(userData.username || ""));
      localStorage.setItem("userPosition", String(userData.posId || ""));
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");
    setIsLoading(true);

    try {
      // 1. REQUEST LOGIN
      const apiResponse = await loginAPI(formData.username, formData.password);

      const payload = apiResponse?.data || apiResponse;
      const { access_token, refresh_token } = payload;

      if (!access_token) {
        throw new Error("Token tidak diterima dari server.");
      }

      // 2. DECODE TOKEN (DILAKUKAN DI SINI SEBELUM MENYIMPAN)
      const decoded = jwtDecode(access_token);

      // 3. EKSTRAKSI DATA DARI TOKEN
      const deptId = decoded.dept_id || decoded.DeptID;
      const siteId = decoded.site_id || decoded.SiteID;
      const username = decoded.sub || decoded.username || decoded.name;
      const posId = decoded.pos_id || decoded.posid;

      // Validasi kelengkapan data token
      if (!deptId || !siteId) {
        throw new Error(
          "Data User (DeptID/SiteID) tidak lengkap di dalam token."
        );
      }

      // 4. TENTUKAN ROLE
      const userRole = getRoleByDeptId(deptId);
      const userPos = getPositionByPostId(posId);

      // 5. BARU SIMPAN KE LOCAL STORAGE (Setelah semua variabel di atas terisi)
      saveAuthData(access_token, refresh_token, {
        role: userRole, // Ini hasil dari langkah 4
        siteId: siteId, // Ini hasil dari langkah 3
        deptId: deptId, // Ini hasil dari langkah 3
        username: username || formData.username,
        posId: userPos,
      });

      navigate("/", { replace: true });
    } catch (err) {
      console.error(err);
      setError(err.message || "Login gagal.");
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="flex items-center justify-center min-h-screen bg-gray-100 px-4">
      <div className="w-full max-w-md p-8 bg-white rounded-xl shadow-lg">
        <div className="mb-8 text-center">
          <h1 className="text-3xl font-bold text-gray-800">Gracia Pharmindo</h1>
          <p className="text-gray-500 mt-2">Silahkan login untuk melanjutkan</p>
        </div>

        {error && (
          <div className="mb-4 p-3 bg-red-100 text-red-700 text-sm rounded border border-red-200">
            {error}
          </div>
        )}

        <form onSubmit={handleSubmit} className="space-y-6">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Username
            </label>
            <input
              type="text"
              name="username"
              required
              className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 outline-none transition"
              placeholder="Masukkan username"
              value={formData.username}
              onChange={handleChange}
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Password
            </label>
            <input
              type="password"
              name="password"
              required
              className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 outline-none transition"
              placeholder="Masukkan password"
              value={formData.password}
              onChange={handleChange}
            />
          </div>

          <button
            type="submit"
            disabled={isLoading}
            className={`w-full py-2.5 rounded-lg text-white font-semibold transition-all shadow-md ${
              isLoading
                ? "bg-gray-400 cursor-not-allowed"
                : "bg-blue-600 hover:bg-blue-700"
            }`}
          >
            {isLoading ? "Memproses..." : "Login"}
          </button>
        </form>
      </div>
    </div>
  );
};

export default LoginPage;
