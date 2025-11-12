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

    const confirmMessage = `Are you sure you want to delete ${
      selectedUsers.length
    } user${
      selectedUsers.length > 1 ? "s" : ""
    }? This action cannot be undone.`;

    if (window.confirm(confirmMessage)) {
      dispatch(bulkDeleteUsers(selectedUsers));
      toast.success(
        `${selectedUsers.length} user${
          selectedUsers.length > 1 ? "s" : ""
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
      <div>
        <div className="flex items-center justify-between mb-6">
          <div>
            <h1 className="text-3xl font-bold text-gray-900 mb-2">
              Student Management
            </h1>
            <p className="text-gray-600">
              View and manage all registered students
            </p>
          </div>
          <Button
            variant="primary"
            onClick={() => navigate("/admin/users/create")}
          >
            + Add User
          </Button>
        </div>

        <div className="flex gap-3 mb-3">
          <Button variant="outline" onClick={exportStudents}>
            📥 Export CSV
          </Button>
        </div>

        {/* Search & Bulk Actions */}
        <Card className="p-4 mb-6">
          <div className="flex flex-col sm:flex-row gap-3 items-start sm:items-center justify-between">
            <Input
              placeholder="Search by name or email..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="flex-1"
            />
            <div className="flex items-center gap-2">
              {selectedUsers.length > 0 && (
                <Button variant="danger" size="sm" onClick={handleBulkDelete}>
                  Delete Selected ({selectedUsers.length})
                </Button>
              )}
              <span className="text-sm text-gray-600">
                Total: {filteredStudents.length}
              </span>
            </div>
          </div>
        </Card>

        {/* Students Table */}
        <Card className="overflow-hidden">
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead className="bg-gray-50 border-b border-gray-200">
                <tr>
                  <th className="px-6 py-3 text-left">
                    <input
                      type="checkbox"
                      checked={allSelected}
                      ref={(input) => {
                        if (input) input.indeterminate = someSelected;
                      }}
                      onChange={handleSelectAll}
                      className="w-4 h-4 text-blue-600 border-gray-300 rounded focus:ring-blue-500"
                    />
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Student
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Enrolled Courses
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Attempts
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Avg Score
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Joined Date
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Actions
                  </th>
                </tr>
              </thead>
              <tbody className="bg-white divide-y divide-gray-200">
                {filteredStudents.length > 0 ? (
                  filteredStudents.map((student) => {
                    const stats = getStudentStats(student.id);
                    const isSelected = selectedUsers.includes(student.id);
                    return (
                      <tr
                        key={student.id}
                        className={`hover:bg-gray-50 ${
                          isSelected ? "bg-blue-50" : ""
                        }`}
                      >
                        <td className="px-6 py-4">
                          <input
                            type="checkbox"
                            checked={isSelected}
                            onChange={() => handleSelectOne(student.id)}
                            className="w-4 h-4 text-blue-600 border-gray-300 rounded focus:ring-blue-500"
                          />
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap">
                          <div className="flex items-center">
                            <div className="w-10 h-10 rounded-full bg-blue-100 flex items-center justify-center text-blue-700 font-bold mr-3">
                              {student.name.charAt(0).toUpperCase()}
                            </div>
                            <div>
                              <div className="text-sm font-medium text-gray-900">
                                {student.name}
                              </div>
                              <div className="text-sm text-gray-500">
                                {student.email}
                              </div>
                            </div>
                          </div>
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap">
                          <span className="text-sm text-gray-900">
                            {stats.enrolledCourses}
                          </span>
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap">
                          <span className="text-sm text-gray-900">
                            {stats.totalAttempts}
                          </span>
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap">
                          <span
                            className={`px-2 py-1 inline-flex text-xs leading-5 font-semibold rounded-full ${
                              stats.avgPercentage >= 80
                                ? "bg-emerald-100 text-emerald-800"
                                : stats.avgPercentage >= 60
                                ? "bg-yellow-100 text-yellow-800"
                                : "bg-red-100 text-red-800"
                            }`}
                          >
                            {stats.avgPercentage}%
                          </span>
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                          {student.createdAt
                            ? formatDate(student.createdAt)
                            : "N/A"}
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap text-sm font-medium">
                          <div className="flex gap-2">
                            <Button
                              variant="secondary"
                              size="sm"
                              onClick={() =>
                                navigate(`/admin/users/edit/${student.id}`)
                              }
                            >
                              Edit
                            </Button>
                            <Button
                              variant="outline"
                              size="sm"
                              onClick={() =>
                                navigate(`/admin/users/${student.id}`)
                              }
                            >
                              View
                            </Button>
                            <Button
                              variant="danger"
                              size="sm"
                              onClick={() =>
                                handleDeleteSingle(student.id, student.name)
                              }
                            >
                              Delete
                            </Button>
                          </div>
                        </td>
                      </tr>
                    );
                  })
                ) : (
                  <tr>
                    <td
                      colSpan="7"
                      className="px-6 py-12 text-center text-gray-500"
                    >
                      No students found
                    </td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>
        </Card>
      </div>
    </AdminLayout>
  );
};

export default AdminStudentsPage;
