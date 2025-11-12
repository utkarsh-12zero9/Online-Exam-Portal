import React from "react";
import { useSelector } from "react-redux";
import { useNavigate } from "react-router-dom";
import AdminLayout from "@/shared/components/layout/AdminLayout";
import Card from "@/shared/components/ui/Card";
import {
  HiOutlineBookOpen,
  HiOutlineUsers,
  HiOutlinePencilAlt,
  HiOutlineQuestionMarkCircle,
} from "react-icons/hi";

const AdminDashboardPage = () => {
  const navigate = useNavigate();

  // Get all Redux state
  const courses = useSelector((state) => state.courses.courses || []);
  const enrollments = useSelector(
    (state) => state.enrollments.enrollments || []
  );
  const users = useSelector((state) => state.auth.users || []);
  const questions = useSelector((state) => state.questions.questions || []);

  // Calculate stats
  const students = users.filter((u) => u.role === "user");

  const totalAttempts = enrollments.reduce((sum, enrollment) => {
    return sum + (enrollment.attempts?.length || 0);
  }, 0);

  // --- STATS CONFIGURATION (CLEANED) ---
  const stats = [
    {
      label: "Total Courses",
      value: courses.length,
      icon: HiOutlineBookOpen,
      textColor: "text-blue-600",
      bgColor: "bg-blue-50",
    },
    {
      label: "Total Students",
      value: students.length,
      icon: HiOutlineUsers,
      textColor: "text-emerald-600",
      bgColor: "bg-emerald-50",
    },
    {
      label: "Total Attempts",
      value: totalAttempts,
      icon: HiOutlinePencilAlt,
      textColor: "text-purple-600",
      bgColor: "bg-purple-50",
    },
    {
      label: "Total Questions",
      value: questions.length,
      icon: HiOutlineQuestionMarkCircle,
      textColor: "text-yellow-600",
      bgColor: "bg-yellow-50",
    },
  ];

  return (
    <AdminLayout>
      <div className="space-y-6 sm:space-y-8">
        {/* Header */}
        <div>
          <h2 className="text-2xl sm:text-3xl font-bold text-gray-900">
            Dashboard Overview
          </h2>
          <p className="text-gray-600 mt-2 text-sm sm:text-base">
            Welcome back! Here's what's happening today.
          </p>
        </div>

        {/* Stats Grid - Responsive */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 sm:gap-6">
          {stats.map((stat, index) => {
            const Icon = stat.icon;
            return (
              <Card key={index} className="p-4 sm:p-6">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-xs sm:text-sm text-gray-600 mb-1">
                      {stat.label}
                    </p>
                    <p className="text-2xl sm:text-3xl font-bold text-gray-900">
                      {stat.value}
                    </p>
                  </div>
                  <div className={`${stat.bgColor} p-3 sm:p-4 rounded-xl`}>
                    <Icon
                      className={`w-6 h-6 sm:w-8 sm:h-8 ${stat.textColor}`}
                    />
                  </div>
                </div>
              </Card>
            );
          })}
        </div>

        {/* Recent Courses - Responsive Table */}
        <Card className="p-4 sm:p-6">
          <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between mb-4 sm:mb-6 gap-3">
            <h3 className="text-lg sm:text-xl font-bold text-gray-900">
              Recent Courses
            </h3>
            <button
              onClick={() => navigate("/admin/courses")}
              className="text-blue-600 hover:text-blue-700 font-medium text-sm self-start sm:self-auto"
            >
              View All →
            </button>
          </div>

          {courses.length === 0 ? (
            <div className="text-center py-8 text-gray-500">
              <p>No courses available yet.</p>
              <button
                onClick={() => navigate("/admin/courses/create")}
                className="mt-4 text-blue-600 hover:text-blue-700 font-medium"
              >
                Create your first course →
              </button>
            </div>
          ) : (
            <>
              {/* Mobile: Card View */}
              <div className="block sm:hidden space-y-4">
                {courses.slice(0, 5).map((course) => (
                  <Card key={course.id} className="p-4">
                    <h4 className="font-semibold text-gray-900 mb-2">
                      {course.title}
                    </h4>
                    <p className="text-sm text-gray-600 mb-3">
                      {course.description?.substring(0, 80) || "No description"}
                      ...
                    </p>
                    <div className="flex flex-wrap gap-2">
                      <span className="text-xs px-2 py-1 bg-gray-100 text-gray-700 rounded">
                        {course.domain || "N/A"}
                      </span>
                      <span
                        className={`text-xs px-2 py-1 rounded ${course.difficulty === "easy"
                            ? "bg-emerald-100 text-emerald-700"
                            : course.difficulty === "medium"
                              ? "bg-yellow-100 text-yellow-700"
                              : "bg-red-100 text-red-700"
                          }`}
                      >
                        {course.difficulty || "medium"}
                      </span>
                      <span className="text-xs px-2 py-1 bg-gray-100 text-gray-700 rounded">
                        {course.duration || 0} min
                      </span>
                    </div>
                  </Card>
                ))}
              </div>

              {/* Desktop: Table View */}
              <div className="hidden sm:block overflow-x-auto">
                <table className="w-full">
                  <thead>
                    <tr className="border-b border-gray-200">
                      <th className="text-left py-3 px-4 text-sm font-medium text-gray-700">
                        Course
                      </th>
                      <th className="text-left py-3 px-4 text-sm font-medium text-gray-700">
                        Domain
                      </th>
                      <th className="text-left py-3 px-4 text-sm font-medium text-gray-700">
                        Difficulty
                      </th>
                      <th className="text-left py-3 px-4 text-sm font-medium text-gray-700">
                        Duration
                      </th>
                      <th className="text-left py-3 px-4 text-sm font-medium text-gray-700">
                        Price
                      </th>
                    </tr>
                  </thead>
                  <tbody>
                    {courses.slice(0, 5).map((course) => (
                      <tr
                        key={course.id}
                        className="border-b border-gray-100 hover:bg-gray-50"
                      >
                        <td className="py-4 px-4">
                          <div>
                            <p className="font-medium text-gray-900">
                              {course.title}
                            </p>
                            <p className="text-sm text-gray-500 mt-1">
                              {course.description?.substring(0, 50) ||
                                "No description"}
                              ...
                            </p>
                            {/* ^^^ THIS IS THE FIX ^^^ */}
                          </div>
                        </td>
                        <td className="py-4 px-4 text-gray-600">
                          {course.domain || "N/A"}
                        </td>
                        <td className="py-4 px-4">
                          <span
                            className={`px-3 py-1 rounded-full text-xs font-medium ${course.difficulty === "easy"
                                ? "bg-emerald-100 text-emerald-700"
                                : course.difficulty === "medium"
                                  ? "bg-yellow-100 text-yellow-700"
                                  : "bg-red-100 text-red-700"
                              }`}
                          >
                            {course.difficulty || "medium"}
                          </span>
                        </td>
                        <td className="py-4 px-4 text-gray-600">
                          {course.duration || 0} min
                        </td>
                        <td className="py-4 px-4 text-gray-600">
                          ₹{course.price || 0}
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </>
          )}
        </Card>
      </div>
    </AdminLayout>
  );
};

export default AdminDashboardPage;