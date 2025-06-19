const express = require('express')
const router = express.Router()
const postController = require('../controllers/postController')

router.get('/', postController.listPost)
// post /api/posts : 포스트 글쓰기(C) - 파일 업로드 처리 필요
router.post('/', postController.createPost)

module.exports = router;