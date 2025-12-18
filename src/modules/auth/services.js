// src/modules/auth/services.js
import axios from "axios";

// URL Backend Auth kamu
const AUTH_API_URL = "/auth-api";

export const loginAPI = async (username, password) => {
  try {
    const response = await axios.post(`${AUTH_API_URL}/login`, {
      username: username,
      password: password,
    });
    return response.data;
  } catch (error) {
    throw error.response ? error.response.data : new Error("Network Error");
  }
};
