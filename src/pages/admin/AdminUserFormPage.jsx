import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { useDispatch, useSelector } from 'react-redux';
import AdminLayout from '@/shared/components/layout/AdminLayout';
import Card from '@/shared/components/ui/Card';
import Button from '@/shared/components/ui/Button';
import Input from '@/shared/components/ui/Input';
import { addUser, updateUserById } from '@/features/auth/slices/authSlice';
import { toast } from 'react-toastify';

const AdminUserFormPage = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const dispatch = useDispatch();

  const users = useSelector((state) => state.auth.users || []);

  const isEditMode = Boolean(id);
  const existingUser = isEditMode ? users.find((u) => u.id === Number(id)) : null;

  const [form, setForm] = useState({
    name: '',
    email: '',
    password: '',
    role: 'user',
    phone: '',
    bio: '',
  });

  const [errors, setErrors] = useState({});

  useEffect(() => {
    if (existingUser) {
      setForm({
        name: existingUser.name,
        email: existingUser.email,
        password: '',
        role: existingUser.role,
        phone: existingUser.phone || '',
        bio: existingUser.bio || '',
      });
    }
  }, [existingUser]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setForm((prev) => ({ ...prev, [name]: value }));
    if (errors[name]) {
      setErrors((prev) => ({ ...prev, [name]: '' }));
    }
  };

  const validate = () => {
    const newErrors = {};

    if (!form.name.trim()) {
      newErrors.name = 'Name is required';
    }

    if (!form.email.trim()) {
      newErrors.email = 'Email is required';
    } else if (!/\S+@\S+\.\S+/.test(form.email)) {
      newErrors.email = 'Email is invalid';
    } else {
      const emailTaken = users.some(
        (u) => u.email === form.email && u.id !== Number(id)
      );
      if (emailTaken) {
        newErrors.email = 'Email is already taken';
      }
    }

    if (!isEditMode || form.password) {
      if (!form.password) {
        newErrors.password = 'Password is required';
      } else if (form.password.length < 6) {
        newErrors.password = 'Password must be at least 6 characters';
      }
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

    if (isEditMode) {
      const updates = {
        id: Number(id),
        name: form.name,
        email: form.email,
        role: form.role,
        phone: form.phone,
        bio: form.bio,
      };

      if (form.password) {
        updates.password = form.password;
      }

      dispatch(updateUserById(updates));
      toast.success(`User "${form.name}" updated successfully!`);
    } else {
      dispatch(addUser(form));
      toast.success(`User "${form.name}" created successfully!`);
    }

    navigate('/admin/users');
  };

  return (
    <AdminLayout>
      <div className="max-w-2xl mx-auto px-4 py-8">
        {/* Back Button */}
        <button
          onClick={() => navigate('/admin/users')}
          className="inline-flex items-center gap-2 text-gray-600 hover:text-blue-700 mb-6 text-sm font-medium group focus:outline-none focus:ring-2 focus:ring-blue-400 rounded"
        >
          <svg className="w-4 h-4 transition-transform group-hover:-translate-x-1" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
          </svg>
          Back to Users
        </button>

        {/* Page Title */}
        <div className="mb-8">
          <h1 className="text-3xl font-extrabold text-gray-900 mb-2">{isEditMode ? 'Edit User' : 'Create New User'}</h1>
          <p className="text-gray-600 text-base mb-0">{isEditMode ? 'Update user information below' : 'Add a new student to the platform'}</p>
        </div>

        {/* Form Card */}
        <Card className="p-8 shadow-lg rounded-xl border border-gray-200 bg-white">
          <form onSubmit={handleSubmit} className="space-y-6">

            {/* Full Name */}
            <div>
              <Input
                label="Full Name"
                name="name"
                value={form.name}
                onChange={handleChange}
                placeholder="Enter full name"
                required
                className="text-base"
              />
              {errors.name && <div className="text-red-500 text-xs mt-1">{errors.name}</div>}
            </div>

            {/* Email */}
            <div>
              <Input
                label="Email Address"
                name="email"
                type="email"
                value={form.email}
                onChange={handleChange}
                placeholder="student@example.com"
                required
                className="text-base"
              />
              {errors.email && <div className="text-red-500 text-xs mt-1">{errors.email}</div>}
            </div>

            {/* Password */}
            <div>
              <Input
                label={isEditMode ? 'Password (leave blank to keep current)' : 'Password'}
                name="password"
                type="password"
                value={form.password}
                onChange={handleChange}
                placeholder={isEditMode ? 'Enter new password to change' : 'Enter password (min 6 characters)'}
                required={!isEditMode}
                className="text-base"
              />
              {errors.password && <div className="text-red-500 text-xs mt-1">{errors.password}</div>}
              {isEditMode && (
                <div className="text-xs text-gray-500 mt-1">Leave blank to keep the current password</div>
              )}
            </div>

            {/* Role */}
            <div>
              <label className="block text-sm font-semibold text-gray-700 mb-1">
                Role <span className="text-red-500">*</span>
              </label>
              <select
                name="role"
                value={form.role}
                onChange={handleChange}
                className="w-full border border-gray-300 rounded-lg px-3 py-2 text-base focus:ring-2 focus:ring-blue-500 focus:border-transparent transition"
                required
              >
                <option value="user">Student</option>
                <option value="admin">Admin</option>
              </select>
            </div>

            {/* Phone (Optional) */}
            <div>
              <Input
                label="Phone Number (Optional)"
                name="phone"
                type="tel"
                value={form.phone}
                onChange={handleChange}
                placeholder="+91 1234567890"
                className="text-base"
              />
            </div>

            {/* Bio (Optional) */}
            <div>
              <label className="block text-sm font-semibold text-gray-700 mb-1">Bio (Optional)</label>
              <textarea
                name="bio"
                value={form.bio}
                onChange={handleChange}
                rows={3}
                className="w-full border border-gray-300 rounded-lg px-3 py-2 text-base focus:ring-2 focus:ring-blue-500 focus:border-transparent transition"
                placeholder="Tell us about this user..."
              />
            </div>

            {/* Submit Buttons */}
            <div className="flex flex-col sm:flex-row gap-3 pt-6 border-t border-gray-100">
              <Button
                type="button"
                variant="outline"
                onClick={() => navigate('/admin/users')}
                className="w-full sm:w-auto sm:min-w-[140px]"
              >
                Cancel
              </Button>
              <Button
                type="submit"
                variant="primary"
                className="w-full sm:flex-1"
              >
                {isEditMode ? 'Update User' : 'Create User'}
              </Button>
            </div>
          </form>
        </Card>
      </div>
    </AdminLayout>
  );

};

export default AdminUserFormPage;
