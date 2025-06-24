import axiosInstance from "./axiosInstance";
import type { User, CreateUserResponse, EmailCheckResponse, UserListResponse } from '../components/users/types/user';

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