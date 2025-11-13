import React from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { useSelector } from 'react-redux';
import AdminLayout from '@/shared/components/layout/AdminLayout';
import Card from '@/shared/components/ui/Card';
import Button from '@/shared/components/ui/Button';

const AdminStudentDetailsPage = () => {
  const { id } = useParams();
  const navigate = useNavigate();

  const users = useSelector((state) => state.auth.users || []);
  const enrollments = useSelector((state) => state.enrollments.enrollments);
  const courses = useSelector((state) => state.courses.courses);

  const student = users.find((u) => u.id === Number(id));
  const studentEnrollments = enrollments.filter((e) => e.userId === Number(id));

  if (!student) {
    return (
      <AdminLayout>
        <div className="text-center py-12">
          <p className="text-gray-500">Student not found</p>
          <Button variant="primary" onClick={() => navigate('/admin/users')} className="mt-4">
            Back to Students
          </Button>
        </div>
      </AdminLayout>
    );
  }

  const totalAttempts = studentEnrollments.reduce((sum, e) => sum + e.attempts.length, 0);
  let totalScore = 0;
  let totalMarks = 0;
  studentEnrollments.forEach((enrollment) => {
    enrollment.attempts.forEach((attempt) => {
      totalScore += attempt.score || 0;
      totalMarks += attempt.totalMarks || 1;
    });
  });
  const avgPercentage = totalMarks > 0 ? ((totalScore / totalMarks) * 100).toFixed(1) : 0;

  const formatDate = (dateString) => {
    return new Date(dateString).toLocaleString('en-US', {
      year: 'numeric',
      month: 'short',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit',
    });
  };

  return (
    <AdminLayout>
      <div className="max-w-4xl mx-auto px-4 py-8 space-y-8">

        {/* Back Button */}
        <button
          onClick={() => navigate('/admin/users')}
          className="inline-flex items-center gap-2 text-gray-500 hover:text-blue-800 mb-6 text-sm font-medium group focus:outline-none focus:ring-2 focus:ring-blue-400 rounded"
        >
          <svg className="w-4 h-4 transition-transform group-hover:-translate-x-1" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
          </svg>
          Back to Students
        </button>

        {/* Student Profile Card */}
        <Card className="p-8 mb-8 shadow-xl rounded-2xl border border-blue-100 bg-gradient-to-br from-white to-blue-50">
          <div className="flex flex-col sm:flex-row items-center gap-6">
            <div className="w-24 h-24 rounded-full bg-blue-200 flex items-center justify-center text-blue-700 text-4xl font-bold shadow-lg">
              {student.name.charAt(0).toUpperCase()}
            </div>
            <div className="flex-1 text-center sm:text-left">
              <h1 className="text-3xl font-black text-gray-900 leading-tight mb-2">{student.name}</h1>
              <p className="text-gray-600 mb-2 text-base">{student.email}</p>
              <div className="flex flex-wrap gap-6 justify-center sm:justify-start text-sm text-gray-700 font-medium">
                <span>Role: <span className="font-extrabold capitalize">{student.role}</span></span>
                <span>Joined: <span className="font-semibold">{student.createdAt ? formatDate(student.createdAt) : 'N/A'}</span></span>
              </div>
            </div>
          </div>
        </Card>

        {/* Stats Grid */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4 md:gap-6 mb-8">
          <Card className="p-6 text-center shadow-md rounded-xl border-none bg-gradient-to-br from-blue-100 via-white to-blue-50">
            <p className="text-gray-600 text-xs mb-1">Enrolled Courses</p>
            <p className="text-3xl font-extrabold text-blue-600">{studentEnrollments.length}</p>
          </Card>
          <Card className="p-6 text-center shadow-md rounded-xl border-none bg-gradient-to-br from-purple-100 via-white to-purple-50">
            <p className="text-gray-600 text-xs mb-1">Total Attempts</p>
            <p className="text-3xl font-extrabold text-purple-600">{totalAttempts}</p>
          </Card>
          <Card className="p-6 text-center shadow-md rounded-xl border-none bg-gradient-to-br from-emerald-100 via-white to-emerald-50">
            <p className="text-gray-600 text-xs mb-1">Total Score</p>
            <p className="text-3xl font-extrabold text-emerald-600">{totalScore}</p>
          </Card>
          <Card className="p-6 text-center shadow-md rounded-xl border-none bg-gradient-to-br from-yellow-100 via-white to-yellow-50">
            <p className="text-gray-600 text-xs mb-1">Average %</p>
            <p className="text-3xl font-extrabold text-yellow-600">{avgPercentage}%</p>
          </Card>
        </div>

        {/* Enrollments & Attempts */}
        <h2 className="text-2xl font-black text-gray-900 mb-4">Course Enrollments</h2>
        <div className="space-y-6">
          {studentEnrollments.map(enrollment => {
            const course = courses.find(c => c.id === enrollment.courseId);
            return (
              <Card key={enrollment.id} className="p-6 shadow-md rounded-xl border border-gray-100 bg-gradient-to-br from-white to-gray-50">
                <div className="flex flex-col sm:flex-row items-center justify-between mb-4 gap-2">
                  <div className="text-center sm:text-left">
                    <h3 className="text-lg font-bold text-gray-900">{course?.title || 'Unknown Course'}</h3>
                    <p className="text-xs text-gray-500 mt-1">Enrolled: {formatDate(enrollment.enrolledAt)}</p>
                  </div>
                  <span className="px-3 py-1 bg-blue-100 text-blue-700 rounded-full font-bold text-xs shadow">{enrollment.attempts.length} Attempt{enrollment.attempts.length !== 1 && 's'}</span>
                </div>
                {/* Attempts List */}
                {enrollment.attempts.length > 0 ? (
                  <div className="space-y-2">
                    <p className="text-xs font-semibold text-gray-700 mb-2">Recent Attempts:</p>
                    {enrollment.attempts.slice(0, 3).map((attempt, idx) => {
                      const percentage = attempt.totalMarks > 0
                        ? ((attempt.score / attempt.totalMarks) * 100).toFixed(1)
                        : 0;
                      return (
                        <div key={idx} className="flex items-center justify-between p-3 bg-gray-50 rounded-lg shadow-inner">
                          <div className="flex items-center gap-3">
                            <span className="text-xs text-gray-600">
                              {formatDate(attempt.submittedAt)}
                            </span>
                            <span className="text-xs font-bold text-gray-900">
                              Score: {attempt.score}/{attempt.totalMarks}
                            </span>
                          </div>
                          <span
                            className={`px-2.5 py-1 rounded-full text-xs font-bold ${percentage >= 80
                                ? 'bg-emerald-100 text-emerald-700'
                                : percentage >= 60
                                  ? 'bg-yellow-100 text-yellow-700'
                                  : 'bg-red-100 text-red-700'
                              }`}
                          >
                            {percentage}%
                          </span>
                        </div>
                      );
                    })}
                  </div>
                ) : (
                  <p className="text-xs text-gray-400 mb-2">No attempts yet</p>
                )}
              </Card>
            );
          })}
        </div>
      </div>
    </AdminLayout>
  );

};

export default AdminStudentDetailsPage;