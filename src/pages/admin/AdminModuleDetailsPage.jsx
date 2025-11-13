import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { useSelector, useDispatch } from 'react-redux';
import AdminLayout from '@/shared/components/layout/AdminLayout';
import Card from '@/shared/components/ui/Card';
import Button from '@/shared/components/ui/Button';
import {
    addQuestion,
    updateQuestion,
    deleteQuestion,
    setSelectedQuestion,
} from '@/features/questions/slices/questionSlice';
import { toast } from 'react-toastify';
import QuestionForm from './QuestionFrom';

const AdminModuleDetailsPage = () => {
    const { courseId, moduleId } = useParams();
    const navigate = useNavigate();
    const dispatch = useDispatch();

    const modules = useSelector((state) => state.modules.modules);
    const questions = useSelector((state) => state.questions.questions);
    const selectedQuestion = useSelector((state) => state.questions.selectedQuestion);

    const module = modules.find((m) => m.id === Number(moduleId));
    const moduleQuestions = questions.filter((q) => q.moduleId === Number(moduleId));

    const [modalOpen, setModalOpen] = useState(false);
    const [editMode, setEditMode] = useState(false);
    const [form, setForm] = useState({
        moduleId: Number(moduleId),
        type: 'mcq',
        question: '',
        options: ['', '', '', ''],
        correctAnswer: '',
        marks: 1,
        difficulty: 'easy',
    });

    useEffect(() => {
        if (!module) {
            toast.error('Module not found');
            navigate(`/admin/courses/${courseId}`);
        }
    }, [module, navigate, courseId]);

    const openModal = (question = null) => {
        setEditMode(!!question);
        if (question) {
            setForm({
                ...question,
                options: question.options || ['', '', '', ''], 
            });
        } else {
            setForm({
                moduleId: Number(moduleId),
                type: 'mcq',
                question: '',
                options: ['', '', '', ''],
                correctAnswer: '',
                marks: 1,
                difficulty: 'easy',
            });
        }
        setModalOpen(true);
        dispatch(setSelectedQuestion(question));
    };


    const closeModal = () => {
        setModalOpen(false);
        setEditMode(false);
        dispatch(setSelectedQuestion(null));
    };

    const handleChange = (e) => {
        const { name, value } = e.target;

        if (name === 'type') {
            if (value === 'mcq') {
                setForm((f) => ({
                    ...f,
                    type: value,
                    options: ['', '', '', ''],
                    correctAnswer: '',
                }));
            } else {
                setForm((f) => ({
                    ...f,
                    type: value,
                    options: undefined,
                    correctAnswer: '',
                }));
            }
        } else {
            setForm((f) => ({ ...f, [name]: value }));
        }
    };


    const handleOptionChange = (index, value) => {
        const newOptions = [...form.options];
        newOptions[index] = value;
        setForm((f) => ({ ...f, options: newOptions }));
    };

    const handleSave = (e) => {
        e.preventDefault();
        if (editMode) {
            dispatch(updateQuestion(form));
            toast.success('Question updated!');
        } else {
            dispatch(addQuestion(form));
            toast.success('Question added!');
        }
        closeModal();
    };

    const handleDelete = (id) => {
        dispatch(deleteQuestion(id));
        toast.error('Question deleted!');
        closeModal();
    };

    return (
        <AdminLayout>
            <div>
                <div className="flex items-center gap-2 mb-6">
                    <Button variant="outline" size="sm" onClick={() => navigate(`/admin/courses/${courseId}`)}>
                        ← Back to Modules
                    </Button>
                </div>

                <h1 className="text-3xl font-bold mb-2">{module?.title}</h1>
                <p className="text-gray-600 mb-5">{module?.description}</p>

                <Button variant="primary" onClick={() => openModal()} className="mb-6">
                    + Add Question
                </Button>

                <div className="grid grid-cols-1 gap-4 mt-3">
                    {moduleQuestions.map((q, idx) => (
                        <Card key={q.id} className="p-3 sm:p-4">
                            <div className="flex flex-col gap-3">
                                {/* Badges and Question Number */}
                                <div className="flex flex-wrap items-center gap-2">
                                    <span className="px-2 py-1 bg-blue-100 text-blue-700 rounded text-xs font-semibold">
                                        {q.type.toUpperCase()}
                                    </span>
                                    <span
                                        className={`px-2 py-1 rounded text-xs font-semibold ${q.difficulty === 'easy'
                                                ? 'bg-emerald-100 text-emerald-700'
                                                : q.difficulty === 'medium'
                                                    ? 'bg-yellow-100 text-yellow-700'
                                                    : 'bg-red-100 text-red-700'
                                            }`}
                                    >
                                        {q.difficulty}
                                    </span>
                                    <span className="text-gray-500 text-xs">{q.marks} marks</span>
                                </div>

                                {/* Question Text */}
                                <p className="font-semibold text-gray-900 text-sm sm:text-base break-words">
                                    Q{idx + 1}. {q.question}
                                </p>

                                {/* MCQ Options */}
                                {q.type === 'mcq' && (
                                    <ul className="text-xs sm:text-sm text-gray-600 space-y-1">
                                        {q.options.map((opt, i) => (
                                            <li
                                                key={i}
                                                className={`break-words ${opt === q.correctAnswer ? 'text-emerald-600 font-semibold' : ''
                                                    }`}
                                            >
                                                {String.fromCharCode(65 + i)}. {opt}
                                            </li>
                                        ))}
                                    </ul>
                                )}

                                {/* Action Buttons */}
                                <div className="flex flex-col sm:flex-row gap-2 pt-2">
                                    <Button
                                        variant="secondary"
                                        size="sm"
                                        onClick={() => openModal(q)}
                                        fullWidth
                                    >
                                        Edit
                                    </Button>
                                    <Button
                                        variant="danger"
                                        size="sm"
                                        onClick={() => handleDelete(q.id)}
                                        fullWidth
                                    >
                                        Delete
                                    </Button>
                                </div>
                            </div>
                        </Card>
                    ))}
                    {moduleQuestions.length === 0 && (
                        <p className="text-gray-500 text-sm">No questions added yet.</p>
                    )}
                </div>


                {modalOpen && (
                    <QuestionForm
                        form={form}
                        handleChange={handleChange}
                        handleOptionChange={handleOptionChange}
                        handleSave={handleSave}
                        editMode={editMode}
                        handleDelete={editMode ? handleDelete : undefined}
                        closeModal={closeModal}
                        selectedQuestion={selectedQuestion}
                    />
                )}
            </div>
        </AdminLayout>
    );
};

export default AdminModuleDetailsPage;