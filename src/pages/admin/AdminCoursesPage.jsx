import React, { useState } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import { useNavigate } from 'react-router-dom';
import {
  addCourse,
  updateCourse,
  deleteCourse,
  toggleCourseStatus,
  setSelectedCourse,
} from '@/features/courses/slices/courseSlice';
import AdminLayout from '@/shared/components/layout/AdminLayout';
import Card from '@/shared/components/ui/Card';
import Button from '@/shared/components/ui/Button';
import CourseForm from './CourseForm';
import { toast } from 'react-toastify';

const getStatusColor = (active) =>
  active ? 'bg-emerald-100 text-emerald-800' : 'bg-gray-100 text-gray-600';

function AdminCoursesPage() {
  const { courses, selectedCourse } = useSelector((state) => state.courses);
  const dispatch = useDispatch();
  const navigate = useNavigate();
  
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editMode, setEditMode] = useState(false);
  const [form, setForm] = useState({
    title: '',
    description: '',
    domain: '',
    difficulty: 'easy',
    duration: 60,
    price: 0,
    tags: '',
    attemptLimit: 1,
    isActive: true,
  });

  // Open Add/Edit modal
  const openModal = (course = null) => {
    setEditMode(!!course);
    setForm(
      course
        ? {
            ...course,
            tags: course.tags.join(', '),
          }
        : {
            title: '',
            description: '',
            domain: '',
            difficulty: 'easy',
            duration: 60,
            price: 0,
            tags: '',
            attemptLimit: 1,
            isActive: true,
          }
    );
    setIsModalOpen(true);
    if (course) dispatch(setSelectedCourse(course));
  };

  // Close modal
  const closeModal = () => {
    setIsModalOpen(false);
    setEditMode(false);
    dispatch(setSelectedCourse(null));
  };

  const handleChange = (e) => {
    let { name, value } = e.target;
    if (name === 'price' || name === 'duration' || name === 'attemptLimit')
      value = Number(value);
    if (name === 'isActive') value = e.target.checked;
    setForm((f) => ({
      ...f,
      [name]: value,
    }));
  };

  // Save new or update
  const handleSave = (e) => {
    e.preventDefault();
    const courseData = {
      ...form,
      tags: form.tags.split(',').map((t) => t.trim()),
    };
    if (editMode) {
      dispatch(updateCourse({ ...selectedCourse, ...courseData }));
      toast.success('Course updated!');
    } else {
      dispatch(addCourse(courseData));
      toast.success('Course added!');
    }
    closeModal();
  };

  // Delete
  const handleDelete = (id) => {
    dispatch(deleteCourse(id));
    toast.error('Course deleted!');
    closeModal();
  };

  // Toggle active/inactive
  const handleToggleActive = (id) => {
    dispatch(toggleCourseStatus(id));
    toast.info('Course status changed!');
  };

  return (
    <AdminLayout>
      <div>
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between mb-4 gap-2">
          <h1 className="text-2xl font-bold text-gray-900">Manage Courses</h1>
          <Button
            variant="secondary"
            className="w-full sm:w-auto"
            onClick={() => openModal()}
          >
            + Add New Course
          </Button>
        </div>

        {/* Table (Desktop/tablet) */}
        <div className="hidden sm:block">
          <Card className="p-0 overflow-x-auto">
            <table className="w-full text-sm">
              <thead>
                <tr className="bg-blue-100 border-b">
                  <th className="py-3 px-4 font-medium text-gray-600">Course</th>
                  <th className="py-3 px-4 font-medium text-gray-600">Domain</th>
                  <th className="py-3 px-4 font-medium text-gray-600">Difficulty</th>
                  <th className="py-3 px-4 font-medium text-gray-600">Status</th>
                  <th className="py-3 px-4 font-medium text-gray-600">Price</th>
                  <th className="py-3 px-4 font-medium text-gray-600">Actions</th>
                </tr>
              </thead>
              <tbody>
                {courses.map((c) => (
                  <tr key={c.id} className="border-b hover:bg-gray-50">
                    <td className="py-3 px-4">
                      <span className="font-semibold text-gray-900">{c.title}</span>
                      <br />
                      <span className="text-xs text-gray-500">{c.tags.join(', ')}</span>
                    </td>
                    <td className="py-3 px-4 text-gray-600">{c.domain}</td>
                    <td className="py-3 px-4">
                      <span
                        className={`px-2 py-1 rounded text-xs font-semibold ${
                          c.difficulty === 'easy'
                            ? 'bg-emerald-100 text-emerald-800'
                            : c.difficulty === 'medium'
                            ? 'bg-yellow-100 text-yellow-700'
                            : 'bg-red-100 text-red-700'
                        }`}
                      >
                        {c.difficulty}
                      </span>
                    </td>
                    <td className="py-3 px-4">
                      <Button
                        variant={c.isActive ? 'primary' : 'outline'}
                        size="sm"
                        className={getStatusColor(c.isActive)}
                        onClick={() => handleToggleActive(c.id)}
                      >
                        {c.isActive ? 'Active' : 'Inactive'}
                      </Button>
                    </td>
                    <td className="py-3 px-4">{c.price === 0 ? 'Free' : `₹${c.price}`}</td>
                    <td className="py-3 px-4 flex gap-2">
                      <Button
                        variant="primary"
                        size="sm"
                        onClick={() => navigate(`/admin/courses/${c.id}`)}
                      >
                        Manage
                      </Button>
                      <Button
                        variant="secondary"
                        size="sm"
                        onClick={() => openModal(c)}
                      >
                        Edit
                      </Button>
                      <Button
                        variant="danger"
                        size="sm"
                        onClick={() => handleDelete(c.id)}
                      >
                        Delete
                      </Button>
                    </td>
                  </tr>
                ))}
                {courses.length === 0 && (
                  <tr>
                    <td colSpan={6} className="text-center text-gray-400 py-8">
                      No courses found.
                    </td>
                  </tr>
                )}
              </tbody>
            </table>
          </Card>
        </div>

        {/* Mobile Card List */}
        <div className="sm:hidden flex flex-col gap-4">
          {courses.map((c) => (
            <Card key={c.id} className="p-4">
              <div className="flex justify-between items-center mb-2">
                <h2 className="font-bold text-lg">{c.title}</h2>
                <Button
                  variant={c.isActive ? 'primary' : 'outline'}
                  size="sm"
                  className={getStatusColor(c.isActive)}
                  onClick={() => handleToggleActive(c.id)}
                >
                  {c.isActive ? 'Active' : 'Inactive'}
                </Button>
              </div>
              <p className="text-sm text-gray-600 mb-2">{c.description}</p>
              <div className="flex gap-2 flex-wrap mb-2">
                {c.tags.map((tag, i) => (
                  <span
                    key={tag + i}
                    className="px-2 py-1 bg-gray-100 rounded text-xs text-gray-700"
                  >
                    {tag}
                  </span>
                ))}
              </div>
              <div className="flex gap-2">
                <Button 
                  variant="primary" 
                  size="sm" 
                  onClick={() => navigate(`/admin/courses/${c.id}`)}
                >
                  Manage
                </Button>
                <Button variant="secondary" size="sm" onClick={() => openModal(c)}>
                  Edit
                </Button>
                <Button variant="danger" size="sm" onClick={() => handleDelete(c.id)}>
                  Delete
                </Button>
              </div>
            </Card>
          ))}
          {courses.length === 0 && (
            <Card className="p-4 flex items-center justify-center">
              <span className="text-gray-500">No courses found.</span>
            </Card>
          )}
        </div>

        {/* Add/Edit Modal */}
        {isModalOpen && (
          <CourseForm
            form={form}
            handleChange={handleChange}
            handleSave={handleSave}
            editMode={editMode}
            handleDelete={editMode ? handleDelete : undefined}
            closeModal={closeModal}
            selectedCourse={selectedCourse}
          />
        )}
      </div>
    </AdminLayout>
  );
}

export default AdminCoursesPage;
