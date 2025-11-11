import React, { useState } from "react";
import { Link, useNavigate, useLocation } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";
import { logout } from "@/features/auth/slices/authSlice";
import Button from "@/shared/components/ui/Button";

const UserLayout = ({ children }) => {
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const location = useLocation();
  const { user } = useSelector((state) => state.auth);

  const handleLogout = () => {
    dispatch(logout());
    navigate("/login");
  };

  const navItems = [
    { name: "Browse Courses", path: "/user/courses", icon: "📚" },
    { name: "My Courses", path: "/user/my-courses", icon: "🎓" },
    { name: "Attempt History", path: "/user/history", icon: "📊" },
    { name: "Profile", path: "/user/profile", icon: "👤" },
  ];

  return (
    <div className="flex h-screen bg-gray-50 overflow-hidden">
      {/* Sidebar - Full Height, Fixed */}
      <aside className="hidden sm:flex sm:flex-col w-64 bg-gradient-to-b from-emerald-600 to-emerald-700 shadow-xl">
        {/* Sidebar Header */}
        <div className="p-5 border-b-2 border-emerald-300">
          <h1 className="text-2xl font-bold text-white">Exam Portal</h1>
        </div>

        {/* Navigation */}
        <nav className="flex-1 p-4 space-y-2 overflow-y-auto">
          {navItems.map((item) => (
            <Link
              key={item.path}
              to={item.path}
              className={`
                flex items-center gap-3 px-4 py-3 rounded-lg transition-all
                ${
                  location.pathname === item.path
                    ? "bg-white text-emerald-700 font-semibold shadow-md"
                    : "text-emerald-50 hover:bg-emerald-500/30 hover:text-white"
                }
              `}
            >
              <span className="text-xl">{item.icon}</span>
              <span>{item.name}</span>
            </Link>
          ))}
        </nav>

        {/* Sidebar Footer - User Info */}
        <div className="p-4 border-t border-emerald-500/30">
          <div className="flex items-center gap-3 px-2 py-3">
            <div className="w-10 h-10 rounded-full bg-emerald-800 flex items-center justify-center text-white font-bold text-lg">
              {user?.name?.charAt(0).toUpperCase() || "U"}
            </div>
            <div className="flex-1 overflow-hidden">
              <p className="text-sm font-semibold text-white truncate">
                {user?.name || "User"}
              </p>
              <p className="text-xs text-emerald-200 truncate">
                {user?.email || "user@example.com"}
              </p>
            </div>
          </div>        
        </div>
      </aside>

      {/* Mobile Sidebar Overlay */}
      {sidebarOpen && (
        <div
          className="fixed inset-0 bg-black/30 backdrop-blur-sm z-40 sm:hidden"
          onClick={() => setSidebarOpen(false)}
        />
      )}

      {/* Mobile Sidebar */}
      <aside
        className={`
          fixed top-0 left-0 h-full w-64 bg-gradient-to-b from-emerald-600 to-emerald-700
          shadow-xl z-50 transform transition-transform sm:hidden
          ${sidebarOpen ? "translate-x-0" : "-translate-x-full"}
        `}
      >
        <div className="p-6 border-b border-emerald-500/30 flex items-center justify-between">
          <h1 className="text-xl font-bold text-white">Exam Portal</h1>
          <button onClick={() => setSidebarOpen(false)} className="text-white">
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
          </button>
        </div>

        <nav className="p-4 space-y-2">
          {navItems.map((item) => (
            <Link
              key={item.path}
              to={item.path}
              onClick={() => setSidebarOpen(false)}
              className={`
                flex items-center gap-3 px-4 py-3 rounded-lg transition-all
                ${
                  location.pathname === item.path
                    ? "bg-white text-emerald-700 font-semibold shadow-md"
                    : "text-emerald-50 hover:bg-emerald-500/30 hover:text-white"
                }
              `}
            >
              <span className="text-xl">{item.icon}</span>
              <span>{item.name}</span>
            </Link>
          ))}
        </nav>
      </aside>

      {/* Main Content Area */}
      <div className="flex-1 flex flex-col overflow-hidden">
        {/* Header - Only for Content Area */}
        <header className="bg-white shadow-sm">
          <div className="flex items-center justify-between px-4 sm:px-6 py-3">
            {/* Mobile Menu Button */}
            <button
              className="sm:hidden text-gray-600 hover:text-gray-900"
              onClick={() => setSidebarOpen(!sidebarOpen)}
            >
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
            </button>

            {/* Welcome Message - Left */}
            <div className="flex items-center gap-2">
              <span className="text-sm sm:text-base text-gray-600">
                Hello,{" "}
                <span className="font-semibold text-gray-900">
                  {user?.name || "User"}
                </span> !
              </span>
            </div>

            {/* Logout - Right */}
            <Button variant="danger" size="sm" onClick={handleLogout}>
              ➜] Logout
            </Button>
          </div>
        </header>

        {/* Main Content - Scrollable */}
        <main className="flex-1 overflow-y-auto p-4 sm:p-6 md:p-8">
          {children}
        </main>
      </div>
    </div>
  );
};

export default UserLayout;
