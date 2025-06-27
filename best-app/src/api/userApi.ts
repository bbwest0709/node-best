import axiosInstance from "./axiosInstance";
import type { User, CreateUserResponse, EmailCheckResponse, ApiSignInResponse, UserListResponse } from '../components/users/types/user';
import type { AuthUser } from "../stores/authStore";

// 회원 가입 요청
export const apiSignUp = async (user: User): Promise<CreateUserResponse> => {
    const response = await axiosInstance.post('/users', user)
    return response.data; // result, msg, date:{insertId:회원번호}
}

// 이메일 중복 확인
export const apiCheckEmailDuplicate = async (email: string): Promise<EmailCheckResponse> => {
    const response = await axiosInstance.get(`/users/check-email?email=${encodeURIComponent(email)}`)
    return response.data;
}

export const apiUserList = async (): Promise<UserListResponse> => {
    const response = await axiosInstance.get('/admin/users')
    return response.data;
}

// 로그인 요청
export const apiSignIn = async (loginUser: { email: string, passwd: string }): Promise<ApiSignInResponse> => {
    const response = await axiosInstance.post('/auth/signin', loginUser);
    return response.data;
};

// 로그아웃
export const apiSignOut = async (): Promise<void> => {
    await axiosInstance.post('/auth/signout');
};