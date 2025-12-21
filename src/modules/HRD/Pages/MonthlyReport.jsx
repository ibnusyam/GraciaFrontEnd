import React, { useEffect, useState, useMemo } from "react";
import { useCleaningLogs } from "../Hooks/useCleaningLogs";

const MonthlyCleaningReport = () => {
  const { state, actions } = useCleaningLogs();
  const { logs, filterOptions, loading } = state;
  const { fetchData } = actions;

  const [selectedMonth, setSelectedMonth] = useState(new Date().getMonth() + 1);
  const [selectedYear, setSelectedYear] = useState(new Date().getFullYear());
  const [selectedType, setSelectedType] = useState("");

  const daysInMonth = useMemo(() => {
    const date = new Date(selectedYear, selectedMonth, 0);
    const days = date.getDate();
    return Array.from({ length: days }, (_, i) => i + 1);
  }, [selectedMonth, selectedYear]);

  useEffect(() => {
    const monthStr = String(selectedMonth).padStart(2, "0");
    const dateParam = `${selectedYear}-${monthStr}`;
    fetchData("", "", 1, "", dateParam, 1000);
  }, [fetchData, selectedMonth, selectedYear]);

  const matrixData = useMemo(() => {
    const allLocations = filterOptions.locations || [];
    const filteredLocations = selectedType
      ? allLocations.filter(
          (loc) => String(loc.location_type_id) === String(selectedType)
        )
      : allLocations;

    return filteredLocations.map((loc) => {
      const row = {
        location_id: loc.location_id,
        location_name: loc.location_name,
        type_name: loc.type_name || loc.location_type_name,
        days: {},
      };

      const locLogs = logs.filter(
        (l) => String(l.location_id) === String(loc.location_id)
      );

      locLogs.forEach((log) => {
        const logDate = new Date(log.start_time).getDate();
        row.days[logDate] = {
          cleaner: log.cleaner_name,
          time: new Date(log.start_time).toLocaleTimeString("id-ID", {
            hour: "2-digit",
            minute: "2-digit",
          }),
          status: "OK",
        };
      });

      return row;
    });
  }, [filterOptions.locations, logs, selectedType]);

  const months = [
    "Januari",
    "Februari",
    "Maret",
    "April",
    "Mei",
    "Juni",
    "Juli",
    "Agustus",
    "September",
    "Oktober",
    "November",
    "Desember",
  ];
  const years = Array.from(
    { length: 5 },
    (_, i) => new Date().getFullYear() - i
  );

  return (
    <div className="p-6 bg-gray-50 min-h-screen">
      <div className="max-w-full mx-auto">
        <div className="flex flex-col md:flex-row justify-between items-center mb-6 gap-4">
          <div>
            <h1 className="text-2xl font-bold text-gray-800">Rekap Bulanan</h1>
            <p className="text-gray-500 text-sm">
              Monitoring kebersihan per lokasi
            </p>
          </div>

          <div className="flex flex-wrap gap-2">
            <select
              value={selectedType}
              onChange={(e) => setSelectedType(e.target.value)}
              className="bg-white border border-gray-300 text-gray-900 text-sm rounded-lg p-2.5 min-w-[150px]"
            >
              <option value="">Semua Tipe</option>
              {filterOptions.types &&
                filterOptions.types.map((t) => (
                  <option key={t.location_type_id} value={t.location_type_id}>
                    {t.type_name}
                  </option>
                ))}
            </select>

            <select
              value={selectedMonth}
              onChange={(e) => setSelectedMonth(Number(e.target.value))}
              className="bg-white border border-gray-300 text-gray-900 text-sm rounded-lg p-2.5"
            >
              {months.map((m, idx) => (
                <option key={idx} value={idx + 1}>
                  {m}
                </option>
              ))}
            </select>
            <select
              value={selectedYear}
              onChange={(e) => setSelectedYear(Number(e.target.value))}
              className="bg-white border border-gray-300 text-gray-900 text-sm rounded-lg p-2.5"
            >
              {years.map((y) => (
                <option key={y} value={y}>
                  {y}
                </option>
              ))}
            </select>
          </div>
        </div>

        <div className="bg-white shadow-md rounded-lg overflow-hidden border border-gray-200">
          {loading ? (
            <div className="p-10 text-center text-gray-500">
              Memuat data rekap...
            </div>
          ) : matrixData.length === 0 ? (
            <div className="p-10 text-center text-gray-500">
              Tidak ada lokasi ditemukan untuk filter ini.
            </div>
          ) : (
            <div className="overflow-x-auto">
              <table className="w-full text-xs text-left text-gray-500">
                <thead className="text-xs text-gray-700 uppercase bg-gray-100 border-b">
                  <tr>
                    <th className="px-4 py-3 sticky left-0 bg-gray-100 z-10 w-48 shadow-sm">
                      Lokasi
                    </th>
                    {daysInMonth.map((d) => (
                      <th
                        key={d}
                        className="px-2 py-3 text-center min-w-[40px] border-l border-gray-200"
                      >
                        {d}
                      </th>
                    ))}
                  </tr>
                </thead>
                <tbody className="divide-y divide-gray-200">
                  {matrixData.map((row) => (
                    <tr key={row.location_id} className="hover:bg-gray-50">
                      <td className="px-4 py-3 font-medium text-gray-900 sticky left-0 bg-white z-10 shadow-sm border-r">
                        <div
                          className="truncate w-40"
                          title={row.location_name}
                        >
                          {row.location_name}
                        </div>
                        <div className="text-[10px] text-gray-400">
                          {row.type_name}
                        </div>
                      </td>

                      {daysInMonth.map((d) => {
                        const data = row.days[d];
                        return (
                          <td
                            key={d}
                            className="px-1 py-2 text-center border-l border-gray-100"
                          >
                            {data ? (
                              <div className="group relative cursor-pointer flex justify-center">
                                <div className="w-6 h-6 bg-green-100 text-green-600 rounded-full flex items-center justify-center font-bold">
                                  ✓
                                </div>

                                <div className="absolute bottom-full mb-2 hidden group-hover:block w-max bg-gray-800 text-white text-[10px] rounded p-2 z-50">
                                  <div>Cleaner: {data.cleaner}</div>
                                  <div>Jam: {data.time}</div>
                                </div>
                              </div>
                            ) : (
                              <div className="w-6 h-6 mx-auto bg-gray-50 rounded-full flex items-center justify-center text-gray-300">
                                -
                              </div>
                            )}
                          </td>
                        );
                      })}
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default MonthlyCleaningReport;
