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
            <div>
                <h1 className="text-3xl font-bold mb-8">{course?.title} - Modules</h1>

                <Button variant="primary" onClick={() => openModal()} className="mb-6">
                    + Add Module
                </Button>

                <div className="grid grid-cols-1 gap-6 mt-6">
                    {courseModules.map((mod) => (
                        <Card key={mod.id} className="p-6 hover:shadow-lg transition-shadow cursor-pointer">
                            <div onClick={() => navigate(`/admin/courses/${id}/modules/${mod.id}`)} className="flex-1">
                                <h2 className="text-xl font-semibold">{mod.title}</h2>
                                <p className="text-gray-600">{mod.description}</p>
                                <p className="text-gray-400 text-sm mt-1">
                                    Order: {mod.order} | Questions: {mod.questionCount}
                                </p>
                            </div>
                            <div className="flex gap-3 mt-4">
                                <Button variant="primary" size="sm" onClick={() => navigate(`/admin/courses/${id}/modules/${mod.id}`)}>
                                    Manage Questions
                                </Button>
                                <Button variant="secondary" size="sm" onClick={(e) => { e.stopPropagation(); openModal(mod); }}>
                                    Edit
                                </Button>
                                <Button variant="danger" size="sm" onClick={(e) => { e.stopPropagation(); handleDelete(mod.id); }}>
                                    Delete
                                </Button>
                            </div>
                        </Card>

                    ))}
                    {courseModules.length === 0 && (
                        <p className="text-gray-500">No modules added yet.</p>
                    )}
                </div>

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