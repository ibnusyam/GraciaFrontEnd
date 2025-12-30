import { useState, useEffect } from "react";
import imageCompression from "browser-image-compression";
import api from "../../../api/axiosInstance";

const API_BASE_URL = "/hrd-api";

export const useCleaningForm = () => {
  const [formData, setFormData] = useState({
    cleaner_name: localStorage.getItem("userLogin") || "",
    location_name: "",
    location_type_name: "",
    notes: "",
    start_time: null,
    end_time: null,
    image_before: null,
    image_after: null,
  });

  const [locationTypes, setLocationTypes] = useState([]);
  const [locations, setLocations] = useState([]);
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState("");
  const [error, setError] = useState(null);
  const [isCompressing, setIsCompressing] = useState(false);

  useEffect(() => {
    const fetchOptions = async () => {
      const siteId = localStorage.getItem("siteId");
      if (!siteId) return;

      try {
        const response = await api.get(`${API_BASE_URL}/form-options`, {
          params: { site_id: siteId },
        });

        const result = response.data;
        setLocationTypes(result.location_types || []);
        setLocations(result.locations || []);
      } catch (err) {}
    };

    fetchOptions();
  }, []);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleFileChange = async (e) => {
    const { name, files } = e.target;
    if (files && files[0]) {
      const file = files[0];
      const options = {
        maxSizeMB: 1,
        maxWidthOrHeight: 1920,
        useWebWorker: true,
        initialQuality: 0.1,
      };

      try {
        setIsCompressing(true);
        const compressedFile = await imageCompression(file, options);
        setFormData((prev) => ({ ...prev, [name]: compressedFile }));
      } catch (err) {
        setError("Gagal memproses gambar.");
      } finally {
        setIsCompressing(false);
      }
    }
  };

  const formatTimeForGo = (dateInput) => {
    if (!dateInput) return "";
    if (dateInput instanceof Date) {
      const year = dateInput.getFullYear();
      const month = String(dateInput.getMonth() + 1).padStart(2, "0");
      const day = String(dateInput.getDate()).padStart(2, "0");
      const hours = String(dateInput.getHours()).padStart(2, "0");
      const minutes = String(dateInput.getMinutes()).padStart(2, "0");
      const seconds = "00";
      return `${year}-${month}-${day} ${hours}:${minutes}:${seconds}`;
    }
    return String(dateInput);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (isCompressing) {
      setError("Gambar masih diproses...");
      return;
    }

    setLoading(true);
    setMessage("");
    setError(null);

    const siteId = localStorage.getItem("siteId");
    if (!siteId) {
      setError("Site ID tidak ditemukan.");
      setLoading(false);
      return;
    }

    if (
      !formData.cleaner_name ||
      !formData.location_name ||
      !formData.location_type_name ||
      !formData.image_before ||
      !formData.image_after ||
      !formData.start_time ||
      !formData.end_time
    ) {
      setError("Lengkapi semua field wajib.");
      setLoading(false);
      return;
    }

    const data = new FormData();
    data.append("site_id", siteId);
    data.append("cleaner_name", formData.cleaner_name);
    data.append("location_name", formData.location_name);
    data.append("location_type_name", formData.location_type_name);
    data.append("notes", formData.notes);
    data.append("start_time", formatTimeForGo(formData.start_time));
    data.append("end_time", formatTimeForGo(formData.end_time));
    data.append("image_before", formData.image_before);
    data.append("image_after", formData.image_after);

    try {
      const response = await api.post(`${API_BASE_URL}/logs`, data, {
        headers: {
          "Content-Type": "multipart/form-data",
        },
      });

      const result = response.data;
      setMessage(result.message || "Data berhasil disimpan!");

      setFormData((prev) => ({
        ...prev,
        location_name: "",
        location_type_name: "",
        notes: "",
        start_time: null,
        end_time: null,
        image_before: null,
        image_after: null,
      }));

      const fileInputs = document.querySelectorAll('input[type="file"]');
      fileInputs.forEach((input) => (input.value = ""));
    } catch (err) {
      setError(err.response?.data?.error || err.message);
    } finally {
      setLoading(false);
    }
  };

  return {
    state: {
      formData,
      loading,
      message,
      error,
      locationTypes,
      locations,
      isCompressing,
    },
    actions: {
      handleChange,
      handleFileChange,
      handleSubmit,
      setFormData,
    },
  };
};
