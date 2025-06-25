const express = require('express')
require('dotenv').config()
const morgan = require('morgan')
const path = require('path')
const cors = require('cors')
// 라우터 가져오기
const indexRouter = require('./src/routes/indexRouter')
const postRouter = require('./src/routes/postRouter')
const userRouter = require('./src/routes/userRouter')
const adminRouter = require('./src/routes/adminRouter')
const authRouter = require('./src/routes/authRouter')

const port = process.env.PORT || 7777;

const app = express();

// 미들웨어 설정
app.use(express.json())
app.use(express.urlencoded({ extended: true }))
app.use(express.static(path.join(__dirname, 'public')))
app.use(morgan('dev'))
// cors 미들웨어 설정
app.use(cors()) // react와 통신하려면 필요한 미들웨어


// 라우터 설정
app.use('/', indexRouter)
app.use('/api/posts', postRouter)
app.use('/api/users', userRouter)
app.use('/api/admin', adminRouter) // 인가 여부 체크하는 미들웨어 설정
app.use('/api/auth', authRouter);


// 서버 가동
app.listen(port, () => {
    console.log(`http://localhost:${port}`)
})