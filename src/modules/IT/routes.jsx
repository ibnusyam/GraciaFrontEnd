import Users from "./Pages/UserManagement";
import Location from "./Pages/LocationManagement";

export const itRoutes = [
  { path: "it/dashboard", element: <h1>Halaman dashboard</h1> },
  { path: "it/users", element: <Users /> },
  { path: "it/location", element: <Location /> },
];
