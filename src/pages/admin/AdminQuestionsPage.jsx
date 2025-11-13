import React, { useState } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import { useNavigate } from 'react-router-dom';
import AdminLayout from '@/shared/components/layout/AdminLayout';
import Card from '@/shared/components/ui/Card';
import Button from '@/shared/components/ui/Button';
import Input from '@/shared/components/ui/Input';
import { deleteQuestion, bulkDeleteQuestions } from '@/features/questions/slices/questionSlice';
import { toast } from 'react-toastify';
import { exportToCSV } from '@/shared/utils/exportToCSV';

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
  const [selectedQuestions, setSelectedQuestions] = useState([]);

  const filteredQuestions = questions.filter((q) => {
    const matchesSearch = q.question.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesType = filterType === 'all' || q.type === filterType;
    const matchesDifficulty = filterDifficulty === 'all' || q.difficulty === filterDifficulty;
    const matchesModule = filterModule === 'all' || q.moduleId === Number(filterModule);
    return matchesSearch && matchesType && matchesDifficulty && matchesModule;
  });

  const handleSelectAll = (e) => {
    if (e.target.checked) {
      setSelectedQuestions(filteredQuestions.map((q) => q.id));
    } else {
      setSelectedQuestions([]);
    }
  };

  const handleSelectOne = (questionId) => {
    if (selectedQuestions.includes(questionId)) {
      setSelectedQuestions(selectedQuestions.filter((id) => id !== questionId));
    } else {
      setSelectedQuestions([...selectedQuestions, questionId]);
    }
  };

  const handleBulkDelete = () => {
    if (selectedQuestions.length === 0) {
      toast.warning('Please select questions to delete');
      return;
    }

    const confirmMessage = `Are you sure you want to delete ${selectedQuestions.length} question${selectedQuestions.length > 1 ? 's' : ''
      }?`;

    if (window.confirm(confirmMessage)) {
      dispatch(bulkDeleteQuestions(selectedQuestions));
      toast.success(
        `${selectedQuestions.length} question${selectedQuestions.length > 1 ? 's' : ''} deleted successfully`
      );
      setSelectedQuestions([]);
    }
  };

  const handleDelete = (id, question) => {
    if (window.confirm(`Are you sure you want to delete this question?\n\n"${question}"`)) {
      dispatch(deleteQuestion(id));
      toast.success('Question deleted successfully');
      setSelectedQuestions(selectedQuestions.filter((qId) => qId !== id));
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

  const allSelected = filteredQuestions.length > 0 && selectedQuestions.length === filteredQuestions.length;
  const someSelected = selectedQuestions.length > 0 && !allSelected;

  const exportQuestions = () => {
    const data = filteredQuestions.map((question) => ({
      'Question': question.question,
      'Type': question.type,
      'Difficulty': question.difficulty,
      'Marks': question.marks,
      'Module': getModuleName(question.moduleId),
      'Course': getCourseName(question.moduleId),
      'Correct Answer': question.correctAnswer,
    }));

    exportToCSV(data, `questions-${new Date().toISOString().split('T')[0]}.csv`);
    toast.success('Questions data exported successfully!');
  };

  return (
    <AdminLayout>
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
        {/* Header Section */}
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 mb-8">
          <div className="flex items-center gap-3">
            <div className="w-12 h-12 rounded-xl bg-gradient-to-br from-purple-500 to-indigo-600 flex items-center justify-center shadow-lg">
              <svg className="w-6 h-6 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8.228 9c.549-1.165 2.03-2 3.772-2 2.21 0 4 1.343 4 3 0 1.4-1.278 2.575-3.006 2.907-.542.104-.994.54-.994 1.093m0 3h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
              </svg>
            </div>
            <div>
              <h1 className="text-2xl sm:text-3xl font-bold text-gray-900 tracking-tight">
                Question Bank
              </h1>
              <p className="text-sm text-gray-600 mt-0.5">
                Manage and organize all assessment questions
              </p>
            </div>
          </div>

          {/* Action Buttons */}
          <div className="flex flex-wrap gap-2">
            {selectedQuestions.length > 0 && (
              <Button
                variant="danger"
                onClick={handleBulkDelete}
                className="flex-1 sm:flex-none"
              >
                <span className="flex items-center gap-2">
                  <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
                  </svg>
                  Delete ({selectedQuestions.length})
                </span>
              </Button>
            )}
            <Button
              variant="outline"
              onClick={exportQuestions}
              className="flex-1 sm:flex-none"
            >
              <span className="flex items-center gap-2">
                <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 16v1a3 3 0 003 3h10a3 3 0 003-3v-1m-4-4l-4 4m0 0l-4-4m4 4V4" />
                </svg>
                Export CSV
              </span>
            </Button>
            <Button
              variant="primary"
              onClick={() => navigate('/admin/questions/create')}
              className="flex-1 sm:flex-none"
            >
              <span className="flex items-center gap-2">
                <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" />
                </svg>
                Add Question
              </span>
            </Button>
          </div>
        </div>

        {/* Stats Cards */}
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-3 sm:gap-4 mb-6">
          <Card className="p-4 sm:p-5 bg-gradient-to-br from-blue-50 to-blue-100 border border-blue-200">
            <div className="flex items-center justify-between mb-2">
              <p className="text-xs sm:text-sm font-medium text-blue-700">Total Questions</p>
              <div className="w-8 h-8 rounded-lg bg-blue-200 flex items-center justify-center">
                <svg className="w-4 h-4 text-blue-700" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
                </svg>
              </div>
            </div>
            <p className="text-2xl sm:text-3xl font-bold text-blue-700">{questions.length}</p>
          </Card>

          <Card className="p-4 sm:p-5 bg-gradient-to-br from-emerald-50 to-emerald-100 border border-emerald-200">
            <div className="flex items-center justify-between mb-2">
              <p className="text-xs sm:text-sm font-medium text-emerald-700">MCQ</p>
              <div className="w-8 h-8 rounded-lg bg-emerald-200 flex items-center justify-center">
                <svg className="w-4 h-4 text-emerald-700" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2m-6 9l2 2 4-4" />
                </svg>
              </div>
            </div>
            <p className="text-2xl sm:text-3xl font-bold text-emerald-700">
              {questions.filter((q) => q.type === 'mcq').length}
            </p>
          </Card>

          <Card className="p-4 sm:p-5 bg-gradient-to-br from-purple-50 to-purple-100 border border-purple-200">
            <div className="flex items-center justify-between mb-2">
              <p className="text-xs sm:text-sm font-medium text-purple-700">Subjective</p>
              <div className="w-8 h-8 rounded-lg bg-purple-200 flex items-center justify-center">
                <svg className="w-4 h-4 text-purple-700" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z" />
                </svg>
              </div>
            </div>
            <p className="text-2xl sm:text-3xl font-bold text-purple-700">
              {questions.filter((q) => q.type === 'subjective').length}
            </p>
          </Card>

          <Card className="p-4 sm:p-5 bg-gradient-to-br from-yellow-50 to-yellow-100 border border-yellow-200">
            <div className="flex items-center justify-between mb-2">
              <p className="text-xs sm:text-sm font-medium text-yellow-700">Coding</p>
              <div className="w-8 h-8 rounded-lg bg-yellow-200 flex items-center justify-center">
                <svg className="w-4 h-4 text-yellow-700" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 20l4-16m4 4l4 4-4 4M6 16l-4-4 4-4" />
                </svg>
              </div>
            </div>
            <p className="text-2xl sm:text-3xl font-bold text-yellow-700">
              {questions.filter((q) => q.type === 'coding').length}
            </p>
          </Card>
        </div>

        {/* Filters Card */}
        <Card className="p-4 sm:p-6 mb-6 shadow-sm border border-gray-200">
          <div className="space-y-4">
            {/* Filter Controls */}
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-6 gap-3">
              {/* Select All Checkbox */}
              <div className="flex items-center gap-2.5 sm:col-span-2 lg:col-span-1">
                <input
                  type="checkbox"
                  checked={allSelected}
                  ref={(input) => {
                    if (input) input.indeterminate = someSelected;
                  }}
                  onChange={handleSelectAll}
                  className="w-4 h-4 text-blue-600 border-gray-300 rounded focus:ring-blue-500 focus:ring-2 cursor-pointer"
                />
                <label className="text-sm font-medium text-gray-700 cursor-pointer" onClick={handleSelectAll}>
                  Select All
                </label>
              </div>

              {/* Search Input */}
              <div className="sm:col-span-2 lg:col-span-2">
                <div className="relative">
                  <svg
                    className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400"
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24"
                  >
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
                  </svg>
                  <Input
                    placeholder="Search questions..."
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                    className="pl-10 w-full"
                  />
                </div>
              </div>

              {/* Type Filter */}
              <div className="relative">
                <select
                  value={filterType}
                  onChange={(e) => setFilterType(e.target.value)}
                  className="w-full appearance-none border border-gray-300 rounded-lg px-3 pr-10 py-2.5 text-sm bg-white hover:border-gray-400 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all cursor-pointer"
                >
                  <option value="all">All Types</option>
                  <option value="mcq">MCQ</option>
                  <option value="subjective">Subjective</option>
                  <option value="coding">Coding</option>
                </select>
                <div className="absolute inset-y-0 right-0 flex items-center pr-3 pointer-events-none">
                  <svg className="w-4 h-4 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
                  </svg>
                </div>
              </div>

              {/* Difficulty Filter */}
              <div className="relative">
                <select
                  value={filterDifficulty}
                  onChange={(e) => setFilterDifficulty(e.target.value)}
                  className="w-full appearance-none border border-gray-300 rounded-lg px-3 pr-10 py-2.5 text-sm bg-white hover:border-gray-400 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all cursor-pointer"
                >
                  <option value="all">All Difficulties</option>
                  <option value="easy">Easy</option>
                  <option value="medium">Medium</option>
                  <option value="hard">Hard</option>
                </select>
                <div className="absolute inset-y-0 right-0 flex items-center pr-3 pointer-events-none">
                  <svg className="w-4 h-4 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
                  </svg>
                </div>
              </div>

              {/* Module Filter */}
              <div className="relative">
                <select
                  value={filterModule}
                  onChange={(e) => setFilterModule(e.target.value)}
                  className="w-full appearance-none border border-gray-300 rounded-lg px-3 pr-10 py-2.5 text-sm bg-white hover:border-gray-400 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all cursor-pointer"
                >
                  <option value="all">All Modules</option>
                  {modules.map((module) => (
                    <option key={module.id} value={module.id}>
                      {module.title}
                    </option>
                  ))}
                </select>
                <div className="absolute inset-y-0 right-0 flex items-center pr-3 pointer-events-none">
                  <svg className="w-4 h-4 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
                  </svg>
                </div>
              </div>
            </div>

            {/* Results Count */}
            <div className="flex items-center justify-between pt-2 border-t border-gray-100">
              <span className="text-sm text-gray-600 font-medium">
                Showing <span className="text-gray-900 font-semibold">{filteredQuestions.length}</span> of {questions.length} questions
              </span>
              {(filterType !== 'all' || filterDifficulty !== 'all' || filterModule !== 'all' || searchTerm) && (
                <button
                  onClick={() => {
                    setFilterType('all');
                    setFilterDifficulty('all');
                    setFilterModule('all');
                    setSearchTerm('');
                  }}
                  className="text-sm text-blue-600 hover:text-blue-700 font-medium transition-colors"
                >
                  Clear all filters
                </button>
              )}
            </div>
          </div>
        </Card>

        {/* Questions List */}
        <div className="space-y-4">
          {filteredQuestions.length > 0 ? (
            filteredQuestions.map((question) => {
              const isSelected = selectedQuestions.includes(question.id);
              return (
                <Card
                  key={question.id}
                  className={`overflow-hidden transition-all duration-200 ${isSelected
                      ? 'ring-2 ring-blue-500 bg-blue-50 shadow-md'
                      : 'hover:shadow-lg border border-gray-200'
                    }`}
                >
                  <div className="p-4 sm:p-5">
                    <div className="flex items-start gap-3 sm:gap-4">
                      {/* Checkbox */}
                      <input
                        type="checkbox"
                        checked={isSelected}
                        onChange={() => handleSelectOne(question.id)}
                        className="mt-1 w-5 h-5 text-blue-600 border-gray-300 rounded focus:ring-blue-500 focus:ring-2 cursor-pointer flex-shrink-0"
                      />

                      {/* Question Content */}
                      <div className="flex-1 min-w-0">
                        {/* Badges Row */}
                        <div className="flex flex-wrap items-center gap-2 mb-3">
                          <span
                            className={`inline-flex items-center px-2.5 py-1 rounded-full text-xs font-semibold ${question.type === 'mcq'
                                ? 'bg-blue-100 text-blue-700'
                                : question.type === 'subjective'
                                  ? 'bg-purple-100 text-purple-700'
                                  : 'bg-yellow-100 text-yellow-700'
                              }`}
                          >
                            {question.type.toUpperCase()}
                          </span>
                          <span
                            className={`inline-flex items-center px-2.5 py-1 rounded-full text-xs font-semibold ${question.difficulty === 'easy'
                                ? 'bg-emerald-100 text-emerald-700'
                                : question.difficulty === 'medium'
                                  ? 'bg-yellow-100 text-yellow-700'
                                  : 'bg-red-100 text-red-700'
                              }`}
                          >
                            {question.difficulty.charAt(0).toUpperCase() + question.difficulty.slice(1)}
                          </span>
                          <span className="inline-flex items-center px-2.5 py-1 bg-gray-100 text-gray-700 rounded-full text-xs font-semibold">
                            {question.marks} marks
                          </span>
                        </div>

                        {/* Question Text */}
                        <h3 className="text-sm sm:text-base font-semibold text-gray-900 mb-3 line-clamp-2">
                          {question.question}
                        </h3>

                        {/* Module & Course Info */}
                        <div className="flex flex-wrap items-center gap-2 sm:gap-3 text-xs sm:text-sm text-gray-600 mb-3">
                          <div className="flex items-center gap-1.5">
                            <svg className="w-4 h-4 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 6.253v13m0-13C10.832 5.477 9.246 5 7.5 5S4.168 5.477 3 6.253v13C4.168 18.477 5.754 18 7.5 18s3.332.477 4.5 1.253m0-13C13.168 5.477 14.754 5 16.5 5c1.747 0 3.332.477 4.5 1.253v13C19.832 18.477 18.247 18 16.5 18c-1.746 0-3.332.477-4.5 1.253" />
                            </svg>
                            <span>{getCourseName(question.moduleId)}</span>
                          </div>
                          <span className="text-gray-400">•</span>
                          <div className="flex items-center gap-1.5">
                            <svg className="w-4 h-4 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
                            </svg>
                            <span>{getModuleName(question.moduleId)}</span>
                          </div>
                        </div>

                        {/* MCQ Options Preview */}
                        {question.type === 'mcq' && question.options && (
                          <div className="bg-gray-50 rounded-lg p-3 space-y-2 border border-gray-100">
                            {question.options.slice(0, 2).map((option, idx) => (
                              <div key={idx} className="flex items-start gap-2 text-xs sm:text-sm text-gray-700">
                                <span className="flex-shrink-0 w-5 h-5 rounded-full bg-white border border-gray-300 flex items-center justify-center text-xs font-medium text-gray-600">
                                  {String.fromCharCode(65 + idx)}
                                </span>
                                <span className="flex-1 truncate">{option}</span>
                                {option === question.correctAnswer && (
                                  <svg className="w-5 h-5 text-emerald-600 flex-shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                                  </svg>
                                )}
                              </div>
                            ))}
                            {question.options.length > 2 && (
                              <p className="text-xs text-gray-500 pl-7">
                                +{question.options.length - 2} more option{question.options.length - 2 !== 1 ? 's' : ''}
                              </p>
                            )}
                          </div>
                        )}
                      </div>

                      {/* Action Buttons */}
                      <div className="flex flex-col gap-2 flex-shrink-0">
                        <Button
                          variant="secondary"
                          size="sm"
                          onClick={() => navigate(`/admin/questions/edit/${question.id}`)}
                          className="whitespace-nowrap"
                        >
                          <span className="hidden sm:inline">Edit</span>
                          <span className="sm:hidden">
                            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z" />
                            </svg>
                          </span>
                        </Button>
                        <Button
                          variant="danger"
                          size="sm"
                          onClick={() => handleDelete(question.id, question.question)}
                          className="whitespace-nowrap"
                        >
                          <span className="hidden sm:inline">Delete</span>
                          <span className="sm:hidden">
                            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
                            </svg>
                          </span>
                        </Button>
                      </div>
                    </div>
                  </div>
                </Card>
              );
            })
          ) : (
            <Card className="p-12 sm:p-16 text-center border-2 border-dashed border-gray-300">
              <div className="max-w-md mx-auto">
                <div className="w-20 h-20 sm:w-24 sm:h-24 mx-auto mb-6 rounded-full bg-gradient-to-br from-purple-100 to-indigo-100 flex items-center justify-center">
                  <svg className="w-10 h-10 sm:w-12 sm:h-12 text-purple-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M8.228 9c.549-1.165 2.03-2 3.772-2 2.21 0 4 1.343 4 3 0 1.4-1.278 2.575-3.006 2.907-.542.104-.994.54-.994 1.093m0 3h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                  </svg>
                </div>
                <h3 className="text-xl sm:text-2xl font-bold text-gray-900 mb-3">
                  No questions found
                </h3>
                <p className="text-sm sm:text-base text-gray-600 mb-6">
                  {searchTerm || filterType !== 'all' || filterDifficulty !== 'all' || filterModule !== 'all'
                    ? 'No questions match your current filters. Try adjusting your search criteria.'
                    : 'Start building your question bank by creating your first question.'}
                </p>
                <Button
                  variant="primary"
                  onClick={() => navigate('/admin/questions/create')}
                >
                  <span className="flex items-center gap-2">
                    <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" />
                    </svg>
                    Create First Question
                  </span>
                </Button>
              </div>
            </Card>
          )}
        </div>
      </div>
    </AdminLayout>
  );

};

export default AdminQuestionsPage;
