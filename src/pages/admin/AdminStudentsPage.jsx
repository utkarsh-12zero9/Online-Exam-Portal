import React, { useState } from "react";
import { useSelector, useDispatch } from "react-redux";
import { useNavigate } from "react-router-dom";
import AdminLayout from "@/shared/components/layout/AdminLayout";
import Card from "@/shared/components/ui/Card";
import Button from "@/shared/components/ui/Button";
import Input from "@/shared/components/ui/Input";
import { deleteUser, bulkDeleteUsers } from "@/features/auth/slices/authSlice";
import { toast } from "react-toastify";
import { exportToCSV } from "@/shared/utils/exportToCSV";

const AdminStudentsPage = () => {
  const navigate = useNavigate();
  const dispatch = useDispatch();

  const users = useSelector((state) => state.auth.users || []);
  const enrollments = useSelector((state) => state.enrollments.enrollments);
  const courses = useSelector((state) => state.courses.courses);

  const [searchTerm, setSearchTerm] = useState("");
  const [selectedUsers, setSelectedUsers] = useState([]);

  const students = users.filter((u) => u.role === "user");

  const filteredStudents = students.filter((student) => {
    const matchesSearch =
      student.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      student.email.toLowerCase().includes(searchTerm.toLowerCase());
    return matchesSearch;
  });

  const getStudentStats = (userId) => {
    const userEnrollments = enrollments.filter((e) => e.userId === userId);
    const totalAttempts = userEnrollments.reduce(
      (sum, e) => sum + e.attempts.length,
      0
    );

    let totalScore = 0;
    let totalMarks = 0;

    userEnrollments.forEach((enrollment) => {
      enrollment.attempts.forEach((attempt) => {
        totalScore += attempt.score || 0;
        totalMarks += attempt.totalMarks || 1;
      });
    });

    const avgPercentage =
      totalMarks > 0 ? ((totalScore / totalMarks) * 100).toFixed(1) : 0;

    return {
      enrolledCourses: userEnrollments.length,
      totalAttempts,
      avgPercentage,
    };
  };

  const formatDate = (dateString) => {
    return new Date(dateString).toLocaleDateString("en-US", {
      year: "numeric",
      month: "short",
      day: "numeric",
    });
  };

  // Selection handlers
  const handleSelectAll = (e) => {
    if (e.target.checked) {
      setSelectedUsers(filteredStudents.map((s) => s.id));
    } else {
      setSelectedUsers([]);
    }
  };

  const handleSelectOne = (userId) => {
    if (selectedUsers.includes(userId)) {
      setSelectedUsers(selectedUsers.filter((id) => id !== userId));
    } else {
      setSelectedUsers([...selectedUsers, userId]);
    }
  };

  const handleBulkDelete = () => {
    if (selectedUsers.length === 0) {
      toast.warning("Please select users to delete");
      return;
    }

    const confirmMessage = `Are you sure you want to delete ${selectedUsers.length
      } user${selectedUsers.length > 1 ? "s" : ""
      }? This action cannot be undone.`;

    if (window.confirm(confirmMessage)) {
      dispatch(bulkDeleteUsers(selectedUsers));
      toast.success(
        `${selectedUsers.length} user${selectedUsers.length > 1 ? "s" : ""
        } deleted successfully`
      );
      setSelectedUsers([]);
    }
  };

  const handleDeleteSingle = (id, name) => {
    if (window.confirm(`Are you sure you want to delete ${name}?`)) {
      dispatch(deleteUser(id));
      toast.success("User deleted successfully");
      setSelectedUsers(selectedUsers.filter((userId) => userId !== id));
    }
  };

  const allSelected =
    filteredStudents.length > 0 &&
    selectedUsers.length === filteredStudents.length;
  const someSelected = selectedUsers.length > 0 && !allSelected;

  const exportStudents = () => {
    const data = filteredStudents.map((student) => {
      const stats = getStudentStats(student.id);
      return {
        Name: student.name,
        Email: student.email,
        Role: student.role,
        "Enrolled Courses": stats.enrolledCourses,
        "Total Attempts": stats.totalAttempts,
        "Average Score (%)": stats.avgPercentage,
        "Joined Date": student.createdAt
          ? formatDate(student.createdAt)
          : "N/A",
      };
    });

    exportToCSV(data, `students-${new Date().toISOString().split("T")[0]}.csv`);
    toast.success("Students data exported successfully!");
  };

  return (
    <AdminLayout>
      <div className="max-w-8xl mx-auto px-6 sm:px-10 lg:px-14 py-8 space-y-8">

        {/* Header Section */}
        <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between mb-8">
          <div>
            <h1 className="text-3xl font-bold text-gray-900 mb-1">Student Management</h1>
            <p className="text-gray-600 text-base">
              View detailed insights and manage all registered students efficiently.
            </p>
          </div>
          <Button
            variant="primary"
            onClick={() => navigate("/admin/users/create")}
            className="w-full sm:w-auto"
          >
            + Add User
          </Button>
        </div>

        {/* Export Button */}
        <div className="flex mb-6">
          <Button
            variant="outline"
            className="text-xl rounded-lg px-5 py-3 hover:bg-gray-100 transition"
            onClick={exportStudents}
          >
            <span className="flex items-center gap-2">
              <svg className="w-5 h-5 text-green-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 17l4 4 4-4m-4-5v9" />
              </svg>
              Export CSV
            </span>
          </Button>
        </div>

        {/* Search & Bulk Actions */}
        <Card className="p-6 mb-6 shadow-lg border border-gray-200 rounded-xl">
          <div className="flex flex-col lg:flex-row justify-between items-start lg:items-center space-y-4 lg:space-y-0 gap-4">
            <Input
              placeholder="Search by name or email..."
              value={searchTerm}
              onChange={e => setSearchTerm(e.target.value)}
              className="flex-1 max-w-3xl text-lg font-medium shadow-inner bg-gray-50"
              aria-label="Search students by name or email"
            />
            <div className="flex items-center gap-4">
              {selectedUsers.length > 0 && (
                <Button
                  variant="danger"
                  size="md"
                  onClick={handleBulkDelete}
                  className="text-lg px-5 py-2 shadow-md rounded-lg hover:shadow-xl transition"
                  aria-label={`Delete selected ${selectedUsers.length} users`}
                >
                  Delete Selected ({selectedUsers.length})
                </Button>
              )}
              <span className="text-lg text-gray-700 font-semibold">
                Total: {filteredStudents.length}
              </span>
            </div>
          </div>
        </Card>

        {/* Student Table */}
        <Card className="overflow-x-auto shadow-lg rounded-xl border border-gray-300">
          <table className="min-w-full divide-y divide-gray-300">
            <thead className="bg-gradient-to-r from-indigo-100 via-blue-100 to-cyan-100 border-b border-gray-300">
              <tr>
                <th className="px-6 py-4">
                  <input
                    type="checkbox"
                    checked={allSelected}
                    ref={el => {
                      if (el) el.indeterminate = someSelected;
                    }}
                    onChange={handleSelectAll}
                    className="w-5 h-5 text-indigo-600 border-gray-400 rounded focus:ring-indigo-500"
                    aria-label="Select all students"
                  />
                </th>
                <th className="text-left py-4 px-6 text-sm font-semibold text-gray-700 uppercase tracking-widest">
                  Student
                </th>
                <th className="text-left py-4 px-6 text-sm font-semibold text-gray-700 uppercase tracking-widest">
                  Enrolled Courses
                </th>
                <th className="text-left py-4 px-6 text-sm font-semibold text-gray-700 uppercase tracking-widest">
                  Attempts
                </th>
                <th className="text-left py-4 px-6 text-sm font-semibold text-gray-700 uppercase tracking-widest">
                  Avg Score
                </th>
                <th className="text-left py-4 px-6 text-sm font-semibold text-gray-700 uppercase tracking-widest">
                  Joined Date
                </th>
                <th className="text-left py-4 px-6 text-sm font-semibold text-gray-700 uppercase tracking-widest">
                  Actions
                </th>
              </tr>
            </thead>
            <tbody className="bg-white divide-y divide-gray-300">
              {filteredStudents.length > 0 ? (
                filteredStudents.map(student => {
                  const stats = getStudentStats(student.id);
                  const isSelected = selectedUsers.includes(student.id);
                  return (
                    <tr
                      key={student.id}
                      className={`transition-colors duration-300 hover:bg-indigo-50 ${isSelected ? "bg-indigo-100" : ""
                        }`}
                    >
                      <td className="px-6 py-4">
                        <input
                          type="checkbox"
                          checked={isSelected}
                          onChange={() => handleSelectOne(student.id)}
                          className="w-5 h-5 text-indigo-600 border-gray-400 rounded focus:ring-indigo-500"
                          aria-label={`Select student ${student.name}`}
                        />
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap flex items-center gap-4">
                        <div className="w-12 h-12 rounded-full bg-indigo-100 text-indigo-700 flex items-center justify-center text-xl font-extrabold select-none">
                          {student.name.charAt(0).toUpperCase()}
                        </div>
                        <div className="min-w-0">
                          <p className="text-base font-semibold text-gray-900 truncate">
                            {student.name}
                          </p>
                          <p className="text-sm text-gray-600 truncate max-w-[280px]">
                            {student.email}
                          </p>
                        </div>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-base font-semibold text-gray-900">
                        {stats.enrolledCourses}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-base font-semibold text-gray-900">
                        {stats.totalAttempts}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <span
                          className={`inline-flex px-3 py-1 rounded-full text-sm font-semibold text-white ${stats.avgPercentage >= 80
                              ? "bg-green-600"
                              : stats.avgPercentage >= 60
                                ? "bg-yellow-500"
                                : "bg-red-600"
                            }`}
                          aria-label={`Average score ${stats.avgPercentage} percent`}
                        >
                          {stats.avgPercentage}%
                        </span>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-gray-500 text-sm">
                        {student.createdAt ? formatDate(student.createdAt) : "N/A"}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap space-x-2 text-sm font-medium">
                        <Button
                          variant="secondary"
                          size="sm"
                          onClick={() => navigate(`/admin/users/edit/${student.id}`)}
                          className="rounded-md px-3 py-1 shadow-sm transition hover:bg-indigo-50 focus:ring-2 focus:ring-indigo-400"
                          aria-label={`Edit student ${student.name}`}
                        >
                          Edit
                        </Button>
                        <Button
                          variant="outline"
                          size="sm"
                          onClick={() => navigate(`/admin/users/${student.id}`)}
                          className="rounded-md px-3 py-1 shadow-sm transition hover:bg-gray-100 focus:ring-2 focus:ring-gray-300"
                          aria-label={`View student ${student.name}`}
                        >
                          View
                        </Button>
                        <Button
                          variant="danger"
                          size="sm"
                          onClick={() => handleDeleteSingle(student.id, student.name)}
                          className="rounded-md px-3 py-1 shadow-sm transition hover:bg-red-700 focus:ring-2 focus:ring-red-500"
                          aria-label={`Delete student ${student.name}`}
                        >
                          Delete
                        </Button>
                      </td>
                    </tr>
                  );
                })
              ) : (
                <tr>
                  <td
                    colSpan={7}
                    className="px-6 py-12 text-center text-gray-500 text-lg font-medium"
                  >
                    <div className="flex flex-col items-center gap-3">
                      <svg className="w-12 h-12 text-indigo-200 mb-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 12A4 4 0 1 0 8 12a4 4 0 0 0 8 0zm2 0a6 6 0 1 1-12 0 6 6 0 0 1 12 0zm-6 6a9 9 0 0 1-8.485-8.485" />
                      </svg>
                      No students found
                    </div>
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </Card>
      </div>
    </AdminLayout>
  );



};

export default AdminStudentsPage;
