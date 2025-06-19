const express = require('express')
const router = express.Router()
const postController = require('../controllers/postController')

router.get('/', (req, res) => {
    res.send(`<h1>Post</h1>`)
})

// post /api/posts : 포스트 글쓰기(C) - 파일 업로드 처리 필요
router.post('/', postController.createPost)

module.exports = router;