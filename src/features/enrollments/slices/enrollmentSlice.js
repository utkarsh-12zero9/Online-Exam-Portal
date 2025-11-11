import { createSlice } from '@reduxjs/toolkit';

const enrollmentSlice = createSlice({
    name: 'enrollments',
    initialState: {
        enrollments: [], // { userId, courseId, enrolledAt, attempts: [] }
        currentAttempt: null, // Active exam attempt
    },
    reducers: {
        enrollCourse: (state, action) => {
            const { userId, courseId } = action.payload;
            const existing = state.enrollments.find(
                (e) => e.userId === userId && e.courseId === courseId
            );
            if (!existing) {
                state.enrollments.push({
                    id: Date.now(),
                    userId,
                    courseId,
                    enrolledAt: new Date().toISOString(),
                    attempts: [],
                });
            }
        },
        startAttempt: (state, action) => {
            state.currentAttempt = {
                ...action.payload,
                startedAt: new Date().toISOString(),
                answers: {},
                status: 'in-progress',
            };
        },
        saveAnswer: (state, action) => {
            const { questionId, answer } = action.payload;
            if (state.currentAttempt) {
                state.currentAttempt.answers[questionId] = answer;
            }
        },
        submitAttempt: (state, action) => {
            if (state.currentAttempt) {
                const { userId, courseId } = state.currentAttempt;
                const enrollment = state.enrollments.find(
                    (e) => e.userId === userId && e.courseId === courseId
                );

                if (enrollment) {
                    const completedAttempt = {
                        id: Date.now(),
                        ...state.currentAttempt,
                        submittedAt: new Date().toISOString(),
                        status: 'completed',
                        score: action.payload.score,
                        totalMarks: action.payload.totalMarks,
                        percentage: action.payload.percentage,
                        totalQuestions: action.payload.totalQuestions,
                        answeredQuestions: action.payload.answeredQuestions,
                    };

                    enrollment.attempts.push(completedAttempt);
                }

                state.currentAttempt = null;
            }
        },

        clearAttempt: (state) => {
            state.currentAttempt = null;
        },
    },
});

export const { enrollCourse, startAttempt, saveAnswer, submitAttempt, clearAttempt } =
    enrollmentSlice.actions;
export default enrollmentSlice.reducer;
