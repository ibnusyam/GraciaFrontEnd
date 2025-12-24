// modules/HRD/menu.js
export const hrdMenu = {
  mainTitle: "Human Resource",
  roles: ["HRD"],
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
