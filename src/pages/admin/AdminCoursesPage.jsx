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

    const confirmMessage = `Are you sure you want to delete ${selectedCourses.length} course${
      selectedCourses.length > 1 ? 's' : ''
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
      <div>
        <div className="flex items-center justify-between mb-6">
          <div>
            <h1 className="text-3xl font-bold text-gray-900 mb-2">Course Management</h1>
            <p className="text-gray-600">Manage all courses and their modules</p>
          </div>
          <Button variant="primary" onClick={() => navigate('/admin/courses/create')}>
            + Create Course
          </Button>
        </div>

        {/* Filters & Bulk Actions */}
        <Card className="p-4 mb-6">
          <div className="flex flex-col gap-3">
            <div className="flex flex-col sm:flex-row gap-3">
              <Input
                placeholder="Search courses..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="flex-1"
              />
              <select
                value={filterDomain}
                onChange={(e) => setFilterDomain(e.target.value)}
                className="border border-gray-300 rounded-lg px-3 py-2"
              >
                <option value="all">All Domains</option>
                <option value="Programming">Programming</option>
                <option value="Design">Design</option>
                <option value="Business">Business</option>
              </select>
              <select
                value={filterDifficulty}
                onChange={(e) => setFilterDifficulty(e.target.value)}
                className="border border-gray-300 rounded-lg px-3 py-2"
              >
                <option value="all">All Difficulties</option>
                <option value="easy">Easy</option>
                <option value="medium">Medium</option>
                <option value="hard">Hard</option>
              </select>
            </div>

            <div className="flex items-center justify-between">
              <span className="text-sm text-gray-600">
                Showing {filteredCourses.length} of {courses.length} courses
              </span>
              {selectedCourses.length > 0 && (
                <Button variant="danger" size="sm" onClick={handleBulkDelete}>
                  Delete Selected ({selectedCourses.length})
                </Button>
              )}
            </div>
          </div>
        </Card>

        {/* Courses Table */}
        <Card className="overflow-hidden">
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead className="bg-gray-50 border-b border-gray-200">
                <tr>
                  <th className="px-6 py-3 text-left">
                    <input
                      type="checkbox"
                      checked={allSelected}
                      ref={(input) => {
                        if (input) input.indeterminate = someSelected;
                      }}
                      onChange={handleSelectAll}
                      className="w-4 h-4 text-blue-600 border-gray-300 rounded focus:ring-blue-500"
                    />
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Course</th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Domain</th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Difficulty</th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Duration</th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Price</th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Actions</th>
                </tr>
              </thead>
              <tbody className="bg-white divide-y divide-gray-200">
                {filteredCourses.length > 0 ? (
                  filteredCourses.map((course) => {
                    const isSelected = selectedCourses.includes(course.id);
                    return (
                      <tr key={course.id} className={`hover:bg-gray-50 ${isSelected ? 'bg-blue-50' : ''}`}>
                        <td className="px-6 py-4">
                          <input
                            type="checkbox"
                            checked={isSelected}
                            onChange={() => handleSelectOne(course.id)}
                            className="w-4 h-4 text-blue-600 border-gray-300 rounded focus:ring-blue-500"
                          />
                        </td>
                        <td className="px-6 py-4">
                          <div className="text-sm font-medium text-gray-900">{course.title}</div>
                          <div className="text-sm text-gray-500 line-clamp-1">{course.description}</div>
                        </td>
                        <td className="px-6 py-4">
                          <span className="px-2 py-1 text-xs font-semibold rounded-full bg-blue-100 text-blue-800">
                            {course.domain}
                          </span>
                        </td>
                        <td className="px-6 py-4">
                          <span
                            className={`px-2 py-1 text-xs font-semibold rounded-full ${
                              course.difficulty === 'easy'
                                ? 'bg-emerald-100 text-emerald-800'
                                : course.difficulty === 'medium'
                                ? 'bg-yellow-100 text-yellow-800'
                                : 'bg-red-100 text-red-800'
                            }`}
                          >
                            {course.difficulty}
                          </span>
                        </td>
                        <td className="px-6 py-4 text-sm text-gray-900">{course.duration} min</td>
                        <td className="px-6 py-4 text-sm text-gray-900">₹{course.price}</td>
                        <td className="px-6 py-4">
                          <div className="flex gap-2">
                            <Button variant="secondary" size="sm" onClick={() => navigate(`/admin/courses/${course.id}`)}>
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
                    <td colSpan="7" className="px-6 py-12 text-center text-gray-500">
                      No courses found
                    </td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>
        </Card>
      </div>
    </AdminLayout>
  );
};

export default AdminCoursesPage;
