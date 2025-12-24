import { useState, useEffect, useCallback } from "react";
import api from "../../../api/axiosInstance";

const API_BASE_URL = "/hrd-api";

export const useLocationMaster = () => {
  const [types, setTypes] = useState([]);
  const [locations, setLocations] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  // --- FETCH DATA ---
  const fetchAll = useCallback(async () => {
    setLoading(true);
    try {
      const [typeRes, locRes] = await Promise.all([
        api.get(`${API_BASE_URL}/location-types`),
        api.get(`${API_BASE_URL}/locations`),
      ]);
      setTypes(typeRes.data.data || []);
      setLocations(locRes.data.data || []);
      setError(null);
    } catch (err) {
      setError(err.response?.data?.error || "Gagal mengambil data");
    } finally {
      setLoading(false);
    }
  }, []);

  // --- CRUD TYPE ---
  const createType = async (data) => {
    try {
      await api.post(`${API_BASE_URL}/location-types`, data);
      await fetchAll();
      return { success: true };
    } catch (err) {
      return { success: false, message: err.response?.data?.error || "Failed" };
    }
  };

  const updateType = async (id, data) => {
    try {
      await api.put(`${API_BASE_URL}/location-types/${id}`, data);
      await fetchAll();
      return { success: true };
    } catch (err) {
      return { success: false, message: err.response?.data?.error || "Failed" };
    }
  };

  const deleteType = async (id) => {
    if (!window.confirm("Hapus Tipe Lokasi ini?")) return;
    try {
      await api.delete(`${API_BASE_URL}/location-types/${id}`);
      await fetchAll();
    } catch (err) {
      alert("Gagal hapus: " + (err.response?.data?.error || "Error"));
    }
  };

  // --- CRUD LOCATION ---
  const createLocation = async (data) => {
    try {
      await api.post(`${API_BASE_URL}/locations`, data);
      await fetchAll();
      return { success: true };
    } catch (err) {
      return { success: false, message: err.response?.data?.error || "Failed" };
    }
  };

  const updateLocation = async (id, data) => {
    try {
      await api.put(`${API_BASE_URL}/locations/${id}`, data);
      await fetchAll();
      return { success: true };
    } catch (err) {
      return { success: false, message: err.response?.data?.error || "Failed" };
    }
  };

  const deleteLocation = async (id) => {
    if (!window.confirm("Hapus Lokasi ini?")) return;
    try {
      await api.delete(`${API_BASE_URL}/locations/${id}`);
      await fetchAll();
    } catch (err) {
      alert("Gagal hapus: " + (err.response?.data?.error || "Error"));
    }
  };

  useEffect(() => {
    fetchAll();
  }, [fetchAll]);

  return {
    state: { types, locations, loading, error },
    actions: {
      createType,
      updateType,
      deleteType,
      createLocation,
      updateLocation,
      deleteLocation,
    },
  };
};
