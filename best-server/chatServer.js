const express = require('express')
    , http = require('http')
    , cors = require('cors')
const { Server } = require('socket.io') // npm i socket.io

const app = express();
app.use(cors());
const server = http.createServer(app);

const io = new Server(server, {
    cors: { origin: 'http://localhost:5173' } // react server
})

io.on('connection', (socket) => {
    console.log('## 유저 접속함: ', socket.id);
    // 유저가 보내오는 메시지 수신하여 전송 : public 통신
    socket.on('sendMessage', (data) => {
        console.log(`## ${data.sender} : ${data.message}`)
        io.sockets.emit('receiveMessage', data)
    })
})

server.listen(5555, () => {
    console.log(`socket.io 챗서버 실행중 포트: 5555`)
})