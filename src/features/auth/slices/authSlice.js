import { createSlice } from '@reduxjs/toolkit';
import { mockUsers as initialUsers, mockUsers } from '@/mocks/fixtures/users';

// Load from localStorage on initialization
const loadAuthFromStorage = () => {
  try {
    const savedAuth = localStorage.getItem('auth');
    if (savedAuth) {
      const parsed = JSON.parse(savedAuth);
      return {
        user: parsed.user,
        isAuthenticated: parsed.isAuthenticated,
        users: parsed.users || initialUsers,
      };
    }
  } catch (error) {
    console.error('Error loading auth from localStorage:', error);
  }
  return {
    user: mockUsers.find((u) => u.role === 'user') || null,
    isAuthenticated: false,
    users: initialUsers,
  };
};

const initialState = loadAuthFromStorage();

const authSlice = createSlice({
  name: 'auth',
  initialState,
  reducers: {
    loginStart: (state) => {
      state.loading = true;
      state.error = null;
    },

    loginSuccess: (state, action) => {
      state.user = action.payload;
      state.isAuthenticated = true;
      state.loading = false;
      state.error = null;
      
      // Save to localStorage
      localStorage.setItem('auth', JSON.stringify({
        user: action.payload,
        isAuthenticated: true,
        users: state.users,
      }));
    },

    loginFailure: (state, action) => {
      state.error = action.payload;
      state.loading = false;
    },

    logout: (state) => {
      state.user = null;
      state.isAuthenticated = false;
      state.error = null;
      
      // Clear localStorage
      localStorage.removeItem('auth');
    },

    checkAuth: (state) => {
      // Re-check localStorage
      try {
        const savedAuth = localStorage.getItem('auth');
        if (savedAuth) {
          const parsed = JSON.parse(savedAuth);
          state.user = parsed.user;
          state.isAuthenticated = parsed.isAuthenticated;
          state.users = parsed.users || state.users;
        } else {
          state.isAuthenticated = false;
          state.user = null;
        }
      } catch (error) {
        state.isAuthenticated = false;
        state.user = null;
      }
    },

    updateUser: (state, action) => {
      state.user = { ...state.user, ...action.payload };
      
      // Update localStorage
      if (state.isAuthenticated) {
        localStorage.setItem('auth', JSON.stringify({
          user: state.user,
          isAuthenticated: state.isAuthenticated,
          users: state.users,
        }));
      }
    },

    addUser: (state, action) => {
      const newUser = {
        id: Date.now(),
        ...action.payload,
        createdAt: new Date().toISOString(),
      };
      state.users.push(newUser);
      
      // Save updated users list to localStorage
      localStorage.setItem('auth', JSON.stringify({
        user: state.user,
        isAuthenticated: state.isAuthenticated,
        users: state.users,
      }));
    },

    deleteUser: (state, action) => {
      state.users = state.users.filter((user) => user.id !== action.payload);
      
      // Update localStorage
      localStorage.setItem('auth', JSON.stringify({
        user: state.user,
        isAuthenticated: state.isAuthenticated,
        users: state.users,
      }));
    },

    updateUserById: (state, action) => {
      const { id, ...updates } = action.payload;
      const userIndex = state.users.findIndex((u) => u.id === id);
      if (userIndex !== -1) {
        state.users[userIndex] = { ...state.users[userIndex], ...updates };
        
        // Update current user if it's them
        if (state.user?.id === id) {
          state.user = { ...state.user, ...updates };
        }
        
        // Update localStorage
        localStorage.setItem('auth', JSON.stringify({
          user: state.user,
          isAuthenticated: state.isAuthenticated,
          users: state.users,
        }));
      }
    },

    bulkDeleteUsers: (state, action) => {
      const idsToDelete = action.payload;
      state.users = state.users.filter((user) => !idsToDelete.includes(user.id));
      
      // Update localStorage
      localStorage.setItem('auth', JSON.stringify({
        user: state.user,
        isAuthenticated: state.isAuthenticated,
        users: state.users,
      }));
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
  deleteUser,
  updateUserById,
  bulkDeleteUsers,
} = authSlice.actions;

export default authSlice.reducer;