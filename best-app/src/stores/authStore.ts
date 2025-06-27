import { create } from 'zustand';
import type { Role } from '../components/users/types/user';

export interface AuthUser {
    id: number;
    name: string;
    email: string;
    role?: Role;
    accessToken?: string;
    refreshToken?: string;
}

//상태 정의
interface AuthState {
    authUser: AuthUser | null;
    isLoading: boolean; // App에서 인증요청을 모두 마치고 authUser state값을 셋팅하는 동안 로딩상태 유지
    loginAuthUser: (user: AuthUser) => void;
    logout: () => void;
    setLoading: (loading: boolean) => void;
}

// sessionStorage에서 초기값 불러오기 함수
const getStoredUser = (): AuthUser | null => {
    const stored = sessionStorage.getItem('authUser');
    return stored ? JSON.parse(stored) : null;
};

export const useAuthStore = create<AuthState>((set) => ({
    authUser: getStoredUser() || null,
    isLoading: false,

    loginAuthUser: (user) => {
        sessionStorage.setItem('authUser', JSON.stringify(user)); // 저장
        set(() => ({ authUser: user }));
    },
    logout: () => {
        sessionStorage.removeItem('authUser'); // 로그아웃 시 저장도 지우기
        set(() => ({ authUser: null }));
    },
    setLoading: (loading) => set({ isLoading: loading })
}));