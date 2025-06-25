const express = require('express');
const router = express.Router();
const authController = require('../controllers/authController');

// 로그인 API
router.post('/signin', authController.login);

router.post('/signout', (req, res) => {
    // 클라이언트에서 전달받은 토큰을 없애는 로직
    res.clearCookie('accessToken');  // 쿠키로 저장된 경우
    res.clearCookie('refreshToken');
    res.status(200).json({ result: 'success', message: '로그아웃 되었습니다.' });
});

module.exports = router;