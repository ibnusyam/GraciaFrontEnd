import { useState, useEffect, useCallback } from "react";
import api from "../../../api/axiosInstance";

const API_ENDPOINT = "/hrd-api";

const getImageUrl = (path) => {
  if (!path) return null;
  if (path.startsWith("http")) return path;
  return `${API_ENDPOINT}/${path}`;
};

const getNullString = (val) => {
  if (!val) return "-";
  return val;
};

export const useKendaraan = () => {
  const [data, setData] = useState([]);
  const [meta, setMeta] = useState({
    current_page: 1,
    total_pages: 1,
    total_records: 0,
  });
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  const fetchData = useCallback(async (page = 1, limit = 10) => {
    setLoading(true);
    setError(null);

    try {
      const response = await api.get(`${API_ENDPOINT}/kendaraan`, {
        params: {
          page,
          limit,
        },
      });

      const result = response.data;
      setData(result.data || []);

      if (result.meta) {
        setMeta(result.meta);
      }
    } catch (err) {
      const message =
        err.response?.data?.message || err.message || "Gagal mengambil data";
      setError(message);
    } finally {
      setLoading(false);
    }
  }, []);

  const submitData = useCallback(
    async (formData) => {
      setLoading(true);
      setError(null);

      try {
        await api.post(`${API_ENDPOINT}/kendaraan`, formData, {
          headers: {
            "Content-Type": "multipart/form-data",
          },
        });

        await fetchData();
        return true;
      } catch (err) {
        const message = err.response?.data?.message || "Gagal menyimpan data";
        setError(message);
        return false;
      } finally {
        setLoading(false);
      }
    },
    [fetchData]
  );

  useEffect(() => {
    fetchData();
  }, [fetchData]);

  return {
    state: {
      data,
      meta,
      loading,
      error,
    },
    actions: {
      fetchData,
      submitData,
      getImageUrl,
      getNullString,
    },
  };
};
