import React from 'react';
import { useSelector } from 'react-redux';
import { useNavigate } from 'react-router-dom';
import AdminLayout from '@/shared/components/layout/AdminLayout';
import Card from '@/shared/components/ui/Card';

const AdminDashboardPage = () => {
    const { courses } = useSelector((state) => state.courses);
    const navigate = useNavigate();

    const stats = [
        {
            label: 'Total Courses',
            value: courses.length,
            icon: (
                <svg className="w-6 h-6 sm:w-8 sm:h-8" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 6.253v13m0-13C10.832 5.477 9.246 5 7.5 5S4.168 5.477 3 6.253v13C4.168 18.477 5.754 18 7.5 18s3.332.477 4.5 1.253m0-13C13.168 5.477 14.754 5 16.5 5c1.747 0 3.332.477 4.5 1.253v13C19.832 18.477 18.247 18 16.5 18c-1.746 0-3.332.477-4.5 1.253" />
                </svg>
            ),
            color: 'bg-blue-500',
            textColor: 'text-blue-600',
            bgColor: 'bg-blue-50',
        },
        {
            label: 'Active Courses',
            value: courses.filter((c) => c.isActive).length,
            icon: (
                <svg className="w-6 h-6 sm:w-8 sm:h-8" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
                </svg>
            ),
            color: 'bg-emerald-500',
            textColor: 'text-emerald-600',
            bgColor: 'bg-emerald-50',
        },
        {
            label: 'Total Questions',
            value: courses.reduce((sum, c) => sum + c.totalQuestions, 0),
            icon: (
                <svg className="w-6 h-6 sm:w-8 sm:h-8" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8.228 9c.549-1.165 2.03-2 3.772-2 2.21 0 4 1.343 4 3 0 1.4-1.278 2.575-3.006 2.907-.542.104-.994.54-.994 1.093m0 3h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                </svg>
            ),
            color: 'bg-yellow-500',
            textColor: 'text-yellow-600',
            bgColor: 'bg-yellow-50',
        },
        {
            label: 'Free Courses',
            value: courses.filter((c) => c.price === 0).length,
            icon: (
                <svg className="w-6 h-6 sm:w-8 sm:h-8" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8c-1.657 0-3 .895-3 2s1.343 2 3 2 3 .895 3 2-1.343 2-3 2m0-8c1.11 0 2.08.402 2.599 1M12 8V7m0 1v8m0 0v1m0-1c-1.11 0-2.08-.402-2.599-1M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                </svg>
            ),
            color: 'bg-purple-500',
            textColor: 'text-purple-600',
            bgColor: 'bg-purple-50',
        },
    ];

    return (
        <AdminLayout>
            <div className="space-y-6 sm:space-y-8">
                {/* Header */}
                <div>
                    <h2 className="text-2xl sm:text-3xl font-bold text-gray-900">Dashboard Overview</h2>
                    <p className="text-gray-600 mt-2 text-sm sm:text-base">Welcome back! Here's what's happening today.</p>
                </div>

                {/* Stats Grid - Responsive */}
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 sm:gap-6">
                    {stats.map((stat, index) => (
                        <Card key={index} className="p-4 sm:p-6">
                            <div className="flex items-center justify-between">
                                <div>
                                    <p className="text-xs sm:text-sm text-gray-600 mb-1">{stat.label}</p>
                                    <p className="text-2xl sm:text-3xl font-bold text-gray-900">{stat.value}</p>
                                </div>
                                <div className={`${stat.bgColor} p-3 sm:p-4 rounded-xl`}>
                                    <div className={stat.textColor}>{stat.icon}</div>
                                </div>
                            </div>
                        </Card>
                    ))}
                </div>

                {/* Recent Courses - Responsive Table */}
                <Card className="p-4 sm:p-6">
                    <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between mb-4 sm:mb-6 gap-3">
                        <h3 className="text-lg sm:text-xl font-bold text-gray-900">Recent Courses</h3>
                        <button
                            onClick={() => navigate('/admin/courses')}
                            className="text-blue-600 hover:text-blue-700 font-medium text-sm self-start sm:self-auto"
                        >
                            View All →
                        </button>
                    </div>

                    {/* Mobile: Card View */}
                    <div className="block sm:hidden space-y-4">
                        {courses.slice(0, 5).map((course) => (
                            <Card key={course.id} className="p-4">
                                <h4 className="font-semibold text-gray-900 mb-2">{course.title}</h4>
                                <p className="text-sm text-gray-600 mb-3">{course.description.substring(0, 80)}...</p>
                                <div className="flex flex-wrap gap-2">
                                    <span className="text-xs px-2 py-1 bg-gray-100 text-gray-700 rounded">{course.domain}</span>
                                    <span
                                        className={`text-xs px-2 py-1 rounded ${course.difficulty === 'easy'
                                                ? 'bg-emerald-100 text-emerald-700'
                                                : course.difficulty === 'medium'
                                                    ? 'bg-yellow-100 text-yellow-700'
                                                    : 'bg-red-100 text-red-700'
                                            }`}
                                    >
                                        {course.difficulty}
                                    </span>
                                    <span className="text-xs px-2 py-1 bg-gray-100 text-gray-700 rounded">
                                        {course.totalQuestions} Qs
                                    </span>
                                    <span
                                        className={`text-xs px-2 py-1 rounded ${course.isActive
                                                ? 'bg-emerald-100 text-emerald-700'
                                                : 'bg-gray-100 text-gray-700'
                                            }`}
                                    >
                                        {course.isActive ? 'Active' : 'Inactive'}
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
                                    <th className="text-left py-3 px-4 text-sm font-medium text-gray-700">Course</th>
                                    <th className="text-left py-3 px-4 text-sm font-medium text-gray-700">Domain</th>
                                    <th className="text-left py-3 px-4 text-sm font-medium text-gray-700">Difficulty</th>
                                    <th className="text-left py-3 px-4 text-sm font-medium text-gray-700">Questions</th>
                                    <th className="text-left py-3 px-4 text-sm font-medium text-gray-700">Status</th>
                                </tr>
                            </thead>
                            <tbody>
                                {courses.slice(0, 5).map((course) => (
                                    <tr key={course.id} className="border-b border-gray-100 hover:bg-gray-50">
                                        <td className="py-4 px-4">
                                            <div>
                                                <p className="font-medium text-gray-900">{course.title}</p>
                                                <p className="text-sm text-gray-500 mt-1">{course.description.substring(0, 50)}...</p>
                                            </div>
                                        </td>
                                        <td className="py-4 px-4 text-gray-600">{course.domain}</td>
                                        <td className="py-4 px-4">
                                            <span
                                                className={`px-3 py-1 rounded-full text-xs font-medium ${course.difficulty === 'easy'
                                                        ? 'bg-emerald-100 text-emerald-700'
                                                        : course.difficulty === 'medium'
                                                            ? 'bg-yellow-100 text-yellow-700'
                                                            : 'bg-red-100 text-red-700'
                                                    }`}
                                            >
                                                {course.difficulty}
                                            </span>
                                        </td>
                                        <td className="py-4 px-4 text-gray-600">{course.totalQuestions}</td>
                                        <td className="py-4 px-4">
                                            <span
                                                className={`px-3 py-1 rounded-full text-xs font-medium ${course.isActive
                                                        ? 'bg-emerald-100 text-emerald-700'
                                                        : 'bg-gray-100 text-gray-700'
                                                    }`}
                                            >
                                                {course.isActive ? 'Active' : 'Inactive'}
                                            </span>
                                        </td>
                                    </tr>
                                ))}
                            </tbody>
                        </table>
                    </div>
                </Card>
            </div>
        </AdminLayout>
    );
};

export default AdminDashboardPage;
