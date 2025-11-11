import React from 'react';
import Card from '@/shared/components/ui/Card';
import Input from '@/shared/components/ui/Input';
import Button from '@/shared/components/ui/Button';

const QuestionForm = ({
    form,
    handleChange,
    handleOptionChange,
    handleSave,
    editMode,
    handleDelete,
    closeModal,
    selectedQuestion,
}) => {
    return (
        <div className="fixed z-50 inset-0 bg-black/30 backdrop-blur-md overflow-y-auto">
            <div className="min-h-screen flex flex-col justify-center py-6 sm:py-10 px-1">
                <div className="w-full max-w-sm sm:max-w-md lg:max-w-2xl mx-auto rounded-2xl shadow-2xl border border-gray-100 bg-white my-auto">
                    {/* Modal header */}
                    <div className="flex flex-col items-center pt-6 pb-2">
                        <div className="w-12 h-12 rounded-full shadow bg-purple-100 text-purple-700 flex items-center justify-center mb-3">
                            <svg className="w-7 h-7" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path
                                    strokeLinecap="round"
                                    strokeLinejoin="round"
                                    strokeWidth={2}
                                    d="M8.228 9c.549-1.165 2.03-2 3.772-2 2.21 0 4 1.343 4 3 0 1.4-1.278 2.575-3.006 2.907-.542.104-.994.54-.994 1.093m0 3h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"
                                />
                            </svg>
                        </div>
                        <h2 className="text-lg sm:text-xl md:text-2xl font-bold text-gray-900 mb-1 text-center">
                            {editMode ? 'Edit Question' : 'Add New Question'}
                        </h2>
                        <p className="text-gray-500 text-xs sm:text-sm mt-1 text-center max-w-xs mb-2">
                            Create MCQ, subjective, or coding questions for this module.
                        </p>
                    </div>

                    {/* Form */}
                    <form className="flex flex-col gap-3 p-3 sm:p-4 md:p-6 pb-9" onSubmit={handleSave} autoComplete="off">
                        {/* Question Type */}
                        <div>
                            <label className="block text-sm font-medium text-gray-700 mb-1">Question Type</label>
                            <select
                                name="type"
                                value={form.type}
                                onChange={handleChange}
                                className="w-full border border-gray-300 rounded-lg px-3 py-2 bg-white"
                                required
                            >
                                <option value="mcq">Multiple Choice (MCQ)</option>
                                <option value="subjective">Subjective</option>
                                <option value="coding">Coding</option>
                            </select>
                        </div>

                        {/* Question Text */}
                        <div>
                            <label className="block text-sm font-medium text-gray-700 mb-1">Question</label>
                            <textarea
                                name="question"
                                value={form.question}
                                onChange={handleChange}
                                className="w-full border border-gray-300 rounded-lg px-3 py-2 min-h-[80px]"
                                required
                            />
                        </div>

                        {/* MCQ Options */}
                        {form.type === 'mcq' && form.options && (
                            <>
                                <div>
                                    <label className="block text-sm font-medium text-gray-700 mb-2">Options</label>
                                    {form.options.map((opt, idx) => (
                                        <input
                                            key={idx}
                                            type="text"
                                            value={opt}
                                            onChange={(e) => handleOptionChange(idx, e.target.value)}
                                            placeholder={`Option ${String.fromCharCode(65 + idx)}`}
                                            className="w-full border border-gray-300 rounded-lg px-3 py-2 mb-2"
                                            required
                                        />
                                    ))}
                                </div>
                                <Input
                                    label="Correct Answer"
                                    name="correctAnswer"
                                    value={form.correctAnswer}
                                    onChange={handleChange}
                                    placeholder="Enter the correct option text"
                                    required
                                />
                            </>
                        )}


                        {/* Subjective/Coding Answer (optional for preview/reference) */}
                        {(form.type === 'subjective' || form.type === 'coding') && (
                            <div>
                                <label className="block text-sm font-medium text-gray-700 mb-1">
                                    Sample Answer (Optional)
                                </label>
                                <textarea
                                    name="correctAnswer"
                                    value={form.correctAnswer}
                                    onChange={handleChange}
                                    className="w-full border border-gray-300 rounded-lg px-3 py-2 min-h-[60px]"
                                    placeholder="Provide a sample or expected answer..."
                                />
                            </div>
                        )}

                        {/* Difficulty & Marks */}
                        <div className="flex flex-col sm:flex-row gap-3">
                            <div className="flex-1">
                                <label className="block text-sm font-medium text-gray-700 mb-1">Difficulty</label>
                                <select
                                    name="difficulty"
                                    value={form.difficulty}
                                    onChange={handleChange}
                                    className="w-full border border-gray-300 rounded-lg px-3 py-2 bg-white"
                                    required
                                >
                                    <option value="easy">Easy</option>
                                    <option value="medium">Medium</option>
                                    <option value="hard">Hard</option>
                                </select>
                            </div>
                            <Input
                                label="Marks"
                                type="number"
                                name="marks"
                                value={form.marks}
                                onChange={handleChange}
                                className="flex-1"
                                required
                            />
                        </div>

                        {/* Modal actions */}
                        <div className="flex flex-col sm:flex-row gap-2 pt-3">
                            {editMode && handleDelete && (
                                <Button variant="danger" onClick={() => handleDelete(selectedQuestion.id)} fullWidth>
                                    Delete
                                </Button>
                            )}
                            <Button variant="outline" onClick={closeModal} fullWidth>
                                Cancel
                            </Button>
                            <Button variant="primary" type="submit" fullWidth>
                                {editMode ? 'Update' : 'Create'}
                            </Button>
                        </div>
                    </form>
                </div>
            </div>
        </div>
    );
};

export default QuestionForm;
