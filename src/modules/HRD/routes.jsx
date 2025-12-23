// Import halaman-halaman HRD di sini
import CleaningLogTable from "./Pages/CleaningLogs";
import DashboardHRD from "./Pages/Dashboard";
import MonthlyReport from "./Pages/MonthlyReport";
import KendaraanList from "./Pages/KendaraanList";

// Export array route khusus HRD
export const hrdRoutes = [
  { path: "hrd/dashboard", element: <DashboardHRD /> }, // Contoh nambah baru gampang
  { path: "hrd/monthlyreport", element: <MonthlyReport /> }, // Contoh nambah baru gampang
  { path: "hrd/cleaninglogs", element: <CleaningLogTable /> },
  { path: "hrd/kendaraan", element: <KendaraanList /> },
  // { path: "hrd/cleaningform", element: <h1>Halaman Dashboard</h1> },
];
