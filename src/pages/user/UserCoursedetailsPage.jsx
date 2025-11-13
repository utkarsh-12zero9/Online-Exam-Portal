import React, { useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { useSelector, useDispatch } from 'react-redux';
import UserLayout from '@/shared/components/layout/UserLayout';
import Card from '@/shared/components/ui/Card';
import Button from '@/shared/components/ui/Button';
import { toast } from 'react-toastify';
import { enrollCourse } from '@/features/enrollments/slices/enrollmentSlice';
import {
  BookOpen,
  Clock,
  Tag,
  Award,
  BadgeDollarSign,
  Shield,
  Layers,
  HelpCircle,
  Timer,
  CheckCircle2,
  PenSquare,
  PlusSquare,
} from "lucide-react";

const UserCourseDetailsPage = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const dispatch = useDispatch();

  const courses = useSelector((state) => state.courses.courses);
  const modules = useSelector((state) => state.modules.modules);
  const questions = useSelector((state) => state.questions.questions);
  const { user } = useSelector((state) => state.auth);
  const enrollments = useSelector((state) => state.enrollments.enrollments);

  const course = courses.find((c) => c.id === Number(id));
  const courseModules = modules.filter((m) => m.courseId === Number(id));

  // Check if already enrolled
  const isEnrolled = enrollments.some(
    (e) => e.userId === user?.id && e.courseId === Number(id)
  );

  // Calculate total questions
  const totalQuestions = courseModules.reduce((sum, mod) => {
    const modQuestions = questions.filter((q) => q.moduleId === mod.id);
    return sum + modQuestions.length;
  }, 0);

  const handleEnroll = () => {
    if (user && course) {
      dispatch(enrollCourse({ userId: user.id, courseId: course.id }));
      toast.success(`Successfully enrolled in ${course.title}!`);
      navigate('/user/my-courses');
    } else {
      toast.error('Unable to enroll. Please try again.');
    }
  };

  const handleStartExam = () => {
    if (!isEnrolled) {
      toast.error('Please enroll in this course first!');
      return;
    }
    navigate(`/user/exam/${course.id}`);
  };

  if (!course) {
    return (
      <UserLayout>
        <div className="text-center py-12">
          <p className="text-gray-500">Course not found</p>
          <Button variant="primary" onClick={() => navigate('/user/courses')} className="mt-4">
            Back to Courses
          </Button>
        </div>
      </UserLayout>
    );
  }

  return (
    <UserLayout>
      <div className="max-w-6xl mx-auto px-2 sm:px-4 py-4 md:py-8 space-y-8">

        {/* Back Button */}
        <Button
          variant="outline"
          size="sm"
          onClick={() => navigate('/user/courses')}
          className="mb-6"
        >
          ← Back to Courses
        </Button>

        {/* Course Header Card */}
        <Card className="p-4 sm:p-6 md:p-8 mb-6 shadow-xl rounded-2xl border border-gray-100">
          <div className="flex flex-col md:flex-row md:items-start md:justify-between gap-8">
            {/* Course Info */}
            <div className="flex-1 min-w-0">
              <div className="flex items-center gap-3 mb-3 flex-wrap">
                <h1 className="text-2xl md:text-3xl font-black text-gray-900 truncate">
                  {course.title}
                </h1>
                <span
                  className={`inline-flex items-center gap-1 px-3 py-1 rounded-full text-xs md:text-sm font-semibold shadow-sm border
                  ${course.difficulty === "easy"
                      ? "bg-emerald-100 text-emerald-700 border-emerald-200"
                      : course.difficulty === "medium"
                        ? "bg-yellow-100 text-yellow-700 border-yellow-200"
                        : "bg-rose-100 text-rose-700 border-rose-200"
                    }`}
                >
                  {course.difficulty === "easy" && <Award className="w-4 h-4" aria-hidden="true" />}
                  {course.difficulty === "medium" && <BadgeDollarSign className="w-4 h-4" aria-hidden="true" />}
                  {course.difficulty === "hard" && <Shield className="w-4 h-4" aria-hidden="true" />}
                  {course.difficulty}
                </span>
              </div>
              <p className="text-gray-600 mb-4 text-sm md:text-base">{course.description}</p>

              {/* Course Stats */}
              <div className="grid grid-cols-2 sm:grid-cols-4 gap-4 mb-2">
                <div className="flex items-center gap-2 min-w-0">
                  <BookOpen className="w-5 h-5 text-blue-400" />
                  <div>
                    <p className="text-xs text-gray-500">Domain</p>
                    <p className="font-bold text-gray-900 truncate">{course.domain}</p>
                  </div>
                </div>
                <div className="flex items-center gap-2 min-w-0">
                  <Layers className="w-5 h-5 text-purple-400" />
                  <div>
                    <p className="text-xs text-gray-500">Modules</p>
                    <p className="font-bold text-gray-900 truncate">{courseModules.length}</p>
                  </div>
                </div>
                <div className="flex items-center gap-2 min-w-0">
                  <HelpCircle className="w-5 h-5 text-emerald-400" />
                  <div>
                    <p className="text-xs text-gray-500">Questions</p>
                    <p className="font-bold text-gray-900 truncate">{totalQuestions}</p>
                  </div>
                </div>
                <div className="flex items-center gap-2 min-w-0">
                  <Timer className="w-5 h-5 text-yellow-500" />
                  <div>
                    <p className="text-xs text-gray-500">Duration</p>
                    <p className="font-bold text-gray-900 truncate">{course.duration} mins</p>
                  </div>
                </div>
              </div>

              {/* Tags */}
              {course.tags.length > 0 && (
                <div className="flex flex-wrap gap-2 mt-4">
                  {course.tags.map((tag, i) => (
                    <span
                      key={i}
                      className="px-3 py-1 bg-gray-100 rounded-full text-xs text-gray-700 font-semibold flex items-center gap-1 shadow"
                    >
                      <Tag className="w-3 h-3" aria-hidden="true" />
                      {tag}
                    </span>
                  ))}
                </div>
              )}
            </div>

            {/* Action Panel */}
            <div className="flex flex-col gap-4 md:w-[200px] items-center md:items-end mt-4 md:mt-0">
              <div className="text-center md:text-right mb-1">
                <p className="text-2xl md:text-3xl font-extrabold text-emerald-600 mb-1">
                  {course.price === 0 ? 'Free' : `₹${course.price}`}
                </p>
                <p className="text-xs text-gray-500">
                  Attempt Limit: {course.attemptLimit}
                </p>
              </div>
              {isEnrolled ? (
                <>
                  <div className="flex items-center gap-2 px-3 py-2 bg-emerald-50 text-emerald-700 rounded-md text-xs md:text-sm font-semibold">
                    <CheckCircle2 className="w-4 h-4" aria-hidden="true" />
                    Enrolled
                  </div>
                  <Button variant="primary" fullWidth onClick={handleStartExam} className="mt-2">
                    Start Exam
                  </Button>
                </>
              ) : (
                <Button variant="primary" fullWidth onClick={handleEnroll} className="mt-2">
                  <PlusSquare className="w-5 h-5 mr-2" aria-hidden="true" />
                  Enroll Now
                </Button>
              )}
            </div>
          </div>
        </Card>

        {/* Modules Section */}
        <h2 className="text-2xl font-black text-gray-900 mb-4 mt-8">Course Modules</h2>
        <div className="grid grid-cols-1 gap-5">
          {courseModules.length > 0 ? (
            courseModules
              .sort((a, b) => a.order - b.order)
              .map((mod) => {
                const modQuestions = questions.filter((q) => q.moduleId === mod.id);
                return (
                  <Card key={mod.id} className="p-5 rounded-xl shadow-md border border-gray-100 bg-white">
                    <div className="flex flex-col sm:flex-row items-start justify-between gap-6">
                      <div className="flex items-center gap-3 mb-1">
                        <span className="w-8 h-8 rounded-full bg-emerald-100 text-emerald-700 flex items-center justify-center font-black text-base">
                          {mod.order}
                        </span>
                        <h3 className="text-lg font-bold text-gray-900 truncate">{mod.title}</h3>
                      </div>
                      <div className="flex items-center gap-4 text-xs text-gray-500 mt-2 sm:mt-0">
                        <span>
                          <PenSquare className="inline w-4 h-4 mr-1" aria-hidden="true" />
                          {modQuestions.length} Questions
                        </span>
                        <span>
                          <Award className="inline w-4 h-4 mr-1" aria-hidden="true" />
                          {modQuestions.reduce((sum, q) => sum + q.marks, 0)} Marks
                        </span>
                      </div>
                    </div>
                    <p className="text-gray-600 text-sm mt-2">{mod.description}</p>
                  </Card>
                );
              })
          ) : (
            <p className="text-gray-500 text-center py-8">No modules available for this course.</p>
          )}
        </div>
      </div>
    </UserLayout>
  );

};

export default UserCourseDetailsPage;
