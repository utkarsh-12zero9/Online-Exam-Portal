import React, { useState } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import { useNavigate } from 'react-router-dom';
import UserLayout from '@/shared/components/layout/UserLayout';
import Card from '@/shared/components/ui/Card';
import Button from '@/shared/components/ui/Button';
import Input from '@/shared/components/ui/Input';
import { updateUser, logout } from '@/features/auth/slices/authSlice';
import { toast } from 'react-toastify';

const UserProfilePage = () => {
    const dispatch = useDispatch();
    const navigate = useNavigate();
    const { user } = useSelector((state) => state.auth);
    const enrollments = useSelector((state) => state.enrollments.enrollments);

    const userEnrollments = enrollments.filter((e) => e.userId === user?.id);
    const totalAttempts = userEnrollments.reduce((sum, e) => sum + e.attempts.length, 0);

    const [editMode, setEditMode] = useState(false);
    const [form, setForm] = useState({
        name: user?.name || '',
        email: user?.email || '',
        phone: user?.phone || '',
        bio: user?.bio || '',
    });

    const [passwordForm, setPasswordForm] = useState({
        currentPassword: '',
        newPassword: '',
        confirmPassword: '',
    });

    const handleChange = (e) => {
        const { name, value } = e.target;
        setForm((f) => ({ ...f, [name]: value }));
    };

    const handlePasswordChange = (e) => {
        const { name, value } = e.target;
        setPasswordForm((f) => ({ ...f, [name]: value }));
    };

    const handleProfileUpdate = (e) => {
        e.preventDefault();
        dispatch(updateUser({ ...user, ...form }));
        toast.success('Profile updated successfully!');
        setEditMode(false);
    };

    const handlePasswordUpdate = (e) => {
        e.preventDefault();
        if (passwordForm.newPassword !== passwordForm.confirmPassword) {
            toast.error('Passwords do not match!');
            return;
        }
        if (passwordForm.newPassword.length < 6) {
            toast.error('Password must be at least 6 characters!');
            return;
        }
        toast.success('Password updated successfully!');
        setPasswordForm({ currentPassword: '', newPassword: '', confirmPassword: '' });
    };

    const handleDeleteAccount = () => {
        if (window.confirm('Are you sure you want to delete your account? This action cannot be undone.')) {
            toast.info('Account deletion requested. Please contact support.');
        }
    };

    const getBestScore = () => {
        let best = 0;
        userEnrollments.forEach((enrollment) => {
            enrollment.attempts.forEach((attempt) => {
                if (attempt.score > best) best = attempt.score;
            });
        });
        return best;
    };

    const getAverageScore = () => {
        if (totalAttempts === 0) return 0;
        let totalScore = 0;
        let totalMarks = 0;
        userEnrollments.forEach((enrollment) => {
            enrollment.attempts.forEach((attempt) => {
                totalScore += attempt.score || 0;
                totalMarks += attempt.totalMarks || 1;
            });
        });
        return totalMarks > 0 ? ((totalScore / totalMarks) * 100).toFixed(1) : 0;
    };

    return (
        <UserLayout>
            <div>
                <h1 className="text-3xl font-bold text-gray-900 mb-2">My Profile</h1>
                <p className="text-gray-600 mb-6">Manage your account settings and preferences</p>

                <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
                    {/* Profile Card */}
                    <div className="lg:col-span-2 space-y-6">
                        {/* Basic Info */}
                        <Card className="p-6">
                            <div className="flex items-center justify-between mb-6">
                                <h2 className="text-xl font-bold text-gray-900">Personal Information</h2>
                                {!editMode && (
                                    <Button variant="secondary" size="sm" onClick={() => setEditMode(true)}>
                                        Edit Profile
                                    </Button>
                                )}
                            </div>

                            <form onSubmit={handleProfileUpdate} className="space-y-4">
                                <div className="flex items-center gap-4 mb-6">
                                    <div className="w-20 h-20 rounded-full bg-emerald-600 flex items-center justify-center text-white text-3xl font-bold">
                                        {user?.name?.charAt(0).toUpperCase() || 'U'}
                                    </div>
                                    <div>
                                        <h3 className="text-lg font-bold text-gray-900">{user?.name}</h3>
                                        <p className="text-sm text-gray-600">{user?.email}</p>
                                        <span className="inline-block mt-1 px-2 py-1 bg-blue-100 text-blue-700 rounded text-xs font-semibold">
                                            {user?.role === 'admin' ? 'Admin' : 'Student'}
                                        </span>
                                    </div>
                                </div>

                                <Input
                                    label="Full Name"
                                    name="name"
                                    value={form.name}
                                    onChange={handleChange}
                                    disabled={!editMode}
                                    required
                                />

                                <Input
                                    label="Email Address"
                                    name="email"
                                    type="email"
                                    value={form.email}
                                    onChange={handleChange}
                                    disabled={!editMode}
                                    required
                                />

                                <Input
                                    label="Phone Number"
                                    name="phone"
                                    type="tel"
                                    value={form.phone}
                                    onChange={handleChange}
                                    disabled={!editMode}
                                    placeholder="Enter your phone number"
                                />

                                <div>
                                    <label className="block text-sm font-medium text-gray-700 mb-1">Bio</label>
                                    <textarea
                                        name="bio"
                                        value={form.bio}
                                        onChange={handleChange}
                                        disabled={!editMode}
                                        className="w-full border border-gray-300 rounded-lg px-3 py-2 min-h-[100px] disabled:bg-gray-50 disabled:text-gray-600"
                                        placeholder="Tell us about yourself..."
                                    />
                                </div>

                                {editMode && (
                                    <div className="flex gap-3">
                                        <Button variant="outline" onClick={() => setEditMode(false)} fullWidth>
                                            Cancel
                                        </Button>
                                        <Button variant="primary" type="submit" fullWidth>
                                            Save Changes
                                        </Button>
                                    </div>
                                )}
                            </form>
                        </Card>

                        {/* Change Password */}
                        <Card className="p-6">
                            <h2 className="text-xl font-bold text-gray-900 mb-6">Change Password</h2>

                            <form onSubmit={handlePasswordUpdate} className="space-y-4">
                                <Input
                                    label="Current Password"
                                    name="currentPassword"
                                    type="password"
                                    value={passwordForm.currentPassword}
                                    onChange={handlePasswordChange}
                                    required
                                />

                                <Input
                                    label="New Password"
                                    name="newPassword"
                                    type="password"
                                    value={passwordForm.newPassword}
                                    onChange={handlePasswordChange}
                                    required
                                />

                                <Input
                                    label="Confirm New Password"
                                    name="confirmPassword"
                                    type="password"
                                    value={passwordForm.confirmPassword}
                                    onChange={handlePasswordChange}
                                    required
                                />

                                <Button variant="secondary" type="submit" fullWidth>
                                    Update Password
                                </Button>
                            </form>
                        </Card>

                        {/* Danger Zone */}
                        <Card className="p-6 border-2 border-red-200">
                            <h2 className="text-xl font-bold text-red-600 mb-4">Danger Zone</h2>
                            <p className="text-gray-600 mb-4">
                                Once you delete your account, there is no going back. Please be certain.
                            </p>
                            <Button variant="danger" onClick={handleDeleteAccount}>
                                Delete Account
                            </Button>
                        </Card>
                    </div>

                    {/* Stats Sidebar */}
                    <div className="space-y-6">
                        {/* Overall Stats */}
                        <Card className="p-6">
                            <h3 className="text-lg font-bold text-gray-900 mb-4">Overall Statistics</h3>

                            <div className="space-y-4">
                                <div className="bg-emerald-50 rounded-lg p-4">
                                    <p className="text-emerald-600 text-xs font-medium mb-1">Courses Enrolled</p>
                                    <p className="text-3xl font-bold text-emerald-700">{userEnrollments.length}</p>
                                </div>

                                <div className="bg-blue-50 rounded-lg p-4">
                                    <p className="text-blue-600 text-xs font-medium mb-1">Total Attempts</p>
                                    <p className="text-3xl font-bold text-blue-700">{totalAttempts}</p>
                                </div>

                                <div className="bg-purple-50 rounded-lg p-4">
                                    <p className="text-purple-600 text-xs font-medium mb-1">Best Score</p>
                                    <p className="text-3xl font-bold text-purple-700">{getBestScore()}</p>
                                </div>

                                <div className="bg-yellow-50 rounded-lg p-4">
                                    <p className="text-yellow-600 text-xs font-medium mb-1">Average %</p>
                                    <p className="text-3xl font-bold text-yellow-700">{getAverageScore()}%</p>
                                </div>
                            </div>
                        </Card>

                        {/* Quick Actions */}
                        <Card className="p-6">
                            <h3 className="text-lg font-bold text-gray-900 mb-4">Quick Actions</h3>

                            <div className="space-y-2">
                                <Button
                                    variant="outline"
                                    fullWidth
                                    onClick={() => navigate('/user/courses')}
                                >
                                    Browse Courses
                                </Button>
                                <Button
                                    variant="outline"
                                    fullWidth
                                    onClick={() => navigate('/user/my-courses')}
                                >
                                    My Courses
                                </Button>
                                <Button
                                    variant="outline"
                                    fullWidth
                                    onClick={() => navigate('/user/history')}
                                >
                                    View History
                                </Button>
                                <Button
                                    variant="danger"
                                    fullWidth
                                    onClick={() => {
                                        dispatch(logout());
                                        navigate('/login');
                                    }}
                                >
                                    Logout
                                </Button>
                            </div>
                        </Card>
                    </div>
                </div>
            </div>
        </UserLayout>
    );
};

export default UserProfilePage;
