import { configureStore } from '@reduxjs/toolkit';
import authReducer from '@/features/auth/slices/authSlice';
import courseReducer from '@/features/courses/slices/courseSlice';
import moduleReducer from '@/features/modules/slices/moduleSlice';
import questionReducer from '@/features/questions/slices/questionSlice';

export const store = configureStore({
  reducer: {
    auth: authReducer,
    courses: courseReducer,
    modules: moduleReducer,
    questions: questionReducer,
  },
});
