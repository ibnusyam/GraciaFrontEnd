import LogFinger from "./Pages/LogFinger";
import Users from "./Pages/Users";

export const produksiRoutes = [
  { path: "produksi/dashboard", element: <h1>Halaman dashboard</h1> },
  { path: "produksi/users", element: <Users /> },
  { path: "produksi/fingerlog", element: <LogFinger /> },
];
