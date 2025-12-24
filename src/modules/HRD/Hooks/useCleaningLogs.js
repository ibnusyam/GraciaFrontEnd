import { useState, useEffect, useCallback } from "react";
import api from "../../../api/axiosInstance";

const API_BASE_URL = "/hrd-api";

const formatTimeOnly = (dateString) => {
  if (!dateString) return "-";
  return new Date(dateString).toLocaleTimeString("id-ID", {
    hour: "2-digit",
    minute: "2-digit",
    hour12: false,
  });
};

const getNullString = (obj) => {
  if (obj && typeof obj === "object" && obj.Valid) return obj.String;
  return "-";
};

const getNullTime = (obj) => {
  if (obj && typeof obj === "object" && obj.Valid) {
    if (obj.Time && obj.Time.startsWith("0001")) return null;
    return formatTimeOnly(obj.Time);
  }
  return null;
};

const getImageUrl = (path) => {
  if (!path) return null;
  if (typeof path === "object" && path.Valid) {
    return `${API_BASE_URL}/${path.String}`;
  }
  if (typeof path === "string" && path !== "") {
    return `${API_BASE_URL}/${path}`;
  }
  return null;
};

const calculateDuration = (startTime, endTimeObj) => {
  if (!startTime || !endTimeObj || !endTimeObj.Valid) return "-";
  const start = new Date(startTime);
  const end = new Date(endTimeObj.Time);
  if (isNaN(start.getTime()) || isNaN(end.getTime())) return "-";
  const diffMs = end - start;
  if (diffMs < 0) return "-";
  const diffMinutes = Math.floor(diffMs / 60000);
  const hours = Math.floor(diffMinutes / 60);
  const minutes = diffMinutes % 60;
  if (hours > 0) return `${hours} jam ${minutes} menit`;
  return `${minutes} menit`;
};

export const useCleaningLogs = () => {
  const [logs, setLogs] = useState([]);
  const [meta, setMeta] = useState({
    current_page: 1,
    total_pages: 1,
    total_records: 0,
  });
  const [filterOptions, setFilterOptions] = useState({
    locations: [],
    types: [],
  });
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  const fetchFilterOptions = useCallback(async () => {
    const siteId = localStorage.getItem("siteId");
    if (!siteId) return;

    try {
      const response = await api.get(`${API_BASE_URL}/form-options`, {
        params: { site_id: siteId },
      });

      const result = response.data;
      setFilterOptions({
        locations: result.locations || [],
        types: result.location_types || [],
      });
    } catch (err) {}
  }, []);

  const fetchData = useCallback(
    async (
      locationId = "",
      typeId = "",
      page = 1,
      cleanerName = "",
      date = "",
      limit = 10
    ) => {
      setLoading(true);
      setError(null);

      const siteId = localStorage.getItem("siteId");

      if (!siteId) {
        setError("Site ID tidak ditemukan. Silakan login ulang.");
        setLoading(false);
        return;
      }

      try {
        const response = await api.get(`${API_BASE_URL}/logs`, {
          params: {
            site_id: siteId,
            location_id: locationId,
            location_type_id: typeId,
            cleaner_name: cleanerName,
            date,
            page,
            limit,
          },
        });

        const result = response.data;
        setLogs(result.data || []);
        setMeta(
          result.meta || { current_page: 1, total_pages: 1, total_records: 0 }
        );
      } catch (err) {
        setError(err.response?.data?.message || err.message);
      } finally {
        setLoading(false);
      }
    },
    []
  );

  useEffect(() => {
    fetchFilterOptions();
  }, [fetchFilterOptions]);

  return {
    state: { logs, meta, filterOptions, loading, error, API_BASE_URL },
    actions: {
      fetchData,
      formatTime: formatTimeOnly,
      getNullString,
      getNullTime,
      getImageUrl,
      calculateDuration,
    },
  };
};
