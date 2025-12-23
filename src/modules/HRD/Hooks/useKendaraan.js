import { useState, useEffect, useCallback } from "react";
import api from "../../../api/axiosInstance"; // Sesuaikan path ke file axios instance kamu

// Base URL Endpoint API
const API_ENDPOINT = "/hrd-api";
// Base URL untuk gambar (Root domain karena Nginx handle static file)

// --- HELPER FUNCTIONS (Diluar Hook) ---

const getImageUrl = (path) => {
  if (!path) return null;
  // Jika path sudah lengkap (http...), kembalikan langsung
  if (path.startsWith("http")) return path;

  // Jika path relatif (uploads/...), gabungkan dengan Base URL
  return `${API_ENDPOINT}/${path}`;
};

const getNullString = (val) => {
  if (!val) return "-";
  return val;
};

export const useKendaraan = () => {
  // --- STATE ---
  const [data, setData] = useState([]);
  const [meta, setMeta] = useState({
    current_page: 1,
    total_pages: 1,
    total_records: 0,
  });
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  // --- ACTION: GET DATA ---
  const fetchData = useCallback(async (page = 1, limit = 10) => {
    setLoading(true);
    setError(null);

    try {
      // Axios instance 'api' sudah handle Base URL "/" dan Token via Interceptor
      const response = await api.get(`${API_ENDPOINT}/kendaraan`, {
        params: {
          page: page,
          limit: limit,
          // Tambahkan param lain jika ada filter (misal: site_id)
        },
      });

      const result = response.data;
      console.log(result);

      // Mapping response sesuai struktur JSON backend kamu
      // Asumsi backend return: { data: [...], meta: {...} }
      setData(result.data || []);

      if (result.meta) {
        setMeta(result.meta);
      }
    } catch (err) {
      // Error message handling
      const message =
        err.response?.data?.message || err.message || "Gagal mengambil data";
      setError(message);
      console.error("Fetch Error:", err);
    } finally {
      setLoading(false);
    }
  }, []);

  // --- ACTION: POST DATA (Create) ---
  const submitData = useCallback(
    async (formData) => {
      setLoading(true);
      setError(null);

      try {
        // Header 'Content-Type': 'multipart/form-data' wajib untuk upload file
        // Tapi saat pakai FormData, Axios biasanya otomatis set boundary,
        // kita override explicit di sini untuk memastikan.
        await api.post(`${API_ENDPOINT}/kendaraan`, formData, {
          headers: {
            "Content-Type": "multipart/form-data",
          },
        });
        console.log(formData);

        // Setelah sukses submit, refresh data list
        await fetchData();
        return true; // Return success signal
      } catch (err) {
        const message = err.response?.data?.message || "Gagal menyimpan data";
        setError(message);
        return false; // Return fail signal
      } finally {
        setLoading(false);
      }
    },
    [fetchData]
  );

  // --- INITIAL LOAD ---
  useEffect(() => {
    fetchData();
  }, [fetchData]);

  // --- RETURN OBJECT ---
  return {
    state: {
      data, // List kendaraan
      meta, // Pagination info
      loading, // Loading status
      error, // Error message
    },
    actions: {
      fetchData, // Fungsi refresh / get
      submitData, // Fungsi post / upload
      getImageUrl, // Helper URL gambar
      getNullString,
    },
  };
};
