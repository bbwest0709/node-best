const jwt = require('jsonwebtoken')
require('dotenv').config()

//AccessToken 검증하는 미들웨어
exports.verifyAccessToken = (req, res, next) => {
    console.log(req.headers); // Authorization

    const token = req.headers['authorization']?.split(' ')[1];
    console.log('검증 토큰: ', token);
    if (!token) return res.status(401).json({ message: '인증이 필요합니다. 로그인 후 다시 시도해주세요.' })

    //token 검증하기
    jwt.verify(token, process.env.JWT_ACCESS_SECRET, (err, decoded) => {
        if (err) {
            console.log('미들웨어에서 토큰 검증 실패');
            return res.status(403).json({ message: '유효하지 않은 인증 토큰입니다' })
        }
        req.authUser = decoded; //토큰 정보 저장
        next();//검증 미들웨어 통과시
    })
}

//관리자 권한을 체크하는 미들웨어
exports.verifyAdmin = (req, res, next) => {
    if (!req.authUser) {
        return res.status(401).json({ message: '사용자 인증이 필요합니다' })
    }
    if (req.authUser.role !== 'ADMIN') {
        return res.status(403).json({ message: '관리자 권한이 필요합니다' })
    }
    next();//관리자라면 next()호출
}