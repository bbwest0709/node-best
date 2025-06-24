const express = require('express')
const userController = require('../controllers/userController')
const router = express.Router()

router.get('/', (req, res) => {
    res.send(`<h1>User</h1>`)
})

// 회원가입
router.post('/', userController.createUser);

// 이메일 중복 체크
router.get('/check-email', userController.checkEmailDuplicate);

module.exports = router;