import React, { useState, useEffect, useCallback } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { useSelector, useDispatch } from "react-redux";
import {
  startAttempt,
  saveAnswer,
  submitAttempt,
} from "@/features/enrollments/slices/enrollmentSlice";
import Button from "@/shared/components/ui/Button";
import Card from "@/shared/components/ui/Card";
import { toast } from "react-toastify";
import { useProctoring } from "@/hooks/useProctoring";
import ProctoringModal from "@/components/exam/ProctoringModal";

const ExamPage = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const dispatch = useDispatch();

  const courses = useSelector((state) => state.courses.courses);
  const modules = useSelector((state) => state.modules.modules);
  const questions = useSelector((state) => state.questions.questions);
  const { currentAttempt } = useSelector((state) => state.enrollments);
  const { user } = useSelector((state) => state.auth);

  const course = courses.find((c) => c.id === Number(id));
  const courseModules = modules.filter((m) => m.courseId === Number(id));
  const allQuestions = questions.filter((q) =>
    courseModules.some((mod) => mod.id === q.moduleId)
  );

  const [currentQuestionIndex, setCurrentQuestionIndex] = useState(0);
  const [timeRemaining, setTimeRemaining] = useState(
    course?.duration * 60 || 3600
  );
  const [showSubmitConfirm, setShowSubmitConfirm] = useState(false);
  const [markedForReview, setMarkedForReview] = useState(new Set());
  const [showPalette, setShowPalette] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [examCompleted, setExamCompleted] = useState(false);
  const [showProctoringModal, setShowProctoringModal] = useState(true);
  const [proctoringAccepted, setProctoringAccepted] = useState(false);

  const currentQuestion = allQuestions[currentQuestionIndex];

  const handleSubmitExam = useCallback(
    (violationsList = [], autoSubmitted = false) => {
      console.log("=== SUBMITTING EXAM ===");
      console.log("Violations being submitted:", violationsList);
      console.log("Auto-submitted:", autoSubmitted);

      if (timeRemaining <= 0 && !autoSubmitted) {
        toast.error("Time is up!");
      }

      setIsSubmitting(true);

      let score = 0;
      const totalMarks = allQuestions.reduce((sum, q) => sum + q.marks, 0);

      allQuestions.forEach((question) => {
        if (currentAttempt?.answers[question.id] === question.correctAnswer) {
          score += question.marks;
        }
      });

      const percentage = ((score / totalMarks) * 100).toFixed(2);
      const answeredCount = Object.keys(currentAttempt?.answers || {}).length;

      const submissionData = {
        score,
        totalMarks,
        percentage: parseFloat(percentage),
        answeredQuestions: answeredCount,
        totalQuestions: allQuestions.length,
        violations: violationsList || [],
        violationCount: violationsList?.length || 0,
        autoSubmitted: autoSubmitted,
        submissionReason: autoSubmitted
          ? "Maximum violations reached"
          : "User submitted",
      };

      console.log("Submission data:", submissionData);

      dispatch(submitAttempt(submissionData));

      toast.success(
        autoSubmitted
          ? "Exam auto-submitted due to violations"
          : "Exam submitted successfully!"
      );

      if (isFullscreen) {
        exitFullscreen();
      }

      setExamCompleted(true);

      setTimeout(() => {
        navigate("/user/history");
      }, 1500);
    },
    [allQuestions, currentAttempt, dispatch, navigate, timeRemaining]
  );

  const {
    violations,
    violationCount,
    maxViolations,
    isFullscreen,
    requestFullscreen,
    exitFullscreen,
  } = useProctoring((violationsList) => {
    handleSubmitExam(violationsList, true);
  }, proctoringAccepted);

  const handleAcceptProctoring = () => {
    setProctoringAccepted(true);
    setShowProctoringModal(false);
    requestFullscreen();
    toast.success("Proctoring enabled. Exam started in fullscreen mode.");
  };

  const handleRejectProctoring = () => {
    toast.error("You must accept proctoring rules to take the exam");
    navigate("/user/my-courses");
  };

  useEffect(() => {
    const handlePopState = (e) => {
      if (!examCompleted && currentAttempt) {
        e.preventDefault();
        window.history.pushState(null, "", window.location.href);
        toast.warning("You cannot navigate back during an active exam!");
      }
    };

    if (currentAttempt && !examCompleted) {
      window.history.pushState(null, "", window.location.href);
      window.addEventListener("popstate", handlePopState);
    }

    return () => {
      window.removeEventListener("popstate", handlePopState);
    };
  }, [currentAttempt, examCompleted]);

  useEffect(() => {
    const handleBeforeUnload = (e) => {
      if (!examCompleted && currentAttempt) {
        e.preventDefault();
        e.returnValue =
          "You have an active exam. Are you sure you want to leave?";
        return e.returnValue;
      }
    };

    window.addEventListener("beforeunload", handleBeforeUnload);
    return () => window.removeEventListener("beforeunload", handleBeforeUnload);
  }, [currentAttempt, examCompleted]);

  useEffect(() => {
    if (course && user && !currentAttempt) {
      dispatch(
        startAttempt({
          userId: user.id,
          courseId: course.id,
          totalQuestions: allQuestions.length,
        })
      );
    }
  }, [course, user, currentAttempt, dispatch, allQuestions.length]);

  useEffect(() => {
    if (examCompleted) return;

    if (timeRemaining <= 0) {
      handleSubmitExam(violations, false); 
    }

    const timer = setInterval(() => {
      setTimeRemaining((prev) => prev - 1);
    }, 1000);

    return () => clearInterval(timer);
  }, [timeRemaining, examCompleted, violations, handleSubmitExam]);

  const formatTime = (seconds) => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins}:${secs.toString().padStart(2, "0")}`;
  };

  const handleAnswerChange = (answer) => {
    dispatch(saveAnswer({ questionId: currentQuestion.id, answer }));
  };

  const handleMarkForReview = () => {
    const newMarked = new Set(markedForReview);
    if (newMarked.has(currentQuestion.id)) {
      newMarked.delete(currentQuestion.id);
    } else {
      newMarked.add(currentQuestion.id);
    }
    setMarkedForReview(newMarked);
  };

  const getQuestionStatus = (question) => {
    const answered = currentAttempt?.answers[question.id];
    const marked = markedForReview.has(question.id);

    if (answered && marked) return "answered-marked";
    if (answered) return "answered";
    if (marked) return "marked";
    return "unanswered";
  };

  const getStatusColor = (status) => {
    switch (status) {
      case "answered":
        return "bg-emerald-500 text-white border-emerald-600";
      case "marked":
        return "bg-purple-500 text-white border-purple-600";
      case "answered-marked":
        return "bg-blue-500 text-white border-blue-600";
      default:
        return "bg-white text-gray-700 border-2 border-gray-300 hover:border-gray-400";
    }
  };

  if (showProctoringModal) {
    return (
      <ProctoringModal
        onAccept={handleAcceptProctoring}
        onReject={handleRejectProctoring}
      />
    );
  }

  if (examCompleted) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <Card className="p-8 text-center max-w-md">
          <div className="w-16 h-16 bg-emerald-100 rounded-full flex items-center justify-center mx-auto mb-4">
            <svg
              className="w-8 h-8 text-emerald-600"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M5 13l4 4L19 7"
              />
            </svg>
          </div>
          <h2 className="text-2xl font-bold text-gray-900 mb-2">
            Exam Submitted!
          </h2>
          <p className="text-gray-600 mb-4">Redirecting to your results...</p>
        </Card>
      </div>
    );
  }

  if (!course || !currentQuestion) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto mb-4"></div>
          <p className="text-gray-600">Loading exam...</p>
        </div>
      </div>
    );
  }

  const userAnswer = currentAttempt?.answers[currentQuestion.id];
  const answeredCount = Object.keys(currentAttempt?.answers || {}).length;
  const markedCount = markedForReview.size;
  const unansweredCount = allQuestions.length - answeredCount;

  return (
    <div className="min-h-screen bg-gray-50 flex flex-col">
      {/* Header */}
      <header className="bg-white shadow-sm sticky top-0 z-40 border-b-2 border-gray-200">
        <div className="flex items-center justify-between px-3 sm:px-6 py-2 sm:py-3">
          <div className="flex-1 min-w-0">
            <h1 className="text-sm sm:text-lg font-bold text-gray-900 truncate">
              {course.title}
            </h1>
            <p className="text-xs text-gray-500">
              Q {currentQuestionIndex + 1}/{allQuestions.length}
            </p>
          </div>
          <div className="flex items-center gap-2 sm:gap-4">
            <div className="text-right">
              <p className="text-xs text-gray-500">Time</p>
              <p
                className={`text-sm sm:text-lg font-bold ${
                  timeRemaining < 300 ? "text-red-600" : "text-emerald-600"
                }`}
              >
                {formatTime(timeRemaining)}
              </p>
            </div>
            {proctoringAccepted && (
              <div className="flex items-center gap-2 px-3 py-2 bg-red-50 text-red-700 rounded-lg">
                <span>⚠️</span>
                <span className="text-sm font-medium">
                  Violations: {violationCount}/{maxViolations}
                </span>
              </div>
            )}
            <Button
              variant="primary"
              size="sm"
              onClick={() => setShowPalette(true)}
            >
              Palette
            </Button>
          </div>
        </div>
      </header>

      {/* Main Content */}
      <div className="flex flex-1 overflow-hidden">
        {/* Question Area */}
        <div className="flex-1 overflow-y-auto">
          <div className="p-3 sm:p-6 max-w-4xl mx-auto">
            {/* Question Card */}
            <Card className="p-4 sm:p-6 mb-4">
              <div className="flex flex-wrap items-center gap-2 mb-4">
                <span className="px-2 sm:px-3 py-1 bg-blue-100 text-blue-700 rounded text-xs sm:text-sm font-semibold">
                  Q{currentQuestionIndex + 1}
                </span>
                <span
                  className={`px-2 sm:px-3 py-1 rounded text-xs font-semibold ${
                    currentQuestion.difficulty === "easy"
                      ? "bg-emerald-100 text-emerald-700"
                      : currentQuestion.difficulty === "medium"
                      ? "bg-yellow-100 text-yellow-700"
                      : "bg-red-100 text-red-700"
                  }`}
                >
                  {currentQuestion.difficulty}
                </span>
                <span className="px-2 sm:px-3 py-1 bg-gray-100 text-gray-700 rounded text-xs font-semibold">
                  {currentQuestion.marks} marks
                </span>
              </div>

              <h2 className="text-base sm:text-xl font-semibold text-gray-900 mb-4 sm:mb-6">
                {currentQuestion.question}
              </h2>

              {/* MCQ Options */}
              {currentQuestion.type === "mcq" && (
                <div className="space-y-2 sm:space-y-3 mb-4">
                  {currentQuestion.options.map((option, idx) => (
                    <label
                      key={idx}
                      className={`flex items-start gap-2 sm:gap-3 p-3 sm:p-4 border-2 rounded-lg cursor-pointer transition-all text-sm sm:text-base ${
                        userAnswer === option
                          ? "border-emerald-500 bg-emerald-50"
                          : "border-gray-200 hover:border-emerald-300"
                      }`}
                    >
                      <input
                        type="radio"
                        name="answer"
                        checked={userAnswer === option}
                        onChange={() => handleAnswerChange(option)}
                        className="mt-1 w-4 h-4 accent-emerald-600 flex-shrink-0"
                      />
                      <span className="flex-1 text-gray-900">{option}</span>
                    </label>
                  ))}
                </div>
              )}

              {/* Subjective Answer */}
              {currentQuestion.type === "subjective" && (
                <textarea
                  value={userAnswer || ""}
                  onChange={(e) => handleAnswerChange(e.target.value)}
                  className="w-full border-2 border-gray-200 rounded-lg p-3 sm:p-4 min-h-[120px] sm:min-h-[150px] text-sm sm:text-base focus:border-emerald-500 focus:outline-none mb-4"
                  placeholder="Type your answer here..."
                />
              )}

              {/* Coding Answer */}
              {currentQuestion.type === "coding" && (
                <textarea
                  value={userAnswer || ""}
                  onChange={(e) => handleAnswerChange(e.target.value)}
                  className="w-full border-2 border-gray-200 rounded-lg p-3 sm:p-4 min-h-[200px] sm:min-h-[250px] font-mono text-xs sm:text-sm focus:border-emerald-500 focus:outline-none bg-gray-50 mb-4"
                  placeholder="// Write your code here..."
                />
              )}

              {/* Mark for Review Button */}
              <Button
                variant={
                  markedForReview.has(currentQuestion.id)
                    ? "secondary"
                    : "outline"
                }
                size="sm"
                onClick={handleMarkForReview}
                fullWidth
                className="mt-4"
              >
                {markedForReview.has(currentQuestion.id)
                  ? "★ Marked for Review"
                  : "☆ Mark for Review"}
              </Button>
            </Card>

            {/* Navigation Buttons */}
            <div className="flex gap-2 sm:gap-3">
              <Button
                variant="outline"
                onClick={() =>
                  setCurrentQuestionIndex((prev) => Math.max(0, prev - 1))
                }
                disabled={currentQuestionIndex === 0}
                fullWidth
                size="sm"
              >
                ← Prev
              </Button>
              {currentQuestionIndex < allQuestions.length - 1 ? (
                <Button
                  variant="primary"
                  onClick={() => setCurrentQuestionIndex((prev) => prev + 1)}
                  fullWidth
                  size="sm"
                >
                  Next →
                </Button>
              ) : (
                <Button
                  variant="secondary"
                  onClick={() => setShowSubmitConfirm(true)}
                  fullWidth
                  size="sm"
                >
                  Submit
                </Button>
              )}
            </div>
          </div>
        </div>

        {/* Desktop Sidebar */}
        <div className="hidden lg:block w-80 xl:w-96 bg-white border-l-2 border-gray-200 overflow-y-auto p-4">
          <h3 className="text-lg font-bold text-gray-900 mb-4">
            Question Palette
          </h3>

          {/* Legend */}
          <div className="grid grid-cols-2 gap-2 mb-4 text-xs">
            <div className="flex items-center gap-2">
              <div className="w-6 h-6 rounded bg-emerald-500 flex-shrink-0"></div>
              <span>Answered ({answeredCount})</span>
            </div>
            <div className="flex items-center gap-2">
              <div className="w-6 h-6 rounded bg-white border-2 border-gray-300 flex-shrink-0"></div>
              <span>Unanswered ({unansweredCount})</span>
            </div>
            <div className="flex items-center gap-2">
              <div className="w-6 h-6 rounded bg-purple-500 flex-shrink-0"></div>
              <span>Marked ({markedCount})</span>
            </div>
            <div className="flex items-center gap-2">
              <div className="w-6 h-6 rounded bg-blue-500 flex-shrink-0"></div>
              <span>Both</span>
            </div>
          </div>

          {/* Question Grid */}
          <div className="grid grid-cols-5 gap-2 mb-4">
            {allQuestions.map((q, idx) => {
              const status = getQuestionStatus(q);
              return (
                <button
                  key={q.id}
                  onClick={() => setCurrentQuestionIndex(idx)}
                  className={`
                    aspect-square flex items-center justify-center
                    rounded border-2 font-semibold text-sm transition-all
                    ${getStatusColor(status)}
                    ${
                      currentQuestionIndex === idx
                        ? "ring-2 ring-offset-2 ring-blue-500"
                        : ""
                    }
                  `}
                >
                  {idx + 1}
                </button>
              );
            })}
          </div>

          <Button
            variant="danger"
            fullWidth
            onClick={() => setShowSubmitConfirm(true)}
          >
            Submit Exam
          </Button>
        </div>
      </div>

      {/* Mobile Palette Modal */}
      {showPalette && (
        <div className="fixed inset-0 bg-black/50 backdrop-blur-sm z-50 lg:hidden">
          <div className="absolute inset-x-0 bottom-0 bg-white rounded-t-3xl max-h-[80vh] overflow-y-auto">
            <div className="sticky top-0 bg-white border-b border-gray-200 p-4 flex items-center justify-between">
              <h3 className="text-lg font-bold text-gray-900">
                Question Palette
              </h3>
              <button
                onClick={() => setShowPalette(false)}
                className="text-gray-500 hover:text-gray-700"
              >
                <svg
                  className="w-6 h-6"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M6 18L18 6M6 6l12 12"
                  />
                </svg>
              </button>
            </div>

            <div className="p-4">
              {/* Legend */}
              <div className="grid grid-cols-2 gap-3 mb-4 text-xs">
                <div className="flex items-center gap-2">
                  <div className="w-6 h-6 rounded bg-emerald-500 flex-shrink-0"></div>
                  <span>Answered ({answeredCount})</span>
                </div>
                <div className="flex items-center gap-2">
                  <div className="w-6 h-6 rounded bg-white border-2 border-gray-300 flex-shrink-0"></div>
                  <span>Unanswered ({unansweredCount})</span>
                </div>
                <div className="flex items-center gap-2">
                  <div className="w-6 h-6 rounded bg-purple-500 flex-shrink-0"></div>
                  <span>Marked ({markedCount})</span>
                </div>
                <div className="flex items-center gap-2">
                  <div className="w-6 h-6 rounded bg-blue-500 flex-shrink-0"></div>
                  <span>Both</span>
                </div>
              </div>

              {/* Question Grid */}
              <div className="grid grid-cols-6 sm:grid-cols-8 gap-2 mb-4">
                {allQuestions.map((q, idx) => {
                  const status = getQuestionStatus(q);
                  return (
                    <button
                      key={q.id}
                      onClick={() => {
                        setCurrentQuestionIndex(idx);
                        setShowPalette(false);
                      }}
                      className={`
                        aspect-square flex items-center justify-center
                        rounded border-2 font-semibold text-sm transition-all
                        ${getStatusColor(status)}
                        ${
                          currentQuestionIndex === idx
                            ? "ring-2 ring-offset-2 ring-blue-500"
                            : ""
                        }
                      `}
                    >
                      {idx + 1}
                    </button>
                  );
                })}
              </div>

              <Button
                variant="danger"
                fullWidth
                onClick={() => {
                  setShowPalette(false);
                  setShowSubmitConfirm(true);
                }}
              >
                Submit Exam
              </Button>
            </div>
          </div>
        </div>
      )}

      {/* Submit Confirmation Modal */}
      {showSubmitConfirm && (
        <div className="fixed inset-0 bg-black/30 backdrop-blur-sm flex items-center justify-center z-50 p-4">
          <Card className="p-6 max-w-md w-full">
            <h3 className="text-xl font-bold text-gray-900 mb-4">
              Submit Exam?
            </h3>
            <div className="space-y-2 mb-6 text-sm">
              <p className="text-gray-600">
                <span className="font-semibold text-emerald-600">
                  {answeredCount}
                </span>{" "}
                Answered
              </p>
              <p className="text-gray-600">
                <span className="font-semibold text-purple-600">
                  {markedCount}
                </span>{" "}
                Marked for Review
              </p>
              <p className="text-gray-600">
                <span className="font-semibold text-gray-700">
                  {unansweredCount}
                </span>{" "}
                Not Answered
              </p>
            </div>
            <p className="text-gray-600 mb-6">
              Are you sure you want to submit?
            </p>
            <div className="flex gap-3">
              <Button
                variant="outline"
                onClick={() => setShowSubmitConfirm(false)}
                fullWidth
              >
                Cancel
              </Button>
              <Button
                variant="primary"
                onClick={() => handleSubmitExam(violations, false)}
                fullWidth
              >
                Submit
              </Button>
            </div>
          </Card>
        </div>
      )}
    </div>
  );
};

export default ExamPage;
