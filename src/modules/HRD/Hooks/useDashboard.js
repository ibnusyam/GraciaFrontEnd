import { useState, useEffect, useCallback } from "react";
import api from "../../../api/axiosInstance";

const API_BASE_URL = "/hrd-api";

export const useCleanerPerformance = (siteId) => {
  const [cleaners, setCleaners] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [filter, setFilter] = useState({
    month: new Date().getMonth() + 1,
    year: new Date().getFullYear(),
  });

  const months = [
    { v: 1, l: "Januari" },
    { v: 2, l: "Februari" },
    { v: 3, l: "Maret" },
    { v: 4, l: "April" },
    { v: 5, l: "Mei" },
    { v: 6, l: "Juni" },
    { v: 7, l: "Juli" },
    { v: 8, l: "Agustus" },
    { v: 9, l: "September" },
    { v: 10, l: "Oktober" },
    { v: 11, l: "November" },
    { v: 12, l: "Desember" },
  ];

  const loadData = useCallback(async () => {
    if (!siteId) return;

    setLoading(true);
    setError(null);
    try {
      const res = await api.get(`${API_BASE_URL}/dashboard/stats`, {
        params: {
          site_id: siteId,
          month: filter.month,
          year: filter.year,
        },
      });
      setCleaners(res.data.data || []);
    } catch (e) {
      setError("Gagal mengambil data dari server.");
      setCleaners([]);
    } finally {
      setLoading(false);
    }
  }, [siteId, filter.month, filter.year]);

  useEffect(() => {
    loadData();
  }, [loadData]);

  const handleFilterChange = (e) => {
    const { name, value } = e.target;
    setFilter((prev) => ({ ...prev, [name]: parseInt(value) }));
  };

  const totals = {
    logs: cleaners.reduce((a, b) => a + (b.total_logs || 0), 0),
    minutes: cleaners.reduce((a, b) => a + (b.total_minutes || 0), 0),
  };

  return {
    state: {
      cleaners,
      loading,
      error,
      filter,
      months,
      totals,
    },
    actions: {
      handleFilterChange,
      loadData,
    },
  };
};
