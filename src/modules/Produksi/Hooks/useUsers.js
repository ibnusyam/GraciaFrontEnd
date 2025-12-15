// src/modules/users/hooks/useUsers.js
import { useState, useEffect, useCallback } from "react";

const API_BASE_URL = "http://localhost:8082";

export const useUsers = () => {
  // --- STATE ---
  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  // State Modal Create
  const [showModal, setShowModal] = useState(false);
  const [creating, setCreating] = useState(false);
  const [formData, setFormData] = useState({
    nik: "",
    full_name: "",
  });

  // --- API ACTIONS ---

  // 1. Fetch Users
  const fetchUsers = useCallback(async () => {
    setLoading(true);
    try {
      const response = await fetch(`${API_BASE_URL}/users`);

      if (!response.ok) {
        console.warn("Gagal mengambil data user, menampilkan state kosong.");
        setUsers([]);
        setError(null);
        return;
      }

      const data = await response.json();

      if (Array.isArray(data)) {
        setUsers(data);
      } else {
        setUsers([]);
      }
      setError(null);
    } catch (err) {
      console.error("Error fetching users:", err);
      setUsers([]);
      setError(null);
    } finally {
      setLoading(false);
    }
  }, []);

  // 2. Delete User
  const handleDelete = async (id) => {
    if (
      !window.confirm(`Apakah Anda yakin ingin menghapus user dengan ID ${id}?`)
    ) {
      return;
    }

    try {
      const response = await fetch(`${API_BASE_URL}/delete/${id}`, {
        method: "DELETE",
      });

      if (response.ok) {
        setUsers((prevUsers) => prevUsers.filter((user) => user.id !== id));
        alert("Pengguna berhasil dihapus!");
      } else {
        alert("Gagal menghapus pengguna di server.");
      }
    } catch (err) {
      console.error("Error deleting user:", err);
      alert("Terjadi kesalahan saat menghubungi server.");
    }
  };

  // 3. Create User
  const handleCreate = async (e) => {
    e.preventDefault();

    if (!formData.nik || !formData.full_name) {
      alert("Mohon lengkapi NIK dan Nama Lengkap");
      return;
    }

    setCreating(true);
    try {
      const response = await fetch(`${API_BASE_URL}/create`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(formData),
      });

      if (response.ok) {
        alert("Pengguna berhasil dibuat!");
        setShowModal(false);
        setFormData({ nik: "", full_name: "" });
        fetchUsers();
      } else {
        alert("Gagal membuat pengguna baru.");
      }
    } catch (err) {
      console.error("Error creating user:", err);
      alert("Terjadi kesalahan pada server saat membuat pengguna.");
    } finally {
      setCreating(false);
    }
  };

  // --- FORM HANDLERS ---
  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  // --- EFFECTS ---
  useEffect(() => {
    fetchUsers();
  }, [fetchUsers]);

  // Return data & functions
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
