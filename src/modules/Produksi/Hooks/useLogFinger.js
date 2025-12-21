import { useState, useEffect } from "react";
import api from "../../../api/axiosInstance";

const API_BASE_URL = "/produksi-api";

export const useLogFinger = () => {
  const today = new Date().toISOString().split("T")[0];

  const [tableRows, setTableRows] = useState([]);
  const [loading, setLoading] = useState(false);
  const [selectedDate, setSelectedDate] = useState(today);
  const [notes, setNotes] = useState({});
  const [totalPairs, setTotalPairs] = useState(8);

  // --- STATE MODAL ---
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [manualForm, setManualForm] = useState({
    nik: "",
    date: today,
    time: "08:00",
  });
  const [isSubmitting, setIsSubmitting] = useState(false);

  // --- HELPERS ---
  const formatTime = (isoString) => {
    if (!isoString) return "";
    const date = new Date(isoString);
    const hours = String(date.getHours()).padStart(2, "0");
    const minutes = String(date.getMinutes()).padStart(2, "0");
    return `${hours}:${minutes}`;
  };

  const calculateDuration = (startIso, endIso) => {
    if (!startIso || !endIso) return "";
    const start = new Date(startIso);
    const end = new Date(endIso);
    const diffMs = end - start;
    if (diffMs < 0) return "-";
    const diffMins = Math.floor(diffMs / 60000);
    return `${diffMins}m`;
  };

  // --- API HANDLERS ---

  // 1. Search / Fetch Data
  const handleSearch = async () => {
    if (!selectedDate) return;
    setLoading(true);
    try {
      const response = await api.post(`${API_BASE_URL}/get`, {
        date: selectedDate,
      });
      const data = response.data;

      // ... (Bagian Fetch Notes TETAP SAMA) ...
      try {
        const notesResponse = await api.get(`${API_BASE_URL}/notes`, {
          params: { date: selectedDate },
        });
        const notesData = notesResponse.data;
        const notesMap = {};
        if (Array.isArray(notesData)) {
          notesData.forEach((item) => {
            notesMap[item.nik] = item.note;
          });
        }
        setNotes(notesMap);
      } catch (err) {
        console.warn(err);
      }

      // 🔥 FIX 1: Gunakan (item.timestamps || []) untuk mencegah error null
      const maxScanCount =
        data.length > 0
          ? Math.max(...data.map((item) => (item.timestamps || []).length))
          : 0;

      let calculatedPairs = Math.max(8, Math.ceil(maxScanCount / 2));
      setTotalPairs(calculatedPairs);

      const formattedData = data.map((item, index) => {
        const rowData = [];

        // 🔥 FIX 2: Pastikan timestamps aman
        const safeTimestamps = item.timestamps || [];

        for (let i = 0; i < calculatedPairs; i++) {
          const tsIndexMasuk = i * 2;
          const tsIndexKeluar = i * 2 + 1;
          const tsIndexNextMasuk = (i + 1) * 2;

          const rawTimeMasuk = safeTimestamps[tsIndexMasuk];
          const rawTimeKeluar = safeTimestamps[tsIndexKeluar];
          const rawTimeNextMasuk = safeTimestamps[tsIndexNextMasuk];

          rowData.push(
            rawTimeMasuk
              ? { display: formatTime(rawTimeMasuk), original: rawTimeMasuk }
              : null
          );
          rowData.push(
            rawTimeKeluar
              ? { display: formatTime(rawTimeKeluar), original: rawTimeKeluar }
              : null
          );

          if (rawTimeKeluar && rawTimeNextMasuk) {
            rowData.push(calculateDuration(rawTimeKeluar, rawTimeNextMasuk));
          } else {
            rowData.push("");
          }
        }
        return {
          no: index + 1,
          nik: item.nik,
          nama: item.full_name,
          logs: rowData,
        };
      });
      setTableRows(formattedData);
    } catch (error) {
      setTableRows([]);
    } finally {
      setLoading(false);
    }
  };

  const handleDeleteLog = async (nik, logData) => {
    // logData.original isinya: "2025-11-27 17:18:23.838 +0700" (String mentah dari DB)
    if (!nik || !logData || !logData.original) return;

    const confirmDelete = window.confirm(
      `Hapus log jam ${logData.display} untuk NIK ${nik}?`
    );
    if (!confirmDelete) return;

    try {
      // 🔥 CHANGE: Jangan format manual lagi! Kirim string asli saja.
      // Backend Go sudah kita update untuk menerima format detail ini.
      const rawTimestamp = logData.original;

      await api.post(`${API_BASE_URL}/remove`, {
        nik,
        timestamp: rawTimestamp,
      });

      alert("Data berhasil dihapus");
      handleSearch();
    } catch (error) {
      alert(`Gagal hapus: ${error.response?.data?.message || error.message}`);
    }
  };

  // 3. Save Note
  const handleNoteBlur = async (nik) => {
    const noteContent = notes[nik];
    try {
      await api.post(`${API_BASE_URL}/notes`, {
        date: selectedDate,
        nik: nik,
        note: noteContent,
      });
    } catch (error) {
      console.error("Gagal menyimpan catatan:", error);
    }
  };

  // 4. Add Manual Log
  const handleManualSubmit = async (e) => {
    e.preventDefault();
    if (!manualForm.nik || !manualForm.date || !manualForm.time) {
      alert("Mohon lengkapi data");
      return;
    }
    setIsSubmitting(true);
    try {
      // Manual input biasanya detik 00
      const timestamp = `${manualForm.date} ${manualForm.time}:00`;
      await api.post(`${API_BASE_URL}/insert`, {
        nik: manualForm.nik,
        timestamp: timestamp,
      });

      alert("Data berhasil ditambahkan!");
      setIsModalOpen(false);
      handleSearch();
    } catch (error) {
      alert(`Error: ${error.response?.data?.message || error.message}`);
    } finally {
      setIsSubmitting(false);
    }
  };

  // 5. Export PDF
  const loadScript = (src) => {
    return new Promise((resolve, reject) => {
      if (document.querySelector(`script[src="${src}"]`)) {
        resolve();
        return;
      }
      const script = document.createElement("script");
      script.src = src;
      script.onload = resolve;
      script.onerror = reject;
      document.body.appendChild(script);
    });
  };

  const handleExportPDF = async () => {
    if (tableRows.length === 0) {
      alert("Tidak ada data");
      return;
    }
    try {
      setLoading(true);
      await loadScript(
        "https://cdnjs.cloudflare.com/ajax/libs/jspdf/2.5.1/jspdf.umd.min.js"
      );
      await loadScript(
        "https://cdnjs.cloudflare.com/ajax/libs/jspdf-autotable/3.5.31/jspdf.plugin.autotable.min.js"
      );

      const { jsPDF } = window.jspdf;
      const doc = new jsPDF("l", "mm", "a4");

      const totalTableColumns = totalPairs * 3;
      let dynamicColumnStyles = {
        0: { cellWidth: 7, halign: "center" },
        1: { cellWidth: 15, halign: "center" },
        2: { cellWidth: 35, halign: "left" },
      };
      for (let i = 0; i < totalPairs; i++) {
        const baseIndex = 3 + i * 3;
        dynamicColumnStyles[baseIndex] = { cellWidth: 9, halign: "center" };
        dynamicColumnStyles[baseIndex + 1] = { cellWidth: 9, halign: "center" };
        dynamicColumnStyles[baseIndex + 2] = {
          cellWidth: 10,
          halign: "center",
          fontStyle: "bold",
          textColor: [200, 100, 0],
        };
      }
      const head = [
        [
          {
            content: "No",
            rowSpan: 3,
            styles: { valign: "middle", halign: "center" },
          },
          {
            content: "NIK",
            rowSpan: 3,
            styles: { valign: "middle", halign: "center" },
          },
          {
            content: "NAMA",
            rowSpan: 3,
            styles: { valign: "middle", halign: "center" },
          },
          {
            content: `Log Finger (${selectedDate})`,
            colSpan: totalTableColumns,
            styles: {
              halign: "center",
              fontStyle: "bold",
              fillColor: [52, 73, 94],
            },
          },
        ],
        [],
        [],
      ];
      for (let i = 0; i < totalPairs; i++) {
        head[1].push({
          content: "M",
          styles: {
            halign: "center",
            fillColor: [236, 240, 241],
            textColor: 50,
          },
        });
        head[1].push({
          content: "K",
          styles: {
            halign: "center",
            fillColor: [236, 240, 241],
            textColor: 50,
          },
        });
        head[1].push({
          content: "Ist",
          styles: {
            halign: "center",
            fillColor: [253, 235, 208],
            textColor: 50,
          },
        });
        head[2].push({
          content: (i + 1).toString(),
          colSpan: 3,
          styles: { halign: "center", fontSize: 6, fillColor: [250, 250, 250] },
        });
      }

      const body = [];
      tableRows.forEach((row) => {
        // 🔥 PDF FIX: Extract display string from object
        const cleanLogs = row.logs.map((log) => {
          if (log && typeof log === "object") return log.display;
          return log || "";
        });

        body.push([row.no, row.nik, row.nama, ...cleanLogs]);

        const noteText = notes[row.nik] || "";
        if (noteText.trim() !== "") {
          body.push([
            {
              content: `Keterangan: ${noteText}`,
              colSpan: 3 + totalTableColumns,
              styles: {
                fillColor: [255, 252, 235],
                textColor: [50, 50, 50],
                fontStyle: "italic",
                cellPadding: 1,
                fontSize: 7,
              },
            },
          ]);
        }
      });

      doc.autoTable({
        head: head,
        body: body,
        startY: 20,
        theme: "grid",
        styles: {
          fontSize: 6,
          cellPadding: 0.5,
          lineColor: [200, 200, 200],
          lineWidth: 0.1,
          overflow: "ellipsize",
          valign: "middle",
        },
        headStyles: { fillColor: [41, 128, 185], textColor: 255, fontSize: 6 },
        columnStyles: dynamicColumnStyles,
        margin: { top: 20, left: 5, right: 5 },
      });

      doc.save(`Laporan_Log_Finger_${selectedDate}.pdf`);
    } catch (error) {
      console.error(error);
      alert("Gagal export PDF");
    } finally {
      setLoading(false);
    }
  };

  // --- EVENTS ---
  const handleNoteChange = (nik, value) => {
    setNotes((prev) => ({ ...prev, [nik]: value }));
  };

  const handleOpenModal = () => {
    setManualForm({ nik: "", date: selectedDate, time: "08:00" });
    setIsModalOpen(true);
  };

  const handleCloseModal = () => setIsModalOpen(false);

  const handleManualInput = (e) => {
    const { name, value } = e.target;
    setManualForm((prev) => ({ ...prev, [name]: value }));
  };

  const handleTimeSelect = (type, value) => {
    const currentTime = manualForm.time || "00:00";
    let [h, m] = currentTime.split(":");
    if (type === "hour") h = value;
    if (type === "minute") m = value;
    setManualForm((prev) => ({ ...prev, time: `${h}:${m}` }));
  };

  useEffect(() => {
    setNotes({});
    setManualForm((prev) => ({ ...prev, date: selectedDate }));
  }, [selectedDate]);

  useEffect(() => {
    handleSearch();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  return {
    state: {
      tableRows,
      loading,
      selectedDate,
      notes,
      totalPairs,
      isModalOpen,
      manualForm,
      isSubmitting,
    },
    actions: {
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
    },
  };
};
