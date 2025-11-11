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
      <div>
        <Button variant="outline" size="sm" onClick={() => navigate('/admin/questions')} className="mb-6">
          ← Back to Questions
        </Button>

        <div className="max-w-3xl">
          <h1 className="text-3xl font-bold text-gray-900 mb-2">
            {isEditMode ? 'Edit Question' : 'Create New Question'}
          </h1>
          <p className="text-gray-600 mb-6">
            {isEditMode ? 'Update the question details below' : 'Add a new question to the question bank'}
          </p>

          <Card className="p-6">
            <form onSubmit={handleSubmit} className="space-y-6">
              {/* Module Selection */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Select Module <span className="text-red-500">*</span>
                </label>
                <select
                  name="moduleId"
                  value={form.moduleId}
                  onChange={handleChange}
                  className="w-full border border-gray-300 rounded-lg px-3 py-2 focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                >
                  <option value="">-- Select Module --</option>
                  {modules.map((module) => (
                    <option key={module.id} value={module.id}>
                      {module.title} ({getModuleCourse(module.id)})
                    </option>
                  ))}
                </select>
                {errors.moduleId && <p className="text-red-500 text-xs mt-1">{errors.moduleId}</p>}
              </div>

              {/* Question Type */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Question Type <span className="text-red-500">*</span>
                </label>
                <select
                  name="type"
                  value={form.type}
                  onChange={handleChange}
                  className="w-full border border-gray-300 rounded-lg px-3 py-2 focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                >
                  <option value="mcq">Multiple Choice (MCQ)</option>
                  <option value="subjective">Subjective</option>
                  <option value="coding">Coding</option>
                </select>
              </div>

              {/* Question Text */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Question <span className="text-red-500">*</span>
                </label>
                <textarea
                  name="question"
                  value={form.question}
                  onChange={handleChange}
                  rows="4"
                  className="w-full border border-gray-300 rounded-lg px-3 py-2 focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  placeholder="Enter the question text..."
                />
                {errors.question && <p className="text-red-500 text-xs mt-1">{errors.question}</p>}
              </div>

              {/* MCQ Options */}
              {form.type === 'mcq' && (
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Options <span className="text-red-500">*</span>
                  </label>
                  <div className="space-y-3">
                    {form.options.map((option, index) => (
                      <div key={index} className="flex gap-2">
                        <span className="w-8 h-10 flex items-center justify-center bg-gray-100 rounded font-semibold text-gray-700">
                          {String.fromCharCode(65 + index)}
                        </span>
                        <Input
                          value={option}
                          onChange={(e) => handleOptionChange(index, e.target.value)}
                          placeholder={`Option ${String.fromCharCode(65 + index)}`}
                        />
                        {form.options.length > 2 && (
                          <Button
                            type="button"
                            variant="danger"
                            size="sm"
                            onClick={() => removeOption(index)}
                          >
                            Remove
                          </Button>
                        )}
                      </div>
                    ))}
                  </div>
                  {errors.options && <p className="text-red-500 text-xs mt-1">{errors.options}</p>}
                  <Button type="button" variant="secondary" size="sm" onClick={addOption} className="mt-3">
                    + Add Option
                  </Button>
                </div>
              )}

              {/* Correct Answer */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  {form.type === 'mcq' ? 'Correct Answer' : 'Sample Answer / Reference'}{' '}
                  <span className="text-red-500">*</span>
                </label>
                {form.type === 'mcq' ? (
                  <select
                    name="correctAnswer"
                    value={form.correctAnswer}
                    onChange={handleChange}
                    className="w-full border border-gray-300 rounded-lg px-3 py-2 focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  >
                    <option value="">-- Select Correct Answer --</option>
                    {form.options
                      .filter((opt) => opt.trim())
                      .map((option, index) => (
                        <option key={index} value={option}>
                          {String.fromCharCode(65 + index)}. {option}
                        </option>
                      ))}
                  </select>
                ) : (
                  <textarea
                    name="correctAnswer"
                    value={form.correctAnswer}
                    onChange={handleChange}
                    rows="4"
                    className="w-full border border-gray-300 rounded-lg px-3 py-2 focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                    placeholder={
                      form.type === 'coding'
                        ? '// Sample code solution...'
                        : 'Provide a sample answer or reference...'
                    }
                  />
                )}
                {errors.correctAnswer && <p className="text-red-500 text-xs mt-1">{errors.correctAnswer}</p>}
              </div>

              {/* Marks and Difficulty */}
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <Input
                    label="Marks"
                    name="marks"
                    type="number"
                    min="1"
                    max="100"
                    value={form.marks}
                    onChange={handleChange}
                    required
                  />
                  {errors.marks && <p className="text-red-500 text-xs mt-1">{errors.marks}</p>}
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Difficulty <span className="text-red-500">*</span>
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
              </div>

              {/* Submit Buttons */}
              <div className="flex gap-3 pt-4">
                <Button type="button" variant="outline" onClick={() => navigate('/admin/questions')} fullWidth>
                  Cancel
                </Button>
                <Button type="submit" variant="primary" fullWidth>
                  {isEditMode ? 'Update Question' : 'Create Question'}
                </Button>
              </div>
            </form>
          </Card>
        </div>
      </div>
    </AdminLayout>
  );
};

export default AdminQuestionFormPage;