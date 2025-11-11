import React, { useState } from 'react';
import { useSelector } from 'react-redux';
import { useNavigate } from 'react-router-dom';
import AdminLayout from '@/shared/components/layout/AdminLayout';
import Card from '@/shared/components/ui/Card';
import Button from '@/shared/components/ui/Button';
import Input from '@/shared/components/ui/Input';

const AdminStudentsPage = () => {
    const navigate = useNavigate();
    const users = useSelector((state) => state.auth.users || []);
    const enrollments = useSelector((state) => state.enrollments.enrollments);
    const courses = useSelector((state) => state.courses.courses);

    const [searchTerm, setSearchTerm] = useState('');
    const [filterRole, setFilterRole] = useState('all');

    // Filter students (exclude admins)
    const students = users.filter((u) => u.role === 'user');

    // Filter by search
    const filteredStudents = students.filter((student) => {
        const matchesSearch =
            student.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
            student.email.toLowerCase().includes(searchTerm.toLowerCase());
        return matchesSearch;
    });

    // Get student stats
    const getStudentStats = (userId) => {
        const userEnrollments = enrollments.filter((e) => e.userId === userId);
        const totalAttempts = userEnrollments.reduce((sum, e) => sum + e.attempts.length, 0);

        let totalScore = 0;
        let totalMarks = 0;
        userEnrollments.forEach((enrollment) => {
            enrollment.attempts.forEach((attempt) => {
                totalScore += attempt.score || 0;
                totalMarks += attempt.totalMarks || 1;
            });
        });

        const avgPercentage = totalMarks > 0 ? ((totalScore / totalMarks) * 100).toFixed(1) : 0;

        return {
            enrolledCourses: userEnrollments.length,
            totalAttempts,
            avgPercentage,
        };
    };

    const formatDate = (dateString) => {
        return new Date(dateString).toLocaleDateString('en-US', {
            year: 'numeric',
            month: 'short',
            day: 'numeric',
        });
    };

    return (
        <AdminLayout>
            <div>
                <div className="flex items-center justify-between mb-6">
                    <div>
                        <h1 className="text-3xl font-bold text-gray-900 mb-2">Student Management</h1>
                        <p className="text-gray-600">View and manage all registered students</p>
                    </div>
                    <Button variant="primary" onClick={() => navigate('/admin/users/create')}>
                        + Add User
                    </Button>
                </div>


                {/* Search & Filter */}
                <Card className="p-4 mb-6">
                    <div className="flex flex-col sm:flex-row gap-3">
                        <Input
                            placeholder="Search by name or email..."
                            value={searchTerm}
                            onChange={(e) => setSearchTerm(e.target.value)}
                            className="flex-1"
                        />
                        <div className="flex items-center gap-2">
                            <span className="text-sm text-gray-600">Total: {filteredStudents.length}</span>
                        </div>

                    </div>
                </Card>

                {/* Students Table */}
                <Card className="overflow-hidden">
                    <div className="overflow-x-auto">
                        <table className="w-full">
                            <thead className="bg-gray-50 border-b border-gray-200">
                                <tr>
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
                                        return (
                                            <tr key={student.id} className="hover:bg-gray-50">
                                                <td className="px-6 py-4 whitespace-nowrap">
                                                    <div className="flex items-center">
                                                        <div className="w-10 h-10 rounded-full bg-blue-100 flex items-center justify-center text-blue-700 font-bold mr-3">
                                                            {student.name.charAt(0).toUpperCase()}
                                                        </div>
                                                        <div>
                                                            <div className="text-sm font-medium text-gray-900">{student.name}</div>
                                                            <div className="text-sm text-gray-500">{student.email}</div>
                                                        </div>
                                                    </div>
                                                </td>
                                                <td className="px-6 py-4 whitespace-nowrap">
                                                    <span className="text-sm text-gray-900">{stats.enrolledCourses}</span>
                                                </td>
                                                <td className="px-6 py-4 whitespace-nowrap">
                                                    <span className="text-sm text-gray-900">{stats.totalAttempts}</span>
                                                </td>
                                                <td className="px-6 py-4 whitespace-nowrap">
                                                    <span
                                                        className={`px-2 py-1 inline-flex text-xs leading-5 font-semibold rounded-full ${stats.avgPercentage >= 80
                                                                ? 'bg-emerald-100 text-emerald-800'
                                                                : stats.avgPercentage >= 60
                                                                    ? 'bg-yellow-100 text-yellow-800'
                                                                    : 'bg-red-100 text-red-800'
                                                            }`}
                                                    >
                                                        {stats.avgPercentage}%
                                                    </span>
                                                </td>
                                                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                                                    {student.createdAt ? formatDate(student.createdAt) : 'N/A'}
                                                </td>
                                                <td className="px-6 py-4 whitespace-nowrap text-sm font-medium">
                                                    <Button
                                                        variant="outline"
                                                        size="sm"
                                                        onClick={() => navigate(`/admin/users/${student.id}`)}
                                                    >
                                                        View Details
                                                    </Button>
                                                </td>
                                            </tr>
                                        );
                                    })
                                ) : (
                                    <tr>
                                        <td colSpan="6" className="px-6 py-12 text-center text-gray-500">
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