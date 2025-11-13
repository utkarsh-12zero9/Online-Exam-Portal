import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { useSelector, useDispatch } from 'react-redux';
import AdminLayout from '@/shared/components/layout/AdminLayout';
import Card from '@/shared/components/ui/Card';
import Button from '@/shared/components/ui/Button';
import {
    addModule,
    updateModule,
    deleteModule,
    setSelectedModule,
} from '@/features/modules/slices/moduleSlice';
import ModuleForm from './ModuleForm';

import { toast } from 'react-toastify';

const AdminCourseDetailsPage = () => {
    const { id } = useParams();
    const navigate = useNavigate();
    const dispatch = useDispatch();

    const courses = useSelector((state) => state.courses.courses);
    const modules = useSelector((state) => state.modules.modules);
    const selectedModule = useSelector((state) => state.modules.selectedModule);

    const course = courses.find((c) => c.id === Number(id));
    const courseModules = modules.filter((m) => m.courseId === Number(id));

    const [modalOpen, setModalOpen] = useState(false);
    const [editMode, setEditMode] = useState(false);
    const [form, setForm] = useState({
        title: '',
        description: '',
        order: 1,
        courseId: Number(id),
        questionCount: 0,
    });

    useEffect(() => {
        if (!course) {
            toast.error('Course not found');
            navigate('/admin/courses');
        }
    }, [course, navigate]);

    const openModal = (module = null) => {
        setEditMode(!!module);
        setForm(
            module || {
                title: '',
                description: '',
                order: courseModules.length + 1,
                courseId: Number(id),
                questionCount: 0,
            }
        );
        setModalOpen(true);
        dispatch(setSelectedModule(module));
    };

    const closeModal = () => {
        setModalOpen(false);
        setEditMode(false);
        dispatch(setSelectedModule(null));
    };

    const handleChange = (e) => {
        setForm((f) => ({ ...f, [e.target.name]: e.target.value }));
    };

    const handleSave = (e) => {
        e.preventDefault();
        if (editMode) {
            dispatch(updateModule(form));
            toast.success('Module updated!');
        } else {
            dispatch(addModule(form));
            toast.success('Module added!');
        }
        closeModal();
    };

    const handleDelete = (id) => {
        dispatch(deleteModule(id));
        toast.error('Module deleted!');
        closeModal();
    };

    return (
        <AdminLayout>
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
                {/* Header Section */}
                <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 mb-8">
                    <div>
                        <div className="flex items-center gap-2 mb-2">
                            <button
                                onClick={() => navigate('/admin/courses')}
                                className="text-gray-400 hover:text-gray-600 transition-colors"
                            >
                                <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
                                </svg>
                            </button>
                            <h1 className="text-2xl sm:text-3xl font-bold text-gray-900 tracking-tight">
                                {course?.title}
                            </h1>
                        </div>
                        <p className="text-sm sm:text-base text-gray-600 ml-7">
                            Manage course modules and learning content
                        </p>
                    </div>
                    <Button
                        variant="primary"
                        onClick={() => openModal()}
                        className="w-full sm:w-auto"
                    >
                        <span className="flex items-center justify-center gap-2">
                            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" />
                            </svg>
                            Add Module
                        </span>
                    </Button>
                </div>

                {/* Modules Summary Card */}
                {courseModules.length > 0 && (
                    <Card className="p-4 sm:p-6 mb-6 bg-gradient-to-r from-blue-50 to-indigo-50 border border-blue-100">
                        <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
                            <div className="text-center sm:text-left">
                                <p className="text-sm text-gray-600 mb-1">Total Modules</p>
                                <p className="text-2xl font-bold text-gray-900">{courseModules.length}</p>
                            </div>
                            <div className="text-center sm:text-left">
                                <p className="text-sm text-gray-600 mb-1">Total Questions</p>
                                <p className="text-2xl font-bold text-gray-900">
                                    {courseModules.reduce((sum, mod) => sum + mod.questionCount, 0)}
                                </p>
                            </div>
                            <div className="text-center sm:text-left col-span-2 sm:col-span-2">
                                <p className="text-sm text-gray-600 mb-1">Average Questions/Module</p>
                                <p className="text-2xl font-bold text-gray-900">
                                    {courseModules.length > 0
                                        ? Math.round(courseModules.reduce((sum, mod) => sum + mod.questionCount, 0) / courseModules.length)
                                        : 0}
                                </p>
                            </div>
                        </div>
                    </Card>
                )}

                {/* Modules Grid */}
                <div className="grid grid-cols-1 lg:grid-cols-2 gap-4 sm:gap-6">
                    {courseModules.map((mod, index) => (
                        <Card
                            key={mod.id}
                            className="group relative overflow-hidden hover:shadow-xl transition-all duration-300 border border-gray-200 hover:border-blue-300"
                        >
                            {/* Module Order Badge */}
                            <div className="absolute top-4 right-4 z-10">
                                <span className="inline-flex items-center justify-center w-10 h-10 rounded-full bg-blue-100 text-blue-800 font-bold text-sm border-2 border-white shadow-sm">
                                    #{mod.order}
                                </span>
                            </div>

                            {/* Clickable Content Area */}
                            <div
                                onClick={() => navigate(`/admin/courses/${id}/modules/${mod.id}`)}
                                className="p-5 sm:p-6 cursor-pointer"
                            >
                                <div className="pr-12">
                                    <div className="flex items-start gap-3 mb-3">
                                        <div className="flex-shrink-0 w-12 h-12 rounded-lg bg-gradient-to-br from-blue-500 to-indigo-600 flex items-center justify-center shadow-md">
                                            <svg className="w-6 h-6 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 6.253v13m0-13C10.832 5.477 9.246 5 7.5 5S4.168 5.477 3 6.253v13C4.168 18.477 5.754 18 7.5 18s3.332.477 4.5 1.253m0-13C13.168 5.477 14.754 5 16.5 5c1.747 0 3.332.477 4.5 1.253v13C19.832 18.477 18.247 18 16.5 18c-1.746 0-3.332.477-4.5 1.253" />
                                            </svg>
                                        </div>
                                        <div className="flex-1 min-w-0">
                                            <h2 className="text-lg sm:text-xl font-semibold text-gray-900 mb-2 group-hover:text-blue-600 transition-colors line-clamp-2">
                                                {mod.title}
                                            </h2>
                                            <p className="text-sm text-gray-600 line-clamp-2">
                                                {mod.description}
                                            </p>
                                        </div>
                                    </div>

                                    {/* Module Stats */}
                                    <div className="flex items-center gap-4 mt-4 pt-4 border-t border-gray-100">
                                        <div className="flex items-center gap-2 text-sm text-gray-600">
                                            <svg className="w-4 h-4 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2m-3 7h3m-3 4h3m-6-4h.01M9 16h.01" />
                                            </svg>
                                            <span className="font-medium">{mod.questionCount} Questions</span>
                                        </div>
                                        <div className="flex items-center gap-1.5 text-sm">
                                            <span className="inline-flex items-center px-2.5 py-1 rounded-full text-xs font-semibold bg-emerald-100 text-emerald-800">
                                                Module {mod.order}
                                            </span>
                                        </div>
                                    </div>
                                </div>
                            </div>

                            {/* Action Buttons */}
                            <div className="px-5 sm:px-6 pb-5 sm:pb-6">
                                <div className="grid grid-cols-3 gap-2">
                                    <Button
                                        variant="primary"
                                        size="sm"
                                        onClick={() => navigate(`/admin/courses/${id}/modules/${mod.id}`)}
                                        className="w-full text-xs sm:text-sm"
                                    >
                                        <span className="hidden sm:inline">Questions</span>
                                        <span className="sm:hidden">
                                            <svg className="w-4 h-4 mx-auto" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2" />
                                            </svg>
                                        </span>
                                    </Button>
                                    <Button
                                        variant="secondary"
                                        size="sm"
                                        onClick={(e) => { e.stopPropagation(); openModal(mod); }}
                                        className="w-full text-xs sm:text-sm"
                                    >
                                        <span className="hidden sm:inline">Edit</span>
                                        <span className="sm:hidden">
                                            <svg className="w-4 h-4 mx-auto" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z" />
                                            </svg>
                                        </span>
                                    </Button>
                                    <Button
                                        variant="danger"
                                        size="sm"
                                        onClick={(e) => { e.stopPropagation(); handleDelete(mod.id); }}
                                        className="w-full text-xs sm:text-sm"
                                    >
                                        <span className="hidden sm:inline">Delete</span>
                                        <span className="sm:hidden">
                                            <svg className="w-4 h-4 mx-auto" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
                                            </svg>
                                        </span>
                                    </Button>
                                </div>
                            </div>
                        </Card>
                    ))}
                </div>

                {/* Enhanced Empty State */}
                {courseModules.length === 0 && (
                    <Card className="p-12 sm:p-16 text-center border-2 border-dashed border-gray-300">
                        <div className="max-w-md mx-auto">
                            <div className="w-20 h-20 sm:w-24 sm:h-24 mx-auto mb-6 rounded-full bg-gradient-to-br from-blue-100 to-indigo-100 flex items-center justify-center">
                                <svg className="w-10 h-10 sm:w-12 sm:h-12 text-blue-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M12 6.253v13m0-13C10.832 5.477 9.246 5 7.5 5S4.168 5.477 3 6.253v13C4.168 18.477 5.754 18 7.5 18s3.332.477 4.5 1.253m0-13C13.168 5.477 14.754 5 16.5 5c1.747 0 3.332.477 4.5 1.253v13C19.832 18.477 18.247 18 16.5 18c-1.746 0-3.332.477-4.5 1.253" />
                                </svg>
                            </div>
                            <h3 className="text-xl sm:text-2xl font-bold text-gray-900 mb-3">
                                No modules yet
                            </h3>
                            <p className="text-sm sm:text-base text-gray-600 mb-6">
                                Get started by creating your first module. Modules help organize your course content into structured learning sections.
                            </p>
                            <Button
                                variant="primary"
                                onClick={() => openModal()}
                                className="mx-auto"
                            >
                                <span className="flex items-center gap-2">
                                    <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" />
                                    </svg>
                                    Create Your First Module
                                </span>
                            </Button>
                        </div>
                    </Card>
                )}

                {/* Module Form Modal */}
                {modalOpen && (
                    <ModuleForm
                        form={form}
                        handleChange={handleChange}
                        handleSave={handleSave}
                        editMode={editMode}
                        handleDelete={editMode ? handleDelete : undefined}
                        closeModal={closeModal}
                        selectedModule={selectedModule}
                    />
                )}
            </div>
        </AdminLayout>
    );

};

export default AdminCourseDetailsPage;