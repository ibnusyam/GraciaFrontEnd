import React, { useState, useEffect } from "react";

const CleaningLogTable = () => {
  // State untuk data, loading, dan error
  const [logs, setLogs] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  // URL Backend
  const API_BASE_URL = "http://localhost:8081";

  // Fungsi Fetch Data
  const fetchData = async () => {
    setLoading(true);
    try {
      // Sesuaikan endpoint path dengan route di Go-mu, misal: /api/cleaning-logs
      const response = await fetch(`${API_BASE_URL}/get`);

      if (!response.ok) {
        throw new Error("Gagal mengambil data dari server");
      }

      const data = await response.json();
      setLogs(data);
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  // Ambil data saat komponen di-load
  useEffect(() => {
    fetchData();
  }, []);

  // --- HELPER FUNCTIONS UNTUK FORMAT DATA GO ---

  // Format Tanggal (Indonesia)
  const formatDate = (dateString) => {
    if (!dateString) return "-";
    return new Date(dateString).toLocaleString("id-ID", {
      day: "numeric",
      month: "short",
      year: "numeric",
      hour: "2-digit",
      minute: "2-digit",
    });
  };

  // Handle Go NullString ({String: "...", Valid: true/false})
  const getNullString = (obj) => {
    if (obj && obj.Valid) return obj.String;
    return "-"; // Atau return "" jika ingin kosong
  };

  // Handle Go NullTime ({Time: "...", Valid: true/false})
  const getNullTime = (obj) => {
    if (obj && obj.Valid) {
      // Cek apakah tahun 0001 (default Go time.Time zero value)
      if (obj.Time.startsWith("0001")) return null;
      return formatDate(obj.Time);
    }
    return null;
  };

  // Generate URL Gambar (Menggabungkan Base URL dengan path dari DB)
  const getImageUrl = (path) => {
    if (!path) return null;
    // Jika path adalah object NullString
    if (typeof path === "object" && path.Valid) {
      return `${API_BASE_URL}/${path.String}`;
    }
    // Jika path string biasa
    if (typeof path === "string" && path !== "") {
      return `${API_BASE_URL}/${path}`;
    }
    return null;
  };

  return (
    <div className="p-6 bg-gray-50 min-h-screen">
      <div className="max-w-7xl mx-auto">
        {/* Header Section */}
        <div className="flex justify-between items-center mb-6">
          <div>
            <h1 className="text-2xl font-bold text-gray-800">
              Laporan Kebersihan
            </h1>
            <p className="text-sm text-gray-500">
              Monitoring aktivitas cleaning service
            </p>
          </div>
          <button
            onClick={fetchData}
            className="bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-lg text-sm transition shadow-sm flex items-center gap-2"
          >
            <svg
              xmlns="http://www.w3.org/2000/svg"
              className="h-4 w-4"
              fill="none"
              viewBox="0 0 24 24"
              stroke="currentColor"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15"
              />
            </svg>
            Refresh Data
          </button>
        </div>

        {/* Error Handling */}
        {error && (
          <div
            className="bg-red-100 border-l-4 border-red-500 text-red-700 p-4 mb-4"
            role="alert"
          >
            <p className="font-bold">Error</p>
            <p>{error}</p>
          </div>
        )}

        {/* Table Content */}
        <div className="bg-white shadow-md rounded-lg overflow-hidden border border-gray-200">
          <div className="overflow-x-auto">
            <table className="w-full text-sm text-left text-gray-500">
              <thead className="text-xs text-gray-700 uppercase bg-gray-100 border-b">
                <tr>
                  <th className="px-6 py-3">Status</th>
                  <th className="px-6 py-3">Cleaner</th>
                  <th className="px-6 py-3">Lokasi</th>
                  <th className="px-6 py-3">Waktu Mulai</th>
                  <th className="px-6 py-3">Waktu Selesai</th>
                  <th className="px-6 py-3 text-center">Foto Sebelum</th>
                  <th className="px-6 py-3 text-center">Foto Sesudah</th>
                  <th className="px-6 py-3">Catatan</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-200">
                {loading ? (
                  <tr>
                    <td colSpan="8" className="px-6 py-10 text-center">
                      <div className="flex justify-center items-center gap-2">
                        <div className="w-5 h-5 border-t-2 border-b-2 border-blue-600 rounded-full animate-spin"></div>
                        <span>Memuat data...</span>
                      </div>
                    </td>
                  </tr>
                ) : logs.length === 0 ? (
                  <tr>
                    <td
                      colSpan="8"
                      className="px-6 py-4 text-center text-gray-400"
                    >
                      Tidak ada data log kebersihan.
                    </td>
                  </tr>
                ) : (
                  logs.map((log) => {
                    // Logic Status: Jika end_time valid, berarti Selesai. Jika tidak, On Progress.
                    const isCompleted = log.end_time?.Valid;

                    return (
                      <tr
                        key={log.log_id}
                        className="hover:bg-gray-50 transition"
                      >
                        {/* Status Badge */}
                        <td className="px-6 py-4">
                          <span
                            className={`px-2 py-1 rounded-full text-xs font-semibold ${
                              isCompleted
                                ? "bg-green-100 text-green-800 border border-green-200"
                                : "bg-yellow-100 text-yellow-800 border border-yellow-200"
                            }`}
                          >
                            {isCompleted ? "Selesai" : "Proses"}
                          </span>
                        </td>

                        {/* Cleaner Name */}
                        <td className="px-6 py-4 font-medium text-gray-900 capitalize">
                          {log.cleaner_name}
                        </td>

                        {/* Location (Gabungan ID) */}
                        <td className="px-6 py-4">
                          <div className="flex flex-col">
                            <span className="font-medium">
                              ID: {log.location_id}
                            </span>
                            <span className="text-xs text-gray-400">
                              Type: {log.location_type_id}
                            </span>
                          </div>
                        </td>

                        {/* Waktu Mulai */}
                        <td className="px-6 py-4 whitespace-nowrap">
                          {formatDate(log.start_time)}
                        </td>

                        {/* Waktu Selesai */}
                        <td className="px-6 py-4 whitespace-nowrap">
                          {getNullTime(log.end_time) || (
                            <span className="text-gray-400 italic">
                              -- : --
                            </span>
                          )}
                        </td>

                        {/* Foto Before */}
                        <td className="px-6 py-4 text-center">
                          {getImageUrl(log.image_before_url) ? (
                            <a
                              href={getImageUrl(log.image_before_url)}
                              target="_blank"
                              rel="noreferrer"
                              className="inline-block group"
                            >
                              <img
                                src={getImageUrl(log.image_before_url)}
                                alt="Before"
                                className="h-12 w-12 object-cover rounded border border-gray-200 group-hover:scale-110 transition"
                              />
                            </a>
                          ) : (
                            <span className="text-xs text-gray-400">
                              No Img
                            </span>
                          )}
                        </td>

                        {/* Foto After (NullString Check) */}
                        <td className="px-6 py-4 text-center">
                          {getImageUrl(log.image_after_url) ? (
                            <a
                              href={getImageUrl(log.image_after_url)}
                              target="_blank"
                              rel="noreferrer"
                              className="inline-block group"
                            >
                              <img
                                src={getImageUrl(log.image_after_url)}
                                alt="After"
                                className="h-12 w-12 object-cover rounded border border-gray-200 group-hover:scale-110 transition"
                              />
                            </a>
                          ) : (
                            <span className="text-xs text-gray-400">-</span>
                          )}
                        </td>

                        {/* Notes (NullString Check) */}
                        <td
                          className="px-6 py-4 max-w-xs truncate"
                          title={getNullString(log.notes)}
                        >
                          {getNullString(log.notes)}
                        </td>
                      </tr>
                    );
                  })
                )}
              </tbody>
            </table>
          </div>

          {/* Footer Table (Optional Pagination info) */}
          <div className="bg-gray-50 px-6 py-3 border-t border-gray-200 text-xs text-gray-500">
            Menampilkan {logs.length} data
          </div>
        </div>
      </div>
    </div>
  );
};

export default CleaningLogTable;
