import React, { useState } from 'react';
import { useSelector } from 'react-redux';
import AdminLayout from '@/shared/components/layout/AdminLayout';
import Card from '@/shared/components/ui/Card';
import Button from '@/shared/components/ui/Button';
import { exportToCSV } from '@/shared/utils/exportToCSV';
import { toast } from 'react-toastify';

const AdminReportsPage = () => {
    const courses = useSelector((state) => state.courses.courses);
    const enrollments = useSelector((state) => state.enrollments.enrollments);
    const questions = useSelector((state) => state.questions.questions);
    const users = useSelector((state) => state.auth.users || []);

    const [selectedCourse, setSelectedCourse] = useState('all');

    const recentAttempts = [];

    enrollments.forEach((enrollment) => {
        enrollment.attempts.forEach((attempt) => {
            recentAttempts.push({
                ...attempt,
                userId: enrollment.userId,
                courseId: enrollment.courseId,
            });
        });
    });

    // Sort by most recent first and take last 20
    recentAttempts.sort((a, b) => new Date(b.submittedAt) - new Date(a.submittedAt));
    const limitedRecentAttempts = recentAttempts.slice(0, 20);

    // Calculate overall stats
    const totalStudents = users.filter((u) => u.role === 'user').length;
    const totalCourses = courses.length;
    const totalEnrollments = enrollments.length;
    const totalAttempts = enrollments.reduce((sum, e) => sum + e.attempts.length, 0);

    // Course-wise analytics
    const getCourseAnalytics = () => {
        return courses.map((course) => {
            const courseEnrollments = enrollments.filter((e) => e.courseId === course.id);
            const enrolledStudents = courseEnrollments.length;

            let totalAttempts = 0;
            let totalScore = 0;
            let totalMarks = 0;
            let completedAttempts = 0;

            courseEnrollments.forEach((enrollment) => {
                totalAttempts += enrollment.attempts.length;
                enrollment.attempts.forEach((attempt) => {
                    if (attempt.status === 'completed') {
                        completedAttempts++;
                        totalScore += attempt.score || 0;
                        totalMarks += attempt.totalMarks || 1;
                    }
                });
            });

            const avgScore = totalMarks > 0 ? (totalScore / totalMarks * 100).toFixed(1) : 0;
            const completionRate = totalAttempts > 0 ? ((completedAttempts / totalAttempts) * 100).toFixed(1) : 0;

            return {
                id: course.id,
                title: course.title,
                difficulty: course.difficulty,
                enrolledStudents,
                totalAttempts,
                completedAttempts,
                avgScore,
                completionRate,
                price: course.price,
            };
        });
    };

    const courseAnalytics = getCourseAnalytics();

    // Filter by selected course
    const filteredAnalytics = selectedCourse === 'all'
        ? courseAnalytics
        : courseAnalytics.filter(c => c.id === Number(selectedCourse));

    // Calculate difficulty-wise distribution
    const difficultyStats = {
        easy: courseAnalytics.filter(c => c.difficulty === 'easy').length,
        medium: courseAnalytics.filter(c => c.difficulty === 'medium').length,
        hard: courseAnalytics.filter(c => c.difficulty === 'hard').length,
    };

    // Top performing courses
    const topCourses = [...courseAnalytics]
        .sort((a, b) => parseFloat(b.avgScore) - parseFloat(a.avgScore))
        .slice(0, 5);

    // Most enrolled courses
    const mostEnrolled = [...courseAnalytics]
        .sort((a, b) => b.enrolledStudents - a.enrolledStudents)
        .slice(0, 5);

    const exportCoursePerformance = () => {
        const data = courseAnalytics.map((course) => ({
            'Course Title': course.title,
            'Difficulty': course.difficulty,
            'Enrolled Students': course.enrolledStudents,
            'Total Attempts': course.totalAttempts,
            'Completed Attempts': course.completedAttempts,
            'Average Score (%)': course.avgScore,
            'Completion Rate (%)': course.completionRate,
            'Price (₹)': course.price,
        }));

        exportToCSV(data, `course-performance-${new Date().toISOString().split('T')[0]}.csv`);
        toast.success('Course performance data exported successfully!');
    };

    const exportStudentPerformance = () => {
        const students = users.filter((u) => u.role === 'user');

        const data = students.map((student) => {
            const userEnrollments = enrollments.filter((e) => e.userId === student.id);
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
                'Student Name': student.name,
                'Email': student.email,
                'Enrolled Courses': userEnrollments.length,
                'Total Attempts': totalAttempts,
                'Total Score': totalScore,
                'Total Marks': totalMarks,
                'Average Score (%)': avgPercentage,
                'Joined Date': student.createdAt ? new Date(student.createdAt).toLocaleDateString() : 'N/A',
            };
        });

        exportToCSV(data, `student-performance-${new Date().toISOString().split('T')[0]}.csv`);
        toast.success('Student performance data exported successfully!');
    };

    const exportDetailedAttempts = () => {
        const data = [];

        enrollments.forEach((enrollment) => {
            const user = users.find((u) => u.id === enrollment.userId);
            const course = courses.find((c) => c.id === enrollment.courseId);

            enrollment.attempts.forEach((attempt) => {
                data.push({
                    'Student Name': user?.name || 'Unknown',
                    'Student Email': user?.email || 'Unknown',
                    'Course Title': course?.title || 'Unknown',
                    'Attempt Date': new Date(attempt.submittedAt).toLocaleString(),
                    'Score': attempt.score,
                    'Total Marks': attempt.totalMarks,
                    'Percentage': attempt.percentage,
                    'Total Questions': attempt.totalQuestions,
                    'Answered Questions': attempt.answeredQuestions,
                    'Status': attempt.status,
                    // ADD THESE LINES:
                    'Violation Count': attempt.violationCount || 0,
                    'Auto Submitted': attempt.autoSubmitted ? 'Yes' : 'No',
                    'Submission Reason': attempt.submissionReason || 'User submitted',
                    'Violations Details': attempt.violations
                        ? attempt.violations.map(v => v.description).join('; ')
                        : 'None',
                });
            });
        });

        exportToCSV(data, `detailed-attempts-${new Date().toISOString().split('T')[0]}.csv`);
        toast.success('Detailed attempts data exported successfully!');
    };


    return (
        <AdminLayout>
            <div>
                {/* Export report as CSV */}
                <div className="flex items-center justify-between mb-6">
                    <div>
                        <h1 className="text-3xl font-bold text-gray-900 mb-2">Analytics & Reports</h1>
                        <p className="text-gray-600">Comprehensive insights into course and student performance</p>
                    </div>
                    <div className="flex gap-3">
                        <Button variant="secondary" size="sm" onClick={exportCoursePerformance}>
                            📊 Export Courses
                        </Button>
                        <Button variant="secondary" size="sm" onClick={exportStudentPerformance}>
                            👥 Export Students
                        </Button>
                        <Button variant="secondary" size="sm" onClick={exportDetailedAttempts}>
                            📝 Export Attempts
                        </Button>
                    </div>
                </div>


                {/* Overall Stats Grid */}
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 mb-6">
                    <Card className="p-6">
                        <div className="flex items-center justify-between mb-2">
                            <p className="text-gray-600 text-sm">Total Students</p>
                            <svg className="w-8 h-8 text-blue-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4.354a4 4 0 110 5.292M15 21H3v-1a6 6 0 0112 0v1zm0 0h6v-1a6 6 0 00-9-5.197M13 7a4 4 0 11-8 0 4 4 0 018 0z" />
                            </svg>
                        </div>
                        <p className="text-3xl font-bold text-gray-900">{totalStudents}</p>
                        <p className="text-xs text-gray-500 mt-1">Registered users</p>
                    </Card>

                    <Card className="p-6">
                        <div className="flex items-center justify-between mb-2">
                            <p className="text-gray-600 text-sm">Total Courses</p>
                            <svg className="w-8 h-8 text-emerald-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 6.253v13m0-13C10.832 5.477 9.246 5 7.5 5S4.168 5.477 3 6.253v13C4.168 18.477 5.754 18 7.5 18s3.332.477 4.5 1.253m0-13C13.168 5.477 14.754 5 16.5 5c1.747 0 3.332.477 4.5 1.253v13C19.832 18.477 18.247 18 16.5 18c-1.746 0-3.332.477-4.5 1.253" />
                            </svg>
                        </div>
                        <p className="text-3xl font-bold text-gray-900">{totalCourses}</p>
                        <p className="text-xs text-gray-500 mt-1">Active courses</p>
                    </Card>

                    <Card className="p-6">
                        <div className="flex items-center justify-between mb-2">
                            <p className="text-gray-600 text-sm">Total Enrollments</p>
                            <svg className="w-8 h-8 text-purple-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2" />
                            </svg>
                        </div>
                        <p className="text-3xl font-bold text-gray-900">{totalEnrollments}</p>
                        <p className="text-xs text-gray-500 mt-1">Course enrollments</p>
                    </Card>

                    <Card className="p-6">
                        <div className="flex items-center justify-between mb-2">
                            <p className="text-gray-600 text-sm">Total Attempts</p>
                            <svg className="w-8 h-8 text-yellow-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
                            </svg>
                        </div>
                        <p className="text-3xl font-bold text-gray-900">{totalAttempts}</p>
                        <p className="text-xs text-gray-500 mt-1">Exam attempts</p>
                    </Card>
                </div>

                {/* Difficulty Distribution */}
                <Card className="p-6 mb-6">
                    <h2 className="text-xl font-bold text-gray-900 mb-4">Course Difficulty Distribution</h2>
                    <div className="grid grid-cols-3 gap-4">
                        <div className="bg-emerald-50 rounded-lg p-4 text-center">
                            <p className="text-emerald-600 text-sm font-medium mb-1">Easy</p>
                            <p className="text-3xl font-bold text-emerald-700">{difficultyStats.easy}</p>
                        </div>
                        <div className="bg-yellow-50 rounded-lg p-4 text-center">
                            <p className="text-yellow-600 text-sm font-medium mb-1">Medium</p>
                            <p className="text-3xl font-bold text-yellow-700">{difficultyStats.medium}</p>
                        </div>
                        <div className="bg-red-50 rounded-lg p-4 text-center">
                            <p className="text-red-600 text-sm font-medium mb-1">Hard</p>
                            <p className="text-3xl font-bold text-red-700">{difficultyStats.hard}</p>
                        </div>
                    </div>
                </Card>

                {/* Top Performing & Most Enrolled */}
                <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-6">
                    {/* Top Performing */}
                    <Card className="p-6">
                        <h2 className="text-xl font-bold text-gray-900 mb-4">Top Performing Courses</h2>
                        <div className="space-y-3">
                            {topCourses.map((course, idx) => (
                                <div key={course.id} className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
                                    <div className="flex items-center gap-3">
                                        <span className="w-8 h-8 rounded-full bg-blue-100 text-blue-700 flex items-center justify-center font-bold text-sm">
                                            {idx + 1}
                                        </span>
                                        <div>
                                            <p className="font-semibold text-gray-900 text-sm">{course.title}</p>
                                            <p className="text-xs text-gray-500">{course.totalAttempts} attempts</p>
                                        </div>
                                    </div>
                                    <span className="px-3 py-1 bg-emerald-100 text-emerald-700 rounded-full text-sm font-semibold">
                                        {course.avgScore}%
                                    </span>
                                </div>
                            ))}
                        </div>
                    </Card>

                    {/* Most Enrolled */}
                    <Card className="p-6">
                        <h2 className="text-xl font-bold text-gray-900 mb-4">Most Enrolled Courses</h2>
                        <div className="space-y-3">
                            {mostEnrolled.map((course, idx) => (
                                <div key={course.id} className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
                                    <div className="flex items-center gap-3">
                                        <span className="w-8 h-8 rounded-full bg-purple-100 text-purple-700 flex items-center justify-center font-bold text-sm">
                                            {idx + 1}
                                        </span>
                                        <div>
                                            <p className="font-semibold text-gray-900 text-sm">{course.title}</p>
                                            <p className="text-xs text-gray-500">{course.totalAttempts} attempts</p>
                                        </div>
                                    </div>
                                    <span className="px-3 py-1 bg-purple-100 text-purple-700 rounded-full text-sm font-semibold">
                                        {course.enrolledStudents} students
                                    </span>
                                </div>
                            ))}
                        </div>
                    </Card>
                </div>

                {/* Detailed Course Analytics Table */}
                <Card className="p-6">
                    <h2 className="text-xl font-bold text-gray-900 mb-4">Recent Exam Attempts</h2>

                    <div className="overflow-x-auto">
                        <table className="w-full">
                            <thead className="bg-gray-50 border-b border-gray-200">
                                <tr>
                                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Student</th>
                                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Course</th>
                                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Score</th>
                                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Date</th>
                                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Violations</th>
                                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Status</th>
                                </tr>
                            </thead>
                            <tbody className="bg-white divide-y divide-gray-200">
                                {recentAttempts.map((attempt, idx) => {
                                    const student = users.find((u) => u.id === attempt.userId);
                                    const course = courses.find((c) => c.id === attempt.courseId);

                                    return (
                                        <tr
                                            key={idx}
                                            className={attempt.violationCount > 0 ? 'bg-red-50' : 'hover:bg-gray-50'}
                                        >
                                            <td className="px-6 py-4 text-sm">
                                                <div className="font-medium text-gray-900">{student?.name || 'Unknown'}</div>
                                                <div className="text-gray-500">{student?.email || 'N/A'}</div>
                                            </td>
                                            <td className="px-6 py-4 text-sm text-gray-900">
                                                {course?.title || 'Unknown Course'}
                                            </td>
                                            <td className="px-6 py-4 text-sm">
                                                <div className="font-semibold text-gray-900">
                                                    {attempt.score}/{attempt.totalMarks}
                                                </div>
                                                <div className="text-gray-500 text-xs">
                                                    ({attempt.percentage}%)
                                                </div>
                                            </td>
                                            <td className="px-6 py-4 text-sm text-gray-500">
                                                {new Date(attempt.submittedAt).toLocaleDateString('en-US', {
                                                    year: 'numeric',
                                                    month: 'short',
                                                    day: 'numeric',
                                                })}
                                            </td>

                                            {/* Violations Column */}
                                            <td className="px-6 py-4 text-sm">
                                                {attempt.violationCount > 0 ? (
                                                    <div className="flex flex-col gap-1">
                                                        <span className="px-2 py-1 bg-red-100 text-red-700 rounded-full text-xs font-semibold inline-flex items-center gap-1 w-fit">
                                                            ⚠️ {attempt.violationCount}
                                                        </span>
                                                        {attempt.violations && (
                                                            <button
                                                                onClick={() => {
                                                                    const violationText = attempt.violations
                                                                        .map((v, i) => `${i + 1}. ${v.description}\n   at ${new Date(v.timestamp).toLocaleTimeString()}`)
                                                                        .join('\n\n');
                                                                    alert(`Proctoring Violations:\n\n${violationText}`);
                                                                }}
                                                                className="text-xs text-blue-600 hover:text-blue-800 underline text-left"
                                                            >
                                                                View Details
                                                            </button>
                                                        )}
                                                    </div>
                                                ) : (
                                                    <span className="text-gray-500">None</span>
                                                )}
                                            </td>

                                            {/* Status Column */}
                                            <td className="px-6 py-4 text-sm">
                                                {attempt.autoSubmitted ? (
                                                    <span className="px-2 py-1 bg-orange-100 text-orange-700 rounded-full text-xs font-semibold">
                                                        Auto-Submitted
                                                    </span>
                                                ) : (
                                                    <span className="px-2 py-1 bg-green-100 text-green-700 rounded-full text-xs font-semibold">
                                                        Normal
                                                    </span>
                                                )}
                                            </td>
                                        </tr>
                                    );
                                })}
                            </tbody>
                        </table>
                    </div>
                </Card>
            </div>
        </AdminLayout>
    );
};

export default AdminReportsPage;