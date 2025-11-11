import { configureStore } from '@reduxjs/toolkit';
import authReducer from '@/features/auth/slices/authSlice';
import courseReducer from '@/features/courses/slices/courseSlice';

export const store = configureStore({
  reducer: {
    auth: authReducer, // Auth reducer
    courses: courseReducer, // Course reducer
  },
});
