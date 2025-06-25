import type { AuthUser } from "../../../stores/authStore";

export interface User {
    id?: number;
    name: string;
    email: string;
    passwd: string;
    role: Role;
}

export type Role = 'USER' | 'ADMIN' // enum으로도 가능

// 공통 api 응답
export interface ApiResponse<T = undefined> {
    result: 'success' | 'fail';
    message: string;
    data?: T; // 성공시에만 존재
}

// 회원가입 성공시 전달할 데이터 payload
export interface createUserData {
    insertId: number
}

// 로그인 응답시 payload
// export type AuthUserResponse = ApiResesponse<AuthUser>
// AuthUser(id, name, email, role, accessToken, refreshToken)

export interface ApiSignInResponse {
    result: 'success' | 'fail';
    message: string;
    data?: AuthUser;  // 로그인 실패 시 data가 없을 수도 있음
}

export interface EmailCheckData {
    isDuplicate: boolean;
}

export interface UserWithoutPassword {
    id?: number;
    name: string;
    email: string;
    role: Role;
    indate: string;
}

export type UserListResponse = ApiResponse<UserWithoutPassword[]>;

export type CreateUserResponse = ApiResponse<createUserData>;
export type EmailCheckResponse = ApiResponse<EmailCheckData>;