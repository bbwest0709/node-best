const express = require('express');
const router = express.Router();
const authController = require('../controllers/authController');
const verifyMiddleware = require('../middlewares/verifyMiddleware');

// 로그인 API
router.post('/signin', authController.login);

router.post('/signout', (req, res) => {
    // 클라이언트에서 전달받은 토큰을 없애는 로직
    res.clearCookie('accessToken');  // 쿠키로 저장된 경우
    res.clearCookie('refreshToken');
    res.status(200).json({ result: 'success', message: '로그아웃 되었습니다.' });
});

// 리프레시 토큰 검증 및 재발급
router.post('/refresh', authController.refreshVerify);

// 인증된 사용자 정보 반환
router.get('/user', verifyMiddleware.verifyAccessToken, authController.getAuthenticUser);

// 로그인한 사용자 마이페이지
router.get('/mypage', verifyMiddleware.verifyAccessToken, authController.mypage);

module.exports = router;