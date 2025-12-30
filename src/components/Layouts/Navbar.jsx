const Navbar = () => {
  const role = localStorage.getItem("userRole");
  // Ambil deptId buat contoh info tambahan (opsional)
  const userLogin = localStorage.getItem("userLogin");

  return (
    <header className="h-16 bg-white border-b border-gray-200 shadow-sm flex items-center justify-between pr-6 pl-16 md:px-6 z-10 transition-all duration-200">
      {/* Left Side: Page Title */}
      <div>
        <h2 className="text-lg font-semibold text-gray-700">
          Dashboard <span className="text-blue-600">{role}</span>
        </h2>
      </div>

      {/* Right Side: Profile Info */}
      <div className="flex items-center gap-4">
        <div className="text-right hidden sm:block">
          <p className="text-sm font-medium text-gray-800">{userLogin}</p>
        </div>

        {/* Avatar Circle */}
        <div className="h-10 w-10 rounded-full bg-blue-100 flex items-center justify-center border-2 border-white shadow-sm">
          <span className="text-blue-600 font-bold text-lg">
            {role?.charAt(0)}
          </span>
        </div>
      </div>
    </header>
  );
};

export default Navbar;
