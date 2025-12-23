import React, { useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { useKendaraan } from "../Hooks/useKendaraan"; // Pastikan path import benar

const KendaraanList = () => {
  const navigate = useNavigate();

  // 1. Panggil Hook
  const { state, actions } = useKendaraan();
  const { data, loading, error, meta } = state;
  const { fetchData, getImageUrl } = actions;

  // 2. Load data saat komponen pertama kali muncul
  useEffect(() => {
    fetchData(); // Default page 1
  }, [fetchData]);

  // 3. Render Loading atau Error
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
    <div className="p-6 bg-white rounded-lg shadow-md m-4">
      {/* --- HEADER & TOMBOL TAMBAH --- */}
      <div className="flex justify-between items-center mb-6">
        <h2 className="text-2xl font-bold text-gray-800">Daftar Kendaraan</h2>
        <button
          onClick={() => navigate("/tambah")}
          className="bg-green-600 hover:bg-green-700 text-white font-semibold py-2 px-4 rounded transition"
        >
          + Tambah Kendaraan
        </button>
      </div>

      {/* --- TABEL DATA --- */}
      <div className="overflow-x-auto">
        <table className="min-w-full bg-white border border-gray-200">
          <thead className="bg-gray-100">
            <tr>
              <th className="py-3 px-4 border-b text-left text-sm font-semibold text-gray-600">
                Pengemudi
              </th>
              <th className="py-3 px-4 border-b text-left text-sm font-semibold text-gray-600">
                Model Mobil
              </th>
              <th className="py-3 px-4 border-b text-left text-sm font-semibold text-gray-600">
                Lokasi
              </th>
              <th className="py-3 px-4 border-b text-left text-sm font-semibold text-gray-600">
                BBM
              </th>
              <th className="py-3 px-4 border-b text-left text-sm font-semibold text-gray-600">
                Foto
              </th>
            </tr>
          </thead>
          <tbody>
            {data.length === 0 ? (
              <tr>
                <td colSpan="6" className="py-6 text-center text-gray-500">
                  Belum ada data kendaraan.
                </td>
              </tr>
            ) : (
              data.map((item) => (
                <tr key={item.id} className="hover:bg-gray-50 transition">
                  <td className="py-3 px-4 border-b font-medium text-gray-800">
                    {item.nama_pengemudi}
                  </td>
                  <td className="py-3 px-4 border-b text-gray-600">
                    {item.model_mobil}
                  </td>
                  <td className="py-3 px-4 border-b text-gray-600">
                    {/* Handle string kosong */}
                    {item.lokasi_sekarang ? item.lokasi_sekarang : "-"}
                  </td>
                  <td className="py-3 px-4 border-b text-gray-600">
                    {/* Handle string kosong */}
                    {item.bbm ? item.bbm : "-"}
                    {/* {item.gambar_url} */}
                  </td>
                  <td className="py-3 px-4 border-b">
                    {item.gambar_url ? (
                      <img
                        src={getImageUrl(item.gambar_url)}
                        alt="Foto Mobil"
                        className="w-24 h-16 object-cover rounded-md border border-gray-300 shadow-sm"
                      />
                    ) : (
                      <span className="text-gray-400 text-sm">No Image</span>
                    )}
                  </td>
                </tr>
              ))
            )}
          </tbody>
        </table>
      </div>

      {/* --- PAGINATION SIMPLE (Opsional) --- */}
      <div className="mt-4 flex justify-between items-center text-sm text-gray-600">
        <div>Total Records: {meta.total_records || 0}</div>
        <div className="flex gap-2">
          <button
            disabled={meta.current_page <= 1}
            onClick={() => fetchData(meta.current_page - 1)}
            className="px-3 py-1 border rounded disabled:opacity-50"
          >
            Prev
          </button>
          <span>
            Page {meta.current_page} of {meta.total_pages}
          </span>
          <button
            disabled={meta.current_page >= meta.total_pages}
            onClick={() => fetchData(meta.current_page + 1)}
            className="px-3 py-1 border rounded disabled:opacity-50"
          >
            Next
          </button>
        </div>
      </div>
    </div>
  );
};

export default KendaraanList;
