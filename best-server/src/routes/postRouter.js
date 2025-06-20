const express = require('express');
const multer = require('multer');
const path = require('path');
const { v4: uuidv4 } = require('uuid');
const router = express.Router();
const postController = require('../controllers/postController');

// multer 저장 설정
const storage = multer.diskStorage({
    destination: (req, file, cb) => {
        cb(null, path.join(__dirname, '..', '..', 'public', 'uploads'));
    },
    filename: (req, file, cb) => {
        const uniqueSuffix = uuidv4();
        const ext = path.extname(file.originalname);
        cb(null, uniqueSuffix + ext);
    }
});

const upload = multer({ storage });

// 파일 업로드 포함 POST 요청 처리
router.post('/', upload.single('file'), postController.createPost);

// 게시글 목록 조회 GET 요청 처리
router.get('/', postController.listPost);

module.exports = router;
