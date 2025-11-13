import React from "react";
import Card from "@/shared/components/ui/Card";
import Input from "@/shared/components/ui/Input";
import Button from "@/shared/components/ui/Button";

const badgeColors = {
    easy: "bg-emerald-100 text-emerald-700",
    medium: "bg-yellow-100 text-yellow-800",
    hard: "bg-red-100 text-red-700",
};

const CourseForm = ({
    form,
    handleChange,
    handleSave,
    editMode,
    handleDelete,
    closeModal,
    selectedCourse,
}) => {
    return (
        <div className="fixed z-50 inset-0 bg-black/30 backdrop-blur-md overflow-y-auto">
            <div className="min-h-screen flex flex-col justify-center py-10 px-2 m-2">
                <div className="w-full max-w-lg mx-auto bg-white rounded-2xl shadow-2xl border border-gray-100 my-auto overflow-hidden">

                    {/* Modal Header with Icon */}
                    <div className="flex flex-col items-center pt-8 pb-3">
                        <div className={`
            w-14 h-14 rounded-full shadow-lg flex items-center justify-center
            ${badgeColors[form.difficulty]} mb-3
          `}>
                            <svg className="w-8 h-8" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                {form.difficulty === "easy" && (
                                    <circle cx="12" cy="12" r="10" strokeWidth="2" />
                                )}
                                {form.difficulty === "medium" && (
                                    <rect x="4" y="4" width="16" height="16" rx="4" strokeWidth="2" />
                                )}
                                {form.difficulty === "hard" && (
                                    <polygon points="12,2 2,22 22,22" strokeWidth="2" />
                                )}
                            </svg>
                        </div>
                        <h2 className="text-xl sm:text-2xl font-bold text-gray-900 mb-1 text-center">
                            {editMode ? "Edit Course" : "Create New Course"}
                        </h2>
                        <p className="text-gray-500 text-sm max-w-xs mt-1 mb-2 text-center">
                            Provide course details, pricing, and other settings. <span className="font-semibold">All fields required.</span>
                        </p>
                    </div>

                    {/* Vertical Form */}
                    <form
                        className="flex flex-col gap-3 p-5 pt-0 md:p-7"
                        onSubmit={handleSave}
                        autoComplete="off"
                    >
                        <Input
                            label="Course Title"
                            name="title"
                            value={form.title}
                            onChange={handleChange}
                            required
                        />
                        <Input
                            label="Domain"
                            name="domain"
                            value={form.domain}
                            onChange={handleChange}
                            required
                        />
                        <Input
                            label="Description"
                            name="description"
                            value={form.description}
                            onChange={handleChange}
                            required
                        />

                        <div className="flex flex-col sm:flex-row gap-3">
                            <div className="flex-1">
                                <label className="block text-sm font-medium text-gray-700 mb-1">Difficulty</label>
                                <select
                                    name="difficulty"
                                    value={form.difficulty}
                                    onChange={handleChange}
                                    className="w-full border border-gray-300 rounded-lg px-2 py-2 bg-white"
                                    required
                                >
                                    <option value="easy">Easy</option>
                                    <option value="medium">Medium</option>
                                    <option value="hard">Hard</option>
                                </select>
                            </div>
                            <Input
                                label="Duration (mins)"
                                type="number"
                                name="duration"
                                value={form.duration}
                                onChange={handleChange}
                                className="flex-1"
                                required
                            />
                        </div>

                        <div className="flex flex-col sm:flex-row gap-3">
                            <Input
                                label="Attempt Limit"
                                type="number"
                                name="attemptLimit"
                                value={form.attemptLimit}
                                onChange={handleChange}
                                className="flex-1"
                                required
                            />
                            <Input
                                label="Price (₹)"
                                type="number"
                                name="price"
                                value={form.price}
                                onChange={handleChange}
                                className="flex-1"
                                required
                            />
                        </div>
                        <Input
                            label="Tags (comma separated)"
                            name="tags"
                            value={form.tags}
                            onChange={handleChange}
                            required
                        />

                        <label className="flex items-center gap-2 mt-2 select-none">
                            <input
                                type="checkbox"
                                name="isActive"
                                checked={form.isActive}
                                onChange={handleChange}
                                className="w-4 h-4 accent-emerald-600"
                            />
                            <span className="text-gray-700 text-sm font-medium">Mark as Active</span>
                        </label>

                        {/* Modal Actions */}
                        <div className="flex flex-col sm:flex-row gap-2 pt-4">
                            {editMode && handleDelete && (
                                <Button
                                    variant="danger"
                                    onClick={() => handleDelete(selectedCourse.id)}
                                    fullWidth
                                >
                                    Delete
                                </Button>
                            )}
                            <Button variant="outline" onClick={closeModal} fullWidth>
                                Cancel
                            </Button>
                            <Button variant="primary" type="submit" fullWidth>
                                {editMode ? "Update" : "Create"}
                            </Button>
                        </div>
                    </form>
                </div>
            </div>
        </div>
    );
};

export default CourseForm;
