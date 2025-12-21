import axios from "axios";

// URL Backend Auth
const AUTH_API_URL = "/auth-api";

export const loginAPI = async (username, password) => {
  try {
    const response = await axios.post(`${AUTH_API_URL}/login`, {
      username,
      password,
    });
    return response.data; // Mengembalikan full response object dari backend
  } catch (error) {
    // Tangkap error response dari server atau network error
    const message =
      error.response?.data?.message || "Terjadi kesalahan pada koneksi server.";
    throw new Error(message);
  }
};
