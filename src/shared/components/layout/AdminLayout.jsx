import React, { useState, useRef, useEffect } from "react";
import { Link, useNavigate, useLocation } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";
import { logout } from "@/features/auth/slices/authSlice";
import { toast } from "react-toastify";
import { PiExamDuotone } from "react-icons/pi";
import {
  HiOutlineHome,
  HiOutlineBookOpen,
  HiOutlineDocumentText,
  HiOutlineChartBar,
  HiOutlineUsers,
  HiOutlineCog,
  HiOutlineLogout,
  HiOutlineX,
  HiOutlineMenu,
  HiOutlineChevronDown,
} from "react-icons/hi";

// Menu items configuration
const menuItems = [
  { icon: HiOutlineHome, label: "Dashboard", path: "/admin" },
  { icon: HiOutlineBookOpen, label: "Courses", path: "/admin/courses" },
  { icon: HiOutlineDocumentText, label: "Questions", path: "/admin/questions" },
  { icon: HiOutlineChartBar, label: "Reports", path: "/admin/reports" },
  { icon: HiOutlineUsers, label: "Students", path: "/admin/users" },
  { icon: HiOutlineCog, label: "Settings", path: "/admin/settings" },
];

const AdminLayout = ({ children }) => {
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);
  const [isProfileOpen, setIsProfileOpen] = useState(false);
  const { user } = useSelector((state) => state.auth);
  const location = useLocation();
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const profileMenuRef = useRef(null);

  // --- Logic (Unchanged) ---
  const handleLogout = () => {
    dispatch(logout());
    toast.success("Logged out successfully");
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
    <div className="min-h-screen bg-gray-100 flex">
      {/* Mobile Overlay with Blur */}
      {isSidebarOpen && (
        <div
          className="fixed inset-0 z-40 lg:hidden bg-black/30 backdrop-blur-sm"
          onClick={() => setIsSidebarOpen(false)}
        />
      )}

      {/* Sidebar */}
      <aside
        className={`
          fixed lg:sticky inset-y-0 left-0 z-50
          w-64 bg-blue-600 text-white
          transform transition-transform duration-300 ease-in-out
          ${isSidebarOpen ? "translate-x-0" : "-translate-x-full lg:translate-x-0"}
          flex flex-col
          h-screen           
          overflow-y-auto    
          top-0              
        `}
      >
        {/* Logo */}
        <div className="p-3.5 border-b-2 border-blue-500">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 bg-white rounded-lg flex items-center justify-center">
                <span className="text-blue-600 font-bold text-xl">
                  <PiExamDuotone />
                </span>
              </div>
              <span className="text-xl font-bold">ExamPortal</span>
            </div>
            <button
              onClick={() => setIsSidebarOpen(false)}
              className="lg:hidden text-white hover:text-gray-200"
            >
              <HiOutlineX className="w-6 h-6" />
            </button>
          </div>
        </div>

        {/* Menu Items */}
        <nav className="flex-1 p-4 overflow-y-auto">
          {menuItems.map((item) => {
            const Icon = item.icon;
            const isActive = location.pathname === item.path;
            return (
              <Link
                key={item.path}
                to={item.path}
                onClick={() => setIsSidebarOpen(false)}
                className={`flex items-center gap-3 px-4 py-3 rounded-lg mb-2 transition-colors ${isActive
                  ? "bg-blue-700 text-white"
                  : "text-blue-100 hover:bg-blue-500 hover:text-white"
                  }`}
              >
                <Icon className="w-5 h-5" />
                <span>{item.label}</span>
              </Link>
            );
          })}
        </nav>

        {/* --- ADDED SECTION --- */}
        {/* Mobile Logout Button (at bottom) */}
        <div className="p-4 border-t border-blue-500 lg:hidden">
          <button
            onClick={() => {
              handleLogout();
              setIsSidebarOpen(false); // Close sidebar on logout
            }}
            className="w-full flex items-center justify-center gap-3 px-4 py-3 rounded-lg text-sm bg-red-500 text-white hover:bg-red-600 transition-colors"
          >
            <HiOutlineLogout className="w-5 h-5" />
            <span>Logout</span>
          </button>
        </div>
        {/* --- END ADDED SECTION --- */}
      </aside>

      {/* Main Content */}
      <div className="flex-1 flex flex-col min-w-0">
        {/* Header */}
        <header className="bg-white border-b border-gray-200 px-4 sm:px-6 lg:px-8 py-3 sticky top-0 z-30">
          <div className="flex items-center justify-between">
            {/* Left Side: Hamburger + Title */}
            <div className="flex items-center gap-4">
              <button
                onClick={() => setIsSidebarOpen(true)}
                className="lg:hidden text-gray-600 hover:text-gray-900"
              >
                <HiOutlineMenu className="w-6 h-6" />
              </button>
              <h1 className="text-xl sm:text-2xl font-bold text-gray-900">
                Admin Panel
              </h1>
            </div>

            {/* Right Side: Profile Dropdown */}
            <div className="relative" ref={profileMenuRef}>
              <button
                onClick={() => setIsProfileOpen((prev) => !prev)}
                className="flex items-center gap-2 text-left p-1 rounded-lg transition-colors hover:bg-gray-100 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
              >
                {/* Avatar */}
                <div className="w-8 h-8 sm:w-10 sm:h-10 bg-blue-600 rounded-full flex items-center justify-center">
                  <span className="text-white font-semibold text-sm sm:text-base">
                    {user?.name?.charAt(0)?.toUpperCase() || "A"}
                  </span>
                </div>
                {/* Name/Role (Hidden on mobile) */}
                <div className="hidden sm:block">
                  <p className="text-sm font-medium text-gray-900 truncate max-w-[150px]">
                    {user?.name || "Admin User"}
                  </p>
                  <p className="text-xs text-gray-500 capitalize">
                    {user?.role || "admin"}
                  </p>
                </div>
                <HiOutlineChevronDown className="hidden sm:block w-4 h-4 text-gray-500" />
              </button>

              {/* Dropdown Menu */}
              {isProfileOpen && (
                <div
                  className="absolute right-0 mt-2 w-56 bg-white border border-gray-200 rounded-lg shadow-lg z-40 overflow-hidden"
                  onClick={() => setIsProfileOpen(false)}
                >
                  {/* Info (Visible on mobile) */}
                  <div className="sm:hidden p-3 border-b border-gray-100">
                    <p className="text-sm font-medium text-gray-900 truncate">
                      {user?.name || "Admin User"}
                    </p>
                    <p className="text-xs text-gray-500 capitalize">
                      {user?.role || "admin"}
                    </p>
                  </div>
                  {/* Logout Button */}
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

        {/* Page Content */}
        <main className="flex-1 p-4 sm:p-6 lg:p-8 overflow-auto">
          {children}
        </main>
      </div>
    </div>
  );
};

export default AdminLayout;