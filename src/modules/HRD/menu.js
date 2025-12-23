// modules/HRD/menu.js
export const hrdMenu = {
  mainTitle: "Human Resource", // Judul Utama (opsional)
  roles: ["HRD"],
  // Masukkan beberapa section di sini
  sections: [
    {
      title: "Human Resource",
      items: [
        { label: "Dashboard", path: "/hrd/dashboard" },
        { label: "Monthly Report", path: "/hrd/monthlyreport" },
        { label: "Cleaning Logs", path: "/hrd/cleaninglogs" },
      ],
    },
    {
      title: "Kendaraan",
      items: [{ label: "Kendaraan", path: "/hrd/kendaraan" }],
    },
  ],
};
