export interface User {
    id?: number;
    name: string;
    email: string;
    passwd: string;
    role: Role;
}

export type Role = 'USER' | 'ADMIN' // enum으로도 가능

// 공통 api 응답
export interface ApiResesponse<T = undefined> {
    result: 'success' | 'fail';
    message: string;
    data?: T; // 성공시에만 존재
}

// 회원가입 성공시 전달할 데이터 payload
export interface createUserData {
    insertId: number
}

export interface EmailCheckData {
    isDuplicate: boolean;
}

export type CreateUserResponse = ApiResesponse<createUserData>;
export type EmailCheckResponse = ApiResesponse<EmailCheckData>;