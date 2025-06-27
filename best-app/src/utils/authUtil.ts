// import axiosInstance from "../api/axiosInstance";
import axios from 'axios'
// import type { AuthUser } from "../stores/authStore";

//jwt payload type
interface JWTPayload {
    exp: number;
    [key: string]: any;
}
//토큰이 유효한지 여부를 체크하는 함수. 유효하지 않으면 true를 반환할 예정
export const checkTokenExpiration = (token: string): boolean => {
    try {
        //header.payload.signature
        const payload = JSON.parse(atob(token.split('.')[1])) as JWTPayload;
        const expTime = payload.exp * 1000; //exp 초단위 
        let isExpired = expTime < Date.now();
        // 1시 < 2시 => 유효시간이 지난 경우=> true를 반환, 
        // 3시  < 2시 => 유효시간이 남은경우 => false반환
        return isExpired;
    } catch (error) {
        console.error('잘못된 토큰 포맷 에러: ', error);
        return true;//오류 발생시 만료된 것으로 간주
    }
}

//리프레시 토큰을 가지고 서버에 요청을 보내는 함수
export const refreshAccessToken = async (): Promise<string | null> => {
    const refreshToken = localStorage.getItem('refreshToken');
    if (!refreshToken) {
        console.log('refreshToken 없음');
        return null;
    }
    //리프레시 토큰을 보내서 서버로부터 검증을 받자 => 검증 통과시 새 억세스토큰을 받는다
    try {
        const response = await axios.post(`http://localhost:7777/api/auth/refresh`, { refreshToken })
        const newAccessToken = await response.data?.accessToken;
        //서버에서 보낸 데이터: {accessToken:newAccessToken}
        return newAccessToken;
    } catch (error) {
        console.error('refreshToken error: ', error);
        return null;
    }
}