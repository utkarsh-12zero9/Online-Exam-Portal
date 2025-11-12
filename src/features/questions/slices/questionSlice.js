import { createSlice } from '@reduxjs/toolkit';
import { mockQuestions } from '@/mocks/fixtures/questions';

const questionSlice = createSlice({
  name: 'questions',
  initialState: {
    questions: mockQuestions,
    loading: false,
    error: null,
    selectedQuestion: null,
  },
  reducers: {
    addQuestion: (state, action) => {
      state.questions.push({
        ...action.payload,
        id: Date.now(),
      });
    },
    updateQuestion: (state, action) => {
      const idx = state.questions.findIndex((q) => q.id === action.payload.id);
      if (idx !== -1) state.questions[idx] = { ...state.questions[idx], ...action.payload };
    },
    deleteQuestion: (state, action) => {
      state.questions = state.questions.filter((q) => q.id !== action.payload);
    },
    setSelectedQuestion: (state, action) => {
      state.selectedQuestion = action.payload;
    },
    bulkDeleteQuestions: (state, action) => {
      const idsToDelete = action.payload;
      state.questions = state.questions.filter((question) => !idsToDelete.includes(question.id));
    },

  },
});

export const { addQuestion, updateQuestion, deleteQuestion, setSelectedQuestion, bulkDeleteQuestions } =
  questionSlice.actions;
export default questionSlice.reducer;
