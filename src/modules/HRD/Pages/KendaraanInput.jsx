import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import { useKendaraan } from "../Hooks/useKendaraan";

const KendaraanInput = () => {
  const navigate = useNavigate();

  const { actions, state } = useKendaraan();
  const { submitData } = actions;
  const { loading, error } = state;

  const [formData, setFormData] = useState({
    nama_pengemudi: "ibnu",
    model_mobil: "",
    lokasi_sekarang: "",
    bbm: "",
  });

  const [gambarFile, setGambarFile] = useState(null);
  const [previewUrl, setPreviewUrl] = useState(null);

  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value,
    });
  };

  const handleFileChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      setGambarFile(file);
      setPreviewUrl(URL.createObjectURL(file));
    }
  };

  const handleLogout = () => {
    localStorage.clear;
    navigate("/login");
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!gambarFile) {
      alert("Silakan pilih gambar terlebih dahulu");
      return;
    }

    const payload = new FormData();
    payload.append("nama_pengemudi", formData.nama_pengemudi);
    payload.append("model_mobil", formData.model_mobil);
    payload.append("lokasi_sekarang", formData.lokasi_sekarang);
    payload.append("bbm", formData.bbm);
    payload.append("gambar", gambarFile);

    const success = await submitData(payload);

    if (success) {
      alert("Data berhasil disimpan!");
      navigate("/");
    }
  };

  return (
    <div
      style={{
        minHeight: "100vh",
        backgroundColor: "#f3f4f6",
        padding: "40px 20px",
        fontFamily: "'Segoe UI', Tahoma, Geneva, Verdana, sans-serif",
        display: "flex",
        flexDirection: "column",
        alignItems: "center",
      }}
    >
      <div
        style={{
          width: "100%",
          maxWidth: "600px",
          display: "flex",
          justifyContent: "space-between",
          marginBottom: "20px",
        }}
      >
        <button
          onClick={handleLogout}
          style={{
            backgroundColor: "#ef4444",
            color: "white",
            border: "none",
            padding: "8px 16px",
            borderRadius: "6px",
            cursor: "pointer",
            fontSize: "14px",
            fontWeight: "600",
            boxShadow: "0 2px 4px rgba(239, 68, 68, 0.2)",
          }}
        >
          Logout
        </button>
      </div>

      <div
        style={{
          width: "100%",
          maxWidth: "600px",
          backgroundColor: "#ffffff",
          borderRadius: "12px",
          boxShadow:
            "0 4px 6px -1px rgba(0, 0, 0, 0.1), 0 2px 4px -1px rgba(0, 0, 0, 0.06)",
          padding: "32px",
        }}
      >
        <h2
          style={{
            marginTop: 0,
            marginBottom: "24px",
            color: "#111827",
            fontSize: "24px",
            fontWeight: "700",
            textAlign: "center",
            borderBottom: "1px solid #e5e7eb",
            paddingBottom: "16px",
          }}
        >
          Input Data BBM Kendaraan
        </h2>

        {error && (
          <div
            style={{
              padding: "12px",
              backgroundColor: "#fef2f2",
              border: "1px solid #fca5a5",
              color: "#991b1b",
              borderRadius: "6px",
              marginBottom: "24px",
              fontSize: "14px",
            }}
          >
            {error}
          </div>
        )}

        <form onSubmit={handleSubmit}>
          <div style={{ marginBottom: "20px" }}>
            <label
              style={{
                display: "block",
                marginBottom: "8px",
                color: "#374151",
                fontSize: "14px",
                fontWeight: "600",
              }}
            >
              Nama Pengemudi
            </label>
            <input
              type="text"
              name="nama_pengemudi"
              placeholder="Nama Supir"
              onChange={handleChange}
              style={{
                width: "100%",
                padding: "12px",
                borderRadius: "8px",
                border: "1px solid #d1d5db",
                fontSize: "14px",
                boxSizing: "border-box",
                outline: "none",
                transition: "border-color 0.2s",
              }}
              required
            />
          </div>

          <div style={{ marginBottom: "20px" }}>
            <label
              style={{
                display: "block",
                marginBottom: "8px",
                color: "#374151",
                fontSize: "14px",
                fontWeight: "600",
              }}
            >
              Model Mobil
            </label>
            <input
              type="text"
              name="model_mobil"
              value={formData.model_mobil}
              onChange={handleChange}
              placeholder="Mobil yang digunakan"
              style={{
                width: "100%",
                padding: "12px",
                borderRadius: "8px",
                border: "1px solid #d1d5db",
                fontSize: "14px",
                boxSizing: "border-box",
                outline: "none",
              }}
              required
            />
          </div>

          <div style={{ display: "flex", gap: "20px", marginBottom: "20px" }}>
            <div style={{ flex: 1 }}>
              <label
                style={{
                  display: "block",
                  marginBottom: "8px",
                  color: "#374151",
                  fontSize: "14px",
                  fontWeight: "600",
                }}
              >
                Lokasi Sekarang
              </label>
              <input
                type="text"
                name="lokasi_sekarang"
                value={formData.lokasi_sekarang}
                onChange={handleChange}
                placeholder="Contoh: Jakarta"
                style={{
                  width: "100%",
                  padding: "12px",
                  borderRadius: "8px",
                  border: "1px solid #d1d5db",
                  fontSize: "14px",
                  boxSizing: "border-box",
                  outline: "none",
                }}
              />
            </div>

            <div style={{ flex: 1 }}>
              <label
                style={{
                  display: "block",
                  marginBottom: "8px",
                  color: "#374151",
                  fontSize: "14px",
                  fontWeight: "600",
                }}
              >
                BBM (Liter/KM)
              </label>
              <input
                type="text"
                name="bbm"
                value={formData.bbm}
                onChange={handleChange}
                style={{
                  width: "100%",
                  padding: "12px",
                  borderRadius: "8px",
                  border: "1px solid #d1d5db",
                  fontSize: "14px",
                  boxSizing: "border-box",
                  outline: "none",
                }}
              />
            </div>
          </div>

          <div style={{ marginBottom: "32px" }}>
            <label
              style={{
                display: "block",
                marginBottom: "8px",
                color: "#374151",
                fontSize: "14px",
                fontWeight: "600",
              }}
            >
              Upload Foto Kendaraan
            </label>
            <div
              style={{
                border: "2px dashed #d1d5db",
                borderRadius: "8px",
                padding: "20px",
                textAlign: "center",
                backgroundColor: "#f9fafb",
              }}
            >
              <input
                type="file"
                accept="image/*"
                onChange={handleFileChange}
                style={{ width: "100%", marginBottom: "10px" }}
              />
              {previewUrl && (
                <div style={{ marginTop: "16px" }}>
                  <img
                    src={previewUrl}
                    alt="Preview"
                    style={{
                      maxWidth: "100%",
                      maxHeight: "200px",
                      borderRadius: "8px",
                      boxShadow: "0 2px 4px rgba(0,0,0,0.1)",
                    }}
                  />
                </div>
              )}
            </div>
          </div>

          <button
            type="submit"
            disabled={loading}
            style={{
              width: "100%",
              padding: "14px",
              backgroundColor: loading ? "#9ca3af" : "#2563eb",
              color: "white",
              border: "none",
              borderRadius: "8px",
              fontSize: "16px",
              fontWeight: "600",
              cursor: loading ? "not-allowed" : "pointer",
              transition: "background-color 0.2s",
              boxShadow: "0 4px 6px rgba(37, 99, 235, 0.2)",
            }}
          >
            {loading ? "Sedang Menyimpan..." : "Simpan Data"}
          </button>
        </form>
      </div>
    </div>
  );
};

export default KendaraanInput;
