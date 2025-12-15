// Import halaman-halaman HRD di sini
import CleaningLogTable from "./cleaninglogs"; // Sesuaikan path aslinya
// import CSDashboard from "./cleaningform"; // Contoh halaman lain

// Export array route khusus HRD
export const hrdRoutes = [
  { path: "hrd/dashboard", element: <CleaningLogTable /> },
  //   { path: "hrd/inimah", element: <CSDashboard /> },
  { path: "hrd/karyawan", element: <h1>Halaman Karyawan</h1> }, // Contoh nambah baru gampang
];
