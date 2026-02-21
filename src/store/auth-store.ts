import { create } from 'zustand';
import { persist } from 'zustand/middleware';

type UserRole = 'user' | 'admin' | null;

interface AuthState {
  role: UserRole;
  login: (role: 'user' | 'admin') => void;
  logout: () => void;
  isAdmin: () => boolean;
  isUser: () => boolean;
  isAuthenticated: () => boolean;
}

export const useAuthStore = create<AuthState>()(
  persist(
    (set, get) => ({
      role: null,
      login: (role) => set({ role }),
      logout: () => set({ role: null }),
      isAdmin: () => get().role === 'admin',
      isUser: () => get().role === 'user',
      isAuthenticated: () => get().role !== null,
    }),
    {
      name: 'auth-storage',
    }
  )
);
