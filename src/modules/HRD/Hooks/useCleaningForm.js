import { useState, useEffect } from "react";

// Sesuaikan URL Backend kamu
const API_BASE_URL = "/hrd-api";

export const useCleaningForm = () => {
  const [formData, setFormData] = useState({
    cleaner_name: localStorage.getItem("userLogin") || "", // Ambil nama cleaner dari login
    location_name: "", // Ini akan menyimpan ID Lokasi (String angka)
    location_type_name: "", // Ini akan menyimpan ID Tipe (String angka)
    notes: "",
    start_time: null,
    end_time: null,
    image_before: null,
    image_after: null,
  });

  const handleLogout = () => {
    localStorage.clear();
    navigate("/login");
  };

  const [locationTypes, setLocationTypes] = useState([]);
  const [locations, setLocations] = useState([]);
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState("");
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchOptions = async () => {
      try {
        const response = await fetch(`${API_BASE_URL}/form-options`);
        const result = await response.json();
        if (response.ok && result.data) {
          setLocationTypes(result.data.location_types || []);
          setLocations(result.data.locations || []);
        }
      } catch (err) {
        console.error("Failed to fetch options", err);
      }
    };

    fetchOptions();
  }, []);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleFileChange = (e) => {
    const { name, files } = e.target;
    if (files && files[0]) {
      setFormData((prev) => ({ ...prev, [name]: files[0] }));
    }
  };

  // Format DatePicker (Objek Date) ke String "YYYY-MM-DD HH:MM:SS"
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
    setLoading(true);
    setMessage("");
    setError(null);

    // 1. AMBIL SITE ID DARI LOCAL STORAGE
    const siteId = localStorage.getItem("siteId");
    if (!siteId) {
      setError("Site ID tidak ditemukan. Silakan login ulang.");
      setLoading(false);
      return;
    }

    // Validasi
    if (
      !formData.cleaner_name ||
      !formData.location_name || // Pastikan ini terisi ID
      !formData.location_type_name || // Pastikan ini terisi ID
      !formData.image_before ||
      !formData.image_after ||
      !formData.start_time ||
      !formData.end_time
    ) {
      setError("Mohon lengkapi semua field wajib.");
      setLoading(false);
      return;
    }

    const data = new FormData();
    // 2. APPEND SITE ID
    data.append("site_id", siteId);

    data.append("cleaner_name", formData.cleaner_name);
    data.append("location_name", formData.location_name); // Mengirim ID Lokasi
    data.append("location_type_name", formData.location_type_name); // Mengirim ID Tipe
    data.append("notes", formData.notes);
    data.append("start_time", formatTimeForGo(formData.start_time));
    data.append("end_time", formatTimeForGo(formData.end_time));
    data.append("image_before", formData.image_before);
    data.append("image_after", formData.image_after);
    console.log("Isi FormData:", Object.fromEntries(data.entries()));

    try {
      const response = await fetch(`${API_BASE_URL}/logs`, {
        method: "POST",
        body: data,
      });

      const result = await response.json();

      if (!response.ok) {
        throw new Error(result.error || "Gagal mengirim data.");
      }

      setMessage(result.message || "Data kebersihan berhasil disimpan!");

      // Reset Form (Kecuali cleaner name)
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

      // Reset input file visual di browser
      const fileInputs = document.querySelectorAll('input[type="file"]');
      fileInputs.forEach((input) => (input.value = ""));
    } catch (err) {
      setError(err.message);
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
    },
    // Expose setFormData agar bisa dipakai di Component untuk reset dropdown
    actions: { handleChange, handleFileChange, handleSubmit, setFormData },
  };
};
