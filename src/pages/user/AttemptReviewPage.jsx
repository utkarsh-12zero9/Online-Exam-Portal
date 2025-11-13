import React from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { useSelector } from 'react-redux';
import UserLayout from '@/shared/components/layout/UserLayout';
import Card from '@/shared/components/ui/Card';
import Button from '@/shared/components/ui/Button';

const AttemptReviewPage = () => {
    const { attemptId } = useParams();
    const navigate = useNavigate();

    const { user } = useSelector((state) => state.auth);
    const enrollments = useSelector((state) => state.enrollments.enrollments);
    const courses = useSelector((state) => state.courses.courses);
    const modules = useSelector((state) => state.modules.modules);
    const questions = useSelector((state) => state.questions.questions);

    // Find the specific attempt
    let attempt = null;
    let course = null;

    for (const enrollment of enrollments) {
        if (enrollment.userId === user?.id) {
            const found = enrollment.attempts.find((a) => a.id === Number(attemptId));
            if (found) {
                attempt = found;
                course = courses.find((c) => c.id === enrollment.courseId);
                break;
            }
        }
    }

    if (!attempt || !course) {
        return (
            <UserLayout>
                <div className="text-center py-12">
                    <p className="text-gray-500">Attempt not found</p>
                    <Button variant="primary" onClick={() => navigate('/user/history')} className="mt-4">
                        Back to History
                    </Button>
                </div>
            </UserLayout>
        );
    }

    // Get all questions for this course
    const courseModules = modules.filter((m) => m.courseId === course.id);
    const allQuestions = questions.filter((q) =>
        courseModules.some((mod) => mod.id === q.moduleId)
    );

    const formatDate = (dateString) => {
        const date = new Date(dateString);
        return date.toLocaleString('en-US', {
            year: 'numeric',
            month: 'short',
            day: 'numeric',
            hour: '2-digit',
            minute: '2-digit',
        });
    };

    const getQuestionResult = (question) => {
        const userAnswer = attempt.answers[question.id];
        const isCorrect = userAnswer === question.correctAnswer;
        return { userAnswer, isCorrect };
    };

    const correctCount = allQuestions.filter((q) => getQuestionResult(q).isCorrect).length;
    const percentage = ((attempt.score / attempt.totalMarks) * 100).toFixed(1);

    return (
        <UserLayout>
            <div>
                {/* Header */}
                <Button variant="outline" size="sm" onClick={() => navigate('/user/history')} className="mb-6">
                    ← Back to History
                </Button>

                {/* Summary Card */}
                <Card className="p-6 mb-6 mt-4">
                    <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
                        <div>
                            <h1 className="text-2xl sm:text-3xl font-bold text-gray-900 mb-2">{course.title}</h1>
                            <div className="flex flex-wrap items-center gap-3 text-sm text-gray-600">
                                <span>📅 {formatDate(attempt.submittedAt)}</span>
                                <span className="px-3 py-1 bg-emerald-100 text-emerald-700 rounded font-semibold">
                                    Completed
                                </span>
                            </div>
                        </div>

                        <div className="flex flex-col items-start md:items-end gap-2">
                            <div className="text-4xl font-bold text-emerald-600">
                                {attempt.score}/{attempt.totalMarks}
                            </div>
                            <div className="text-lg text-gray-600">{percentage}%</div>
                        </div>
                    </div>

                    {/* Stats Grid */}
                    <div className="grid grid-cols-2 sm:grid-cols-4 gap-4 mt-6">
                        <div className="bg-emerald-50 rounded-lg p-3 text-center">
                            <p className="text-emerald-600 text-xs font-medium mb-1">Correct</p>
                            <p className="text-2xl font-bold text-emerald-700">{correctCount}</p>
                        </div>
                        <div className="bg-red-50 rounded-lg p-3 text-center">
                            <p className="text-red-600 text-xs font-medium mb-1">Wrong</p>
                            <p className="text-2xl font-bold text-red-700">
                                {attempt.answeredQuestions - correctCount}
                            </p>
                        </div>
                        <div className="bg-blue-50 rounded-lg p-3 text-center">
                            <p className="text-blue-600 text-xs font-medium mb-1">Answered</p>
                            <p className="text-2xl font-bold text-blue-700">{attempt.answeredQuestions}</p>
                        </div>
                        <div className="bg-gray-100 rounded-lg p-3 text-center">
                            <p className="text-gray-600 text-xs font-medium mb-1">Skipped</p>
                            <p className="text-2xl font-bold text-gray-700">
                                {attempt.totalQuestions - attempt.answeredQuestions}
                            </p>
                        </div>
                    </div>
                </Card>

                {/* Questions Review */}
                <h2 className="text-2xl font-bold text-gray-900 mb-4">Question-wise Analysis</h2>

                <div className="space-y-4">
                    {allQuestions.map((question, idx) => {
                        const { userAnswer, isCorrect } = getQuestionResult(question);
                        const wasAnswered = userAnswer !== undefined && userAnswer !== null && userAnswer !== '';

                        return (
                            <Card key={question.id} className={`p-5 border-l-4 ${wasAnswered
                                    ? isCorrect
                                        ? 'border-emerald-500 bg-emerald-50/30'
                                        : 'border-red-500 bg-red-50/30'
                                    : 'border-gray-300 bg-gray-50'
                                }`}>
                                {/* Question Header */}
                                <div className="flex items-start justify-between gap-3 mb-4">
                                    <div className="flex items-center gap-3">
                                        <span className="w-8 h-8 rounded-full bg-blue-100 text-blue-700 flex items-center justify-center font-bold text-sm flex-shrink-0">
                                            {idx + 1}
                                        </span>
                                        <div>
                                            <div className="flex items-center gap-2 mb-1">
                                                <span
                                                    className={`px-2 py-1 rounded text-xs font-semibold ${question.difficulty === 'easy'
                                                            ? 'bg-emerald-100 text-emerald-700'
                                                            : question.difficulty === 'medium'
                                                                ? 'bg-yellow-100 text-yellow-700'
                                                                : 'bg-red-100 text-red-700'
                                                        }`}
                                                >
                                                    {question.difficulty}
                                                </span>
                                                <span className="px-2 py-1 bg-gray-100 text-gray-700 rounded text-xs font-semibold">
                                                    {question.marks} marks
                                                </span>
                                            </div>
                                        </div>
                                    </div>

                                    {/* Result Badge */}
                                    {wasAnswered ? (
                                        <span
                                            className={`px-3 py-1 rounded font-semibold text-sm flex-shrink-0 ${isCorrect
                                                    ? 'bg-emerald-100 text-emerald-700'
                                                    : 'bg-red-100 text-red-700'
                                                }`}
                                        >
                                            {isCorrect ? '✓ Correct' : '✗ Wrong'}
                                        </span>
                                    ) : (
                                        <span className="px-3 py-1 bg-gray-100 text-gray-600 rounded font-semibold text-sm flex-shrink-0">
                                            Not Answered
                                        </span>
                                    )}
                                </div>

                                {/* Question Text */}
                                <h3 className="text-base sm:text-lg font-semibold text-gray-900 mb-4">
                                    {question.question}
                                </h3>

                                {/* MCQ Options */}
                                {question.type === 'mcq' && (
                                    <div className="space-y-2">
                                        {question.options.map((option, optIdx) => {
                                            const isUserAnswer = option === userAnswer;
                                            const isCorrectAnswer = option === question.correctAnswer;

                                            return (
                                                <div
                                                    key={optIdx}
                                                    className={`flex items-start gap-3 p-3 rounded-lg border-2 ${isCorrectAnswer
                                                            ? 'border-emerald-500 bg-emerald-50'
                                                            : isUserAnswer
                                                                ? 'border-red-500 bg-red-50'
                                                                : 'border-gray-200 bg-white'
                                                        }`}
                                                >
                                                    <div className="flex-shrink-0 mt-0.5">
                                                        {isCorrectAnswer && (
                                                            <span className="text-emerald-600 font-bold">✓</span>
                                                        )}
                                                        {isUserAnswer && !isCorrectAnswer && (
                                                            <span className="text-red-600 font-bold">✗</span>
                                                        )}
                                                        {!isUserAnswer && !isCorrectAnswer && (
                                                            <span className="text-gray-400">○</span>
                                                        )}
                                                    </div>
                                                    <span className={`flex-1 text-sm ${isCorrectAnswer ? 'font-semibold text-emerald-900' :
                                                            isUserAnswer ? 'font-semibold text-red-900' :
                                                                'text-gray-700'
                                                        }`}>
                                                        {option}
                                                    </span>
                                                    {isCorrectAnswer && (
                                                        <span className="text-xs bg-emerald-600 text-white px-2 py-1 rounded">
                                                            Correct Answer
                                                        </span>
                                                    )}
                                                    {isUserAnswer && !isCorrectAnswer && (
                                                        <span className="text-xs bg-red-600 text-white px-2 py-1 rounded">
                                                            Your Answer
                                                        </span>
                                                    )}
                                                </div>
                                            );
                                        })}
                                    </div>
                                )}

                                {/* Subjective/Coding Answer */}
                                {(question.type === 'subjective' || question.type === 'coding') && (
                                    <div className="space-y-3">
                                        {userAnswer && (
                                            <div className="bg-blue-50 rounded-lg p-4">
                                                <p className="text-xs font-semibold text-blue-700 mb-2">Your Answer:</p>
                                                <p className={`text-sm text-gray-900 ${question.type === 'coding' ? 'font-mono whitespace-pre-wrap' : ''
                                                    }`}>
                                                    {userAnswer}
                                                </p>
                                            </div>
                                        )}
                                        {question.correctAnswer && (
                                            <div className="bg-emerald-50 rounded-lg p-4">
                                                <p className="text-xs font-semibold text-emerald-700 mb-2">
                                                    Sample Answer / Reference:
                                                </p>
                                                <p className={`text-sm text-gray-900 ${question.type === 'coding' ? 'font-mono whitespace-pre-wrap' : ''
                                                    }`}>
                                                    {question.correctAnswer}
                                                </p>
                                            </div>
                                        )}
                                    </div>
                                )}
                            </Card>
                        );
                    })}
                </div>

                {/* Bottom Actions */}
                <div className="flex gap-3 mt-8">
                    <Button variant="outline" onClick={() => navigate('/user/history')} fullWidth>
                        Back to History
                    </Button>
                    <Button variant="primary" onClick={() => navigate(`/user/courses/${course.id}`)} fullWidth>
                        View Course
                    </Button>
                </div>
            </div>
        </UserLayout>
    );
};

export default AttemptReviewPage;
