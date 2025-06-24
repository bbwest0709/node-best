import { create } from 'zustand';
import type { User, Role } from '../components/users/types/user';


interface UserState {
    // 1. 상태 정의
    user: User;
    duplicateChecked: boolean; // 이메일 중복 여부 체크 결과

    // 2. 상태 변경 함수 (Actions)
    setField: (field: keyof User, value: string | Role) => void;
    setDuplicateChecked: (ok: boolean) => void;
    reset: () => void;
}

export const useUserStore = create<UserState>((set) => ({
    // 1. 초기 상태 정의
    user: { name: '', email: '', passwd: '', role: 'USER' },
    duplicateChecked: false,

    // 2. 상태 변경 함수 정의
    setField: (field, value) => {
        set((state) => ({ user: { ...state.user, [field]: value } }));
    },

    setDuplicateChecked: (ok) => set({ duplicateChecked: ok }),

    reset: () => {
        set({
            user: { name: '', email: '', passwd: '', role: 'USER' },
            duplicateChecked: false,
        })
    },


}))