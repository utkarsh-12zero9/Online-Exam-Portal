import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { useDispatch, useSelector } from 'react-redux';
import AdminLayout from '@/shared/components/layout/AdminLayout';
import Card from '@/shared/components/ui/Card';
import Button from '@/shared/components/ui/Button';
import Input from '@/shared/components/ui/Input';
import { addCourse, updateCourse } from '@/features/courses/slices/courseSlice';
import { toast } from 'react-toastify';

const AdminCourseFormPage = () => {
    const { id } = useParams();
    const navigate = useNavigate();
    const dispatch = useDispatch();

    const courses = useSelector((state) => state.courses.courses);
    const isEditMode = Boolean(id);
    const existingCourse = isEditMode ? courses.find((c) => c.id === Number(id)) : null;

    const [form, setForm] = useState({
        title: '',
        description: '',
        domain: 'Programming',
        difficulty: 'easy',
        duration: 60,
        price: 0,
    });

    const [errors, setErrors] = useState({});

    useEffect(() => {
        if (existingCourse) {
            setForm({
                title: existingCourse.title,
                description: existingCourse.description,
                domain: existingCourse.domain,
                difficulty: existingCourse.difficulty,
                duration: existingCourse.duration,
                price: existingCourse.price,
            });
        }
    }, [existingCourse]);

    const handleChange = (e) => {
        const { name, value } = e.target;
        setForm((prev) => ({ ...prev, [name]: value }));
        if (errors[name]) {
            setErrors((prev) => ({ ...prev, [name]: '' }));
        }
    };

    const validate = () => {
        const newErrors = {};

        if (!form.title.trim()) {
            newErrors.title = 'Title is required';
        }

        if (!form.description.trim()) {
            newErrors.description = 'Description is required';
        }

        if (form.duration < 1) {
            newErrors.duration = 'Duration must be at least 1 minute';
        }

        if (form.price < 0) {
            newErrors.price = 'Price cannot be negative';
        }

        setErrors(newErrors);
        return Object.keys(newErrors).length === 0;
    };

    const handleSubmit = (e) => {
        e.preventDefault();

        if (!validate()) {
            toast.error('Please fix the errors in the form');
            return;
        }

        const courseData = {
            ...form,
            duration: Number(form.duration),
            price: Number(form.price),
        };

        if (isEditMode) {
            dispatch(updateCourse({ id: Number(id), ...courseData }));
            toast.success('Course updated successfully!');
        } else {
            dispatch(addCourse(courseData));
            toast.success('Course created successfully!');
        }

        navigate('/admin/courses');
    };

    return (
        <AdminLayout>
            <div>
                <Button variant="outline" size="sm" onClick={() => navigate('/admin/courses')} className="mb-6">
                    ← Back to Courses
                </Button>

                <div className="max-w-2xl">
                    <h1 className="text-3xl font-bold text-gray-900 mb-2">
                        {isEditMode ? 'Edit Course' : 'Create New Course'}
                    </h1>
                    <p className="text-gray-600 mb-6">
                        {isEditMode ? 'Update course information' : 'Add a new course to the platform'}
                    </p>

                    <Card className="p-6">
                        <form onSubmit={handleSubmit} className="space-y-4">
                            {/* Title */}
                            <div>
                                <Input
                                    label="Course Title"
                                    name="title"
                                    value={form.title}
                                    onChange={handleChange}
                                    placeholder="e.g., React Fundamentals"
                                    required
                                />
                                {errors.title && <p className="text-red-500 text-xs mt-1">{errors.title}</p>}
                            </div>

                            {/* Description */}
                            <div>
                                <label className="block text-sm font-medium text-gray-700 mb-1">
                                    Description <span className="text-red-500">*</span>
                                </label>
                                <textarea
                                    name="description"
                                    value={form.description}
                                    onChange={handleChange}
                                    rows="4"
                                    className="w-full border border-gray-300 rounded-lg px-3 py-2 focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                                    placeholder="Describe the course content and what students will learn..."
                                    required
                                />
                                {errors.description && <p className="text-red-500 text-xs mt-1">{errors.description}</p>}
                            </div>

                            {/* Domain */}
                            <div>
                                <label className="block text-sm font-medium text-gray-700 mb-1">
                                    Domain <span className="text-red-500">*</span>
                                </label>
                                <select
                                    name="domain"
                                    value={form.domain}
                                    onChange={handleChange}
                                    className="w-full border border-gray-300 rounded-lg px-3 py-2 focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                                >
                                    <option value="Programming">Programming</option>
                                    <option value="Design">Design</option>
                                    <option value="Business">Business</option>
                                    <option value="Data Science">Data Science</option>
                                    <option value="Marketing">Marketing</option>
                                </select>
                            </div>

                            {/* Difficulty */}
                            <div>
                                <label className="block text-sm font-medium text-gray-700 mb-1">
                                    Difficulty Level <span className="text-red-500">*</span>
                                </label>
                                <select
                                    name="difficulty"
                                    value={form.difficulty}
                                    onChange={handleChange}
                                    className="w-full border border-gray-300 rounded-lg px-3 py-2 focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                                >
                                    <option value="easy">Easy</option>
                                    <option value="medium">Medium</option>
                                    <option value="hard">Hard</option>
                                </select>
                            </div>

                            {/* Duration & Price */}
                            <div className="grid grid-cols-2 gap-4">
                                <div>
                                    <Input
                                        label="Duration (minutes)"
                                        name="duration"
                                        type="number"
                                        value={form.duration}
                                        onChange={handleChange}
                                        min="1"
                                        required
                                    />
                                    {errors.duration && <p className="text-red-500 text-xs mt-1">{errors.duration}</p>}
                                </div>

                                <div>
                                    <Input
                                        label="Price (₹)"
                                        name="price"
                                        type="number"
                                        value={form.price}
                                        onChange={handleChange}
                                        min="0"
                                        required
                                    />
                                    {errors.price && <p className="text-red-500 text-xs mt-1">{errors.price}</p>}
                                </div>
                            </div>

                            {/* Submit Buttons */}
                            <div className="flex gap-3 pt-4">
                                <Button
                                    type="button"
                                    variant="outline"
                                    onClick={() => navigate('/admin/courses')}
                                    fullWidth
                                >
                                    Cancel
                                </Button>
                                <Button type="submit" variant="primary" fullWidth>
                                    {isEditMode ? 'Update Course' : 'Create Course'}
                                </Button>
                            </div>
                        </form>
                    </Card>
                </div>
            </div>
        </AdminLayout>
    );
};

export default AdminCourseFormPage;