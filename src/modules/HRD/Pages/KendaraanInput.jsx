import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import { useKendaraan } from "../Hooks/useKendaraan"; // Pastikan path hook benar

const KendaraanInput = () => {
  const navigate = useNavigate();

  // Mengambil action submitData dan state loading/error dari hook
  const { actions, state } = useKendaraan();
  const { submitData } = actions;
  const { loading, error } = state;

  // State internal untuk form
  const [formData, setFormData] = useState({
    nama_pengemudi: "ibnu",
    model_mobil: "Avanza Veloz",
    lokasi_sekarang: "",
    bbm: "",
  });

  const [gambarFile, setGambarFile] = useState(null);
  const [previewUrl, setPreviewUrl] = useState(null);

  // Handle perubahan input teks
  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value,
    });
  };

  // Handle perubahan file gambar + Preview
  const handleFileChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      setGambarFile(file);
      setPreviewUrl(URL.createObjectURL(file)); // Buat preview lokal
    }
  };

  // Handle Submit
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
        maxWidth: "600px",
        margin: "40px auto",
        padding: "20px",
        border: "1px solid #ddd",
        borderRadius: "8px",
        fontFamily: "sans-serif",
      }}
    >
      <div
        style={{ display: "flex", alignItems: "center", marginBottom: "20px" }}
      >
        <button
          onClick={() => navigate("/")}
          style={{ marginRight: "15px", cursor: "pointer" }}
        >
          &larr; Kembali
        </button>
        <h2 style={{ margin: 0 }}>Input Data Kendaraan</h2>
      </div>

      {error && (
        <div
          style={{
            padding: "10px",
            backgroundColor: "#ffebee",
            color: "#c62828",
            marginBottom: "20px",
            borderRadius: "4px",
          }}
        >
          {error}
        </div>
      )}

      <form onSubmit={handleSubmit}>
        <div style={{ marginBottom: "15px" }}>
          <label
            style={{
              display: "block",
              marginBottom: "5px",
              fontWeight: "bold",
            }}
          >
            Nama Pengemudi
          </label>
          <input
            type="text"
            name="nama_pengemudi"
            value={formData.nama_pengemudi}
            onChange={handleChange}
            style={{
              width: "100%",
              padding: "10px",
              borderRadius: "4px",
              border: "1px solid #ccc",
            }}
            required
          />
        </div>

        <div style={{ marginBottom: "15px" }}>
          <label
            style={{
              display: "block",
              marginBottom: "5px",
              fontWeight: "bold",
            }}
          >
            Model Mobil
          </label>
          <input
            type="text"
            name="model_mobil"
            value={formData.model_mobil}
            onChange={handleChange}
            style={{
              width: "100%",
              padding: "10px",
              borderRadius: "4px",
              border: "1px solid #ccc",
            }}
            required
          />
        </div>

        <div style={{ marginBottom: "15px" }}>
          <label
            style={{
              display: "block",
              marginBottom: "5px",
              fontWeight: "bold",
            }}
          >
            Lokasi Sekarang
          </label>
          <input
            type="text"
            name="lokasi_sekarang"
            value={formData.lokasi_sekarang}
            onChange={handleChange}
            placeholder="Contoh: Jakarta Selatan"
            style={{
              width: "100%",
              padding: "10px",
              borderRadius: "4px",
              border: "1px solid #ccc",
            }}
          />
        </div>

        <div style={{ marginBottom: "15px" }}>
          <label
            style={{
              display: "block",
              marginBottom: "5px",
              fontWeight: "bold",
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
              padding: "10px",
              borderRadius: "4px",
              border: "1px solid #ccc",
            }}
          />
        </div>

        <div style={{ marginBottom: "20px" }}>
          <label
            style={{
              display: "block",
              marginBottom: "5px",
              fontWeight: "bold",
            }}
          >
            Upload Foto Kendaraan
          </label>
          <input
            type="file"
            accept="image/*"
            onChange={handleFileChange}
            style={{ width: "100%", marginBottom: "10px" }}
          />

          {/* Preview Gambar Sebelum Upload */}
          {previewUrl && (
            <div style={{ marginTop: "10px" }}>
              <p style={{ fontSize: "12px", color: "#666" }}>Preview:</p>
              <img
                src={previewUrl}
                alt="Preview"
                style={{
                  width: "150px",
                  height: "auto",
                  borderRadius: "8px",
                  border: "1px solid #ddd",
                }}
              />
            </div>
          )}
        </div>

        <button
          type="submit"
          disabled={loading}
          style={{
            width: "100%",
            padding: "12px",
            backgroundColor: loading ? "#ccc" : "#007bff",
            color: "white",
            border: "none",
            borderRadius: "4px",
            fontSize: "16px",
            fontWeight: "bold",
            cursor: loading ? "not-allowed" : "pointer",
          }}
        >
          {loading ? "Sedang Menyimpan..." : "Simpan Data"}
        </button>
      </form>
    </div>
  );
};

export default KendaraanInput;
