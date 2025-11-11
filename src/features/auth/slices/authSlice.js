import { createSlice } from '@reduxjs/toolkit';

const mockUsers = [
  {
    id: 1,
    name: 'Admin User',
    email: 'admin@test.com',
    password: 'admin123',
    role: 'admin',
    createdAt: '2024-01-01T00:00:00.000Z',
  },
  {
    id: 2,
    name: 'Sunny Deol',
    email: 'sunny@test.com',
    password: 'test123',
    role: 'user',
    createdAt: '2024-01-15T00:00:00.000Z',
  },
  {
    id: 3,
    name: 'Bobby Deol',
    email: 'bobby@test.com',
    password: 'test123',
    role: 'user',
    createdAt: '2025-01-15T00:00:00.000Z',
  },
];

const initialState = {
  user: null,
  users: mockUsers,
  isAuthenticated: false,
  loading: false,
  error: null,
};

const authSlice = createSlice({
  name: 'auth',
  initialState,
  reducers: {
    loginStart: (state) => {
      state.loading = true;
      state.error = null;
    },
    loginSuccess: (state, action) => {
      state.loading = false;
      state.isAuthenticated = true;
      state.user = action.payload;
      state.error = null;
    },
    loginFailure: (state, action) => {
      state.loading = false;
      state.error = action.payload;
    },
    logout: (state) => {
      state.user = null;
      state.isAuthenticated = false;
      state.error = null;
      localStorage.removeItem('authToken');
      localStorage.removeItem('user');
    },
    checkAuth: (state) => {
      const token = localStorage.getItem('authToken');
      const user = localStorage.getItem('user');
      if (token && user) {
        state.isAuthenticated = true;
        state.user = JSON.parse(user);
      }
    },
    updateUser: (state, action) => {
      state.user = { ...state.user, ...action.payload };
    },
    addUser: (state, action) => {
      const newUser = {
        ...action.payload,
        id: Date.now(),
        createdAt: new Date().toISOString(),
      };
      state.users.push(newUser);
    },
    deleteUser: (state, action) => {
      state.users = state.users.filter((user) => user.id !== action.payload);
    },

  },
});

export const { 
  loginStart, 
  loginSuccess, 
  loginFailure, 
  logout, 
  checkAuth, 
  updateUser, 
  addUser, 
  deleteUser  // Add this
} = authSlice.actions;

export default authSlice.reducer;