import axios from "axios";

const AUTH_API_URL = "/auth-api";

export const loginAPI = async (username, password) => {
  try {
    const response = await axios.post(`${AUTH_API_URL}/login`, {
      username,
      password,
    });
    return response.data;
  } catch (error) {
    const message =
      error.response?.data?.message || "Terjadi kesalahan pada koneksi server.";
    throw new Error(message);
  }
};
