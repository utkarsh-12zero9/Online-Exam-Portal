import { createSlice } from '@reduxjs/toolkit';
import { mockEnrollments } from '@/mocks/fixtures/enrollments';

const initialState = {
  enrollments: mockEnrollments, // Initialize with mock data
  currentAttempt: null,
  loading: false,
  error: null,
};

const enrollmentSlice = createSlice({
  name: 'enrollments',
  initialState,
  reducers: {
    enrollCourse: (state, action) => {
      const newEnrollment = {
        id: Date.now(),
        userId: action.payload.userId,
        courseId: action.payload.courseId,
        enrolledAt: new Date().toISOString(),
        attempts: [],
      };
      state.enrollments.push(newEnrollment);
    },

    startAttempt: (state, action) => {
      state.currentAttempt = {
        id: Date.now(),
        userId: action.payload.userId,
        courseId: action.payload.courseId,
        startedAt: new Date().toISOString(),
        status: 'in-progress',
        totalQuestions: action.payload.totalQuestions,
        answers: {},
      };
    },

    saveAnswer: (state, action) => {
      if (state.currentAttempt) {
        state.currentAttempt.answers[action.payload.questionId] = action.payload.answer;
      }
    },

    submitAttempt: (state, action) => {
      if (!state.currentAttempt) return;

      const enrollment = state.enrollments.find(
        (e) =>
          e.userId === state.currentAttempt.userId &&
          e.courseId === state.currentAttempt.courseId
      );

      if (enrollment) {
        const completedAttempt = {
          ...state.currentAttempt,
          submittedAt: new Date().toISOString(),
          status: 'completed',
          score: action.payload.score,
          totalMarks: action.payload.totalMarks,
          percentage: action.payload.percentage,
          answeredQuestions: action.payload.answeredQuestions,
          totalQuestions: action.payload.totalQuestions,
          violations: action.payload.violations || [], // Add violations
          violationCount: action.payload.violationCount || 0, // Add count
          autoSubmitted: action.payload.autoSubmitted || false, // Add flag
          submissionReason: action.payload.submissionReason || 'User submitted', // Add reason
        };

        enrollment.attempts.push(completedAttempt);
        state.currentAttempt = null;
      }
    },


    clearCurrentAttempt: (state) => {
      state.currentAttempt = null;
    },
  },
});

export const {
  enrollCourse,
  startAttempt,
  saveAnswer,
  submitAttempt,
  clearCurrentAttempt,
} = enrollmentSlice.actions;

export default enrollmentSlice.reducer;
