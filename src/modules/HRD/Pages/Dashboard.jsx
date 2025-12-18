import React from "react";
import { useCleanerPerformance } from "../Hooks/useDashboard";

export function CleanerPerformanceTable() {
  // Ambil siteId dari localStorage (konsisten dengan logic Form kamu)
  const siteId = localStorage.getItem("siteId");

  const { state, actions } = useCleanerPerformance(siteId);
  const { cleaners, loading, error, filter, months, totals } = state;
  const { handleFilterChange } = actions;

  // Helper format menit ke Jam & Menit
  const formatTime = (totalMin) => {
    const m = Math.round(totalMin || 0);
    const h = Math.floor(m / 60);
    const mins = m % 60;
    return h > 0 ? `${h}j ${mins}m` : `${mins}m`;
  };

  return (
    <div className="w-full bg-white rounded-2xl shadow-xl border border-gray-100 p-6 mt-6">
      {/* Header & Filter */}
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-8 gap-4 border-b pb-4">
        <div>
          <h2 className="text-2xl font-extrabold text-gray-900 uppercase tracking-tight">
            Performa Tim Kebersihan
          </h2>
          <p className="text-sm text-gray-500 italic">
            Akumulasi pekerjaan berdasarkan log harian petugas
          </p>
        </div>

        <div className="flex gap-3 w-full md:w-auto">
          <select
            name="month"
            value={filter.month}
            onChange={handleFilterChange}
            className="flex-1 md:flex-none bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-indigo-500 focus:border-indigo-500 block p-2.5 outline-none transition shadow-sm"
          >
            {months.map((m) => (
              <option key={m.v} value={m.v}>
                {m.l}
              </option>
            ))}
          </select>

          <select
            name="year"
            value={filter.year}
            onChange={handleFilterChange}
            className="flex-1 md:flex-none bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-indigo-500 focus:border-indigo-500 block p-2.5 outline-none transition shadow-sm"
          >
            <option value="2025">2025</option>
            <option value="2024">2024</option>
          </select>
        </div>
      </div>

      {error && (
        <div className="bg-red-50 text-red-600 p-4 rounded-lg mb-4 text-sm font-medium border border-red-100">
          ⚠️ {error}
        </div>
      )}

      {/* Table Section */}
      <div className="overflow-x-auto">
        <table className="w-full text-left border-separate border-spacing-y-2">
          <thead>
            <tr className="text-gray-400 text-xs uppercase tracking-widest font-bold">
              <th className="py-3 px-4">Nama Petugas</th>
              <th className="py-3 px-4 text-center">Jumlah Log</th>
              <th className="py-3 px-4 text-right">Total Waktu Kerja</th>
            </tr>
          </thead>
          <tbody className="text-sm">
            {loading ? (
              <tr>
                <td
                  colSpan="3"
                  className="py-12 text-center text-gray-400 italic bg-gray-50 rounded-xl"
                >
                  Sedang memproses data performa...
                </td>
              </tr>
            ) : cleaners.length === 0 ? (
              <tr>
                <td
                  colSpan="3"
                  className="py-12 text-center text-gray-400 italic bg-gray-50 rounded-xl"
                >
                  Belum ada catatan log untuk periode ini.
                </td>
              </tr>
            ) : (
              cleaners.map((cleaner, index) => (
                <tr
                  key={index}
                  className="bg-white border border-gray-100 shadow-sm hover:shadow-md hover:bg-indigo-50/30 transition-all duration-200 group"
                >
                  <td className="py-4 px-4 rounded-l-xl">
                    <div className="flex items-center gap-4">
                      <div className="w-10 h-10 rounded-full bg-indigo-600 text-white flex items-center justify-center font-bold text-lg shadow-indigo-200 shadow-lg">
                        {cleaner.cleaner_name
                          ? cleaner.cleaner_name.charAt(0).toUpperCase()
                          : "?"}
                      </div>
                      <span className="font-bold text-gray-800 tracking-tight">
                        {cleaner.cleaner_name}
                      </span>
                    </div>
                  </td>
                  <td className="py-4 px-4 text-center">
                    <span className="inline-block bg-indigo-100 text-indigo-700 px-4 py-1.5 rounded-full font-extrabold text-xs border border-indigo-200">
                      {cleaner.total_logs} LOG
                    </span>
                  </td>
                  <td className="py-4 px-4 text-right rounded-r-xl font-black text-gray-700 uppercase">
                    {formatTime(cleaner.total_minutes)}
                  </td>
                </tr>
              ))
            )}
          </tbody>

          {/* Footer Grand Total */}
          {!loading && cleaners.length > 0 && (
            <tfoot>
              <tr className="bg-gray-900 text-white shadow-2xl overflow-hidden">
                <td className="py-5 px-6 rounded-l-2xl font-bold uppercase tracking-wider">
                  Total Keseluruhan
                </td>
                <td className="py-5 px-4 text-center font-black text-indigo-400 text-lg">
                  {totals.logs} LOG
                </td>
                <td className="py-5 px-6 text-right rounded-r-2xl font-black text-xl tracking-tighter text-indigo-400">
                  {formatTime(totals.minutes)}
                </td>
              </tr>
            </tfoot>
          )}
        </table>
      </div>
    </div>
  );
}

export default CleanerPerformanceTable;
