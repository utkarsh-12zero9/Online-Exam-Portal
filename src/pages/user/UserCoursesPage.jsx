import React, { useState } from 'react';
import { useSelector } from 'react-redux';
import { useNavigate } from 'react-router-dom';
import UserLayout from '@/shared/components/layout/UserLayout';
import Card from '@/shared/components/ui/Card';
import Button from '@/shared/components/ui/Button';

const UserCoursesPage = () => {
    const navigate = useNavigate();
    const courses = useSelector((state) => state.courses.courses);
    const activeCourses = courses.filter((c) => c.isActive);

    const [filter, setFilter] = useState('all');
    const [searchTerm, setSearchTerm] = useState('');

    const filteredCourses = activeCourses.filter((course) => {
        const matchesSearch = course.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
            course.domain.toLowerCase().includes(searchTerm.toLowerCase());
        const matchesDifficulty = filter === 'all' || course.difficulty === filter;
        return matchesSearch && matchesDifficulty;
    });

    return (
        <UserLayout>
            <div className="max-w-7xl mx-auto px-3 sm:px-6 lg:px-8 py-4 space-y-6">
                {/* Header */}
                <div>
                    <h1 className="text-3xl font-bold text-gray-900 mb-2">Browse Courses</h1>
                    <p className="text-gray-600 mb-6 text-base sm:text-lg">Explore and enroll in available courses</p>
                </div>

                {/* Search & Filter */}
                <div className="flex flex-col sm:flex-row items-center gap-3 mb-6 max-w-3xl">
                    <input
                        type="text"
                        placeholder="Search courses..."
                        value={searchTerm}
                        onChange={(e) => setSearchTerm(e.target.value)}
                        className="flex-grow px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition"
                        aria-label="Search courses"
                    />
                    <select
                        value={filter}
                        onChange={(e) => setFilter(e.target.value)}
                        className="px-4 py-2 border border-gray-300 rounded-lg bg-white focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition cursor-pointer"
                        aria-label="Filter courses by difficulty"
                    >
                        <option value="all">All Difficulties</option>
                        <option value="easy">Easy</option>
                        <option value="medium">Medium</option>
                        <option value="hard">Hard</option>
                    </select>
                </div>

                {/* Course Grid */}
                {filteredCourses.length > 0 ? (
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                        {filteredCourses.map((course) => (
                            <Card key={course.id} className="p-6 hover:shadow-lg transition-shadow flex flex-col h-full">
                                <div className="flex items-start justify-between mb-4">
                                    <h2 className="text-xl font-bold text-gray-900">{course.title}</h2>
                                    <span
                                        className={`px-3 py-1 rounded-full text-xs font-semibold ${course.difficulty === "easy"
                                                ? "bg-emerald-100 text-emerald-700"
                                                : course.difficulty === "medium"
                                                    ? "bg-yellow-100 text-yellow-700"
                                                    : "bg-red-100 text-red-700"
                                            }`}
                                    >
                                        {course.difficulty}
                                    </span>
                                </div>

                                <p className="text-gray-600 text-sm mb-4 flex-grow">{course.description || "No description provided."}</p>

                                <div className="space-y-3 mb-4 text-gray-600 text-sm">
                                    <div className="flex items-center gap-2">
                                        <span aria-hidden="true">📚</span>
                                        <span className="font-semibold">{course.domain}</span>
                                    </div>
                                    <div className="flex items-center gap-2">
                                        <span aria-hidden="true">⏱️</span>
                                        <span>{course.duration} minutes</span>
                                    </div>
                                    <div className="flex items-center gap-2">
                                        <span aria-hidden="true">💰</span>
                                        <span>{course.price === 0 ? "Free" : `₹${course.price}`}</span>
                                    </div>
                                </div>

                                <div className="flex flex-wrap gap-2 mb-4">
                                    {course.tags?.map((tag, i) => (
                                        <span
                                            key={i}
                                            className="px-2 py-1 bg-gray-100 text-gray-700 text-xs rounded-full"
                                        >
                                            {tag}
                                        </span>
                                    ))}
                                </div>

                                <Button
                                    variant="primary"
                                    fullWidth
                                    onClick={() => navigate(`/user/courses/${course.id}`)}
                                    aria-label={`View details for ${course.title}`}
                                    className="mt-auto"
                                >
                                    View Details
                                </Button>
                            </Card>
                        ))}
                    </div>
                ) : (
                    <div className="text-center py-20 text-gray-500">
                        No courses found matching your criteria.
                    </div>
                )}
            </div>
        </UserLayout>
    );

};

export default UserCoursesPage;