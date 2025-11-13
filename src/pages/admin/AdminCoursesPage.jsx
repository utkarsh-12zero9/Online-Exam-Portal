import React, { useState } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import { useNavigate } from 'react-router-dom';
import AdminLayout from '@/shared/components/layout/AdminLayout';
import Card from '@/shared/components/ui/Card';
import Button from '@/shared/components/ui/Button';
import Input from '@/shared/components/ui/Input';
import { deleteCourse, bulkDeleteCourses } from '@/features/courses/slices/courseSlice';
import { toast } from 'react-toastify';

const AdminCoursesPage = () => {
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const courses = useSelector((state) => state.courses.courses);

  const [searchTerm, setSearchTerm] = useState('');
  const [filterDomain, setFilterDomain] = useState('all');
  const [filterDifficulty, setFilterDifficulty] = useState('all');
  const [selectedCourses, setSelectedCourses] = useState([]);

  const filteredCourses = courses.filter((course) => {
    const matchesSearch = course.title.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesDomain = filterDomain === 'all' || course.domain === filterDomain;
    const matchesDifficulty = filterDifficulty === 'all' || course.difficulty === filterDifficulty;
    return matchesSearch && matchesDomain && matchesDifficulty;
  });

  const handleSelectAll = (e) => {
    if (e.target.checked) {
      setSelectedCourses(filteredCourses.map((c) => c.id));
    } else {
      setSelectedCourses([]);
    }
  };

  const handleSelectOne = (courseId) => {
    if (selectedCourses.includes(courseId)) {
      setSelectedCourses(selectedCourses.filter((id) => id !== courseId));
    } else {
      setSelectedCourses([...selectedCourses, courseId]);
    }
  };

  const handleBulkDelete = () => {
    if (selectedCourses.length === 0) {
      toast.warning('Please select courses to delete');
      return;
    }

    const confirmMessage = `Are you sure you want to delete ${selectedCourses.length} course${selectedCourses.length > 1 ? 's' : ''
      }? This will also delete all associated modules and questions.`;

    if (window.confirm(confirmMessage)) {
      dispatch(bulkDeleteCourses(selectedCourses));
      toast.success(`${selectedCourses.length} course${selectedCourses.length > 1 ? 's' : ''} deleted successfully`);
      setSelectedCourses([]);
    }
  };

  const handleDeleteSingle = (id, title) => {
    if (window.confirm(`Are you sure you want to delete "${title}"? This will also delete all associated modules and questions.`)) {
      dispatch(deleteCourse(id));
      toast.success('Course deleted successfully');
      setSelectedCourses(selectedCourses.filter((courseId) => courseId !== id));
    }
  };

  const allSelected = filteredCourses.length > 0 && selectedCourses.length === filteredCourses.length;
  const someSelected = selectedCourses.length > 0 && !allSelected;

  return (
    <AdminLayout>
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
        {/* Header Section */}
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 mb-8">
          <div>
            <h1 className="text-2xl sm:text-3xl font-bold text-gray-900 tracking-tight">
              Course Management
            </h1>
            <p className="text-sm sm:text-base text-gray-600 mt-1">
              Manage all courses and their modules
            </p>
          </div>
          <Button
            variant="primary"
            onClick={() => navigate('/admin/courses/create')}
            className="w-full sm:w-auto"
          >
            <span className="flex items-center justify-center gap-2">
              <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" />
              </svg>
              Create Course
            </span>
          </Button>
        </div>

        {/* Filters & Search Card */}
        <Card className="p-4 sm:p-6 mb-6 shadow-sm border border-gray-200">
          <div className="space-y-4">
            {/* Search & Filters Row */}
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3">
              <div className="sm:col-span-2 lg:col-span-2">
                <div className="relative">
                  <svg
                    className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400"
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24"
                  >
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
                  </svg>
                  <Input
                    placeholder="Search courses by title or description..."
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                    className="pl-10 w-full"
                  />
                </div>
              </div>

              <select
                value={filterDomain}
                onChange={(e) => setFilterDomain(e.target.value)}
                className="w-full border border-gray-300 rounded-lg px-4 py-2.5 text-sm bg-white hover:border-gray-400 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-colors"
              >
                <option value="all">All Domains</option>
                <option value="Programming">Programming</option>
                <option value="Design">Design</option>
                <option value="Business">Business</option>
              </select>

              <select
                value={filterDifficulty}
                onChange={(e) => setFilterDifficulty(e.target.value)}
                className="w-full border border-gray-300 rounded-lg px-4 py-2.5 text-sm bg-white hover:border-gray-400 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-colors"
              >
                <option value="all">All Difficulties</option>
                <option value="easy">Easy</option>
                <option value="medium">Medium</option>
                <option value="hard">Hard</option>
              </select>
            </div>

            {/* Results & Bulk Actions Row */}
            <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3 pt-2 border-t border-gray-100">
              <span className="text-sm text-gray-600 font-medium">
                Showing <span className="text-gray-900 font-semibold">{filteredCourses.length}</span> of {courses.length} courses
              </span>
              {selectedCourses.length > 0 && (
                <Button
                  variant="danger"
                  size="sm"
                  onClick={handleBulkDelete}
                  className="w-full sm:w-auto"
                >
                  <span className="flex items-center justify-center gap-2">
                    <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
                    </svg>
                    Delete Selected ({selectedCourses.length})
                  </span>
                </Button>
              )}
            </div>
          </div>
        </Card>

        {/* Desktop Table View (Hidden on Mobile) */}
        <Card className="hidden lg:block overflow-hidden shadow-sm border border-gray-200">
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead className="bg-gradient-to-r from-gray-50 to-gray-100 border-b border-gray-200">
                <tr>
                  <th className="px-6 py-4 text-left w-12">
                    <input
                      type="checkbox"
                      checked={allSelected}
                      ref={(input) => {
                        if (input) input.indeterminate = someSelected;
                      }}
                      onChange={handleSelectAll}
                      className="w-4 h-4 text-blue-600 border-gray-300 rounded focus:ring-blue-500 focus:ring-2 cursor-pointer"
                    />
                  </th>
                  <th className="px-6 py-4 text-left text-xs font-semibold text-gray-700 uppercase tracking-wider">
                    Course
                  </th>
                  <th className="px-6 py-4 text-left text-xs font-semibold text-gray-700 uppercase tracking-wider">
                    Domain
                  </th>
                  <th className="px-6 py-4 text-left text-xs font-semibold text-gray-700 uppercase tracking-wider">
                    Difficulty
                  </th>
                  <th className="px-6 py-4 text-left text-xs font-semibold text-gray-700 uppercase tracking-wider">
                    Duration
                  </th>
                  <th className="px-6 py-4 text-left text-xs font-semibold text-gray-700 uppercase tracking-wider">
                    Price
                  </th>
                  <th className="px-6 py-4 text-right text-xs font-semibold text-gray-700 uppercase tracking-wider">
                    Actions
                  </th>
                </tr>
              </thead>
              <tbody className="bg-white divide-y divide-gray-200">
                {filteredCourses.length > 0 ? (
                  filteredCourses.map((course) => {
                    const isSelected = selectedCourses.includes(course.id);
                    return (
                      <tr
                        key={course.id}
                        className={`transition-colors duration-150 ${isSelected ? 'bg-blue-50' : 'hover:bg-gray-50'
                          }`}
                      >
                        <td className="px-6 py-4">
                          <input
                            type="checkbox"
                            checked={isSelected}
                            onChange={() => handleSelectOne(course.id)}
                            className="w-4 h-4 text-blue-600 border-gray-300 rounded focus:ring-blue-500 focus:ring-2 cursor-pointer"
                          />
                        </td>
                        <td className="px-6 py-4 max-w-md">
                          <div className="text-sm font-semibold text-gray-900 mb-1">
                            {course.title}
                          </div>
                          <div className="text-sm text-gray-500 line-clamp-1">
                            {course.description}
                          </div>
                        </td>
                        <td className="px-6 py-4">
                          <span className="inline-flex items-center px-2.5 py-1 text-xs font-semibold rounded-full bg-blue-100 text-blue-800">
                            {course.domain}
                          </span>
                        </td>
                        <td className="px-6 py-4">
                          <span
                            className={`inline-flex items-center px-2.5 py-1 text-xs font-semibold rounded-full ${course.difficulty === 'easy'
                                ? 'bg-emerald-100 text-emerald-800'
                                : course.difficulty === 'medium'
                                  ? 'bg-yellow-100 text-yellow-800'
                                  : 'bg-red-100 text-red-800'
                              }`}
                          >
                            {course.difficulty.charAt(0).toUpperCase() + course.difficulty.slice(1)}
                          </span>
                        </td>
                        <td className="px-6 py-4 text-sm text-gray-900 font-medium">
                          {course.duration} min
                        </td>
                        <td className="px-6 py-4 text-sm text-gray-900 font-semibold">
                          ₹{course.price}
                        </td>
                        <td className="px-6 py-4">
                          <div className="flex justify-end gap-2">
                            <Button
                              variant="secondary"
                              size="sm"
                              onClick={() => navigate(`/admin/courses/${course.id}`)}
                            >
                              View
                            </Button>
                            <Button
                              variant="danger"
                              size="sm"
                              onClick={() => handleDeleteSingle(course.id, course.title)}
                            >
                              Delete
                            </Button>
                          </div>
                        </td>
                      </tr>
                    );
                  })
                ) : (
                  <tr>
                    <td colSpan="7" className="px-6 py-16 text-center">
                      <div className="flex flex-col items-center justify-center">
                        <svg className="w-16 h-16 text-gray-300 mb-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M12 6.253v13m0-13C10.832 5.477 9.246 5 7.5 5S4.168 5.477 3 6.253v13C4.168 18.477 5.754 18 7.5 18s3.332.477 4.5 1.253m0-13C13.168 5.477 14.754 5 16.5 5c1.747 0 3.332.477 4.5 1.253v13C19.832 18.477 18.247 18 16.5 18c-1.746 0-3.332.477-4.5 1.253" />
                        </svg>
                        <p className="text-gray-500 font-medium">No courses found</p>
                        <p className="text-gray-400 text-sm mt-1">Try adjusting your filters or create a new course</p>
                      </div>
                    </td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>
        </Card>

        {/* Mobile Card View (Hidden on Desktop) */}
        <div className="lg:hidden space-y-4">
          {filteredCourses.length > 0 ? (
            filteredCourses.map((course) => {
              const isSelected = selectedCourses.includes(course.id);
              return (
                <Card
                  key={course.id}
                  className={`p-4 shadow-sm border transition-all duration-150 ${isSelected ? 'border-blue-500 bg-blue-50' : 'border-gray-200 hover:shadow-md'
                    }`}
                >
                  <div className="space-y-3">
                    {/* Header Row */}
                    <div className="flex items-start justify-between">
                      <div className="flex items-start gap-3 flex-1">
                        <input
                          type="checkbox"
                          checked={isSelected}
                          onChange={() => handleSelectOne(course.id)}
                          className="w-5 h-5 mt-1 text-blue-600 border-gray-300 rounded focus:ring-blue-500 focus:ring-2 cursor-pointer"
                        />
                        <div className="flex-1 min-w-0">
                          <h3 className="text-base font-semibold text-gray-900 mb-1">
                            {course.title}
                          </h3>
                          <p className="text-sm text-gray-600 line-clamp-2">
                            {course.description}
                          </p>
                        </div>
                      </div>
                    </div>

                    {/* Badges Row */}
                    <div className="flex flex-wrap gap-2">
                      <span className="inline-flex items-center px-2.5 py-1 text-xs font-semibold rounded-full bg-blue-100 text-blue-800">
                        {course.domain}
                      </span>
                      <span
                        className={`inline-flex items-center px-2.5 py-1 text-xs font-semibold rounded-full ${course.difficulty === 'easy'
                            ? 'bg-emerald-100 text-emerald-800'
                            : course.difficulty === 'medium'
                              ? 'bg-yellow-100 text-yellow-800'
                              : 'bg-red-100 text-red-800'
                          }`}
                      >
                        {course.difficulty.charAt(0).toUpperCase() + course.difficulty.slice(1)}
                      </span>
                    </div>

                    {/* Info Row */}
                    <div className="flex items-center gap-4 text-sm">
                      <div className="flex items-center gap-1.5 text-gray-600">
                        <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
                        </svg>
                        <span className="font-medium">{course.duration} min</span>
                      </div>
                      <div className="flex items-center gap-1.5 text-gray-900">
                        <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8c-1.657 0-3 .895-3 2s1.343 2 3 2 3 .895 3 2-1.343 2-3 2m0-8c1.11 0 2.08.402 2.599 1M12 8V7m0 1v8m0 0v1m0-1c-1.11 0-2.08-.402-2.599-1M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                        </svg>
                        <span className="font-semibold">₹{course.price}</span>
                      </div>
                    </div>

                    {/* Action Buttons Row */}
                    <div className="grid grid-cols-2 gap-2 pt-2 border-t border-gray-200">
                      <Button
                        variant="secondary"
                        size="sm"
                        onClick={() => navigate(`/admin/courses/${course.id}`)}
                        className="w-full"
                      >
                        View Details
                      </Button>
                      <Button
                        variant="danger"
                        size="sm"
                        onClick={() => handleDeleteSingle(course.id, course.title)}
                        className="w-full"
                      >
                        Delete
                      </Button>
                    </div>
                  </div>
                </Card>
              );
            })
          ) : (
            <Card className="p-12 text-center">
              <div className="flex flex-col items-center justify-center">
                <svg className="w-20 h-20 text-gray-300 mb-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M12 6.253v13m0-13C10.832 5.477 9.246 5 7.5 5S4.168 5.477 3 6.253v13C4.168 18.477 5.754 18 7.5 18s3.332.477 4.5 1.253m0-13C13.168 5.477 14.754 5 16.5 5c1.747 0 3.332.477 4.5 1.253v13C19.832 18.477 18.247 18 16.5 18c-1.746 0-3.332.477-4.5 1.253" />
                </svg>
                <p className="text-gray-500 font-medium text-base">No courses found</p>
                <p className="text-gray-400 text-sm mt-1">Try adjusting your filters or create a new course</p>
              </div>
            </Card>
          )}
        </div>
      </div>
    </AdminLayout>
  );

};

export default AdminCoursesPage;
