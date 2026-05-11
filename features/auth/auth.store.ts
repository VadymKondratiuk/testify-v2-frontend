import { create } from "zustand";
import { devtools } from 'zustand/middleware';
import type { AuthUser } from "@/features/auth/auth.service";

interface AuthState {
  user: AuthUser | null;
  isAuthenticated: boolean;
  isAuthReady: boolean;
  setUser: (user: AuthUser | null) => void;
  setAuthReady: (isAuthReady: boolean) => void;
  clearAuth: () => void;
}

export const useAuthStore = create<AuthState>()(
  devtools(
    (set) => ({
      user: null,
      isAuthenticated: false,
      isAuthReady: false,

      setUser: (user) =>
        set({
          user,
          isAuthenticated: Boolean(user),
          isAuthReady: true,
        }),

      setAuthReady: (isAuthReady) => set({ isAuthReady }),

      clearAuth: () =>
        set({
          user: null,
          isAuthenticated: false,
          isAuthReady: true,
        }),
    }),
    { name: 'Testify-AuthStore' } // Ця назва буде світитися у Redux DevTools
  )
);
