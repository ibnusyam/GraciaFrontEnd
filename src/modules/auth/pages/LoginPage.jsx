// src/modules/auth/pages/LoginPage.jsx
import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { loginAPI } from "../services";
import { jwtDecode } from "jwt-decode"; // 🔥 1. IMPORT LIBRARY INI

const LoginPage = () => {
  const navigate = useNavigate();

  const [formData, setFormData] = useState({
    username: "",
    password: "",
  });
  const [error, setError] = useState("");
  const [isLoading, setIsLoading] = useState(false);

  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value,
    });
  };

  // --- MAPPING DEPARTEMEN ---
  const mapDeptIdToRole = (id) => {
    const deptId = parseInt(id);
    console.log("Dept ID untuk mapping:", deptId);

    switch (deptId) {
      case 1:
        return "IT";
      case 2:
        return "HRD";
      case 4:
        return "CS";
      case 5:
        return "PRODUKSI";
      default:
        return "USER";
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");
    setIsLoading(true);

    try {
      // 1. Panggil API Login
      const apiResponse = await loginAPI(formData.username, formData.password);
      console.log("Response Server:", apiResponse);

      const responseData = apiResponse?.data;

      // Cek apakah access_token ada
      if (responseData && responseData.access_token) {
        // 2. Simpan Token ke LocalStorage
        localStorage.setItem("accessToken", responseData.access_token);
        localStorage.setItem("refreshToken", responseData.refresh_token);

        // 🔥 3. DECODE TOKEN UNTUK DAPAT DEPT_ID
        // Kita bongkar isi tokennya di sini
        const decodedToken = jwtDecode(responseData.access_token);

        console.log("Isi Token (Decoded):", decodedToken); // Cek console untuk lihat nama field aslinya

        // Ambil dept_id dari token.
        // Pastikan nama field-nya sesuai dengan struct Claims di Go (biasanya 'dept_id' atau 'DeptID')
        // Kita pakai fallback biar aman (misal backend kirim DeptID atau dept_id)
        const deptIdFromToken = decodedToken.dept_id || decodedToken.DeptID;

        if (!deptIdFromToken) {
          throw new Error("Dept ID tidak ditemukan dalam token");
        }

        // 4. Proses Role berdasarkan ID dari Token
        const userRole = mapDeptIdToRole(deptIdFromToken);

        // Simpan info user
        localStorage.setItem("userRole", userRole);
        localStorage.setItem("deptId", deptIdFromToken);
        console.log(userRole);

        // 5. Redirect berdasarkan Role
        switch (userRole) {
          case "IT":
            navigate("/it/dashboard");
            break;
          case "HRD":
            navigate("/hrd/dashboard");
            break;
          case "CS":
            navigate("/hrd/cleaningform");
            break;
          case "PRODUKSI":
            navigate("/produksi/dashboard");
            break;
          default:
            navigate("/");
        }
      } else {
        setError("Login gagal: Token tidak diterima dari server.");
      }
    } catch (err) {
      console.error(err);
      if (err.response && err.response.data) {
        setError(err.response.data.message || "Username atau Password salah.");
      } else {
        setError("Terjadi kesalahan sistem atau format token salah.");
      }
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="flex items-center justify-center min-h-screen bg-gray-100">
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
