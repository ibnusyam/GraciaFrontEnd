import { Fragment } from "react";
import {
  MagnifyingGlassIcon,
  ArrowDownTrayIcon,
  PencilSquareIcon,
  PlusIcon,
  XMarkIcon,
  TrashIcon,
} from "@heroicons/react/24/outline";

// Import Custom Hook
import { useLogFinger } from "../Hooks/useLogFinger";

// --- CONSTANTS ---
const HOURS = Array.from({ length: 24 }, (_, i) => String(i).padStart(2, "0"));
const MINUTES = Array.from({ length: 60 }, (_, i) =>
  String(i).padStart(2, "0")
);

const WIDTH_NO = "50px";
const WIDTH_NIK = "100px";
const WIDTH_NAMA = "150px";
const WIDTH_TIME = "80px";
const WIDTH_DURATION = "80px";
const POS_NO = "0px";
const POS_NIK = "50px";
const POS_NAMA = "150px";

export function LogFinger() {
  const { state, actions } = useLogFinger();
  const {
    tableRows,
    loading,
    selectedDate,
    notes,
    totalPairs,
    isModalOpen,
    manualForm,
    isSubmitting,
  } = state;
  const {
    setSelectedDate,
    handleSearch,
    handleDeleteLog,
    handleNoteChange,
    handleNoteBlur,
    handleOpenModal,
    handleCloseModal,
    handleManualInput,
    handleTimeSelect,
    handleManualSubmit,
    handleExportPDF,
  } = actions;

  return (
    <>
      <div className="relative flex flex-col h-full w-full mt-8">
        {/* HEADER CONTROLS */}
        <div className="mb-4 w-full bg-white shadow-sm border border-gray-200 rounded-xl z-30 relative">
          <div className="flex flex-wrap items-end gap-4 p-4">
            <div className="w-full md:w-72 bg-white rounded-lg">
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Pilih Tanggal
              </label>
              <input
                type="date"
                value={selectedDate}
                onChange={(e) => setSelectedDate(e.target.value)}
                className="w-full border border-blue-gray-200 px-3 py-2.5 rounded-[7px] text-sm focus:border-gray-900 outline-none"
              />
            </div>
            <button
              onClick={handleSearch}
              disabled={loading}
              className="flex items-center gap-3 bg-blue-600 text-white px-6 py-2.5 rounded-lg shadow hover:shadow-lg transition-all disabled:opacity-50"
            >
              {loading ? (
                <div className="h-4 w-4 animate-spin rounded-full border-2 border-white border-t-transparent" />
              ) : (
                <MagnifyingGlassIcon strokeWidth={2} className="h-4 w-4" />
              )}{" "}
              {loading ? "Memuat..." : "Cari Data"}
            </button>
            <div className="flex items-center gap-3 ml-auto md:ml-auto">
              <button
                onClick={handleOpenModal}
                disabled={loading}
                className="flex items-center gap-3 bg-indigo-600 text-white px-6 py-2.5 rounded-lg shadow hover:shadow-lg transition-all disabled:opacity-50"
              >
                <PlusIcon strokeWidth={2} className="h-4 w-4" /> Tambah
              </button>
              <button
                onClick={handleExportPDF}
                disabled={loading || tableRows.length === 0}
                className="flex items-center gap-3 bg-green-600 text-white px-6 py-2.5 rounded-lg shadow hover:shadow-lg transition-all disabled:opacity-50"
              >
                <ArrowDownTrayIcon strokeWidth={2} className="h-4 w-4" /> Export
                PDF
              </button>
            </div>
          </div>
        </div>

        {/* TABLE DATA */}
        <div className="relative flex flex-col bg-clip-border rounded-xl bg-white text-gray-700 shadow-md h-full w-full overflow-hidden border border-gray-200">
          <div className="p-0 overflow-scroll">
            <table className="w-full min-w-max table-auto text-left border-collapse">
              <thead>
                <tr>
                  <th
                    rowSpan={3}
                    className="border border-gray-200 bg-gray-50 p-4 text-center sticky z-20 top-0"
                    style={{
                      left: POS_NO,
                      width: WIDTH_NO,
                      minWidth: WIDTH_NO,
                    }}
                  >
                    <p className="font-bold text-sm text-blue-gray-900">No</p>
                  </th>
                  <th
                    rowSpan={3}
                    className="border border-gray-200 bg-gray-50 p-4 text-center sticky z-20 top-0"
                    style={{
                      left: POS_NIK,
                      width: WIDTH_NIK,
                      minWidth: WIDTH_NIK,
                    }}
                  >
                    <p className="font-bold text-sm text-blue-gray-900">NIK</p>
                  </th>
                  <th
                    rowSpan={3}
                    className="border border-gray-200 bg-gray-50 p-4 text-center sticky z-20 top-0 shadow-md"
                    style={{
                      left: POS_NAMA,
                      width: WIDTH_NAMA,
                      minWidth: WIDTH_NAMA,
                    }}
                  >
                    <p className="font-bold text-sm text-blue-gray-900">NAMA</p>
                  </th>
                  <th
                    colSpan={totalPairs * 3}
                    className="border border-gray-200 bg-gray-50/50 p-2 text-center"
                  >
                    <p className="font-bold text-sm text-blue-gray-900">
                      Log Finger ({selectedDate})
                    </p>
                  </th>
                </tr>
                <tr>
                  {Array.from({ length: totalPairs }).map((_, index) => (
                    <Fragment key={`pair-${index}`}>
                      <th
                        className="border border-gray-200 bg-gray-50/50 p-2 text-center"
                        style={{ width: WIDTH_TIME, minWidth: WIDTH_TIME }}
                      >
                        <p className="font-normal text-sm">Masuk</p>
                      </th>
                      <th
                        className="border border-gray-200 bg-gray-50/50 p-2 text-center"
                        style={{ width: WIDTH_TIME, minWidth: WIDTH_TIME }}
                      >
                        <p className="font-normal text-sm">Keluar</p>
                      </th>
                      <th
                        className="border border-gray-200 bg-gray-100/50 p-2 text-center"
                        style={{
                          width: WIDTH_DURATION,
                          minWidth: WIDTH_DURATION,
                        }}
                      >
                        <p className="font-bold text-sm text-orange-700">
                          Istirahat
                        </p>
                      </th>
                    </Fragment>
                  ))}
                </tr>
                <tr>
                  {Array.from({ length: totalPairs }).map((_, index) => (
                    <th
                      key={index}
                      colSpan={3}
                      className="border border-gray-200 bg-gray-50/50 p-1 text-center"
                    >
                      <p className="text-[10px] opacity-50">{index + 1}</p>
                    </th>
                  ))}
                </tr>
              </thead>
              <tbody>
                {loading ? (
                  <tr>
                    <td
                      colSpan={totalPairs * 3 + 3}
                      className="p-4 text-center text-gray-500 h-32"
                    >
                      Mengambil data...
                    </td>
                  </tr>
                ) : tableRows.length > 0 ? (
                  tableRows.map(({ no, nik, nama, logs }, index) => {
                    const classes =
                      "p-2 border border-gray-200 border-b-gray-200";
                    const stickyClasses = `${classes} sticky z-10 bg-white`;
                    const noteValue = notes[nik] || "";
                    return (
                      <Fragment key={index}>
                        <tr className="hover:bg-gray-50/20">
                          <td
                            className={`${stickyClasses} text-center`}
                            style={{
                              left: POS_NO,
                              width: WIDTH_NO,
                              minWidth: WIDTH_NO,
                            }}
                          >
                            <p className="text-sm">{no}</p>
                          </td>
                          <td
                            className={`${stickyClasses} text-center`}
                            style={{
                              left: POS_NIK,
                              width: WIDTH_NIK,
                              minWidth: WIDTH_NIK,
                            }}
                          >
                            <p className="text-sm">{nik}</p>
                          </td>
                          <td
                            className={`${stickyClasses} whitespace-nowrap shadow-md`}
                            style={{
                              left: POS_NAMA,
                              width: WIDTH_NAMA,
                              minWidth: WIDTH_NAMA,
                            }}
                          >
                            <p className="text-sm truncate px-2">{nama}</p>
                          </td>

                          {logs.map((logData, logIndex) => {
                            const isIntervalCol = (logIndex + 1) % 3 === 0;
                            const colWidth = isIntervalCol
                              ? WIDTH_DURATION
                              : WIDTH_TIME;

                            // 🔥 DATA HANDLING UPDATE: Cek apakah Object atau String
                            let displayText = "";
                            let isClickable = false;

                            if (isIntervalCol) {
                              // Kolom Interval/Durasi (masih String dari perhitungan)
                              displayText = logData;
                              isClickable = false;
                            } else {
                              // Kolom Jam Masuk/Keluar (bisa Object {display, original} atau null)
                              if (logData && logData.display) {
                                displayText = logData.display;
                                isClickable = true;
                              } else {
                                displayText = "";
                                isClickable = false;
                              }
                            }

                            return (
                              <td
                                key={logIndex}
                                className={`${classes} text-center ${
                                  isIntervalCol ? "bg-orange-50/30" : ""
                                } ${
                                  isClickable
                                    ? "cursor-pointer hover:bg-red-50 hover:text-red-600 transition-colors group relative"
                                    : ""
                                }`}
                                style={{ width: colWidth, minWidth: colWidth }}
                                onClick={() =>
                                  isClickable && handleDeleteLog(nik, logData)
                                }
                                title={
                                  isClickable ? `Hapus log: ${displayText}` : ""
                                }
                              >
                                <p
                                  className={`text-xs whitespace-nowrap overflow-hidden text-ellipsis ${
                                    isIntervalCol
                                      ? "text-orange-800 font-semibold"
                                      : "text-blue-gray-900"
                                  }`}
                                >
                                  {displayText}
                                </p>
                                {isClickable && (
                                  <span className="hidden group-hover:block absolute top-0 right-0 p-0.5 text-red-500 bg-white/80 rounded-bl">
                                    <TrashIcon className="w-3 h-3" />
                                  </span>
                                )}
                              </td>
                            );
                          })}
                        </tr>
                        <tr className="bg-gray-50/30 border-b border-gray-300">
                          <td
                            colSpan={3}
                            className="sticky left-0 z-10 bg-gray-50 p-2 text-right border-r border-gray-200 shadow-md"
                          >
                            <div className="flex items-center justify-end gap-2 text-gray-500">
                              <PencilSquareIcon className="w-3 h-3" />
                              <span className="text-[10px] uppercase">
                                Keterangan:
                              </span>
                            </div>
                          </td>
                          <td
                            colSpan={totalPairs * 3}
                            className="p-1 bg-gray-50"
                          >
                            <input
                              type="text"
                              value={noteValue}
                              onChange={(e) =>
                                handleNoteChange(nik, e.target.value)
                              }
                              onBlur={() => handleNoteBlur(nik)}
                              placeholder="Tulis keterangan (Sakit, Cuti, dll)..."
                              className="w-full text-xs p-1.5 bg-white border border-gray-200 rounded outline-none focus:border-blue-400 focus:ring-1 focus:ring-blue-200 transition-all"
                            />
                          </td>
                        </tr>
                      </Fragment>
                    );
                  })
                ) : (
                  <tr>
                    <td
                      colSpan={totalPairs * 3 + 3}
                      className="p-8 text-center text-gray-500"
                    >
                      Tidak ada data
                    </td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>
        </div>
      </div>

      {/* MODAL TAMBAH DATA */}
      {isModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 backdrop-blur-sm">
          <div className="bg-white rounded-xl shadow-2xl w-full max-w-md p-6">
            <div className="flex justify-between items-center mb-6">
              <h3 className="text-xl font-bold">Tambah Log Finger</h3>
              <button onClick={handleCloseModal}>
                <XMarkIcon className="w-6 h-6 text-gray-400 hover:text-red-500" />
              </button>
            </div>
            <form onSubmit={handleManualSubmit}>
              <div className="space-y-4">
                <div>
                  <label className="block text-sm font-medium mb-1">NIK</label>
                  <input
                    type="text"
                    name="nik"
                    value={manualForm.nik}
                    onChange={handleManualInput}
                    className="w-full border px-3 py-2 rounded-lg outline-none"
                    required
                  />
                </div>
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-medium mb-1">
                      Tanggal
                    </label>
                    <input
                      type="date"
                      name="date"
                      value={manualForm.date}
                      onChange={handleManualInput}
                      className="w-full border px-3 py-2 rounded-lg outline-none"
                      required
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium mb-1">
                      Jam (24h)
                    </label>
                    <div className="flex items-center gap-2">
                      <select
                        value={manualForm.time.split(":")[0]}
                        onChange={(e) =>
                          handleTimeSelect("hour", e.target.value)
                        }
                        className="w-full border px-2 py-2 rounded-lg outline-none bg-white text-center"
                      >
                        {HOURS.map((h) => (
                          <option key={h} value={h}>
                            {h}
                          </option>
                        ))}
                      </select>
                      <span className="font-bold">:</span>
                      <select
                        value={manualForm.time.split(":")[1]}
                        onChange={(e) =>
                          handleTimeSelect("minute", e.target.value)
                        }
                        className="w-full border px-2 py-2 rounded-lg outline-none bg-white text-center"
                      >
                        {MINUTES.map((m) => (
                          <option key={m} value={m}>
                            {m}
                          </option>
                        ))}
                      </select>
                    </div>
                  </div>
                </div>
              </div>
              <div className="mt-8 flex justify-end gap-3">
                <button
                  type="button"
                  onClick={handleCloseModal}
                  className="px-4 py-2 text-sm bg-gray-100 rounded-lg"
                >
                  Batal
                </button>
                <button
                  type="submit"
                  disabled={isSubmitting}
                  className="px-4 py-2 text-sm text-white bg-indigo-600 rounded-lg hover:bg-indigo-700"
                >
                  {isSubmitting ? "Menyimpan..." : "Simpan Data"}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </>
  );
}

export default LogFinger;
