import { create } from 'zustand';
import type { Role } from '../components/users/types/user';

export interface AuthUser {
    // id: number;
    name: string;
    // email: string;
    role?: Role;
    // accessToken?: string;
    // refreshToken?: string;
}

// 상태 정의
interface AuthState {
    authUser: AuthUser | null;

    loginAuthUser: (user: AuthUser) => void;
    logout: () => void;
}

export const useAuthStore = create<AuthState>((set) => ({
    authUser: null,
    loginAuthUser: (user) => set(() => ({ authUser: user })),
    logout: () => set(() => ({ authUser: null }))
}))