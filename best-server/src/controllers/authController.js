const pool = require('../models/dbPool');
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');
const JWT_SECRET = process.env.JWT_SECRET || 'your_secret_key';

// 에러 응답을 일관되게 처리하는 유틸리티 함수
const errorResponse = (status, message) => ({
    result: 'fail',
    message,
    status,
});

// 비밀번호 검증 함수
const validatePassword = async (inputPassword, storedPassword) => {
    const isMatch = await bcrypt.compare(inputPassword, storedPassword);
    if (!isMatch) {
        throw errorResponse(400, '이메일 또는 비밀번호가 잘못되었습니다.');
    }
};

// JWT 토큰 생성
const generateTokens = (user) => {
    const payload = { email: user.email, role: user.role };
    const accessToken = jwt.sign(payload, JWT_SECRET, { expiresIn: '1h' });
    const refreshToken = jwt.sign(payload, JWT_SECRET, { expiresIn: '3d' });
    return { accessToken, refreshToken };
};

// 로그인 처리 함수
exports.login = async (req, res) => {
    const { email, passwd } = req.body;

    // 이메일과 비밀번호 체크
    if (!email || !passwd) {
        return res.status(400).json(errorResponse(400, '이메일과 비밀번호를 입력하세요.'));
    }

    const sql = `SELECT * FROM members WHERE email = ?`;

    try {
        // DB에서 사용자 정보 조회
        const [rows] = await pool.execute(sql, [email]);
        if (rows.length === 0) {
            return res.status(404).json(errorResponse(404, '이메일 또는 비밀번호가 잘못되었습니다.'));
        }

        const user = rows[0];

        // 비밀번호 비교
        await validatePassword(passwd, user.passwd);

        // JWT 토큰 생성
        const { accessToken, refreshToken } = generateTokens(user);

        // 리프레시 토큰 쿠키 저장
        res.cookie('refreshToken', refreshToken, {
            httpOnly: true,
            sameSite: 'Strict', // CSRF 공격 방지
        })

        return res.status(200)
            .set('Authorization', `Bearer ${accessToken}`) // 액세스 토큰 헤더 저장
            .json({
                result: 'success',
                message: '로그인 성공',
                data: {
                    id: user.id,
                    name: user.name,
                    email: user.email,
                    role: user.role,
                },
            })

    } catch (error) {
        console.error(error);
        return res.status(500).json(errorResponse(500, '서버 오류가 발생했습니다.'));
    }
};

// 로그아웃 처리 함수
exports.logout = async (req, res) => {
    try {
        useAuthStore.getState().logout();  // 상태 초기화
        localStorage.removeItem('accessToken');  // 액세스 토큰 삭제
        localStorage.removeItem('refreshToken');  // 리프레시 토큰 삭제

        return res.status(200).json({
            result: 'success',
            message: '로그아웃 성공',
        });
    } catch (error) {
        console.error(error);
        return res.status(500).json(errorResponse(500, '로그아웃 중 오류가 발생했습니다.'));
    }
};

exports.refreshVerify = async (req, res) => {
    // 예정
};
