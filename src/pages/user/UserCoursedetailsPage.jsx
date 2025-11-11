import React, { useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { useSelector, useDispatch } from 'react-redux';
import UserLayout from '@/shared/components/layout/UserLayout';
import Card from '@/shared/components/ui/Card';
import Button from '@/shared/components/ui/Button';
import { toast } from 'react-toastify';
import { enrollCourse } from '@/features/enrollments/slices/enrollmentSlice';

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
      <div>
        {/* Back Button */}
        <Button variant="outline" size="sm" onClick={() => navigate('/user/courses')} className="mb-6">
          ← Back to Courses
        </Button>

        {/* Course Header */}
        <Card className="p-6 mb-6">
          <div className="flex flex-col md:flex-row md:items-start md:justify-between gap-4">
            <div className="flex-1">
              <div className="flex items-center gap-3 mb-3">
                <h1 className="text-2xl sm:text-3xl font-bold text-gray-900">{course.title}</h1>
                <span
                  className={`px-3 py-1 rounded text-sm font-semibold ${
                    course.difficulty === 'easy'
                      ? 'bg-emerald-100 text-emerald-700'
                      : course.difficulty === 'medium'
                      ? 'bg-yellow-100 text-yellow-700'
                      : 'bg-red-100 text-red-700'
                  }`}
                >
                  {course.difficulty}
                </span>
              </div>
              <p className="text-gray-600 mb-4">{course.description}</p>

              {/* Course Stats */}
              <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
                <div className="flex items-center gap-2">
                  <span className="text-2xl">📚</span>
                  <div>
                    <p className="text-xs text-gray-500">Domain</p>
                    <p className="font-semibold text-gray-900">{course.domain}</p>
                  </div>
                </div>
                <div className="flex items-center gap-2">
                  <span className="text-2xl">📝</span>
                  <div>
                    <p className="text-xs text-gray-500">Modules</p>
                    <p className="font-semibold text-gray-900">{courseModules.length}</p>
                  </div>
                </div>
                <div className="flex items-center gap-2">
                  <span className="text-2xl">❓</span>
                  <div>
                    <p className="text-xs text-gray-500">Questions</p>
                    <p className="font-semibold text-gray-900">{totalQuestions}</p>
                  </div>
                </div>
                <div className="flex items-center gap-2">
                  <span className="text-2xl">⏱️</span>
                  <div>
                    <p className="text-xs text-gray-500">Duration</p>
                    <p className="font-semibold text-gray-900">{course.duration} mins</p>
                  </div>
                </div>
              </div>

              {/* Tags */}
              <div className="flex flex-wrap gap-2 mt-4">
                {course.tags.map((tag, i) => (
                  <span key={i} className="px-3 py-1 bg-gray-100 rounded-full text-xs text-gray-700">
                    {tag}
                  </span>
                ))}
              </div>
            </div>

            {/* Action Button */}
            <div className="flex flex-col gap-3 md:min-w-[200px]">
              <div className="text-center md:text-right mb-2">
                <p className="text-2xl font-bold text-emerald-600">
                  {course.price === 0 ? 'Free' : `₹${course.price}`}
                </p>
                <p className="text-xs text-gray-500">Attempts: {course.attemptLimit}</p>
              </div>
              
              {isEnrolled ? (
                <>
                  <div className="text-center px-3 py-2 bg-emerald-100 text-emerald-700 rounded-lg text-sm font-semibold">
                    ✓ Enrolled
                  </div>
                  <Button variant="primary" fullWidth onClick={handleStartExam}>
                    Start Exam
                  </Button>
                </>
              ) : (
                <Button variant="primary" fullWidth onClick={handleEnroll}>
                  Enroll Now
                </Button>
              )}
            </div>
          </div>
        </Card>

        {/* Modules Section */}
        <h2 className="text-2xl font-bold text-gray-900 mb-4">Course Modules</h2>
        <div className="grid grid-cols-1 gap-4">
          {courseModules.length > 0 ? (
            courseModules
              .sort((a, b) => a.order - b.order)
              .map((mod) => {
                const modQuestions = questions.filter((q) => q.moduleId === mod.id);
                return (
                  <Card key={mod.id} className="p-5">
                    <div className="flex items-start justify-between gap-4">
                      <div className="flex-1">
                        <div className="flex items-center gap-3 mb-2">
                          <span className="w-8 h-8 rounded-full bg-emerald-100 text-emerald-700 flex items-center justify-center font-bold text-sm">
                            {mod.order}
                          </span>
                          <h3 className="text-lg font-semibold text-gray-900">{mod.title}</h3>
                        </div>
                        <p className="text-gray-600 text-sm mb-3">{mod.description}</p>
                        <div className="flex items-center gap-4 text-xs text-gray-500">
                          <span>📝 {modQuestions.length} Questions</span>
                          <span>
                            🎯{' '}
                            {modQuestions.reduce((sum, q) => sum + q.marks, 0)} Marks
                          </span>
                        </div>
                      </div>
                    </div>
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
