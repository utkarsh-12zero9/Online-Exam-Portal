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

  // Calculate stats
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
      <div>
        <Button variant="outline" size="sm" onClick={() => navigate('/admin/users')} className="mb-6">
          ← Back to Students
        </Button>

        {/* Student Profile Card */}
        <Card className="p-6 mb-6">
          <div className="flex items-start gap-4">
            <div className="w-20 h-20 rounded-full bg-blue-100 flex items-center justify-center text-blue-700 font-bold text-3xl">
              {student.name.charAt(0).toUpperCase()}
            </div>
            <div className="flex-1">
              <h1 className="text-2xl font-bold text-gray-900 mb-1">{student.name}</h1>
              <p className="text-gray-600 mb-3">{student.email}</p>
              <div className="flex items-center gap-4 text-sm text-gray-600">
                <span>Role: <span className="font-semibold">{student.role}</span></span>
                <span>Joined: <span className="font-semibold">{student.createdAt ? formatDate(student.createdAt) : 'N/A'}</span></span>
              </div>
            </div>
          </div>
        </Card>

        {/* Stats Grid */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-6">
          <Card className="p-6">
            <p className="text-gray-600 text-sm mb-1">Enrolled Courses</p>
            <p className="text-3xl font-bold text-blue-600">{studentEnrollments.length}</p>
          </Card>
          <Card className="p-6">
            <p className="text-gray-600 text-sm mb-1">Total Attempts</p>
            <p className="text-3xl font-bold text-purple-600">{totalAttempts}</p>
          </Card>
          <Card className="p-6">
            <p className="text-gray-600 text-sm mb-1">Total Score</p>
            <p className="text-3xl font-bold text-emerald-600">{totalScore}</p>
          </Card>
          <Card className="p-6">
            <p className="text-gray-600 text-sm mb-1">Average %</p>
            <p className="text-3xl font-bold text-yellow-600">{avgPercentage}%</p>
          </Card>
        </div>

        {/* Enrollments & Attempts */}
        <h2 className="text-2xl font-bold text-gray-900 mb-4">Course Enrollments</h2>
        <div className="space-y-4">
          {studentEnrollments.map((enrollment) => {
            const course = courses.find((c) => c.id === enrollment.courseId);
            return (
              <Card key={enrollment.id} className="p-6">
                <div className="flex items-start justify-between mb-4">
                  <div>
                    <h3 className="text-lg font-bold text-gray-900">{course?.title || 'Unknown Course'}</h3>
                    <p className="text-sm text-gray-600">
                      Enrolled: {formatDate(enrollment.enrolledAt)}
                    </p>
                  </div>
                  <span className="px-3 py-1 bg-blue-100 text-blue-700 rounded font-semibold text-sm">
                    {enrollment.attempts.length} Attempts
                  </span>
                </div>

                {/* Attempts List */}
                {enrollment.attempts.length > 0 ? (
                  <div className="space-y-2">
                    <p className="text-sm font-semibold text-gray-700 mb-2">Recent Attempts:</p>
                    {enrollment.attempts.slice(0, 3).map((attempt, idx) => {
                      const percentage = attempt.totalMarks > 0 
                        ? ((attempt.score / attempt.totalMarks) * 100).toFixed(1)
                        : 0;
                      return (
                        <div key={idx} className="flex items-center justify-between p-3 bg-gray-50 rounded">
                          <div className="flex items-center gap-3">
                            <span className="text-sm text-gray-600">
                              {formatDate(attempt.submittedAt)}
                            </span>
                            <span className="text-sm font-semibold text-gray-900">
                              Score: {attempt.score}/{attempt.totalMarks}
                            </span>
                          </div>
                          <span
                            className={`px-2 py-1 rounded text-xs font-semibold ${
                              percentage >= 80
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
                  <p className="text-sm text-gray-500">No attempts yet</p>
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
