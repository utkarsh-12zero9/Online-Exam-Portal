import React, { useState } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import { loginSuccess } from '@/features/auth/slices/authSlice';
import { toast } from 'react-toastify';
import AdminLayout from '@/shared/components/layout/AdminLayout';
import Card from '@/shared/components/ui/Card';
import Input from '@/shared/components/ui/Input';
import Button from '@/shared/components/ui/Button';


const AdminSettingsPage = () => {
  const { user } = useSelector((state) => state.auth);
  const dispatch = useDispatch();

  const [profileData, setProfileData] = useState({
    name: user?.name || '',
    email: user?.email || '',
  });

  const [passwordData, setPasswordData] = useState({
    currentPassword: '',
    newPassword: '',
    confirmPassword: '',
  });

  const [photoPreview, setPhotoPreview] = useState(null);
  const [loading, setLoading] = useState(false);

  const handleProfileChange = (e) => {
    setProfileData({ ...profileData, [e.target.name]: e.target.value });
  };

  const handlePasswordChange = (e) => {
    setPasswordData({ ...passwordData, [e.target.name]: e.target.value });
  };

  const handlePhotoChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => {
        setPhotoPreview(reader.result);
      };
      reader.readAsDataURL(file);
    }
  };

  const handleProfileUpdate = (e) => {
    e.preventDefault();
    setLoading(true);

    setTimeout(() => {
      const updatedUser = {
        ...user,
        name: profileData.name,
        email: profileData.email,
        photo: photoPreview || user.photo,
      };

      localStorage.setItem('user', JSON.stringify(updatedUser));
      dispatch(loginSuccess(updatedUser));
      toast.success('Profile updated successfully!');
      setLoading(false);
    }, 1000);
  };

  const handlePasswordUpdate = (e) => {
    e.preventDefault();

    if (passwordData.newPassword !== passwordData.confirmPassword) {
      toast.error('New passwords do not match!');
      return;
    }

    if (passwordData.newPassword.length < 6) {
      toast.error('Password must be at least 6 characters!');
      return;
    }

    setLoading(true);

    setTimeout(() => {
      toast.success('Password updated successfully!');
      setPasswordData({
        currentPassword: '',
        newPassword: '',
        confirmPassword: '',
      });
      setLoading(false);
    }, 1000);
  };


  return (
    <AdminLayout>
      <div className="max-w-4xl mx-auto py-8 px-4 space-y-8">

        {/* Header */}
        <div>
          <h2 className="text-2xl sm:text-3xl font-bold text-gray-900">Settings</h2>
          <p className="text-gray-600 mt-2 text-base">
            Manage your account settings and preferences
          </p>
        </div>

        {/* Profile Settings */}
        <Card className="p-8 rounded-2xl shadow-xl border border-gray-100">
          <h3 className="text-xl font-bold text-gray-900 mb-8">Profile Information</h3>
          <form onSubmit={handleProfileUpdate} className="space-y-8">
            {/* Profile Photo */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-3">
                Profile Photo
              </label>
              <div className="flex items-center gap-8">
                <div className="w-24 h-24 rounded-full bg-blue-100 flex items-center justify-center overflow-hidden ring-2 ring-blue-300 shadow">
                  {photoPreview || user?.photo ? (
                    <img src={photoPreview || user?.photo} alt="Profile" className="w-full h-full object-cover" />
                  ) : (
                    <span className="text-blue-600 text-3xl font-bold">{user?.name?.charAt(0).toUpperCase()}</span>
                  )}
                </div>
                <div>
                  <input
                    type="file"
                    id="photo"
                    accept="image/*"
                    onChange={handlePhotoChange}
                    className="hidden"
                  />
                  <label
                    htmlFor="photo"
                    className="cursor-pointer px-4 py-2 bg-blue-600 text-white rounded-md font-medium hover:bg-blue-700 transition"
                  >
                    Change Photo
                  </label>
                  <p className="text-xs text-gray-500 mt-2">JPG, PNG, or GIF. Max size 2MB</p>
                </div>
              </div>
            </div>

            {/* Full Name */}
            <Input
              label="Full Name"
              type="text"
              name="name"
              value={profileData.name}
              onChange={handleProfileChange}
              required
              className="text-base"
            />

            {/* Email */}
            <Input
              label="Email Address"
              type="email"
              name="email"
              value={profileData.email}
              onChange={handleProfileChange}
              required
              className="text-base"
            />

            <Button type="submit" loading={loading} variant="primary" className="w-full sm:w-auto mt-2">
              Update Profile
            </Button>
          </form>
        </Card>

        {/* Password Settings */}
        <Card className="p-8 rounded-2xl shadow-xl border border-gray-100">
          <h3 className="text-xl font-bold text-gray-900 mb-8">Change Password</h3>
          <form onSubmit={handlePasswordUpdate} className="space-y-6">
            <Input
              label="Current Password"
              type="password"
              name="currentPassword"
              value={passwordData.currentPassword}
              onChange={handlePasswordChange}
              placeholder="Enter current password"
              required
            />
            <Input
              label="New Password"
              type="password"
              name="newPassword"
              value={passwordData.newPassword}
              onChange={handlePasswordChange}
              placeholder="Enter new password"
              required
            />
            <Input
              label="Confirm New Password"
              type="password"
              name="confirmPassword"
              value={passwordData.confirmPassword}
              onChange={handlePasswordChange}
              placeholder="Confirm new password"
              required
            />
            <Button type="submit" loading={loading} variant="secondary" className="w-full sm:w-auto mt-2">
              Update Password
            </Button>
          </form>
        </Card>

        {/* Account Info */}
        <Card className="p-8 rounded-2xl shadow-xl border border-gray-100">
          <h3 className="text-xl font-bold text-gray-900 mb-4">Account Information</h3>
          <div className="space-y-3 text-base">
            <div className="flex justify-between py-3 border-b border-gray-200">
              <span className="text-gray-600 font-medium">Account Type</span>
              <span className="font-semibold text-gray-900 capitalize">{user?.role}</span>
            </div>
            <div className="flex justify-between py-3 border-b border-gray-200">
              <span className="text-gray-600 font-medium">Account Status</span>
              <span className="font-semibold text-emerald-600">Active</span>
            </div>
            <div className="flex justify-between py-3">
              <span className="text-gray-600 font-medium">Member Since</span>
              <span className="font-semibold text-gray-900">{/* format dynamic join date here if needed */}January 2025</span>
            </div>
          </div>
        </Card>
      </div>
    </AdminLayout>
  );

};

export default AdminSettingsPage;
