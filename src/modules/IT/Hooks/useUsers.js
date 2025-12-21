import { useState, useEffect, useCallback } from "react";
import api from "../../../api/axiosInstance";

const API_BASE_URL = "/it-api";

const getNullString = (val) => {
  if (val && typeof val === "object" && val.Valid) return val.String;
  return val || "-";
};

export const useUsers = () => {
  const [users, setUsers] = useState([]);
  const [meta, setMeta] = useState({
    current_page: 1,
    total_pages: 1,
    total_records: 0,
  });

  const [formOptions, setFormOptions] = useState({
    departments: [],
    positions: [],
    sites: [],
  });

  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  const fetchFormOptions = useCallback(async () => {
    try {
      const [deptRes, posRes, siteRes] = await Promise.all([
        api.get(`${API_BASE_URL}/departments`),
        api.get(`${API_BASE_URL}/positions`),
        api.get(`${API_BASE_URL}/sites`),
      ]);

      setFormOptions({
        departments: deptRes.data.data || [],
        positions: posRes.data.data || [],
        sites: siteRes.data.data || [],
      });
    } catch (err) {
      console.error(err);
    }
  }, []);

  const fetchData = useCallback(async (page = 1, limit = 10, search = "") => {
    setLoading(true);
    setError(null);

    try {
      const response = await api.get(`${API_BASE_URL}/users`, {
        params: { page, limit, search },
      });

      const result = response.data;
      setUsers(result.data || []);
      setMeta(
        result.meta || {
          current_page: 1,
          total_pages: 1,
          total_records: result.data?.length || 0,
        }
      );
    } catch (err) {
      setError(err.response?.data?.error || err.message);
    } finally {
      setLoading(false);
    }
  }, []);

  const createUser = async (formData) => {
    setLoading(true);
    try {
      await api.post(`${API_BASE_URL}/users`, formData);
      await fetchData();
      return { success: true };
    } catch (err) {
      const msg = err.response?.data?.error || "Gagal membuat user";
      setError(msg);
      return { success: false, message: msg };
    } finally {
      setLoading(false);
    }
  };

  const updateUser = async (id, formData) => {
    setLoading(true);
    try {
      await api.put(`${API_BASE_URL}/users/${id}`, formData);
      await fetchData();
      return { success: true };
    } catch (err) {
      const msg = err.response?.data?.error || "Gagal update user";
      setError(msg);
      return { success: false, message: msg };
    } finally {
      setLoading(false);
    }
  };

  const deleteUser = async (id) => {
    setLoading(true);
    try {
      await api.delete(`${API_BASE_URL}/users/${id}`);
      await fetchData();
      return { success: true };
    } catch (err) {
      const msg = err.response?.data?.error || "Gagal hapus user";
      setError(msg);
      return { success: false, message: msg };
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchData();
    fetchFormOptions();
  }, [fetchData, fetchFormOptions]);

  return {
    state: { users, meta, formOptions, loading, error },
    actions: { fetchData, createUser, updateUser, deleteUser, getNullString },
  };
};
