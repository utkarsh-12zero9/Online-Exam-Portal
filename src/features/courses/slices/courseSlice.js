import { createSlice } from '@reduxjs/toolkit';
import { mockCourses } from '@/mocks/fixtures/courses';

const courseSlice = createSlice({
  name: 'courses',
  initialState: {
    courses: mockCourses,
    loading: false,
    error: null,
    selectedCourse: null,
  },
  reducers: {
    addCourse: (state, action) => {
      state.courses.push({
        ...action.payload,
        id: Date.now(),
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString(),
      });
    },
    updateCourse: (state, action) => {
      const index = state.courses.findIndex((c) => c.id === action.payload.id);
      if (index !== -1) {
        state.courses[index] = {
          ...state.courses[index],
          ...action.payload,
          updatedAt: new Date().toISOString(),
        };
      }
    },
    deleteCourse: (state, action) => {
      state.courses = state.courses.filter((c) => c.id !== action.payload);
    },
    setSelectedCourse: (state, action) => {
      state.selectedCourse = action.payload;
    },
    toggleCourseStatus: (state, action) => {
      const course = state.courses.find((c) => c.id === action.payload);
      if (course) {
        course.isActive = !course.isActive;
      }
    },
  },
});

export const {
  addCourse,
  updateCourse,
  deleteCourse,
  setSelectedCourse,
  toggleCourseStatus,
} = courseSlice.actions;

export default courseSlice.reducer;
