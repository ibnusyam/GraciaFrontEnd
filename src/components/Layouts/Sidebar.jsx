import { Link, useNavigate, useLocation } from "react-router-dom";
import { appMenus } from "../../config/menuConfig";

const Sidebar = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const userRole = localStorage.getItem("userRole");

  const handleLogout = () => {
    localStorage.clear();
    navigate("/login");
  };

  // Helper untuk styling menu aktif (Tetap sama)
  const NavItem = ({ to, label }) => {
    const isActive = location.pathname.startsWith(to);
    return (
      <Link
        to={to}
        className={`block px-4 py-3 rounded-lg transition-colors duration-200 text-sm font-medium ${
          isActive
            ? "bg-gray-800 text-white shadow-md"
            : "text-gray-700 hover:bg-gray-100"
        }`}
      >
        {label}
      </Link>
    );
  };

  return (
    <aside className="w-64 bg-white text-gray-800 min-h-screen flex flex-col shadow-xl z-20 hidden md:flex border-r border-gray-200">
      {/* Brand Logo */}
      <div className="h-16 flex items-center px-6 border-b border-gray-200">
        <h1 className="text-xl font-bold tracking-wider text-gray-800">
          Gracia<span className="text-gray-800">Pharmindo</span>
        </h1>
      </div>

      <nav className="flex-1 px-3 py-6 space-y-2 overflow-y-auto">
        {appMenus.map((menu, index) => {
          if (!menu.roles.includes(userRole)) return null;

          return (
            <div key={index}>
              {menu.sections ? (
                menu.sections.map((section, sIdx) => (
                  <div key={sIdx}>
                    <div className="px-4 py-2 mt-4 text-xs font-semibold text-gray-400 uppercase tracking-wider">
                      {section.title}
                    </div>

                    {section.items.map((item, iIdx) => (
                      <NavItem key={iIdx} to={item.path} label={item.label} />
                    ))}
                  </div>
                ))
              ) : (
                <div>
                  {menu.title && (
                    <div className="px-4 py-2 mt-4 text-xs font-semibold text-gray-400 uppercase tracking-wider">
                      {menu.title}
                    </div>
                  )}

                  {menu.items.map((item, iIdx) => (
                    <NavItem key={iIdx} to={item.path} label={item.label} />
                  ))}
                </div>
              )}
            </div>
          );
        })}
      </nav>
      <div className="p-4 border-t border-gray-200 bg-white">
        <button
          onClick={handleLogout}
          className="w-full flex items-center justify-center px-4 py-2 text-sm font-medium text-white bg-red-600 rounded-lg hover:bg-red-700 transition-colors focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-red-500"
        >
          Sign Out
        </button>
      </div>
    </aside>
  );
};

export default Sidebar;
