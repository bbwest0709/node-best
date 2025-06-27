import axios from 'axios';
import { checkTokenExpiration, refreshAccessToken } from '../utils/authUtil';

const axiosInstance = axios.create({
    baseURL: `http://localhost:7777/api`,
    headers: {
        'Content-Type': 'application/json'
    }
});
export default axiosInstance;

// 요청 인터셉터
axiosInstance.interceptors.request.use(
    async (config) => {
        const accessToken = sessionStorage.getItem('accessToken');
        console.log(`요청 인터셉터 실행 중 .... accessToken : ${accessToken}`);
        if (accessToken) {
            // 토큰 유효성 체크
            if (checkTokenExpiration(accessToken)) {
                console.log('요청 인터셉터: 유효하지 않은 토큰인 경우...');
                // 토큰 만료 시 리프레시 토큰으로 새 액세스 토큰 받기
                const newAccessToken = await refreshAccessToken();
                console.log('새 액세스토큰 발급 받음...', newAccessToken);
                if (newAccessToken) {
                    sessionStorage.setItem("accessToken", newAccessToken);
                    config.headers['Authorization'] = `Bearer ${newAccessToken}`;
                    return config;
                }
            }
            // 토큰 유효 시 헤더에 추가
            config.headers['Authorization'] = `Bearer ${accessToken}`;
        }
        return config;
    },
    (err) => {
        console.error('요청 인터셉터 에러: ', err);
        return Promise.reject(err);
    }
);

// 응답 인터셉터
axiosInstance.interceptors.response.use(
    (response) => response,
    async (error) => {
        const status = error.response?.status;
        console.log('응답 인터셉터에서 받은 응답상태코드(status): ', status);

        if (status === 400) {
            // 400 에러는 alert만 띄우고 이동은 하지 않음
            alert(error.response.data?.message || '잘못된 요청입니다.');
            return Promise.reject(error);
        }

        if (status === 401) {
            // 인증 실패 처리: 리프레시 토큰으로 새 토큰 요청 시도
            const refreshToken = localStorage.getItem('refreshToken');
            if (refreshToken) {
                try {
                    const newAccessToken = await refreshAccessToken();
                    if (newAccessToken) {
                        sessionStorage.setItem('accessToken', newAccessToken);
                        error.config.headers['Authorization'] = `Bearer ${newAccessToken}`;
                        return axiosInstance(error.config); // 요청 재시도
                    }
                } catch (err) {
                    console.error('리프레시 토큰도 유효하지 않음:', err);
                }
            }
            // 리프레시 토큰 없거나 실패 시 로그아웃 처리
            localStorage.removeItem('refreshToken');
            sessionStorage.removeItem('accessToken');
            window.location.href = '/';
            return Promise.reject(error);
        }

        if (status === 403) {
            alert('접근 권한이 없습니다.');
            window.location.href = '/';
            return Promise.reject(error);
        }

        return Promise.reject(error);
    }
);
