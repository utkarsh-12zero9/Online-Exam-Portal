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
            <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
                {/* Improved Back Button */}
                <div className="mb-6">
                    <button
                        onClick={() => navigate('/admin/courses')}
                        className="inline-flex items-center gap-2 text-gray-600 hover:text-gray-900 transition-colors group mb-6"
                    >
                        <svg
                            className="w-5 h-5 transition-transform group-hover:-translate-x-1"
                            fill="none"
                            stroke="currentColor"
                            viewBox="0 0 24 24"
                        >
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
                        </svg>
                        <span className="text-sm font-medium">Back to Courses</span>
                    </button>

                    <div className="flex items-start gap-4">
                        <div className="flex-shrink-0 w-12 h-12 sm:w-16 sm:h-16 rounded-xl bg-gradient-to-br from-blue-500 to-indigo-600 flex items-center justify-center shadow-lg">
                            <svg className="w-6 h-6 sm:w-8 sm:h-8 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d={isEditMode ? "M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z" : "M12 4v16m8-8H4"} />
                            </svg>
                        </div>
                        <div className="flex-1">
                            <h1 className="text-2xl sm:text-3xl font-bold text-gray-900 tracking-tight mb-2">
                                {isEditMode ? 'Edit Course' : 'Create New Course'}
                            </h1>
                            <p className="text-sm sm:text-base text-gray-600">
                                {isEditMode ? 'Update course information and details' : 'Add a new course to your learning platform'}
                            </p>
                        </div>
                    </div>
                </div>

                {/* Form Card */}
                <Card className="overflow-hidden shadow-lg border border-gray-200">
                    {/* Progress Indicator for Edit Mode */}
                    {isEditMode && (
                        <div className="bg-blue-50 border-b border-blue-100 px-4 sm:px-6 py-3">
                            <div className="flex items-center gap-2 text-sm text-blue-800">
                                <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                                </svg>
                                <span className="font-medium">You are editing an existing course</span>
                            </div>
                        </div>
                    )}

                    <form onSubmit={handleSubmit} className="p-4 sm:p-6 lg:p-8">
                        <div className="space-y-6">
                            {/* Course Title */}
                            <div>
                                <label className="block text-sm font-semibold text-gray-700 mb-2">
                                    Course Title <span className="text-red-500">*</span>
                                </label>
                                <Input
                                    name="title"
                                    value={form.title}
                                    onChange={handleChange}
                                    placeholder="e.g., React Fundamentals for Beginners"
                                    className="text-base"
                                    required
                                />
                                {errors.title && (
                                    <div className="flex items-center gap-1.5 mt-2 text-red-600">
                                        <svg className="w-4 h-4 flex-shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                                        </svg>
                                        <p className="text-xs font-medium">{errors.title}</p>
                                    </div>
                                )}
                                <p className="text-xs text-gray-500 mt-1.5">
                                    Choose a clear, descriptive title that explains what students will learn
                                </p>
                            </div>

                            {/* Description */}
                            <div>
                                <label className="block text-sm font-semibold text-gray-700 mb-2">
                                    Description <span className="text-red-500">*</span>
                                </label>
                                <div className="relative">
                                    <textarea
                                        name="description"
                                        value={form.description}
                                        onChange={handleChange}
                                        rows="5"
                                        className="w-full border border-gray-300 rounded-lg px-4 py-3 text-base focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-shadow resize-none"
                                        placeholder="Describe the course content, learning objectives, and what students will achieve..."
                                        required
                                    />
                                    <div className="absolute bottom-3 right-3 text-xs text-gray-400">
                                        {form.description.length} characters
                                    </div>
                                </div>
                                {errors.description && (
                                    <div className="flex items-center gap-1.5 mt-2 text-red-600">
                                        <svg className="w-4 h-4 flex-shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                                        </svg>
                                        <p className="text-xs font-medium">{errors.description}</p>
                                    </div>
                                )}
                                <p className="text-xs text-gray-500 mt-1.5">
                                    Provide a detailed overview to help students understand the course value
                                </p>
                            </div>

                            {/* Domain & Difficulty - Row */}
                            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 sm:gap-6">
                                {/* Domain */}
                                <div>
                                    <label className="block text-sm font-semibold text-gray-700 mb-2">
                                        Domain <span className="text-red-500">*</span>
                                    </label>
                                    <div className="relative">
                                        <select
                                            name="domain"
                                            value={form.domain}
                                            onChange={handleChange}
                                            className="w-full appearance-none border border-gray-300 rounded-lg pl-4 pr-10 py-3 text-base bg-white hover:border-gray-400 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all cursor-pointer"
                                        >
                                            <option value="Programming">📱 Programming</option>
                                            <option value="Design">🎨 Design</option>
                                            <option value="Business">💼 Business</option>
                                            <option value="Data Science">📊 Data Science</option>
                                            <option value="Marketing">📢 Marketing</option>
                                        </select>
                                        <div className="absolute inset-y-0 right-0 flex items-center pr-3 pointer-events-none">
                                            <svg className="w-5 h-5 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
                                            </svg>
                                        </div>
                                    </div>
                                    <p className="text-xs text-gray-500 mt-1.5">
                                        Select the primary category
                                    </p>
                                </div>

                                {/* Difficulty */}
                                <div>
                                    <label className="block text-sm font-semibold text-gray-700 mb-2">
                                        Difficulty Level <span className="text-red-500">*</span>
                                    </label>
                                    <div className="relative">
                                        <select
                                            name="difficulty"
                                            value={form.difficulty}
                                            onChange={handleChange}
                                            className="w-full appearance-none border border-gray-300 rounded-lg pl-4 pr-10 py-3 text-base bg-white hover:border-gray-400 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all cursor-pointer"
                                        >
                                            <option value="easy">🟢 Easy - Beginner Friendly</option>
                                            <option value="medium">🟡 Medium - Intermediate</option>
                                            <option value="hard">🔴 Hard - Advanced</option>
                                        </select>
                                        <div className="absolute inset-y-0 right-0 flex items-center pr-3 pointer-events-none">
                                            <svg className="w-5 h-5 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
                                            </svg>
                                        </div>
                                    </div>
                                    <p className="text-xs text-gray-500 mt-1.5">
                                        Set the skill level required
                                    </p>
                                </div>
                            </div>

                            {/* Duration & Price - Row */}
                            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 sm:gap-6">
                                {/* Duration */}
                                <div>
                                    <label className="block text-sm font-semibold text-gray-700 mb-2">
                                        Duration (minutes) <span className="text-red-500">*</span>
                                    </label>
                                    <div className="relative">
                                        <div className="absolute inset-y-0 left-0 flex items-center pl-3 pointer-events-none">
                                            <svg className="w-5 h-5 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
                                            </svg>
                                        </div>
                                        <Input
                                            name="duration"
                                            type="number"
                                            value={form.duration}
                                            onChange={handleChange}
                                            min="1"
                                            placeholder="60"
                                            className="pl-10 text-base"
                                            required
                                        />
                                    </div>
                                    {errors.duration && (
                                        <div className="flex items-center gap-1.5 mt-2 text-red-600">
                                            <svg className="w-4 h-4 flex-shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                                            </svg>
                                            <p className="text-xs font-medium">{errors.duration}</p>
                                        </div>
                                    )}
                                    <p className="text-xs text-gray-500 mt-1.5">
                                        Estimated completion time
                                    </p>
                                </div>

                                {/* Price */}
                                <div>
                                    <label className="block text-sm font-semibold text-gray-700 mb-2">
                                        Price (₹) <span className="text-red-500">*</span>
                                    </label>
                                    <div className="relative">
                                        <div className="absolute inset-y-0 left-0 flex items-center pl-3 pointer-events-none">
                                            <span className="text-gray-500 font-semibold text-base">₹</span>
                                        </div>
                                        <Input
                                            name="price"
                                            type="number"
                                            value={form.price}
                                            onChange={handleChange}
                                            min="0"
                                            placeholder="999"
                                            className="pl-8 text-base"
                                            required
                                        />
                                    </div>
                                    {errors.price && (
                                        <div className="flex items-center gap-1.5 mt-2 text-red-600">
                                            <svg className="w-4 h-4 flex-shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                                            </svg>
                                            <p className="text-xs font-medium">{errors.price}</p>
                                        </div>
                                    )}
                                    <p className="text-xs text-gray-500 mt-1.5">
                                        Set to 0 for free courses
                                    </p>
                                </div>
                            </div>

                            {/* Form Actions */}
                            <div className="pt-6 border-t border-gray-200">
                                <div className="flex flex-col-reverse sm:flex-row gap-3">
                                    <Button
                                        type="button"
                                        variant="outline"
                                        onClick={() => navigate('/admin/courses')}
                                        className="w-full sm:w-auto sm:min-w-[140px]"
                                    >
                                        <span className="flex items-center justify-center gap-2">
                                            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                                            </svg>
                                            Cancel
                                        </span>
                                    </Button>
                                    <Button
                                        type="submit"
                                        variant="primary"
                                        className="w-full sm:flex-1"
                                    >
                                        <span className="flex items-center justify-center gap-2">
                                            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d={isEditMode ? "M5 13l4 4L19 7" : "M12 4v16m8-8H4"} />
                                            </svg>
                                            {isEditMode ? 'Update Course' : 'Create Course'}
                                        </span>
                                    </Button>
                                </div>
                            </div>
                        </div>
                    </form>
                </Card>

                {/* Help Card */}
                <Card className="mt-6 p-4 sm:p-6 bg-gradient-to-r from-gray-50 to-blue-50 border border-gray-200">
                    <div className="flex items-start gap-3">
                        <div className="flex-shrink-0 w-10 h-10 rounded-lg bg-blue-100 flex items-center justify-center">
                            <svg className="w-5 h-5 text-blue-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                            </svg>
                        </div>
                        <div className="flex-1">
                            <h3 className="text-sm font-semibold text-gray-900 mb-1">Tips for Creating Great Courses</h3>
                            <ul className="text-xs text-gray-600 space-y-1">
                                <li className="flex items-start gap-2">
                                    <span className="text-blue-600 mt-0.5">•</span>
                                    <span>Use clear, descriptive titles that highlight the main learning outcome</span>
                                </li>
                                <li className="flex items-start gap-2">
                                    <span className="text-blue-600 mt-0.5">•</span>
                                    <span>Set realistic duration estimates based on your content volume</span>
                                </li>
                                <li className="flex items-start gap-2">
                                    <span className="text-blue-600 mt-0.5">•</span>
                                    <span>Price competitively by researching similar courses in your domain</span>
                                </li>
                            </ul>
                        </div>
                    </div>
                </Card>
            </div>
        </AdminLayout>
    );

};

export default AdminCourseFormPage;