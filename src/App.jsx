import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import LoginPage from "./modules/auth/pages/LoginPage";
import ProtectedRoute from "./routes/ProtectedRoute";
import RootRedirect from "./routes/RootRedirect";
import MainLayout from "./components/Layouts/MainLayout";
import CSLayout from "./modules/CS/Pages/CleaningForm";

// 🔥 1. Import Config Routes dari masing-masing module
import { hrdRoutes } from "./modules/HRD/routes";
import { produksiRoutes } from "./modules/Produksi/routes";
import { itRoutes } from "./modules/IT/routes";
// import { csRoutes } from "./modules/CS/routes";

function App() {
  return (
    <Router>
      <Routes>
        {/* PUBLIC ROUTES */}
        <Route path="/login" element={<LoginPage />} />

        {/* ==================================================== */}
        {/* PROTECTED ROUTES - IT AREA */}
        {/* ==================================================== */}
        <Route element={<ProtectedRoute allowedDepartments={["IT"]} />}>
          <Route element={<MainLayout />}>
            {itRoutes.map((route, index) => (
              <Route key={index} path={route.path} element={route.element} />
            ))}
          </Route>
        </Route>
        {/* ==================================================== */}
        {/* PROTECTED ROUTES - CS */}
        {/* ==================================================== */}
        <Route element={<ProtectedRoute allowedDepartments={["CS"]} />}>
          <Route path="/hrd/cleaningform" element={<CSLayout />} />
        </Route>

        {/* ==================================================== */}
        {/* PROTECTED ROUTES - HRD AREA */}
        {/* ==================================================== */}
        <Route element={<ProtectedRoute allowedDepartments={["HRD"]} />}>
          <Route element={<MainLayout />}>
            {hrdRoutes.map((route, index) => (
              <Route key={index} path={route.path} element={route.element} />
            ))}
          </Route>
        </Route>

        {/* ==================================================== */}
        {/* PROTECTED ROUTES - Produksi AREA */}
        {/* ==================================================== */}
        <Route element={<ProtectedRoute allowedDepartments={["PRODUKSI"]} />}>
          <Route element={<MainLayout />}>
            {produksiRoutes.map((route, index) => (
              <Route key={index} path={route.path} element={route.element} />
            ))}
          </Route>
        </Route>

        <Route path="/" element={<RootRedirect />} />

        <Route
          path="*"
          element={
            <div className="p-10 text-center font-bold">404 - Not Found</div>
          }
        />
      </Routes>
    </Router>
  );
}

export default App;
