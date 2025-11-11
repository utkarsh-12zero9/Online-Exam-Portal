import React, { useState } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import { useNavigate } from 'react-router-dom';
import AdminLayout from '@/shared/components/layout/AdminLayout';
import Card from '@/shared/components/ui/Card';
import Button from '@/shared/components/ui/Button';
import Input from '@/shared/components/ui/Input';
import { deleteQuestion } from '@/features/questions/slices/questionSlice';
import { toast } from 'react-toastify';

const AdminQuestionsPage = () => {
  const navigate = useNavigate();
  const dispatch = useDispatch();

  const questions = useSelector((state) => state.questions.questions);
  const modules = useSelector((state) => state.modules.modules);
  const courses = useSelector((state) => state.courses.courses);

  const [searchTerm, setSearchTerm] = useState('');
  const [filterType, setFilterType] = useState('all');
  const [filterDifficulty, setFilterDifficulty] = useState('all');
  const [filterModule, setFilterModule] = useState('all');

  // Filter questions
  const filteredQuestions = questions.filter((q) => {
    const matchesSearch = q.question.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesType = filterType === 'all' || q.type === filterType;
    const matchesDifficulty = filterDifficulty === 'all' || q.difficulty === filterDifficulty;
    const matchesModule = filterModule === 'all' || q.moduleId === Number(filterModule);
    return matchesSearch && matchesType && matchesDifficulty && matchesModule;
  });

  const handleDelete = (id, question) => {
    if (window.confirm(`Are you sure you want to delete this question?\n\n"${question}"`)) {
      dispatch(deleteQuestion(id));
      toast.success('Question deleted successfully');
    }
  };

  const getModuleName = (moduleId) => {
    const module = modules.find((m) => m.id === moduleId);
    return module ? module.title : 'Unknown Module';
  };

  const getCourseName = (moduleId) => {
    const module = modules.find((m) => m.id === moduleId);
    const course = courses.find((c) => c.id === module?.courseId);
    return course ? course.title : 'Unknown Course';
  };

  return (
    <AdminLayout>
      <div>
        {/* Header */}
        <div className="flex items-center justify-between mb-6">
          <div>
            <h1 className="text-3xl font-bold text-gray-900 mb-2">Question Bank</h1>
            <p className="text-gray-600">Manage all exam questions across modules</p>
          </div>
          <Button variant="primary" onClick={() => navigate('/admin/questions/create')}>
            + Add Question
          </Button>
        </div>

        {/* Stats Cards */}
        <div className="grid grid-cols-1 sm:grid-cols-4 gap-4 mb-6">
          <Card className="p-4">
            <p className="text-gray-600 text-sm mb-1">Total Questions</p>
            <p className="text-2xl font-bold text-blue-600">{questions.length}</p>
          </Card>
          <Card className="p-4">
            <p className="text-gray-600 text-sm mb-1">MCQ</p>
            <p className="text-2xl font-bold text-emerald-600">
              {questions.filter((q) => q.type === 'mcq').length}
            </p>
          </Card>
          <Card className="p-4">
            <p className="text-gray-600 text-sm mb-1">Subjective</p>
            <p className="text-2xl font-bold text-purple-600">
              {questions.filter((q) => q.type === 'subjective').length}
            </p>
          </Card>
          <Card className="p-4">
            <p className="text-gray-600 text-sm mb-1">Coding</p>
            <p className="text-2xl font-bold text-yellow-600">
              {questions.filter((q) => q.type === 'coding').length}
            </p>
          </Card>
        </div>

        {/* Filters */}
        <Card className="p-4 mb-6">
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3">
            <Input
              placeholder="Search questions..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
            />
            <select
              value={filterType}
              onChange={(e) => setFilterType(e.target.value)}
              className="border border-gray-300 rounded-lg px-3 py-2"
            >
              <option value="all">All Types</option>
              <option value="mcq">MCQ</option>
              <option value="subjective">Subjective</option>
              <option value="coding">Coding</option>
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
            <select
              value={filterModule}
              onChange={(e) => setFilterModule(e.target.value)}
              className="border border-gray-300 rounded-lg px-3 py-2"
            >
              <option value="all">All Modules</option>
              {modules.map((module) => (
                <option key={module.id} value={module.id}>
                  {module.title}
                </option>
              ))}
            </select>
          </div>
          <p className="text-sm text-gray-600 mt-3">
            Showing {filteredQuestions.length} of {questions.length} questions
          </p>
        </Card>

        {/* Questions List */}
        <div className="space-y-4">
          {filteredQuestions.length > 0 ? (
            filteredQuestions.map((question) => (
              <Card key={question.id} className="p-5 hover:shadow-lg transition-shadow">
                <div className="flex items-start justify-between gap-4">
                  <div className="flex-1">
                    {/* Question Header */}
                    <div className="flex items-center gap-2 mb-2">
                      <span
                        className={`px-2 py-1 rounded text-xs font-semibold ${
                          question.type === 'mcq'
                            ? 'bg-blue-100 text-blue-700'
                            : question.type === 'subjective'
                            ? 'bg-purple-100 text-purple-700'
                            : 'bg-yellow-100 text-yellow-700'
                        }`}
                      >
                        {question.type.toUpperCase()}
                      </span>
                      <span
                        className={`px-2 py-1 rounded text-xs font-semibold ${
                          question.difficulty === 'easy'
                            ? 'bg-emerald-100 text-emerald-700'
                            : question.difficulty === 'medium'
                            ? 'bg-yellow-100 text-yellow-700'
                            : 'bg-red-100 text-red-700'
                        }`}
                      >
                        {question.difficulty}
                      </span>
                      <span className="px-2 py-1 bg-gray-100 text-gray-700 rounded text-xs font-semibold">
                        {question.marks} marks
                      </span>
                    </div>

                    {/* Question Text */}
                    <h3 className="text-base font-semibold text-gray-900 mb-2">{question.question}</h3>

                    {/* Module & Course Info */}
                    <div className="flex items-center gap-3 text-sm text-gray-600 mb-3">
                      <span>📚 {getCourseName(question.moduleId)}</span>
                      <span>•</span>
                      <span>📝 {getModuleName(question.moduleId)}</span>
                    </div>

                    {/* MCQ Options Preview */}
                    {question.type === 'mcq' && question.options && (
                      <div className="space-y-1">
                        {question.options.slice(0, 2).map((option, idx) => (
                          <div key={idx} className="text-sm text-gray-700 flex items-center gap-2">
                            <span className="text-gray-400">{String.fromCharCode(65 + idx)}.</span>
                            <span className="truncate">{option}</span>
                            {option === question.correctAnswer && (
                              <span className="text-emerald-600 font-semibold">✓</span>
                            )}
                          </div>
                        ))}
                        {question.options.length > 2 && (
                          <p className="text-xs text-gray-500">+{question.options.length - 2} more options</p>
                        )}
                      </div>
                    )}
                  </div>

                  {/* Actions */}
                  <div className="flex flex-col gap-2">
                    <Button
                      variant="secondary"
                      size="sm"
                      onClick={() => navigate(`/admin/questions/edit/${question.id}`)}
                    >
                      Edit
                    </Button>
                    <Button
                      variant="danger"
                      size="sm"
                      onClick={() => handleDelete(question.id, question.question)}
                    >
                      Delete
                    </Button>
                  </div>
                </div>
              </Card>
            ))
          ) : (
            <Card className="p-12 text-center">
              <p className="text-gray-500 mb-4">No questions found matching your filters</p>
              <Button variant="primary" onClick={() => navigate('/admin/questions/create')}>
                Create First Question
              </Button>
            </Card>
          )}
        </div>
      </div>
    </AdminLayout>
  );
};

export default AdminQuestionsPage;
