import React, { useState, useMemo } from "react";
import { useLocationMaster } from "../Hooks/useLocation";

const LocationManagement = () => {
  const { state, actions } = useLocationMaster();
  const { types, locations, loading, error } = state;

  // --- FILTER STATE ---
  // Default pilih ID 1 (Gracia Pabrik) agar tampilan awal tidak kosong/campur
  const [selectedSiteId, setSelectedSiteId] = useState(1);

  // Tab: 'types' or 'locations'
  const [activeTab, setActiveTab] = useState("types");

  // Modal State
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isEditMode, setIsEditMode] = useState(false);
  const [currentId, setCurrentId] = useState(null);

  // Form State
  const [formData, setFormData] = useState({
    type_name: "",
    description: "",
    site_id: "",
    location_name: "",
    location_type_id: "",
  });

  // --- MAPPING SITE ---
  const SITE_OPTIONS = [
    { id: 1, name: "Gracia Pabrik" },
    { id: 2, name: "Head Office" },
    { id: 3, name: "Baranang" },
  ];

  // Helper Display Name
  const getSiteName = (id) => {
    const site = SITE_OPTIONS.find((s) => s.id === parseInt(id));
    return site ? site.name : `Site ID: ${id}`;
  };

  // --- DATA FILTERING (LOGIC UTAMA) ---
  // Kita filter data dari Hook berdasarkan Site ID yang dipilih user
  const filteredTypes = useMemo(() => {
    return types.filter((t) => t.site_id === selectedSiteId);
  }, [types, selectedSiteId]);

  const filteredLocations = useMemo(() => {
    return locations.filter((l) => l.site_id === selectedSiteId);
  }, [locations, selectedSiteId]);

  // --- HANDLERS ---

  const openCreate = () => {
    setIsEditMode(false);
    setFormData({
      type_name: "",
      description: "",
      // 🔥 Auto-fill Site ID sesuai filter yang sedang aktif
      site_id: selectedSiteId,
      location_name: "",
      location_type_id: "",
    });
    setIsModalOpen(true);
  };

  const openEdit = (item) => {
    setIsEditMode(true);
    if (activeTab === "types") {
      setCurrentId(item.location_type_id);
      setFormData({
        type_name: item.type_name,
        description: item.description,
        site_id: item.site_id,
      });
    } else {
      setCurrentId(item.location_id);
      setFormData({
        location_name: item.location_name,
        location_type_id: item.location_type_id,
        site_id: item.site_id,
      });
    }
    setIsModalOpen(true);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    const payload = {
      ...formData,
      site_id: parseInt(formData.site_id),
      location_type_id: parseInt(formData.location_type_id || 0),
    };

    let result;
    if (activeTab === "types") {
      result = isEditMode
        ? await actions.updateType(currentId, payload)
        : await actions.createType(payload);
    } else {
      result = isEditMode
        ? await actions.updateLocation(currentId, payload)
        : await actions.createLocation(payload);
    }

    if (result.success) {
      setIsModalOpen(false);
    } else {
      alert(result.message);
    }
  };

  const handleChange = (e) =>
    setFormData({ ...formData, [e.target.name]: e.target.value });

  return (
    <div className="p-6">
      <h1 className="text-2xl font-bold mb-2 text-gray-800">
        Master Data Lokasi (HRD)
      </h1>
      <p className="text-gray-500 mb-6 text-sm">
        Kelola Tipe dan Lokasi per Site
      </p>

      {/* --- FILTER BUTTONS (SITE) --- */}
      <div className="mb-6 flex gap-2">
        {SITE_OPTIONS.map((site) => (
          <button
            key={site.id}
            onClick={() => setSelectedSiteId(site.id)}
            className={`px-4 py-2 rounded-lg text-sm font-medium transition-all ${
              selectedSiteId === site.id
                ? "bg-blue-600 text-white shadow-md"
                : "bg-white text-gray-600 border border-gray-300 hover:bg-gray-50"
            }`}
          >
            {site.name}
          </button>
        ))}
      </div>

      {/* --- TABS --- */}
      <div className="flex border-b border-gray-300 mb-6">
        <button
          className={`py-2 px-4 font-semibold ${
            activeTab === "types"
              ? "border-b-2 border-blue-600 text-blue-600"
              : "text-gray-500"
          }`}
          onClick={() => setActiveTab("types")}
        >
          Tipe Lokasi{" "}
          <span className="text-xs bg-gray-200 px-2 py-0.5 rounded-full ml-1">
            {filteredTypes.length}
          </span>
        </button>
        <button
          className={`py-2 px-4 font-semibold ${
            activeTab === "locations"
              ? "border-b-2 border-blue-600 text-blue-600"
              : "text-gray-500"
          }`}
          onClick={() => setActiveTab("locations")}
        >
          Daftar Lokasi{" "}
          <span className="text-xs bg-gray-200 px-2 py-0.5 rounded-full ml-1">
            {filteredLocations.length}
          </span>
        </button>
      </div>

      <button
        onClick={openCreate}
        className="mb-4 bg-green-600 text-white px-4 py-2 rounded shadow hover:bg-green-700 flex items-center gap-2"
      >
        <span>+ Tambah {activeTab === "types" ? "Tipe" : "Lokasi"}</span>
        <span className="text-xs bg-green-700 px-2 py-0.5 rounded text-white bg-opacity-50">
          di {getSiteName(selectedSiteId)}
        </span>
      </button>

      {error && (
        <div className="bg-red-100 p-3 text-red-700 rounded mb-4">{error}</div>
      )}
      {loading && <p className="text-gray-500">Loading data...</p>}

      {/* --- TAB CONTENT: TYPES --- */}
      {activeTab === "types" && (
        <div className="bg-white shadow rounded overflow-hidden">
          <table className="min-w-full leading-normal">
            <thead className="bg-gray-50 text-left text-xs font-semibold text-gray-600 uppercase">
              <tr>
                <th className="px-5 py-3">Nama Tipe</th>
                <th className="px-5 py-3">Deskripsi</th>
                <th className="px-5 py-3 text-center">Aksi</th>
              </tr>
            </thead>
            <tbody>
              {filteredTypes.length === 0 ? (
                <tr>
                  <td colSpan="3" className="text-center py-4 text-gray-400">
                    Belum ada data tipe di site ini.
                  </td>
                </tr>
              ) : (
                filteredTypes.map((t) => (
                  <tr
                    key={t.location_type_id}
                    className="border-b border-gray-200 hover:bg-gray-50"
                  >
                    <td className="px-5 py-3 font-medium">{t.type_name}</td>
                    <td className="px-5 py-3 text-gray-500">
                      {t.description || "-"}
                    </td>
                    <td className="px-5 py-3 text-center">
                      <button
                        onClick={() => openEdit(t)}
                        className="text-blue-600 mr-3 hover:underline"
                      >
                        Edit
                      </button>
                      <button
                        onClick={() => actions.deleteType(t.location_type_id)}
                        className="text-red-600 hover:underline"
                      >
                        Hapus
                      </button>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      )}

      {/* --- TAB CONTENT: LOCATIONS --- */}
      {activeTab === "locations" && (
        <div className="bg-white shadow rounded overflow-hidden">
          <table className="min-w-full leading-normal">
            <thead className="bg-gray-50 text-left text-xs font-semibold text-gray-600 uppercase">
              <tr>
                <th className="px-5 py-3">Nama Lokasi</th>
                <th className="px-5 py-3">Tipe</th>
                <th className="px-5 py-3 text-center">Aksi</th>
              </tr>
            </thead>
            <tbody>
              {filteredLocations.length === 0 ? (
                <tr>
                  <td colSpan="3" className="text-center py-4 text-gray-400">
                    Belum ada data lokasi di site ini.
                  </td>
                </tr>
              ) : (
                filteredLocations.map((l) => (
                  <tr
                    key={l.location_id}
                    className="border-b border-gray-200 hover:bg-gray-50"
                  >
                    <td className="px-5 py-3 font-medium">{l.location_name}</td>
                    <td className="px-5 py-3">
                      <span className="bg-blue-100 text-blue-800 py-1 px-2 rounded-full text-xs font-semibold">
                        {l.type_name}
                      </span>
                    </td>
                    <td className="px-5 py-3 text-center">
                      <button
                        onClick={() => openEdit(l)}
                        className="text-blue-600 mr-3 hover:underline"
                      >
                        Edit
                      </button>
                      <button
                        onClick={() => actions.deleteLocation(l.location_id)}
                        className="text-red-600 hover:underline"
                      >
                        Hapus
                      </button>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      )}

      {/* --- MODAL FORM --- */}
      {isModalOpen && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white p-6 rounded shadow-lg w-96">
            <h2 className="text-xl font-bold mb-1">
              {isEditMode ? "Edit" : "Tambah"}{" "}
              {activeTab === "types" ? "Tipe" : "Lokasi"}
            </h2>
            <p className="text-sm text-gray-500 mb-4">
              Untuk:{" "}
              <span className="font-bold text-blue-600">
                {getSiteName(formData.site_id)}
              </span>
            </p>

            <form onSubmit={handleSubmit}>
              {/* Input Khusus TYPE */}
              {activeTab === "types" && (
                <>
                  <div className="mb-3">
                    <label className="block text-sm font-bold mb-1">
                      Nama Tipe
                    </label>
                    <input
                      className="w-full border p-2 rounded focus:ring-2 focus:ring-blue-500 outline-none"
                      name="type_name"
                      value={formData.type_name}
                      onChange={handleChange}
                      placeholder="Contoh: Toilet, Lobby, Meeting Room"
                      required
                    />
                  </div>
                  <div className="mb-3">
                    <label className="block text-sm font-bold mb-1">
                      Deskripsi
                    </label>
                    <input
                      className="w-full border p-2 rounded focus:ring-2 focus:ring-blue-500 outline-none"
                      name="description"
                      value={formData.description}
                      onChange={handleChange}
                      placeholder="Opsional"
                    />
                  </div>
                </>
              )}

              {/* Input Khusus LOCATION */}
              {activeTab === "locations" && (
                <>
                  <div className="mb-3">
                    <label className="block text-sm font-bold mb-1">
                      Nama Lokasi
                    </label>
                    <input
                      className="w-full border p-2 rounded focus:ring-2 focus:ring-blue-500 outline-none"
                      name="location_name"
                      value={formData.location_name}
                      onChange={handleChange}
                      placeholder="Contoh: Toilet Lt.1 (Pria)"
                      required
                    />
                  </div>
                  <div className="mb-3">
                    <label className="block text-sm font-bold mb-1">
                      Pilih Tipe
                    </label>
                    <select
                      className="w-full border p-2 rounded focus:ring-2 focus:ring-blue-500 outline-none"
                      name="location_type_id"
                      value={formData.location_type_id}
                      onChange={handleChange}
                      required
                    >
                      <option value="">-- Pilih Tipe --</option>
                      {/* 🔥 Dropdown hanya menampilkan Tipe milik Site yang sedang dipilih */}
                      {filteredTypes.map((t) => (
                        <option
                          key={t.location_type_id}
                          value={t.location_type_id}
                        >
                          {t.type_name}
                        </option>
                      ))}
                    </select>
                  </div>
                </>
              )}

              {/* SITE ID (Hidden or Readonly) - Kita buat Disabled agar user tau ini masuk kemana tapi gabisa ganti sembarangan */}
              <div className="mb-4">
                <label className="block text-sm font-bold mb-1">Site</label>
                <select
                  className="w-full border p-2 rounded bg-gray-100 text-gray-500 cursor-not-allowed"
                  name="site_id"
                  value={formData.site_id}
                  onChange={handleChange}
                  disabled // 🔥 User tidak bisa ganti site di sini, harus ganti filter di atas
                  required
                >
                  {SITE_OPTIONS.map((site) => (
                    <option key={site.id} value={site.id}>
                      {site.name}
                    </option>
                  ))}
                </select>
              </div>

              <div className="flex justify-end gap-2">
                <button
                  type="button"
                  onClick={() => setIsModalOpen(false)}
                  className="bg-gray-300 px-4 py-2 rounded hover:bg-gray-400 transition"
                >
                  Batal
                </button>
                <button
                  type="submit"
                  className="bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700 transition"
                >
                  Simpan
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};

export default LocationManagement;
