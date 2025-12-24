import React, { useState, useEffect, useMemo } from "react";
import { useCleaningLogs } from "../Hooks/useCleaningLogs";

const CleaningLogTable = () => {
  const { state, actions } = useCleaningLogs();
  const { logs, meta, filterOptions, loading, error } = state;
  const {
    fetchData,
    getNullTime,
    getImageUrl,
    getNullString,
    formatTime,
    calculateDuration,
  } = actions;

  const getCurrentMonth = () => {
    const month = new Date().getMonth() + 1;
    return month < 10 ? `0${month}` : `${month}`;
  };

  const [filterMonth, setFilterMonth] = useState(getCurrentMonth());
  const [filterYear, setFilterYear] = useState(new Date().getFullYear());
  const [selectedLocation, setSelectedLocation] = useState("");
  const [selectedType, setSelectedType] = useState("");
  const [searchCleaner, setSearchCleaner] = useState("");
  const [currentPage, setCurrentPage] = useState(1);

  const filteredLocations = useMemo(() => {
    const allLocations = filterOptions.locations || [];
    if (!selectedType) return allLocations;
    return allLocations.filter(
      (loc) => String(loc.location_type_id) === String(selectedType)
    );
  }, [selectedType, filterOptions.locations]);

  useEffect(() => {
    let dateParam = "";
    if (filterYear) {
      dateParam = filterMonth
        ? `${filterYear}-${filterMonth}`
        : `${filterYear}`;
    }

    const timer = setTimeout(() => {
      fetchData(
        selectedLocation,
        selectedType,
        currentPage,
        searchCleaner,
        dateParam
      );
    }, 500);

    return () => clearTimeout(timer);
  }, [
    selectedLocation,
    selectedType,
    currentPage,
    searchCleaner,
    filterMonth,
    filterYear,
    fetchData,
  ]);

  const displayedLogs = logs.filter((log) => {
    if (selectedType) {
      if (
        log.location_type_id &&
        String(log.location_type_id) !== String(selectedType)
      ) {
        return false;
      }
    }
    if (selectedLocation) {
      if (
        log.location_id &&
        String(log.location_id) !== String(selectedLocation)
      ) {
        return false;
      }
    }
    return true;
  });

  const handleResetFilter = () => {
    setSelectedLocation("");
    setSelectedType("");
    setSearchCleaner("");
    setFilterMonth(getCurrentMonth());
    setFilterYear(new Date().getFullYear());
    setCurrentPage(1);
  };

  const handlePageChange = (newPage) => {
    if (newPage >= 1 && newPage <= meta.total_pages) {
      setCurrentPage(newPage);
    }
  };

  const formatDate = (dateString) => {
    if (!dateString) return "-";
    return new Date(dateString).toLocaleDateString("id-ID", {
      day: "2-digit",
      month: "short",
      year: "numeric",
    });
  };

  const months = [
    { value: "01", label: "Januari" },
    { value: "02", label: "Februari" },
    { value: "03", label: "Maret" },
    { value: "04", label: "April" },
    { value: "05", label: "Mei" },
    { value: "06", label: "Juni" },
    { value: "07", label: "Juli" },
    { value: "08", label: "Agustus" },
    { value: "09", label: "September" },
    { value: "10", label: "Oktober" },
    { value: "11", label: "November" },
    { value: "12", label: "Desember" },
  ];

  const currentYear = new Date().getFullYear();
  const years = Array.from(
    { length: 5 },
    (_, i) => currentYear - i + 1
  ).reverse();

  return (
    <div className="p-6 bg-gray-50 min-h-screen">
      <div className="max-w-7xl mx-auto">
        {/* HEADER & RESET */}
        <div className="mb-6 flex flex-col gap-4">
          <div className="flex justify-between items-center">
            <div>
              <h1 className="text-2xl font-bold text-gray-800">
                Log Kebersihan
              </h1>
              <p className="text-sm text-gray-500">
                Total Data: {meta.total_records}
              </p>
            </div>
            <button
              onClick={handleResetFilter}
              className="text-gray-900 bg-white border border-gray-300 hover:bg-gray-100 font-medium rounded-lg text-sm px-5 py-2.5 transition"
            >
              Reset Filter
            </button>
          </div>

          {/* FILTER SECTION */}
          <div className="grid grid-cols-1 md:grid-cols-5 gap-3">
            <input
              type="text"
              placeholder="Cari Nama Cleaner..."
              value={searchCleaner}
              onChange={(e) => {
                setSearchCleaner(e.target.value);
                setCurrentPage(1);
              }}
              className="bg-white border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full p-2.5"
            />

            <select
              value={filterMonth}
              onChange={(e) => {
                setFilterMonth(e.target.value);
                setCurrentPage(1);
              }}
              className="bg-white border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full p-2.5"
            >
              {months.map((m) => (
                <option key={m.value} value={m.value}>
                  {m.label}
                </option>
              ))}
            </select>

            <select
              value={filterYear}
              onChange={(e) => {
                setFilterYear(e.target.value);
                setCurrentPage(1);
              }}
              className="bg-white border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full p-2.5"
            >
              {years.map((y) => (
                <option key={y} value={y}>
                  {y}
                </option>
              ))}
            </select>

            <select
              value={selectedType}
              onChange={(e) => {
                setSelectedType(e.target.value);
                setSelectedLocation(""); // Reset Location saat Type berubah
                setCurrentPage(1);
              }}
              className="bg-white border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full p-2.5"
            >
              <option value="">Semua Tipe</option>
              {filterOptions.types && filterOptions.types.length > 0 ? (
                filterOptions.types.map((type) => (
                  <option
                    key={type.location_type_id}
                    value={type.location_type_id}
                  >
                    {type.type_name}
                  </option>
                ))
              ) : (
                <option disabled>Loading...</option>
              )}
            </select>

            <select
              value={selectedLocation}
              onChange={(e) => {
                setSelectedLocation(e.target.value);
                setCurrentPage(1);
              }}
              className="bg-white border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full p-2.5"
            >
              <option value="">Semua Lokasi</option>
              {filteredLocations.length > 0 ? (
                filteredLocations.map((loc) => (
                  <option key={loc.location_id} value={loc.location_id}>
                    {loc.location_name}
                  </option>
                ))
              ) : (
                <option disabled>
                  {selectedType ? "Tidak ada lokasi tipe ini" : "Loading..."}
                </option>
              )}
            </select>
          </div>
        </div>

        {error && (
          <div
            className="p-4 mb-4 text-sm text-red-800 rounded-lg bg-red-50"
            role="alert"
          >
            <span className="font-medium">Error!</span> {error}
          </div>
        )}

        <div className="bg-white shadow-md rounded-lg overflow-hidden border border-gray-200">
          <div className="overflow-x-auto">
            <table className="w-full text-sm text-left text-gray-500">
              <thead className="text-xs text-gray-700 uppercase bg-gray-100 border-b">
                <tr>
                  <th className="px-6 py-3">Tanggal</th>
                  <th className="px-6 py-3">Cleaner</th>
                  <th className="px-6 py-3">Tipe Lokasi</th>
                  <th className="px-6 py-3">Lokasi Detail</th>
                  <th className="px-6 py-3">Mulai</th>
                  <th className="px-6 py-3">Selesai</th>
                  <th className="px-6 py-3">Durasi</th>
                  <th className="px-6 py-3 text-center">Foto Sebelum</th>
                  <th className="px-6 py-3 text-center">Foto Sesudah</th>
                  <th className="px-6 py-3">Catatan</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-200">
                {loading ? (
                  <tr>
                    <td colSpan="10" className="px-6 py-10 text-center">
                      <div className="flex justify-center items-center gap-2">
                        <div className="w-5 h-5 border-t-2 border-b-2 border-blue-600 rounded-full animate-spin"></div>
                        <span>Memuat data...</span>
                      </div>
                    </td>
                  </tr>
                ) : displayedLogs.length === 0 ? (
                  // GANTI 'logs.length' DENGAN 'displayedLogs.length'
                  <tr>
                    <td
                      colSpan="10"
                      className="px-6 py-4 text-center text-gray-400"
                    >
                      Tidak ada data log kebersihan ditemukan.
                    </td>
                  </tr>
                ) : (
                  // LOOPING MENGGUNAKAN 'displayedLogs' BUKAN 'logs'
                  displayedLogs.map((log) => (
                    <tr
                      key={log.log_id}
                      className="hover:bg-gray-50 transition"
                    >
                      <td className="px-6 py-4 whitespace-nowrap font-medium text-gray-700">
                        {formatDate(log.start_time)}
                      </td>
                      <td className="px-6 py-4 font-medium text-gray-900 capitalize">
                        {log.cleaner_name}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <span className="bg-blue-100 text-blue-800 text-xs font-medium px-2.5 py-0.5 rounded">
                          {log.location_type_name}
                        </span>
                      </td>
                      <td className="px-6 py-4 font-medium text-gray-800">
                        {log.location_name}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        {formatTime(log.start_time)}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        {getNullTime(log.end_time) || "--:--"}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap font-semibold text-gray-700">
                        {calculateDuration(log.start_time, log.end_time)}
                      </td>
                      <td className="px-6 py-4 text-center">
                        {getImageUrl(log.image_before_url) ? (
                          <a
                            href={getImageUrl(log.image_before_url)}
                            target="_blank"
                            rel="noreferrer"
                          >
                            <img
                              src={getImageUrl(log.image_before_url)}
                              alt="Before"
                              className="h-12 w-12 object-cover rounded border hover:scale-150 transition bg-white"
                            />
                          </a>
                        ) : (
                          <span className="text-xs text-gray-400">N/A</span>
                        )}
                      </td>
                      <td className="px-6 py-4 text-center">
                        {getImageUrl(log.image_after_url) ? (
                          <a
                            href={getImageUrl(log.image_after_url)}
                            target="_blank"
                            rel="noreferrer"
                          >
                            <img
                              src={getImageUrl(log.image_after_url)}
                              alt="After"
                              className="h-12 w-12 object-cover rounded border hover:scale-150 transition bg-white"
                            />
                          </a>
                        ) : (
                          <span className="text-xs text-gray-400">N/A</span>
                        )}
                      </td>
                      <td
                        className="px-6 py-4 max-w-xs truncate"
                        title={getNullString(log.notes)}
                      >
                        {getNullString(log.notes)}
                      </td>
                    </tr>
                  ))
                )}
              </tbody>
            </table>
          </div>

          <div className="bg-gray-50 px-6 py-4 border-t border-gray-200 flex items-center justify-between">
            <span className="text-sm text-gray-700">
              Halaman <span className="font-semibold">{meta.current_page}</span>{" "}
              dari <span className="font-semibold">{meta.total_pages}</span>
            </span>
            <div className="inline-flex mt-2 xs:mt-0">
              <button
                onClick={() => handlePageChange(meta.current_page - 1)}
                disabled={meta.current_page === 1 || loading}
                className="px-4 py-2 text-sm font-medium text-white bg-blue-600 rounded-l hover:bg-blue-700 disabled:bg-gray-300"
              >
                Prev
              </button>
              <button
                onClick={() => handlePageChange(meta.current_page + 1)}
                disabled={meta.current_page === meta.total_pages || loading}
                className="px-4 py-2 text-sm font-medium text-white bg-blue-600 rounded-r border-0 border-l border-blue-700 hover:bg-blue-700 disabled:bg-gray-300"
              >
                Next
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default CleaningLogTable;
