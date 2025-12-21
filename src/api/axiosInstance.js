import axios from "axios";
import Cookies from "js-cookie";

// 1. Buat Instance Axios
const api = axios.create({
  // PERBAIKAN DISINI:
  // Ganti jadi "/" atau kosongkan jika proxy Nginx sudah handle root.
  // Ini supaya dia fleksibel bisa dipake untuk HRD, AUTH, dll.
  baseURL: "/",
  headers: {
    "Content-Type": "application/json",
  },
});

// --- REQUEST INTERCEPTOR (SATPAM PINTU KELUAR) ---
api.interceptors.request.use(
  (config) => {
    const token = Cookies.get("accessToken");
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);

// --- RESPONSE INTERCEPTOR (SATPAM PINTU MASUK) ---
api.interceptors.response.use(
  (response) => {
    return response;
  },
  async (error) => {
    const originalRequest = error.config;

    // Cek 401 Unauthorized
    if (
      error.response &&
      error.response.status === 401 &&
      !originalRequest._retry
    ) {
      originalRequest._retry = true;

      try {
        // --- LOGIC REFRESH TOKEN (Opsional: Diaktifkan nanti kalau Backend Auth siap) ---
        const refreshToken = Cookies.get("refreshToken");
        // Perhatikan: Karena baseURL kita sekarang "/", kita harus panggil full path
        const res = await axios.post("/auth-api/refresh", { refreshToken });

        if (res.status === 200) {
          const newAccessToken = res.data.data.access_token;
          Cookies.set("accessToken", newAccessToken);

          // Update header request yang gagal tadi dengan token baru
          originalRequest.headers.Authorization = `Bearer ${newAccessToken}`;

          // Ulangi request yang tadi gagal pakai instance 'api' ini
          return api(originalRequest);
        }

        // Kalau gagal refresh atau belum siap, lempar error biar masuk catch bawah
        throw new Error("Session Expired");
      } catch (refreshError) {
        console.warn("Sesi habis. Logout...");

        // Bersih-bersih
        Cookies.remove("accessToken");
        Cookies.remove("refreshToken");
        localStorage.clear();

        // Redirect
        window.location.href = "/login";
        return Promise.reject(refreshError);
      }
    }

    return Promise.reject(error);
  }
);

export default api;
