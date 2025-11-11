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
            <div>
                <h1 className="text-3xl font-bold text-gray-900 mb-2">Browse Courses</h1>
                <p className="text-gray-600 mb-6">Explore and enroll in available courses</p>

                {/* Search & Filter */}
                <div className="flex flex-col sm:flex-row gap-3 mb-6">
                    <input
                        type="text"
                        placeholder="Search courses..."
                        value={searchTerm}
                        onChange={(e) => setSearchTerm(e.target.value)}
                        className="flex-1 px-4 py-2 border border-gray-300 rounded-lg"
                    />
                    <select
                        value={filter}
                        onChange={(e) => setFilter(e.target.value)}
                        className="px-4 py-2 border border-gray-300 rounded-lg bg-white"
                    >
                        <option value="all">All Difficulties</option>
                        <option value="easy">Easy</option>
                        <option value="medium">Medium</option>
                        <option value="hard">Hard</option>
                    </select>
                </div>

                {/* Course Grid */}
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                    {filteredCourses.map((course) => (
                        <Card key={course.id} className="p-5 hover:shadow-lg transition-shadow">
                            <div className="flex flex-col h-full">
                                <div className="flex items-start justify-between mb-3">
                                    <h2 className="text-xl font-bold text-gray-900">{course.title}</h2>
                                    <span
                                        className={`px-2 py-1 rounded text-xs font-semibold ${course.difficulty === 'easy'
                                                ? 'bg-emerald-100 text-emerald-700'
                                                : course.difficulty === 'medium'
                                                    ? 'bg-yellow-100 text-yellow-700'
                                                    : 'bg-red-100 text-red-700'
                                            }`}
                                    >
                                        {course.difficulty}
                                    </span>
                                </div>

                                <p className="text-gray-600 text-sm mb-3 flex-1">{course.description}</p>

                                <div className="space-y-2 mb-4">
                                    <div className="flex items-center gap-2 text-sm text-gray-600">
                                        <span>📚</span>
                                        <span className="font-semibold">{course.domain}</span>
                                    </div>
                                    <div className="flex items-center gap-2 text-sm text-gray-600">
                                        <span>⏱️</span>
                                        <span>{course.duration} minutes</span>
                                    </div>
                                    <div className="flex items-center gap-2 text-sm text-gray-600">
                                        <span>💰</span>
                                        <span>{course.price === 0 ? 'Free' : `₹${course.price}`}</span>
                                    </div>
                                </div>

                                <div className="flex flex-wrap gap-2 mb-4">
                                    {course.tags.map((tag, i) => (
                                        <span key={i} className="px-2 py-1 bg-gray-100 rounded text-xs text-gray-700">
                                            {tag}
                                        </span>
                                    ))}
                                </div>

                                <Button
                                    variant="primary"
                                    fullWidth
                                    onClick={() => navigate(`/user/courses/${course.id}`)}
                                >
                                    View Details
                                </Button>
                            </div>
                        </Card>
                    ))}
                </div>

                {filteredCourses.length === 0 && (
                    <div className="text-center py-12">
                        <p className="text-gray-500">No courses found matching your criteria.</p>
                    </div>
                )}
            </div>
        </UserLayout>
    );
};

export default UserCoursesPage;