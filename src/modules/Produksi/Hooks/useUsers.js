import { useState, useEffect, useCallback } from "react";
import api from "../../../api/axiosInstance";

const API_BASE_URL = "/produksi-api";

export const useUsers = () => {
  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const [showModal, setShowModal] = useState(false);
  const [creating, setCreating] = useState(false);
  const [formData, setFormData] = useState({
    nik: "",
    full_name: "",
  });

  const fetchUsers = useCallback(async () => {
    setLoading(true);
    try {
      const response = await api.get(`${API_BASE_URL}/users`);

      const result = response.data.data || response.data;

      if (Array.isArray(result)) {
        setUsers(result);
      } else {
        setUsers([]);
      }
      setError(null);
    } catch (err) {
      console.error(err);
      setUsers([]);
      setError(null);
    } finally {
      setLoading(false);
    }
  }, []);

  const handleDelete = async (id) => {
    if (
      !window.confirm(`Apakah Anda yakin ingin menghapus user dengan ID ${id}?`)
    ) {
      return;
    }

    try {
      await api.delete(`${API_BASE_URL}/users/${id}`);

      setUsers((prevUsers) => prevUsers.filter((user) => user.user_id !== id));
      alert("Pengguna berhasil dihapus!");
    } catch (err) {
      console.error(err);
      alert("Terjadi kesalahan saat menghubungi server.");
    }
  };

  const handleCreate = async (e) => {
    e.preventDefault();

    if (!formData.nik || !formData.full_name) {
      alert("Mohon lengkapi NIK dan Nama Lengkap");
      return;
    }

    setCreating(true);
    try {
      const payload = {
        username: formData.nik,
        full_name: formData.full_name,
        password: "password123",
        department_id: null,
        position_id: null,
        site_id: null,
      };

      await api.post(`${API_BASE_URL}/users`, payload);

      alert("Pengguna berhasil dibuat!");
      setShowModal(false);
      setFormData({ nik: "", full_name: "" });
      fetchUsers();
    } catch (err) {
      console.error(err);
      alert("Gagal membuat pengguna baru.");
    } finally {
      setCreating(false);
    }
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  useEffect(() => {
    fetchUsers();
  }, [fetchUsers]);

  return {
    state: {
      users,
      loading,
      error,
      showModal,
      creating,
      formData,
    },
    actions: {
      setShowModal,
      handleDelete,
      handleCreate,
      handleChange,
    },
  };
};
