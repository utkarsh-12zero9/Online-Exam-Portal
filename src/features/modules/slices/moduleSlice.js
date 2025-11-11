import { createSlice } from '@reduxjs/toolkit';
import { mockModules } from '@/mocks/fixtures/modules';

const moduleSlice = createSlice({
    name: 'modules',
    initialState: {
        modules: mockModules,
        loading: false,
        error: null,
        selectedModule: null,
    },
    reducers: {
        addModule: (state, action) => {
            state.modules.push({
                ...action.payload,
                id: Date.now(),
            });
        },
        updateModule: (state, action) => {
            const idx = state.modules.findIndex(m => m.id === action.payload.id);
            if (idx !== -1) state.modules[idx] = { ...state.modules[idx], ...action.payload };
        },
        deleteModule: (state, action) => {
            state.modules = state.modules.filter(m => m.id !== action.payload);
        },
        setSelectedModule: (state, action) => {
            state.selectedModule = action.payload;
        },
    },
});

export const { addModule, updateModule, deleteModule, setSelectedModule } = moduleSlice.actions;
export default moduleSlice.reducer;
