import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { useSelector, useDispatch } from 'react-redux';
import AdminLayout from '@/shared/components/layout/AdminLayout';
import Card from '@/shared/components/ui/Card';
import Button from '@/shared/components/ui/Button';
import Input from '@/shared/components/ui/Input';
import { addQuestion, updateQuestion } from '@/features/questions/slices/questionSlice';
import { toast } from 'react-toastify';

const AdminQuestionFormPage = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const dispatch = useDispatch();

  const questions = useSelector((state) => state.questions.questions);
  const modules = useSelector((state) => state.modules.modules);
  const courses = useSelector((state) => state.courses.courses);

  const isEditMode = Boolean(id);
  const existingQuestion = isEditMode ? questions.find((q) => q.id === Number(id)) : null;

  const [form, setForm] = useState({
    moduleId: '',
    type: 'mcq',
    question: '',
    options: ['', '', '', ''],
    correctAnswer: '',
    marks: 1,
    difficulty: 'easy',
  });

  const [errors, setErrors] = useState({});

  useEffect(() => {
    if (existingQuestion) {
      setForm({
        moduleId: existingQuestion.moduleId,
        type: existingQuestion.type,
        question: existingQuestion.question,
        options: existingQuestion.options || ['', '', '', ''],
        correctAnswer: existingQuestion.correctAnswer || '',
        marks: existingQuestion.marks,
        difficulty: existingQuestion.difficulty,
      });
    }
  }, [existingQuestion]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setForm((prev) => ({ ...prev, [name]: value }));
    if (errors[name]) {
      setErrors((prev) => ({ ...prev, [name]: '' }));
    }
  };

  const handleOptionChange = (index, value) => {
    const newOptions = [...form.options];
    newOptions[index] = value;
    setForm((prev) => ({ ...prev, options: newOptions }));
  };

  const addOption = () => {
    setForm((prev) => ({ ...prev, options: [...prev.options, ''] }));
  };

  const removeOption = (index) => {
    if (form.options.length <= 2) {
      toast.error('Must have at least 2 options');
      return;
    }
    const newOptions = form.options.filter((_, i) => i !== index);
    setForm((prev) => ({ ...prev, options: newOptions }));
  };

  const validate = () => {
    const newErrors = {};

    if (!form.moduleId) {
      newErrors.moduleId = 'Module is required';
    }

    if (!form.question.trim()) {
      newErrors.question = 'Question text is required';
    }

    if (form.type === 'mcq') {
      const filledOptions = form.options.filter((opt) => opt.trim());
      if (filledOptions.length < 2) {
        newErrors.options = 'At least 2 options are required';
      }

      if (!form.correctAnswer.trim()) {
        newErrors.correctAnswer = 'Correct answer is required';
      } else if (!form.options.includes(form.correctAnswer)) {
        newErrors.correctAnswer = 'Correct answer must match one of the options exactly';
      }
    } else {
      if (!form.correctAnswer.trim()) {
        newErrors.correctAnswer = 'Sample answer/reference is required';
      }
    }

    if (form.marks < 1 || form.marks > 100) {
      newErrors.marks = 'Marks must be between 1 and 100';
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

    const questionData = {
      ...form,
      moduleId: Number(form.moduleId),
      marks: Number(form.marks),
      options: form.type === 'mcq' ? form.options.filter((opt) => opt.trim()) : undefined,
    };

    if (isEditMode) {
      dispatch(updateQuestion({ id: Number(id), ...questionData }));
      toast.success('Question updated successfully!');
    } else {
      dispatch(addQuestion(questionData));
      toast.success('Question created successfully!');
    }

    navigate('/admin/questions');
  };

  const getModuleCourse = (moduleId) => {
    const module = modules.find((m) => m.id === Number(moduleId));
    const course = courses.find((c) => c.id === module?.courseId);
    return course ? course.title : '';
  };

  return (
    <AdminLayout>
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
        {/* Improved Back Button */}
        <div className="mb-6">
          <button
            onClick={() => navigate('/admin/questions')}
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
            <span className="text-sm font-medium">Back to Questions</span>
          </button>

          <div className="flex items-start gap-4">
            <div className="flex-shrink-0 w-12 h-12 sm:w-16 sm:h-16 rounded-xl bg-gradient-to-br from-purple-500 to-indigo-600 flex items-center justify-center shadow-lg">
              <svg className="w-6 h-6 sm:w-8 sm:h-8 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d={isEditMode ? "M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z" : "M8.228 9c.549-1.165 2.03-2 3.772-2 2.21 0 4 1.343 4 3 0 1.4-1.278 2.575-3.006 2.907-.542.104-.994.54-.994 1.093m0 3h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"} />
              </svg>
            </div>
            <div className="flex-1">
              <h1 className="text-2xl sm:text-3xl font-bold text-gray-900 tracking-tight mb-2">
                {isEditMode ? 'Edit Question' : 'Create New Question'}
              </h1>
              <p className="text-sm sm:text-base text-gray-600">
                {isEditMode ? 'Update the question details below' : 'Add a new question to the question bank'}
              </p>
            </div>
          </div>
        </div>

        {/* Form Card */}
        <Card className="overflow-hidden shadow-lg border border-gray-200">
          {/* Edit Mode Indicator */}
          {isEditMode && (
            <div className="bg-purple-50 border-b border-purple-100 px-4 sm:px-6 py-3">
              <div className="flex items-center gap-2 text-sm text-purple-800">
                <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                </svg>
                <span className="font-medium">You are editing an existing question</span>
              </div>
            </div>
          )}

          <form onSubmit={handleSubmit} className="p-4 sm:p-6 lg:p-8">
            <div className="space-y-6">
              {/* Module Selection */}
              <div>
                <label className="block text-sm font-semibold text-gray-700 mb-2">
                  Select Module <span className="text-red-500">*</span>
                </label>
                <div className="relative">
                  <div className="absolute inset-y-0 left-0 flex items-center pl-3 pointer-events-none">
                    <svg className="w-5 h-5 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 6.253v13m0-13C10.832 5.477 9.246 5 7.5 5S4.168 5.477 3 6.253v13C4.168 18.477 5.754 18 7.5 18s3.332.477 4.5 1.253m0-13C13.168 5.477 14.754 5 16.5 5c1.747 0 3.332.477 4.5 1.253v13C19.832 18.477 18.247 18 16.5 18c-1.746 0-3.332.477-4.5 1.253" />
                    </svg>
                  </div>
                  <select
                    name="moduleId"
                    value={form.moduleId}
                    onChange={handleChange}
                    className="w-full appearance-none border border-gray-300 rounded-lg pl-10 pr-10 py-3 text-base bg-white hover:border-gray-400 focus:outline-none focus:ring-2 focus:ring-purple-500 focus:border-transparent transition-all cursor-pointer"
                  >
                    <option value="">-- Select a module --</option>
                    {modules.map((module) => (
                      <option key={module.id} value={module.id}>
                        {module.title} ({getModuleCourse(module.id)})
                      </option>
                    ))}
                  </select>
                  <div className="absolute inset-y-0 right-0 flex items-center pr-3 pointer-events-none">
                    <svg className="w-5 h-5 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
                    </svg>
                  </div>
                </div>
                {errors.moduleId && (
                  <div className="flex items-center gap-1.5 mt-2 text-red-600">
                    <svg className="w-4 h-4 flex-shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                    </svg>
                    <p className="text-xs font-medium">{errors.moduleId}</p>
                  </div>
                )}
                <p className="text-xs text-gray-500 mt-1.5">
                  Choose the course module where this question belongs
                </p>
              </div>

              {/* Question Type */}
              <div>
                <label className="block text-sm font-semibold text-gray-700 mb-2">
                  Question Type <span className="text-red-500">*</span>
                </label>
                <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                  <button
                    type="button"
                    onClick={() => handleChange({ target: { name: 'type', value: 'mcq' } })}
                    className={`p-4 border-2 rounded-lg transition-all ${form.type === 'mcq'
                        ? 'border-blue-500 bg-blue-50 shadow-md'
                        : 'border-gray-200 hover:border-gray-300'
                      }`}
                  >
                    <div className="flex flex-col items-center gap-2">
                      <div className={`w-10 h-10 rounded-lg flex items-center justify-center ${form.type === 'mcq' ? 'bg-blue-100' : 'bg-gray-100'
                        }`}>
                        <svg className={`w-5 h-5 ${form.type === 'mcq' ? 'text-blue-600' : 'text-gray-600'}`} fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2m-6 9l2 2 4-4" />
                        </svg>
                      </div>
                      <span className={`text-sm font-semibold ${form.type === 'mcq' ? 'text-blue-700' : 'text-gray-700'}`}>
                        Multiple Choice
                      </span>
                    </div>
                  </button>

                  <button
                    type="button"
                    onClick={() => handleChange({ target: { name: 'type', value: 'subjective' } })}
                    className={`p-4 border-2 rounded-lg transition-all ${form.type === 'subjective'
                        ? 'border-purple-500 bg-purple-50 shadow-md'
                        : 'border-gray-200 hover:border-gray-300'
                      }`}
                  >
                    <div className="flex flex-col items-center gap-2">
                      <div className={`w-10 h-10 rounded-lg flex items-center justify-center ${form.type === 'subjective' ? 'bg-purple-100' : 'bg-gray-100'
                        }`}>
                        <svg className={`w-5 h-5 ${form.type === 'subjective' ? 'text-purple-600' : 'text-gray-600'}`} fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z" />
                        </svg>
                      </div>
                      <span className={`text-sm font-semibold ${form.type === 'subjective' ? 'text-purple-700' : 'text-gray-700'}`}>
                        Subjective
                      </span>
                    </div>
                  </button>

                  <button
                    type="button"
                    onClick={() => handleChange({ target: { name: 'type', value: 'coding' } })}
                    className={`p-4 border-2 rounded-lg transition-all ${form.type === 'coding'
                        ? 'border-yellow-500 bg-yellow-50 shadow-md'
                        : 'border-gray-200 hover:border-gray-300'
                      }`}
                  >
                    <div className="flex flex-col items-center gap-2">
                      <div className={`w-10 h-10 rounded-lg flex items-center justify-center ${form.type === 'coding' ? 'bg-yellow-100' : 'bg-gray-100'
                        }`}>
                        <svg className={`w-5 h-5 ${form.type === 'coding' ? 'text-yellow-600' : 'text-gray-600'}`} fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 20l4-16m4 4l4 4-4 4M6 16l-4-4 4-4" />
                        </svg>
                      </div>
                      <span className={`text-sm font-semibold ${form.type === 'coding' ? 'text-yellow-700' : 'text-gray-700'}`}>
                        Coding
                      </span>
                    </div>
                  </button>
                </div>
                <p className="text-xs text-gray-500 mt-1.5">
                  Select the type of question you want to create
                </p>
              </div>

              {/* Question Text */}
              <div>
                <label className="block text-sm font-semibold text-gray-700 mb-2">
                  Question <span className="text-red-500">*</span>
                </label>
                <div className="relative">
                  <textarea
                    name="question"
                    value={form.question}
                    onChange={handleChange}
                    rows="5"
                    className="w-full border border-gray-300 rounded-lg px-4 py-3 text-base focus:ring-2 focus:ring-purple-500 focus:border-transparent transition-shadow resize-none"
                    placeholder="Enter the question text clearly and concisely..."
                  />
                  <div className="absolute bottom-3 right-3 text-xs text-gray-400">
                    {form.question.length} characters
                  </div>
                </div>
                {errors.question && (
                  <div className="flex items-center gap-1.5 mt-2 text-red-600">
                    <svg className="w-4 h-4 flex-shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                    </svg>
                    <p className="text-xs font-medium">{errors.question}</p>
                  </div>
                )}
              </div>

              {/* MCQ Options */}
              {form.type === 'mcq' && (
                <div className="bg-blue-50 rounded-lg p-4 sm:p-6 border border-blue-100">
                  <label className="block text-sm font-semibold text-gray-800 mb-3">
                    Answer Options <span className="text-red-500">*</span>
                  </label>
                  <div className="space-y-3 mb-3">
                    {form.options.map((option, index) => (
                      <div key={index} className="flex gap-3 items-start">
                        <div className="flex-shrink-0 w-10 h-10 flex items-center justify-center bg-white border-2 border-blue-200 rounded-lg font-bold text-blue-700 shadow-sm">
                          {String.fromCharCode(65 + index)}
                        </div>
                        <Input
                          value={option}
                          onChange={(e) => handleOptionChange(index, e.target.value)}
                          placeholder={`Enter option ${String.fromCharCode(65 + index)}`}
                          className="flex-1"
                        />
                        {form.options.length > 2 && (
                          <Button
                            type="button"
                            variant="danger"
                            size="sm"
                            onClick={() => removeOption(index)}
                            className="flex-shrink-0"
                          >
                            <span className="hidden sm:inline">Remove</span>
                            <span className="sm:hidden">
                              <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                              </svg>
                            </span>
                          </Button>
                        )}
                      </div>
                    ))}
                  </div>
                  {errors.options && (
                    <div className="flex items-center gap-1.5 mt-2 text-red-600">
                      <svg className="w-4 h-4 flex-shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                      </svg>
                      <p className="text-xs font-medium">{errors.options}</p>
                    </div>
                  )}
                  <Button
                    type="button"
                    variant="secondary"
                    size="sm"
                    onClick={addOption}
                    className="mt-4"
                  >
                    <span className="flex items-center gap-2">
                      <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" />
                      </svg>
                      Add Another Option
                    </span>
                  </Button>
                </div>
              )}

              {/* Correct Answer */}
              <div>
                <label className="block text-sm font-semibold text-gray-700 mb-2">
                  {form.type === 'mcq' ? 'Correct Answer' : 'Sample Answer / Reference'}{' '}
                  <span className="text-red-500">*</span>
                </label>
                {form.type === 'mcq' ? (
                  <div className="relative">
                    <div className="absolute inset-y-0 left-0 flex items-center pl-3 pointer-events-none">
                      <svg className="w-5 h-5 text-emerald-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                      </svg>
                    </div>
                    <select
                      name="correctAnswer"
                      value={form.correctAnswer}
                      onChange={handleChange}
                      className="w-full appearance-none border border-gray-300 rounded-lg pl-10 pr-10 py-3 text-base bg-white hover:border-gray-400 focus:outline-none focus:ring-2 focus:ring-emerald-500 focus:border-transparent transition-all cursor-pointer"
                    >
                      <option value="">-- Select the correct answer --</option>
                      {form.options
                        .filter((opt) => opt.trim())
                        .map((option, index) => (
                          <option key={index} value={option}>
                            {String.fromCharCode(65 + index)}. {option}
                          </option>
                        ))}
                    </select>
                    <div className="absolute inset-y-0 right-0 flex items-center pr-3 pointer-events-none">
                      <svg className="w-5 h-5 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
                      </svg>
                    </div>
                  </div>
                ) : (
                  <div className="relative">
                    <textarea
                      name="correctAnswer"
                      value={form.correctAnswer}
                      onChange={handleChange}
                      rows="5"
                      className={`w-full border border-gray-300 rounded-lg px-4 py-3 text-base focus:ring-2 ${form.type === 'coding'
                          ? 'focus:ring-yellow-500 font-mono'
                          : 'focus:ring-purple-500'
                        } focus:border-transparent transition-shadow resize-none`}
                      placeholder={
                        form.type === 'coding'
                          ? '// Write sample code solution here...\nfunction example() {\n  return "solution";\n}'
                          : 'Provide a detailed sample answer or key points for reference...'
                      }
                    />
                    <div className="absolute bottom-3 right-3 text-xs text-gray-400">
                      {form.correctAnswer.length} characters
                    </div>
                  </div>
                )}
                {errors.correctAnswer && (
                  <div className="flex items-center gap-1.5 mt-2 text-red-600">
                    <svg className="w-4 h-4 flex-shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                    </svg>
                    <p className="text-xs font-medium">{errors.correctAnswer}</p>
                  </div>
                )}
                <p className="text-xs text-gray-500 mt-1.5">
                  {form.type === 'mcq'
                    ? 'Choose which option is the correct answer'
                    : 'Provide a reference answer for grading purposes'}
                </p>
              </div>

              {/* Marks and Difficulty */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 sm:gap-6">
                {/* Marks */}
                <div>
                  <label className="block text-sm font-semibold text-gray-700 mb-2">
                    Marks <span className="text-red-500">*</span>
                  </label>
                  <div className="relative">
                    <div className="absolute inset-y-0 left-0 flex items-center pl-3 pointer-events-none">
                      <svg className="w-5 h-5 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M7 20l4-16m2 16l4-16M6 9h14M4 15h14" />
                      </svg>
                    </div>
                    <Input
                      name="marks"
                      type="number"
                      min="1"
                      max="100"
                      value={form.marks}
                      onChange={handleChange}
                      placeholder="10"
                      className="pl-10 text-base"
                      required
                    />
                  </div>
                  {errors.marks && (
                    <div className="flex items-center gap-1.5 mt-2 text-red-600">
                      <svg className="w-4 h-4 flex-shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                      </svg>
                      <p className="text-xs font-medium">{errors.marks}</p>
                    </div>
                  )}
                  <p className="text-xs text-gray-500 mt-1.5">
                    Points awarded for correct answer
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
                      className="w-full appearance-none border border-gray-300 rounded-lg px-3 pr-10 py-3 text-base bg-white hover:border-gray-400 focus:outline-none focus:ring-2 focus:ring-purple-500 focus:border-transparent transition-all cursor-pointer"
                    >
                      <option value="easy">🟢 Easy - Beginner Level</option>
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
                    Set the complexity level
                  </p>
                </div>
              </div>

              {/* Form Actions */}
              <div className="pt-6 border-t border-gray-200">
                <div className="flex flex-col-reverse sm:flex-row gap-3">
                  <Button
                    type="button"
                    variant="outline"
                    onClick={() => navigate('/admin/questions')}
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
                      {isEditMode ? 'Update Question' : 'Create Question'}
                    </span>
                  </Button>
                </div>
              </div>
            </div>
          </form>
        </Card>

        {/* Help Card */}
        <Card className="mt-6 p-4 sm:p-6 bg-gradient-to-r from-gray-50 to-purple-50 border border-gray-200">
          <div className="flex items-start gap-3">
            <div className="flex-shrink-0 w-10 h-10 rounded-lg bg-purple-100 flex items-center justify-center">
              <svg className="w-5 h-5 text-purple-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
              </svg>
            </div>
            <div className="flex-1">
              <h3 className="text-sm font-semibold text-gray-900 mb-1">Question Creation Tips</h3>
              <ul className="text-xs text-gray-600 space-y-1">
                <li className="flex items-start gap-2">
                  <span className="text-purple-600 mt-0.5">•</span>
                  <span>Write clear, unambiguous questions that test specific concepts</span>
                </li>
                <li className="flex items-start gap-2">
                  <span className="text-purple-600 mt-0.5">•</span>
                  <span>For MCQs, ensure all options are plausible to test understanding</span>
                </li>
                <li className="flex items-start gap-2">
                  <span className="text-purple-600 mt-0.5">•</span>
                  <span>Assign marks proportional to the difficulty and time required</span>
                </li>
              </ul>
            </div>
          </div>
        </Card>
      </div>
    </AdminLayout>
  );

};

export default AdminQuestionFormPage;