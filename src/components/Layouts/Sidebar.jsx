import { useState } from "react";
import { Link, useNavigate, useLocation } from "react-router-dom";
import { appMenus } from "../../config/menuConfig";

const Sidebar = () => {
  const [isOpen, setIsOpen] = useState(false);
  const navigate = useNavigate();
  const location = useLocation();
  const userRole = localStorage.getItem("userRole");

  const handleLogout = () => {
    localStorage.clear();
    navigate("/login");
  };

  const NavItem = ({ to, label }) => {
    const isActive = location.pathname.startsWith(to);
    return (
      <Link
        to={to}
        onClick={() => setIsOpen(false)}
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
    <>
      {/* --- MOBILE TOGGLE BUTTON --- */}
      {/* UPDATE: Menggunakan 'top-3' agar lebih pas di tengah navbar tinggi 16 (64px) */}
      <button
        onClick={() => setIsOpen(!isOpen)}
        className="md:hidden fixed top-3 left-4 z-50 p-2 rounded-md bg-white text-gray-800 shadow-sm border border-gray-200 hover:bg-gray-50 focus:outline-none"
      >
        {isOpen ? (
          <svg
            className="w-6 h-6"
            fill="none"
            stroke="currentColor"
            viewBox="0 0 24 24"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={2}
              d="M6 18L18 6M6 6l12 12"
            />
          </svg>
        ) : (
          <svg
            className="w-6 h-6"
            fill="none"
            stroke="currentColor"
            viewBox="0 0 24 24"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={2}
              d="M4 6h16M4 12h16M4 18h16"
            />
          </svg>
        )}
      </button>

      {/* --- OVERLAY --- */}
      {isOpen && (
        <div
          onClick={() => setIsOpen(false)}
          className="fixed inset-0 z-30 bg-black/50 md:hidden transition-opacity duration-300 backdrop-blur-sm"
        />
      )}

      {/* --- SIDEBAR --- */}
      <aside
        className={`
          fixed md:sticky top-0 inset-y-0 left-0 z-40
          w-64 bg-white text-gray-800 h-screen flex flex-col shadow-xl border-r border-gray-200
          transform transition-transform duration-300 ease-in-out
          ${isOpen ? "translate-x-0" : "-translate-x-full"} 
          md:translate-x-0 md:flex
        `}
      >
        {/* Brand Logo */}
        <div className="h-16 flex items-center justify-between px-6 border-b border-gray-200">
          <h1 className="text-xl font-bold tracking-wider text-gray-800">
            Gracia<span className="text-gray-800">Pharmindo</span>
          </h1>
        </div>

        {/* Menu Items */}
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

        {/* Footer */}
        <div className="p-4 border-t border-gray-200 bg-white">
          <button
            onClick={handleLogout}
            className="w-full flex items-center justify-center px-4 py-2 text-sm font-medium text-white bg-red-600 rounded-lg hover:bg-red-700 transition-colors"
          >
            Sign Out
          </button>
        </div>
      </aside>
    </>
  );
};

export default Sidebar;
