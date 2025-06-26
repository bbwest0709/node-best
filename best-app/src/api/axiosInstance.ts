import axios from 'axios';

const axiosInstance = axios.create({
    baseURL: `http://localhost:7777/api`,
    headers: {
        "Content-Type": 'application/json'

    }
})

axiosInstance.interceptors.request.use(
    (config) => {
        const token = sessionStorage.getItem('accessToken');  // 토큰 가져오기
        console.log('Access Token in Request Interceptor:', token);  // 토큰 확인용 로그

        if (token) {
            config.headers['Authorization'] = `Bearer ${token}`;
        }

        return config;
    },
    (error) => {
        return Promise.reject(error);
    }
);

// 응답 인터셉터 추가
axiosInstance.interceptors.response.use(
    (response) => response,  // 정상 응답은 그대로 반환
    async (error) => {
        // 401 에러가 발생했을 때
        if (error.response && error.response.status === 401) {
            try {
                // 리프레시 토큰을 사용해 새로운 액세스 토큰을 요청
                const refreshToken = localStorage.getItem('refreshToken');
                const response = await axios.post('http://localhost:7777/api/auth/refresh', { refreshToken });

                const { accessToken } = response.data;
                // 새로운 액세스 토큰을 세션 스토리지에 저장
                sessionStorage.setItem('accessToken', accessToken);

                // 기존 요청의 헤더에 새로운 액세스 토큰을 넣어 다시 요청
                error.config.headers['Authorization'] = `Bearer ${accessToken}`;
                return axios(error.config);  // 다시 요청 보내기
            } catch (refreshError) {
                // 리프레시 토큰도 실패하면 로그아웃 처리 등 할 수 있음
                console.error('Refresh token error', refreshError);
                // 로그아웃 처리 등 추가 로직
            }
        }
        return Promise.reject(error);
    }
);



export default axiosInstance;