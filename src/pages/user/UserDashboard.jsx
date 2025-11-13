import React from "react";
import { useNavigate } from "react-router-dom";
import { useSelector } from "react-redux";
import UserLayout from "@/shared/components/layout/UserLayout";
import Card from "@/shared/components/ui/Card";
import Button from "@/shared/components/ui/Button";

const UserDashboardPage = () => {
    const navigate = useNavigate();
    const { user } = useSelector((state) => state.auth);
    const courses = useSelector((state) => state.courses.courses);
    const enrollments = useSelector((state) => state.enrollments.enrollments);

    const myEnrollments = enrollments.filter((e) => e.userId === user?.id);

    const totalEnrolled = myEnrollments.length;
    const totalAttempts = myEnrollments.reduce(
        (sum, e) => sum + e.attempts.length,
        0
    );

    let totalScore = 0;
    let totalMarks = 0;
    myEnrollments.forEach((enrollment) => {
        enrollment.attempts.forEach((attempt) => {
            totalScore += attempt.score || 0;
            totalMarks += attempt.totalMarks || 1;
        });
    });
    const avgPercentage =
        totalMarks > 0 ? ((totalScore / totalMarks) * 100).toFixed(1) : 0;

    const recentEnrollments = [...myEnrollments]
        .sort((a, b) => new Date(b.enrolledAt) - new Date(a.enrolledAt))
        .slice(0, 3);

    const recentAttempts = [];
    myEnrollments.forEach((enrollment) => {
        enrollment.attempts.forEach((attempt) => {
            recentAttempts.push({
                ...attempt,
                courseId: enrollment.courseId,
                enrollmentId: enrollment.id,
            });
        });
    });
    recentAttempts.sort(
        (a, b) => new Date(b.submittedAt) - new Date(a.submittedAt)
    );
    const lastAttempts = recentAttempts.slice(0, 5);

    const bestScore = recentAttempts.reduce((max, attempt) => {
        const percentage = (attempt.score / attempt.totalMarks) * 100;
        return percentage > max ? percentage : max;
    }, 0);

    const availableCourses = courses.filter(
        (course) => !myEnrollments.some((e) => e.courseId === course.id)
    );

    const formatDate = (dateString) => {
        return new Date(dateString).toLocaleDateString("en-US", {
            month: "short",
            day: "numeric",
            year: "numeric",
        });
    };

    const getCourseName = (courseId) => {
        const course = courses.find((c) => c.id === courseId);
        return course ? course.title : "Unknown Course";
    };

    return (
        <UserLayout>
            <div className="px-6 py-4">
                {/* Welcome Header */}
                <div className="mb-8">
                    <h1 className="text-3xl font-bold text-gray-900 mb-2">
                        Welcome, {user?.name}! 👋
                    </h1>
                    <p className="text-gray-600">
                        Here's your learning progress overview
                    </p>
                </div>

                {/* Stats Grid */}
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
                    <Card className="p-6 bg-gradient-to-br from-blue-50 to-blue-100 border-blue-200">
                        <div className="flex items-center justify-between mb-2">
                            <p className="text-blue-700 text-sm font-medium">
                                Enrolled Courses
                            </p>
                            <span className="text-3xl">📚</span>
                        </div>
                        <p className="text-4xl font-bold text-blue-900">{totalEnrolled}</p>
                        <p className="text-xs text-blue-600 mt-1">Active learning paths</p>
                    </Card>

                    <Card className="p-6">
                        <div className="flex items-center justify-between mb-2">
                            <h3 className="text-sm font-medium text-gray-600">
                                Total Attempts
                            </h3>
                            <svg
                                className="w-8 h-8 text-purple-600"
                                fill="none"
                                stroke="currentColor"
                                viewBox="0 0 24 24"
                            >
                                <path
                                    strokeLinecap="round"
                                    strokeLinejoin="round"
                                    strokeWidth={2}
                                    d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2"
                                />
                            </svg>
                        </div>
                        <p className="text-3xl font-bold text-gray-900">{totalAttempts}</p>
                        <p className="text-xs text-gray-500 mt-1">Exams taken</p>
                    </Card>

                    <Card className="p-6 bg-gradient-to-br from-purple-50 to-purple-100 border-purple-200">
                        <div className="flex items-center justify-between mb-2">
                            <p className="text-purple-700 text-sm font-medium">
                                Average Score
                            </p>
                            <span className="text-3xl">📊</span>
                        </div>
                        <p className="text-4xl font-bold text-purple-900">
                            {avgPercentage}%
                        </p>
                        <p className="text-xs text-purple-600 mt-1">Overall performance</p>
                    </Card>

                    <Card className="p-6 bg-gradient-to-br from-yellow-50 to-yellow-100 border-yellow-200">
                        <div className="flex items-center justify-between mb-2">
                            <p className="text-yellow-700 text-sm font-medium">Best Score</p>
                            <span className="text-3xl">🏆</span>
                        </div>
                        <p className="text-4xl font-bold text-yellow-900">
                            {bestScore.toFixed(0)}%
                        </p>
                        <p className="text-xs text-yellow-600 mt-1">Highest achievement</p>
                    </Card>
                </div>

                {/* Quick Actions */}
                <Card className="p-6 mb-8">
                    <h2 className="text-xl font-bold text-gray-900 mb-4">
                        Quick Actions
                    </h2>
                    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3">
                        <Button
                            variant="primary"
                            fullWidth
                            onClick={() => navigate("/user/courses")}
                            className="flex items-center justify-center gap-2"
                        >
                            <span>🔍</span> Browse Courses
                        </Button>
                        <Button
                            variant="secondary"
                            fullWidth
                            onClick={() => navigate("/user/my-courses")}
                            className="flex items-center justify-center gap-2"
                        >
                            <span>📚</span> My Courses
                        </Button>
                        <Button
                            variant="secondary"
                            fullWidth
                            onClick={() => navigate("/user/history")}
                            className="flex items-center justify-center gap-2"
                        >
                            <span>📜</span> View History
                        </Button>
                        <Button
                            variant="outline"
                            fullWidth
                            onClick={() => navigate("/user/profile")}
                            className="flex items-center justify-center gap-2"
                        >
                            <span>⚙️</span> Profile
                        </Button>
                    </div>
                </Card>

                <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                    {/* Recent Enrollments */}
                    <Card className="p-6">
                        <div className="flex items-center justify-between mb-4">
                            <h2 className="text-xl font-bold text-gray-900">
                                Recent Enrollments
                            </h2>
                            <Button
                                variant="outline"
                                size="sm"
                                onClick={() => navigate("/user/my-courses")}
                            >
                                View All
                            </Button>
                        </div>

                        {recentEnrollments.length > 0 ? (
                            <div className="space-y-3">
                                {recentEnrollments.map((enrollment) => {
                                    const course = courses.find(
                                        (c) => c.id === enrollment.courseId
                                    );
                                    return (
                                        <div
                                            key={enrollment.id}
                                            className="flex items-center justify-between p-4 bg-gray-50 rounded-lg hover:bg-gray-100 transition-colors cursor-pointer"
                                            onClick={() =>
                                                navigate(`/user/courses/${enrollment.courseId}`)
                                            }
                                        >
                                            <div className="flex-1">
                                                <h3 className="font-semibold text-gray-900">
                                                    {course?.title}
                                                </h3>
                                                <p className="text-sm text-gray-600">
                                                    Enrolled: {formatDate(enrollment.enrolledAt)}
                                                </p>
                                                <p className="text-xs text-gray-500 mt-1">
                                                    {enrollment.attempts.length} attempt
                                                    {enrollment.attempts.length !== 1 ? "s" : ""}
                                                </p>
                                            </div>
                                            <span className="text-2xl ml-4">
                                                {course?.domain === "Programming" ? "💻" : "📖"}
                                            </span>
                                        </div>
                                    );
                                })}
                            </div>
                        ) : (
                            <div className="text-center py-8">
                                <p className="text-gray-500 mb-4">No enrollments yet</p>
                                <Button
                                    variant="primary"
                                    size="sm"
                                    onClick={() => navigate("/user/courses")}
                                >
                                    Browse Courses
                                </Button>
                            </div>
                        )}
                    </Card>

                    {/* Recent Activity */}
                    <Card className="p-6">
                        <div className="flex items-center justify-between mb-4">
                            <h2 className="text-xl font-bold text-gray-900">
                                Recent Activity
                            </h2>
                            <Button
                                variant="outline"
                                size="sm"
                                onClick={() => navigate("/user/history")}
                            >
                                View All
                            </Button>
                        </div>

                        {lastAttempts.length > 0 ? (
                            <div className="space-y-3">
                                {lastAttempts.map((attempt, idx) => {
                                    const percentage = (
                                        (attempt.score / attempt.totalMarks) *
                                        100
                                    ).toFixed(0);
                                    return (
                                        <div
                                            key={idx}
                                            className="flex items-center justify-between p-4 bg-gray-50 rounded-lg hover:bg-gray-100 transition-colors"
                                        >
                                            <div className="flex-1">
                                                <h3 className="font-semibold text-gray-900 text-sm">
                                                    {getCourseName(attempt.courseId)}
                                                </h3>
                                                <p className="text-xs text-gray-600">
                                                    {formatDate(attempt.submittedAt)}
                                                </p>
                                            </div>
                                            <div className="text-right ml-4">
                                                <p className="font-bold text-lg text-gray-900">
                                                    {attempt.score}/{attempt.totalMarks}
                                                </p>
                                                <span
                                                    className={`text-xs font-semibold px-2 py-1 rounded ${percentage >= 80
                                                            ? "bg-emerald-100 text-emerald-700"
                                                            : percentage >= 60
                                                                ? "bg-yellow-100 text-yellow-700"
                                                                : "bg-red-100 text-red-700"
                                                        }`}
                                                >
                                                    {percentage}%
                                                </span>
                                            </div>
                                        </div>
                                    );
                                })}
                            </div>
                        ) : (
                            <div className="text-center py-8">
                                <p className="text-gray-500 mb-4">No exam attempts yet</p>
                                <Button
                                    variant="primary"
                                    size="sm"
                                    onClick={() => navigate("/user/my-courses")}
                                >
                                    Take an Exam
                                </Button>
                            </div>
                        )}
                    </Card>
                </div>

                {/* Available Courses */}
                {availableCourses.length > 0 && (
                    <Card className="p-6 mt-6">
                        <div className="flex justify-between mb-3">
                            <h2 className="text-xl font-bold text-gray-900 mb-4">
                                Recommended for You
                            </h2>

                            <div>
                                <Button
                                    variant="outline"
                                    fullWidth
                                    className="mt-4"
                                    onClick={() => navigate("/user/courses")}
                                >
                                    View All Courses
                                </Button>
                            </div>
                        </div>
                        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 mb-4">
                            {availableCourses.slice(0, 3).map((course) => (
                                <div
                                    key={course.id}
                                    className="p-4 border-2 border-gray-200 rounded-lg hover:border-blue-500 transition-colors cursor-pointer hover:bg-blue-100"
                                    onClick={() => navigate(`/user/courses/${course.id}`)}
                                >
                                    <h3 className="font-semibold text-gray-900 mb-2">
                                        {course.title}
                                    </h3>
                                    <p className="text-sm text-gray-600 mb-3 line-clamp-2">
                                        {course.description}
                                    </p>
                                    <div className="flex items-center gap-2">
                                        <span className="text-xs px-2 py-1 bg-blue-100 text-blue-700 rounded">
                                            {course.domain}
                                        </span>
                                        <span className="text-xs px-2 py-1 bg-gray-100 text-gray-700 rounded capitalize">
                                            {course.difficulty}
                                        </span>
                                    </div>
                                </div>
                            ))}
                        </div>
                    </Card>
                )}
            </div>
        </UserLayout>
    );
};

export default UserDashboardPage;
