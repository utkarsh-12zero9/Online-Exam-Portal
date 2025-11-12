import React from 'react';
import { useSelector } from 'react-redux';
import { useNavigate } from 'react-router-dom';
import UserLayout from '@/shared/components/layout/UserLayout';
import Card from '@/shared/components/ui/Card';
import Button from '@/shared/components/ui/Button';

const UserHistoryPage = () => {
    const navigate = useNavigate();
    const { user } = useSelector((state) => state.auth);
    const enrollments = useSelector((state) => state.enrollments.enrollments);
    const courses = useSelector((state) => state.courses.courses);

    // Get all attempts for current user
    const userEnrollments = enrollments.filter((e) => e.userId === user?.id);

    // Flatten all attempts with course info
    const allAttempts = userEnrollments.flatMap((enrollment) => {
        const course = courses.find((c) => c.id === enrollment.courseId);
        return (enrollment.attempts || []).map((attempt) => ({
            ...attempt,
            course,
            enrollmentId: enrollment.id,
        }));
    });

    // Sort by date (most recent first)
    const sortedAttempts = allAttempts.sort(
        (a, b) => new Date(b.submittedAt) - new Date(a.submittedAt)
    );

    const formatDate = (dateString) => {
        const date = new Date(dateString);
        return date.toLocaleDateString('en-US', {
            year: 'numeric',
            month: 'short',
            day: 'numeric',
            hour: '2-digit',
            minute: '2-digit',
        });
    };

    const getScoreColor = (score, total) => {
        if (total === 0) return 'text-gray-600';
        const percentage = (score / total) * 100;
        if (percentage >= 80) return 'text-emerald-600';
        if (percentage >= 60) return 'text-yellow-600';
        return 'text-red-600';
    };

    const getScoreBadge = (score, total) => {
        if (total === 0) return 'bg-gray-100 text-gray-700 border-gray-200';
        const percentage = (score / total) * 100;
        if (percentage >= 80)
            return 'bg-emerald-100 text-emerald-700 border-emerald-200';
        if (percentage >= 60)
            return 'bg-yellow-100 text-yellow-700 border-yellow-200';
        return 'bg-red-100 text-red-700 border-red-200';
    };

    return (
        <UserLayout>
            <div>
                <h1 className="text-3xl font-bold text-gray-900 mb-2">Attempt History</h1>
                <p className="text-gray-600 mb-6">View your past exam attempts and scores</p>

                {sortedAttempts.length > 0 ? (
                    <div className="grid grid-cols-1 gap-4">
                        {sortedAttempts.map((attempt, idx) => {
                            const totalMarks = attempt.totalMarks || (attempt.totalQuestions * 1) || 1;
                            const score = attempt.score || 0;
                            const percentage = totalMarks > 0
                                ? ((score / totalMarks) * 100).toFixed(1)
                                : '0.0';

                            return (
                                <Card key={idx} className="p-5 hover:shadow-lg transition-shadow">
                                    <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
                                        {/* Course Info */}
                                        <div className="flex-1">
                                            <div className="flex items-start gap-3 mb-2 flex-wrap">
                                                <h2 className="text-xl font-bold text-gray-900">
                                                    {attempt.course?.title || 'Unknown Course'}
                                                </h2>
                                                <span
                                                    className={`px-3 py-1 rounded border text-xs font-semibold ${getScoreBadge(
                                                        score,
                                                        totalMarks
                                                    )}`}
                                                >
                                                    {attempt.status === 'completed' ? 'Completed' : 'In Progress'}
                                                </span>

                                                {/* Violation Badge */}
                                                {attempt.violationCount > 0 && (
                                                    <span className="px-2 py-1 bg-red-100 text-red-700 rounded-full text-xs font-semibold flex items-center gap-1">
                                                        ⚠️ {attempt.violationCount} Violation{attempt.violationCount > 1 ? 's' : ''}
                                                    </span>
                                                )}

                                                {/* Auto-submitted Badge */}
                                                {attempt.autoSubmitted && (
                                                    <span className="px-2 py-1 bg-orange-100 text-orange-700 rounded-full text-xs font-semibold">
                                                        Auto-Submitted
                                                    </span>
                                                )}
                                            </div>

                                            <div className="grid grid-cols-2 sm:grid-cols-3 gap-3 text-sm text-gray-600">
                                                <div>
                                                    <span className="text-gray-500">Submitted:</span>
                                                    <p className="font-semibold text-gray-900">
                                                        {formatDate(attempt.submittedAt)}
                                                    </p>
                                                </div>
                                                <div>
                                                    <span className="text-gray-500">Questions:</span>
                                                    <p className="font-semibold text-gray-900">
                                                        {attempt.totalQuestions || 0}
                                                    </p>
                                                </div>
                                                <div>
                                                    <span className="text-gray-500">Answered:</span>
                                                    <p className="font-semibold text-gray-900">
                                                        {attempt.answeredQuestions || Object.keys(attempt.answers || {}).length}
                                                    </p>
                                                </div>
                                            </div>

                                            {/* Violation Details */}
                                            {attempt.violationCount > 0 && attempt.violations && (
                                                <div className="mt-4 p-3 bg-red-50 border border-red-200 rounded-lg">
                                                    <p className="text-xs font-semibold text-red-700 mb-2 flex items-center gap-2">
                                                        <span>⚠️</span>
                                                        <span>Proctoring Violations Detected:</span>
                                                    </p>
                                                    <div className="space-y-1">
                                                        {attempt.violations.slice(0, 3).map((violation, vIdx) => (
                                                            <div key={vIdx} className="text-xs text-red-600 flex items-start gap-2">
                                                                <span className="mt-0.5">•</span>
                                                                <span className="flex-1">{violation.description}</span>
                                                                <span className="text-red-500 text-xs">
                                                                    ({new Date(violation.timestamp).toLocaleTimeString()})
                                                                </span>
                                                            </div>
                                                        ))}
                                                        {attempt.violations.length > 3 && (
                                                            <p className="text-xs text-red-500 italic pl-4">
                                                                +{attempt.violations.length - 3} more violation{attempt.violations.length - 3 > 1 ? 's' : ''}
                                                            </p>
                                                        )}
                                                    </div>
                                                    {attempt.submissionReason && (
                                                        <p className="text-xs text-red-600 mt-2 font-semibold">
                                                            Reason: {attempt.submissionReason}
                                                        </p>
                                                    )}
                                                </div>
                                            )}
                                        </div>

                                        {/* Score Display */}
                                        <div className="flex flex-col items-start md:items-end gap-2">
                                            <div className="text-center md:text-right">
                                                <p className="text-sm text-gray-500 mb-1">Score</p>
                                                <p
                                                    className={`text-3xl font-bold ${getScoreColor(
                                                        score,
                                                        totalMarks
                                                    )}`}
                                                >
                                                    {score}/{totalMarks}
                                                </p>
                                                <p className="text-sm text-gray-600 mt-1">{percentage}%</p>
                                            </div>

                                            <div className="flex gap-2">
                                                <Button
                                                    variant="primary"
                                                    size="sm"
                                                    onClick={() => navigate(`/user/attempt/${attempt.id}`)}
                                                >
                                                    View Details
                                                </Button>
                                                <Button
                                                    variant="outline"
                                                    size="sm"
                                                    onClick={() => navigate(`/user/courses/${attempt.course?.id}`)}
                                                >
                                                    View Course
                                                </Button>
                                            </div>
                                        </div>
                                    </div>

                                    {/* Progress Bar */}
                                    <div className="mt-4">
                                        <div className="w-full bg-gray-200 rounded-full h-2">
                                            <div
                                                className={`h-2 rounded-full transition-all ${
                                                    percentage >= 80
                                                        ? 'bg-emerald-500'
                                                        : percentage >= 60
                                                        ? 'bg-yellow-500'
                                                        : 'bg-red-500'
                                                }`}
                                                style={{ width: `${Math.min(100, percentage)}%` }}
                                            />
                                        </div>
                                    </div>
                                </Card>
                            );
                        })}
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
                                    d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z"
                                />
                            </svg>
                            <div>
                                <p className="text-lg font-semibold text-gray-900 mb-2">
                                    No Exam Attempts Yet
                                </p>
                                <p className="text-gray-500 mb-4">
                                    Start taking exams to see your attempt history here
                                </p>
                                <Button variant="primary" onClick={() => navigate('/user/courses')}>
                                    Browse Courses
                                </Button>
                            </div>
                        </div>
                    </Card>
                )}
            </div>
        </UserLayout>
    );
};

export default UserHistoryPage;
