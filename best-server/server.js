const express = require('express')
require('dotenv').config()
const morgan = require('morgan')
const path = require('path')

const port = process.env.PORT || 7777;

const app = express();

// 미들웨어 설정

// 라우터 설정

// 서버 가동
app.listen(port, () => {
    console.log(`http://localhost:${port}`)
})