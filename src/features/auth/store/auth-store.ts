import { create } from 'zustand';
import { createJSONStorage, persist } from 'zustand/middleware';
import { signIn, signOut } from 'next-auth/react';
import type { User } from '@/features/auth/types';
import { getPersistStorage } from '@/lib/persist-storage';

interface AuthState {
  user: User | null;
  isAuthenticated: boolean;
  hasHydrated: boolean;
  setHasHydrated: (hasHydrated: boolean) => void;
  syncSession: () => Promise<void>;
  login: (email: string, password: string) => Promise<boolean>;
  register: (name: string, email: string, password: string) => Promise<boolean>;
  logout: () => void;
}

const sessionUserToUser = (sessionUser: { id?: string; name?: string | null; email?: string | null }): User => ({
  id: sessionUser.id || '',
  name: sessionUser.name || 'Admin',
  email: sessionUser.email || '',
  phone: '',
  addresses: [],
});

export const useAuthStore = create<AuthState>()(
  persist(
    (set) => ({
      user: null,
      isAuthenticated: false,
      hasHydrated: false,
      setHasHydrated: (hasHydrated) => set({ hasHydrated }),
      syncSession: async () => {
        try {
          const response = await fetch('/api/auth/session', { credentials: 'include' });
          const session = await response.json();

          if (session?.user?.role === 'admin') {
            set({ user: sessionUserToUser(session.user), isAuthenticated: true });
          } else {
            set({ user: null, isAuthenticated: false });
          }
        } catch {
          set({ user: null, isAuthenticated: false });
        }
      },
      login: async (email: string, password: string) => {
        const result = await signIn('credentials', {
          email,
          password,
          redirect: false,
        });

        if (!result || result.error) {
          set({ user: null, isAuthenticated: false });
          return false;
        }

        await useAuthStore.getState().syncSession();
        return true;
      },
      register: async (_name: string, _email: string, _password: string) => {
        return false;
      },
      logout: () => {
        void signOut({ redirect: false }).finally(() => {
          set({ user: null, isAuthenticated: false });
        });
      },
    }),
    {
      name: 'restaurant-auth',
      storage: createJSONStorage(getPersistStorage),
      onRehydrateStorage: () => (state) => {
        state?.setHasHydrated(true);
      },
    }
  )
);
