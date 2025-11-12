import React from 'react';
import { useSelector } from 'react-redux';
import { useNavigate } from 'react-router-dom';
import UserLayout from '@/shared/components/layout/UserLayout';
import Card from '@/shared/components/ui/Card';
import Button from '@/shared/components/ui/Button';

const MyCoursesPage = () => {
    const navigate = useNavigate();
    const { user } = useSelector((state) => state.auth);
    const enrollments = useSelector((state) => state.enrollments.enrollments);
    const courses = useSelector((state) => state.courses.courses);

    // Get enrolled courses for current user
    const userEnrollments = enrollments.filter((e) => e.userId === user?.id);

    // Map enrollments to course data
    const enrolledCourses = userEnrollments.map((enrollment) => {
        const course = courses.find((c) => c.id === enrollment.courseId);
        const attemptCount = enrollment.attempts.length;
        const lastAttempt = enrollment.attempts[enrollment.attempts.length - 1];
        const bestScore = enrollment.attempts.reduce((max, attempt) =>
            Math.max(max, attempt.score || 0), 0
        );

        return {
            ...course,
            enrollmentId: enrollment.id,
            enrolledAt: enrollment.enrolledAt,
            attemptCount,
            lastAttempt,
            bestScore,
            remainingAttempts: course?.attemptLimit - attemptCount,
        };
    });

    const formatDate = (dateString) => {
        const date = new Date(dateString);
        return date.toLocaleDateString('en-US', {
            year: 'numeric',
            month: 'short',
            day: 'numeric',
        });
    };

    const getProgressPercentage = (bestScore) => {
        // Assuming max score is totalQuestions * 1 (1 mark per question)
        // This is a simplified calculation
        return Math.min(100, (bestScore / 10) * 10); // Placeholder calculation
    };

    return (
        <UserLayout>
            <div>
                <div className="flex items-center justify-between mb-6">
                    <div>
                        <h1 className="text-3xl font-bold text-gray-900 mb-2">My Courses</h1>
                        <p className="text-gray-600">Track your enrolled courses and progress</p>
                    </div>
                    <Button variant="primary" onClick={() => navigate('/user/courses')}>
                        Browse More
                    </Button>
                </div>

                {enrolledCourses.length > 0 ? (
                    <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                        {enrolledCourses.map((course) => (
                            <Card key={course.enrollmentId} className="p-6 hover:shadow-lg transition-shadow">
                                <div className="flex flex-col h-full">
                                    {/* Course Header */}
                                    <div className="flex items-start justify-between mb-3">
                                        <div className="flex-1">
                                            <h2 className="text-xl font-bold text-gray-900 mb-1">{course?.title}</h2>
                                            <p className="text-sm text-gray-600">{course?.domain}</p>
                                        </div>
                                        <span
                                            className={`px-3 py-1 rounded text-xs font-semibold flex-shrink-0 ${course?.difficulty === 'easy'
                                                    ? 'bg-emerald-100 text-emerald-700'
                                                    : course?.difficulty === 'medium'
                                                        ? 'bg-yellow-100 text-yellow-700'
                                                        : 'bg-red-100 text-red-700'
                                                }`}
                                        >
                                            {course?.difficulty}
                                        </span>
                                    </div>

                                    {/* Enrollment Info */}
                                    <div className="flex items-center gap-4 text-sm text-gray-600 mb-4">
                                        <span>📅 Enrolled: {formatDate(course.enrolledAt)}</span>
                                    </div>

                                    {/* Stats Grid */}
                                    <div className="grid grid-cols-3 gap-3 mb-4">
                                        <div className="bg-emerald-50 rounded-lg p-3 text-center">
                                            <p className="text-xs text-emerald-600 font-medium mb-1">Best Score</p>
                                            <p className="text-xl font-bold text-emerald-700">{course.bestScore || 0}</p>
                                        </div>
                                        <div className="bg-blue-50 rounded-lg p-3 text-center">
                                            <p className="text-xs text-blue-600 font-medium mb-1">Attempts</p>
                                            <p className="text-xl font-bold text-blue-700">{course.attemptCount}</p>
                                        </div>
                                        <div className="bg-purple-50 rounded-lg p-3 text-center">
                                            <p className="text-xs text-purple-600 font-medium mb-1">Remaining</p>
                                            <p className="text-xl font-bold text-purple-700">
                                                {course.remainingAttempts > 0 ? course.remainingAttempts : 0}
                                            </p>
                                        </div>
                                    </div>

                                    {/* Last Attempt */}
                                    {course.lastAttempt && (
                                        <div className="bg-gray-50 rounded-lg p-3 mb-4">
                                            <p className="text-xs text-gray-500 mb-1">Last Attempt</p>
                                            <div className="flex items-center justify-between">
                                                <span className="text-sm font-semibold text-gray-900">
                                                    Score: {course.lastAttempt.score || 0}
                                                </span>
                                                <span className="text-xs text-gray-600">
                                                    {formatDate(course.lastAttempt.submittedAt)}
                                                </span>
                                            </div>
                                        </div>
                                    )}

                                    {/* Progress Bar */}
                                    <div className="mb-4">
                                        <div className="flex items-center justify-between text-xs text-gray-600 mb-1">
                                            <span>Progress</span>
                                            <span>{getProgressPercentage(course.bestScore)}%</span>
                                        </div>
                                        <div className="w-full bg-gray-200 rounded-full h-2">
                                            <div
                                                className="bg-emerald-500 h-2 rounded-full transition-all"
                                                style={{ width: `${getProgressPercentage(course.bestScore)}%` }}
                                            />
                                        </div>
                                    </div>

                                    {/* Action Buttons */}
                                    <div className="flex gap-2 mt-auto">
                                        <Button
                                            variant="outline"
                                            size="sm"
                                            fullWidth
                                            onClick={() => navigate(`/user/courses/${course.id}`)}
                                        >
                                            View Details
                                        </Button>
                                        {course.remainingAttempts > 0 ? (
                                            <Button
                                                variant="primary"
                                                size="sm"
                                                fullWidth
                                                onClick={() => navigate(`/user/exam/${course.id}`)}
                                            >
                                                Take Exam
                                            </Button>
                                        ) : (
                                            <Button variant="secondary" size="sm" fullWidth disabled>
                                                No Attempts Left
                                            </Button>
                                        )}
                                    </div>
                                </div>
                            </Card>
                        ))}
                    </div>
                ) : (
                    <Card className="p-12 text-center">
                        <div className="flex flex-col items-center gap-4">
                            <svg
                                className="w-20 h-20 text-gray-300"
                                fill="none"
                                stroke="currentColor"
                                viewBox="0 0 24 24"
                            >
                                <path
                                    strokeLinecap="round"
                                    strokeLinejoin="round"
                                    strokeWidth={2}
                                    d="M12 6.253v13m0-13C10.832 5.477 9.246 5 7.5 5S4.168 5.477 3 6.253v13C4.168 18.477 5.754 18 7.5 18s3.332.477 4.5 1.253m0-13C13.168 5.477 14.754 5 16.5 5c1.747 0 3.332.477 4.5 1.253v13C19.832 18.477 18.247 18 16.5 18c-1.746 0-3.332.477-4.5 1.253"
                                />
                            </svg>
                            <div>
                                <p className="text-lg font-semibold text-gray-900 mb-2">No Enrolled Courses</p>
                                <p className="text-gray-500 mb-4">
                                    Browse available courses and enroll to start learning
                                </p>
                                <Button variant="primary" onClick={() => navigate('/user/courses')}>
                                    Enroll now
                                </Button>
                            </div>
                        </div>
                    </Card>
                )}
            </div>
        </UserLayout>
    );
};

export default MyCoursesPage;
