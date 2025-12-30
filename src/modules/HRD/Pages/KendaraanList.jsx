import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { useKendaraan } from "../Hooks/useKendaraan";

const KendaraanList = () => {
  const navigate = useNavigate();
  const { state, actions } = useKendaraan();
  const { data, loading, error, meta } = state;
  const { fetchData, getImageUrl } = actions;

  const [selectedImg, setSelectedImg] = useState(null);

  useEffect(() => {
    fetchData();
  }, [fetchData]);

  const handleLogout = () => {
    if (window.confirm("Apakah Anda yakin ingin logout?")) {
      localStorage.removeItem("token");
      navigate("/login");
    }
  };

  if (loading && data.length === 0) {
    return <div className="p-4 text-center">Loading data...</div>;
  }

  if (error) {
    return (
      <div className="p-4 text-center text-red-500">
        Error: {error}
        <br />
        <button
          onClick={() => fetchData()}
          className="mt-2 bg-blue-500 text-white px-4 py-2 rounded"
        >
          Coba Lagi
        </button>
      </div>
    );
  }

  return (
    <div className="p-6 bg-gray-50 min-h-screen">
      <div className="max-w-7xl mx-auto bg-white rounded-xl shadow-lg p-6">
        <div className="flex justify-between items-center mb-8">
          <div>
            <h2 className="text-3xl font-bold text-gray-800">
              Daftar Kendaraan
            </h2>
            <p className="text-gray-500">
              Manajemen data operasional kendaraan
            </p>
          </div>
          <div className="flex gap-3">
            <button
              onClick={() => navigate("/tambah")}
              className="bg-blue-600 hover:bg-blue-700 text-white font-semibold py-2 px-6 rounded-lg transition shadow-md"
            >
              + Tambah Data
            </button>
            <button
              onClick={handleLogout}
              className="bg-red-500 hover:bg-red-600 text-white font-semibold py-2 px-6 rounded-lg transition shadow-md"
            >
              Logout
            </button>
          </div>
        </div>

        <div className="overflow-x-auto rounded-lg border border-gray-200">
          <table className="min-w-full divide-y divide-gray-200">
            <thead className="bg-gray-100">
              <tr>
                <th className="py-4 px-4 text-left text-xs font-bold text-gray-600 uppercase tracking-wider">
                  Pengemudi
                </th>
                <th className="py-4 px-4 text-left text-xs font-bold text-gray-600 uppercase tracking-wider">
                  Model Mobil
                </th>
                <th className="py-4 px-4 text-left text-xs font-bold text-gray-600 uppercase tracking-wider">
                  Lokasi
                </th>
                <th className="py-4 px-4 text-left text-xs font-bold text-gray-600 uppercase tracking-wider">
                  Waktu Input
                </th>
                <th className="py-4 px-4 text-left text-xs font-bold text-gray-600 uppercase tracking-wider">
                  BBM
                </th>
                <th className="py-4 px-4 text-center text-xs font-bold text-gray-600 uppercase tracking-wider">
                  Foto
                </th>
              </tr>
            </thead>
            <tbody className="bg-white divide-y divide-gray-100">
              {data.length === 0 ? (
                <tr>
                  <td
                    colSpan="6"
                    className="py-10 text-center text-gray-400 italic"
                  >
                    Belum ada data kendaraan.
                  </td>
                </tr>
              ) : (
                data.map((item) => (
                  <tr
                    key={item.id}
                    className="hover:bg-blue-50 transition-colors"
                  >
                    <td className="py-4 px-4 text-sm font-medium text-gray-900">
                      {item.nama_pengemudi}
                    </td>
                    <td className="py-4 px-4 text-sm text-gray-600">
                      {item.model_mobil}
                    </td>
                    <td className="py-4 px-4 text-sm text-gray-600">
                      {item.lokasi_sekarang || "-"}
                    </td>
                    <td className="py-4 px-4 text-sm text-gray-500">
                      {item.waktu_input
                        ? new Date(item.waktu_input).toLocaleString("id-ID")
                        : "-"}
                    </td>
                    <td className="py-4 px-4 text-sm text-gray-600">
                      {item.bbm || "-"}
                    </td>
                    <td className="py-4 px-4 text-center">
                      {item.gambar_url ? (
                        <img
                          src={getImageUrl(item.gambar_url)}
                          alt="Preview"
                          onClick={() =>
                            setSelectedImg(getImageUrl(item.gambar_url))
                          }
                          className="w-16 h-12 object-cover rounded-md border border-gray-200 shadow-sm cursor-zoom-in hover:scale-110 transition-transform mx-auto"
                        />
                      ) : (
                        <span className="text-gray-300 text-xs italic">
                          No Image
                        </span>
                      )}
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>

        <div className="mt-6 flex justify-between items-center bg-gray-50 p-4 rounded-lg">
          <div className="text-gray-600 font-medium">
            Total: {meta.total_records || 0} Data
          </div>
          <div className="flex items-center gap-4">
            <button
              disabled={meta.current_page <= 1}
              onClick={() => fetchData(meta.current_page - 1)}
              className="px-4 py-2 bg-white border border-gray-300 rounded-md hover:bg-gray-100 disabled:opacity-40 transition"
            >
              Previous
            </button>
            <span className="text-gray-700 font-semibold">
              Halaman {meta.current_page} dari {meta.total_pages}
            </span>
            <button
              disabled={meta.current_page >= meta.total_pages}
              onClick={() => fetchData(meta.current_page + 1)}
              className="px-4 py-2 bg-white border border-gray-300 rounded-md hover:bg-gray-100 disabled:opacity-40 transition"
            >
              Next
            </button>
          </div>
        </div>
      </div>

      {/* --- MODAL ZOOM GAMBAR --- */}
      {selectedImg && (
        <div
          className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-80 p-4 backdrop-blur-sm"
          onClick={() => setSelectedImg(null)}
        >
          <div className="relative max-w-4xl w-full flex justify-center">
            <button
              className="absolute -top-10 right-0 text-white text-3xl font-bold hover:text-gray-300"
              onClick={() => setSelectedImg(null)}
            >
              &times; Close
            </button>
            <img
              src={selectedImg}
              alt="Full Size"
              className="max-w-full max-h-[85vh] rounded-lg shadow-2xl object-contain animate-zoomIn"
            />
          </div>
        </div>
      )}
    </div>
  );
};

export default KendaraanList;
