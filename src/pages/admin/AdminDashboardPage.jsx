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

  const courses = useSelector((state) => state.courses.courses || []);
  const enrollments = useSelector(
    (state) => state.enrollments.enrollments || []
  );
  const users = useSelector((state) => state.auth.users || []);
  const questions = useSelector((state) => state.questions.questions || []);

  const students = users.filter((u) => u.role === "user");

  const totalAttempts = enrollments.reduce((sum, enrollment) => {
    return sum + (enrollment.attempts?.length || 0);
  }, 0);

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
      <div className="space-y-8 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
        {/* Header */}
        <div>
          <h2 className="text-2xl sm:text-3xl font-bold text-gray-900 tracking-tight">
            Dashboard Overview
          </h2>
          <p className="text-gray-600 mt-2 text-sm sm:text-base">
            Welcome back! Here's what's happening today.
          </p>
        </div>

        {/* Stats Grid */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4 sm:gap-6">
          {stats.map((stat, index) => {
            const Icon = stat.icon;
            return (
              <Card
                key={index}
                className={`p-4 sm:p-6 shadow-sm border-0 relative overflow-hidden group`}
              >
                {/* Subtle gradient background blob for depth */}
                <div className={`absolute -right-5 -top-5 blur-lg opacity-20 w-32 h-32 rounded-full z-0 ${stat.bgColor}`} />
                <div className="flex items-start justify-between relative z-10">
                  <div>
                    <p className="text-xs sm:text-sm text-gray-600 mb-1 font-medium uppercase tracking-wider">
                      {stat.label}
                    </p>
                    <p className="text-2xl sm:text-3xl font-bold text-gray-900">
                      {stat.value}
                    </p>
                  </div>
                  <div className={`flex items-center justify-center rounded-xl p-3 sm:p-4 ${stat.bgColor} shadow`}>
                    <Icon className={`w-6 h-6 sm:w-8 sm:h-8 ${stat.textColor}`} />
                  </div>
                </div>
              </Card>
            );
          })}
        </div>

        {/* Recent Courses */}
        <Card className="p-4 sm:p-6 shadow-sm border-0">
          <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between mb-4 sm:mb-6 gap-3">
            <h3 className="text-lg sm:text-xl font-bold text-gray-900">
              Recent Courses
            </h3>
            <button
              onClick={() => navigate("/admin/courses")}
              className="text-blue-600 hover:text-blue-700 font-medium text-sm self-start sm:self-auto transition-colors"
            >
              View All →
            </button>
          </div>

          {/* Empty State */}
          {courses.length === 0 ? (
            <div className="flex flex-col items-center justify-center min-h-[120px] text-center py-8 text-gray-500">
              <svg className="w-12 h-12 text-blue-200 mb-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2}
                  d="M12 6.253v13m0-13C10.832 5.477 9.246 5 7.5 5S4.168 5.477 3 6.253v13C4.168 18.477 5.754 18 7.5 18s3.332.477 4.5 1.253m0-13C13.168 5.477 14.754 5 16.5 5c1.747 0 3.332.477 4.5 1.253v13C19.832 18.477 18.247 18 16.5 18c-1.746 0-3.332.477-4.5 1.253" />
              </svg>
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
              {/* Card View for Mobile */}
              <div className="block sm:hidden space-y-4">
                {courses.slice(0, 5).map((course) => (
                  <Card key={course.id} className="p-4 border border-gray-100">
                    <h4 className="font-semibold text-gray-900 mb-2 truncate">{course.title}</h4>
                    <p className="text-sm text-gray-600 mb-3 line-clamp-2">
                      {course.description?.substring(0, 80) || "No description"}...
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
              {/* Table View for Desktop */}
              <div className="hidden sm:block overflow-x-auto">
                <table className="w-full">
                  <thead>
                    <tr className="border-b border-gray-200">
                      <th className="text-left py-3 px-4 text-[13px] font-medium text-gray-700">Course</th>
                      <th className="text-left py-3 px-4 text-[13px] font-medium text-gray-700">Domain</th>
                      <th className="text-left py-3 px-4 text-[13px] font-medium text-gray-700">Difficulty</th>
                      <th className="text-left py-3 px-4 text-[13px] font-medium text-gray-700">Duration</th>
                      <th className="text-left py-3 px-4 text-[13px] font-medium text-gray-700">Price</th>
                    </tr>
                  </thead>
                  <tbody>
                    {courses.slice(0, 5).map((course) => (
                      <tr
                        key={course.id}
                        className="border-b border-gray-100 hover:bg-blue-50 transition-colors"
                      >
                        <td className="py-3 px-4 min-w-[180px]">
                          <div>
                            <span className="font-medium text-gray-900 truncate">{course.title}</span>
                            <p className="text-xs text-gray-500 mt-1 truncate">
                              {course.description?.substring(0, 50) || "No description"}...
                            </p>
                          </div>
                        </td>
                        <td className="py-3 px-4 text-gray-600">
                          {course.domain || "N/A"}
                        </td>
                        <td className="py-3 px-4">
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
                        <td className="py-3 px-4 text-gray-600">
                          {course.duration || 0} min
                        </td>
                        <td className="py-3 px-4 text-gray-600">
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