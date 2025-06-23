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