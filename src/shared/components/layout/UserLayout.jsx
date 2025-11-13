import React, { useState, useRef, useEffect } from "react";
import { Link, useNavigate, useLocation } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";
import { logout } from "@/features/auth/slices/authSlice";
import {
  HiOutlineChartBar,
  HiOutlineBookOpen,
  HiOutlineAcademicCap,
  HiOutlineDocumentText,
  HiOutlineUserCircle,
  HiOutlineLogout,
  HiOutlineX,
  HiOutlineMenu,
  HiOutlineChevronDown,
} from "react-icons/hi";
import { Newspaper } from "lucide-react";

// Menu items configuration
const navItems = [
  { name: "Dashboard", path: "/user/dashboard", icon: HiOutlineChartBar },
  { name: "Browse Courses", path: "/user/courses", icon: HiOutlineBookOpen },
  { name: "My Courses", path: "/user/my-courses", icon: HiOutlineAcademicCap },
  {
    name: "Attempt History",
    path: "/user/history",
    icon: HiOutlineDocumentText,
  },
  { name: "Profile", path: "/user/profile", icon: HiOutlineUserCircle },
];

const UserLayout = ({ children }) => {
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [isProfileOpen, setIsProfileOpen] = useState(false);
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const location = useLocation();
  const { user } = useSelector((state) => state.auth);
  const profileMenuRef = useRef(null);

  const handleLogout = () => {
    dispatch(logout());
    navigate("/login");
  };

  // --- Hook for closing profile dropdown on outside click ---
  useEffect(() => {
    const handleClickOutside = (event) => {
      if (
        profileMenuRef.current &&
        !profileMenuRef.current.contains(event.target)
      ) {
        setIsProfileOpen(false);
      }
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, [profileMenuRef]);

  return (
    <div className="flex h-screen bg-gray-50 overflow-hidden">

      {/* Desktop Sidebar - Fixed Full Height */}
      <aside className="hidden sm:flex sm:flex-col w-64 bg-gradient-to-b from-emerald-600 to-emerald-700 shadow-xl">
        {/* Sidebar Header */}
        <div className="p-5 border-b-2 border-emerald-300 flex items-center gap-3">
          <Newspaper className="w-8 h-8 text-white" />
          <h1 className="text-2xl font-bold text-white">Exam Portal</h1>
        </div>

        {/* Navigation */}
        <nav className="flex-1 p-4 space-y-2 overflow-y-auto">
          {navItems.map((item) => {
            const Icon = item.icon;
            const isActive = location.pathname === item.path;
            return (
              <Link
                key={item.path}
                to={item.path}
                className={`
                flex items-center gap-3 px-4 py-3 rounded-lg transition-all
                ${isActive
                    ? "bg-white text-emerald-700 font-semibold shadow-md"
                    : "text-emerald-50 hover:bg-emerald-500/30 hover:text-white"
                  }
              `}
              >
                <Icon className="w-5 h-5" />
                <span>{item.name}</span>
              </Link>
            );
          })}
        </nav>
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
        flex flex-col
        ${sidebarOpen ? "translate-x-0" : "-translate-x-full"}
      `}
      >
        <div className="p-5 border-b-2 border-emerald-300 flex items-center justify-between gap-3">
          <div className="flex items-center gap-3">
            <Newspaper className="w-8 h-8 text-white" />
            <h1 className="text-xl font-bold text-white">Exam Portal</h1>
          </div>
          <button
            onClick={() => setSidebarOpen(false)}
            className="text-white"
            aria-label="Close Sidebar"
          >
            <HiOutlineX className="w-6 h-6" />
          </button>
        </div>

        <nav className="flex-1 p-4 space-y-2 overflow-y-auto">
          {navItems.map((item) => {
            const Icon = item.icon;
            const isActive = location.pathname === item.path;
            return (
              <Link
                key={item.path}
                to={item.path}
                onClick={() => setSidebarOpen(false)}
                className={`
                flex items-center gap-3 px-4 py-3 rounded-lg transition-all
                ${isActive
                    ? "bg-white text-emerald-700 font-semibold shadow-md"
                    : "text-emerald-50 hover:bg-emerald-500/30 hover:text-white"
                  }
              `}
              >
                <Icon className="w-5 h-5" />
                <span>{item.name}</span>
              </Link>
            );
          })}
        </nav>

        {/* Mobile Logout Button */}
        <div className="p-4 border-t border-emerald-500/30">
          <button
            onClick={() => {
              handleLogout();
              setSidebarOpen(false);
            }}
            className="w-full flex items-center justify-center gap-3 px-4 py-3 rounded-lg text-sm bg-red-500 text-white hover:bg-red-600 transition-colors"
          >
            <HiOutlineLogout className="w-5 h-5" />
            <span>Logout</span>
          </button>
        </div>
      </aside>

      {/* Main Content Area */}
      <div className="flex-1 flex flex-col overflow-hidden">
        {/* Header */}
        <header className="bg-white shadow-sm sticky top-0 z-30">
          <div className="flex items-center justify-between px-4 sm:px-6 py-3">
            {/* Mobile Menu Button */}
            <button
              className="sm:hidden text-gray-600 hover:text-gray-900"
              onClick={() => setSidebarOpen(!sidebarOpen)}
              aria-label="Open Sidebar"
            >
              <HiOutlineMenu className="w-6 h-6" />
            </button>

            {/* Spacer for desktop */}
            <div className="hidden sm:block flex-1"></div>

            {/* Profile Dropdown */}
            <div className="relative" ref={profileMenuRef}>
              <button
                onClick={() => setIsProfileOpen((prev) => !prev)}
                className="flex items-center gap-2 text-left p-1 rounded-lg transition-colors hover:bg-gray-100 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-emerald-500"
                aria-label="User Profile Menu"
              >
                <div className="w-8 h-8 sm:w-10 sm:h-10 bg-emerald-600 rounded-full flex items-center justify-center">
                  <span className="text-white font-semibold text-sm sm:text-base">
                    {user?.name?.charAt(0)?.toUpperCase() || "U"}
                  </span>
                </div>
                <div className="hidden sm:block">
                  <p className="text-sm font-medium text-gray-900 truncate max-w-[150px]">
                    {user?.name || "User"}
                  </p>
                  <p className="text-xs text-gray-500 truncate max-w-[150px]">
                    {user?.email || "user@example.com"}
                  </p>
                </div>
                <HiOutlineChevronDown className="hidden sm:block w-4 h-4 text-gray-500" />
              </button>

              {/* Dropdown Menu */}
              {isProfileOpen && (
                <div
                  className="absolute right-0 mt-2 w-64 bg-white border border-gray-200 rounded-lg shadow-lg z-40 overflow-hidden"
                  onClick={() => setIsProfileOpen(false)}
                >
                  <div className="p-3 border-b border-gray-100">
                    <p className="text-sm font-medium text-gray-900 truncate">
                      {user?.name || "User"}
                    </p>
                    <p className="text-xs text-gray-500 truncate">
                      {user?.email || "user@example.com"}
                    </p>
                  </div>
                  <Link
                    to="/user/profile"
                    className="w-full text-left flex items-center gap-3 px-4 py-3 text-sm text-gray-700 hover:bg-gray-50 transition-colors"
                  >
                    <HiOutlineUserCircle className="w-5 h-5" />
                    <span>My Profile</span>
                  </Link>
                  <button
                    onClick={handleLogout}
                    className="w-full text-left flex items-center gap-3 px-4 py-3 text-sm text-red-600 hover:bg-gray-50 transition-colors"
                  >
                    <HiOutlineLogout className="w-5 h-5" />
                    <span>Logout</span>
                  </button>
                </div>
              )}
            </div>
          </div>
        </header>

        {/* Main Content - Scrollable */}
        <main className="flex-1 overflow-y-auto p-4 sm:p-6 md:p-8 bg-gray-50">
          {children}
        </main>
      </div>
    </div>
  );

};

export default UserLayout;