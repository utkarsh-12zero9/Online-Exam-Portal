import React from 'react';
import Card from '@/shared/components/ui/Card';
import Input from '@/shared/components/ui/Input';
import Button from '@/shared/components/ui/Button';

const ModuleForm = ({
  form,
  handleChange,
  handleSave,
  editMode,
  handleDelete,
  closeModal,
  selectedModule,
}) => {
  return (
    <div className="fixed z-50 inset-0 bg-black/30 backdrop-blur-md overflow-y-auto">
      <div className="min-h-screen flex flex-col justify-center py-6 sm:py-10 px-1">
        <div className="w-full max-w-sm sm:max-w-md mx-auto rounded-2xl shadow-2xl border border-gray-100 bg-white my-auto">
          {/* Modal header */}
          <div className="flex flex-col items-center pt-6 pb-2">
            <div className="w-12 h-12 rounded-full shadow bg-blue-100 text-blue-700 flex items-center justify-center mb-3">
              <svg className="w-7 h-7" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
              </svg>
            </div>
            <h2 className="text-lg sm:text-xl md:text-2xl font-bold text-gray-900 mb-1 text-center">
              {editMode ? 'Edit Module' : 'Add New Module'}
            </h2>
            <p className="text-gray-500 text-xs sm:text-sm mt-1 text-center max-w-xs mb-2">
              Organize your course content into modules. Add title, description, and order.
            </p>
          </div>

          {/* Form */}
          <form className="flex flex-col gap-3 p-3 sm:p-4 md:p-6 pb-9" onSubmit={handleSave} autoComplete="off">
            <Input
              label="Module Title"
              name="title"
              value={form.title}
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
            <Input
              label="Order"
              type="number"
              name="order"
              value={form.order}
              onChange={handleChange}
              required
            />

            {/* Modal actions */}
            <div className="flex flex-col sm:flex-row gap-2 pt-3">
              {editMode && handleDelete && (
                <Button variant="danger" onClick={() => handleDelete(selectedModule.id)} fullWidth>
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

export default ModuleForm;
