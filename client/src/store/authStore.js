import { create } from 'zustand';
import { authAPI } from '../api/auth.js';

// Simple persist helper
const getStoredAuth = () => {
  try {
    const stored = localStorage.getItem('auth-storage');
    return stored ? JSON.parse(stored) : { token: null, user: null };
  } catch {
    return { token: null, user: null };
  }
};

const setStoredAuth = (token, user) => {
  try {
    localStorage.setItem('auth-storage', JSON.stringify({ token, user }));
  } catch (e) {
    console.error('Failed to save auth:', e);
  }
};

export const authStore = create((set) => {
  const stored = getStoredAuth();
  return {
    user: stored.user,
    token: stored.token,
    isAuthenticated: !!stored.token,
    isLoading: false,

      login: async (email, password) => {
        set({ isLoading: true });
        try {
          const response = await authAPI.login({ email, password });
          const user = response.user;
          const token = response.token;
          setStoredAuth(token, user);
          set({
            user,
            token,
            isAuthenticated: true,
            isLoading: false
          });
          return { success: true };
        } catch (error) {
          set({ isLoading: false });
          return {
            success: false,
            message: error.response?.data?.message || 'Login failed'
          };
        }
      },

      register: async (name, email, password) => {
        set({ isLoading: true });
        try {
          const response = await authAPI.register({ name, email, password });
          const user = response.user;
          const token = response.token;
          setStoredAuth(token, user);
          set({
            user,
            token,
            isAuthenticated: true,
            isLoading: false
          });
          return { success: true };
        } catch (error) {
          set({ isLoading: false });
          return {
            success: false,
            message: error.response?.data?.message || 'Registration failed'
          };
        }
      },

      logout: async () => {
        try {
          await authAPI.logout();
        } catch (error) {
          console.error('Logout error:', error);
        } finally {
          localStorage.removeItem('auth-storage');
          set({
            user: null,
            token: null,
            isAuthenticated: false
          });
        }
      },

      checkAuth: async () => {
        set({ isLoading: true });
        try {
          const response = await authAPI.getMe();
          const user = response.user;
          setStoredAuth(getStoredAuth().token, user);
          set({
            user,
            isAuthenticated: true,
            isLoading: false
          });
        } catch (error) {
          localStorage.removeItem('auth-storage');
          set({
            user: null,
            token: null,
            isAuthenticated: false,
            isLoading: false
          });
        }
      }
    };
  }
);

