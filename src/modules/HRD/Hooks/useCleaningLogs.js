import { useState, useEffect, useCallback } from "react";

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

  if (hours > 0) {
    return `${hours} jam ${minutes} menit`;
  }
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
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const fetchFilterOptions = useCallback(async () => {
    try {
      const response = await fetch(`${API_BASE_URL}/form-options`);
      if (response.ok) {
        const result = await response.json();
        if (result.data) {
          setFilterOptions({
            locations: result.data.locations || [],
            types: result.data.location_types || [],
          });
        }
      }
    } catch (err) {
      console.error(err);
    }
  }, []);

  const fetchData = useCallback(
    async (
      locationId = "",
      typeId = "",
      page = 1,
      cleanerName = "",
      date = ""
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
        const params = new URLSearchParams();
        params.append("site_id", siteId);

        if (locationId) params.append("location_id", locationId);
        if (typeId) params.append("type_id", typeId);
        if (cleanerName) params.append("cleaner_name", cleanerName);
        if (date) params.append("date", date);

        params.append("page", page);
        params.append("limit", 10);

        const response = await fetch(
          `${API_BASE_URL}/logs?${params.toString()}`
        );

        if (!response.ok) {
          throw new Error("Gagal mengambil data dari server");
        }

        const result = await response.json();

        setLogs(result.data || []);
        setMeta(
          result.meta || { current_page: 1, total_pages: 1, total_records: 0 }
        );
      } catch (err) {
        setError(err.message);
      } finally {
        setLoading(false);
      }
    },
    []
  );

  useEffect(() => {
    fetchFilterOptions();
    fetchData();
  }, [fetchFilterOptions, fetchData]);

  return {
    state: {
      logs,
      meta,
      filterOptions,
      loading,
      error,
      API_BASE_URL,
    },
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
