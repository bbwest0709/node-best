// ChatApp.tsx
import { IoChatbubblesOutline } from "react-icons/io5";
import { Button } from "react-bootstrap";
import "./chat.css";
import { useAuthStore } from "../../stores/authStore";
import { useState, useRef, useEffect } from "react";
import socket from "./socket"

type ChatMessage = {
    sender: string;
    message: string;
}

export default function ChatApp() {

    const authUser = useAuthStore(s => s.authUser)
    const [nickName, setNickName] = useState<string>('');
    const [message, setMessage] = useState<string>('');
    const [chatList, setChatList] = useState<ChatMessage[]>([]);

    const messageRef = useRef<HTMLInputElement>(null)
    const endRef = useRef<HTMLDivElement>(null)

    useEffect(() => {
        if (!socket.connected) {
            socket.connect(); // 챗서버 연결
        }

        // 서버가 보내오는 메시지를 chatList에 설정
        socket.on('receiveMessage', (data: ChatMessage) => {
            setChatList((prev) => [...prev, data]);
        });

        return () => { // unmount 될 때 실행되는 cleanup 함수
            if (socket.connected) {
                console.log('소켓 연결 끊음')
                socket.off('receiveMessage') // 이벤트 receiveMessage 제거
                socket.disconnect(); // 챗서버 연결 중지
            }
        }

    }, [])

    useEffect(() => {
        // 새 메세지가 추가될 때마다 해당 요소로 스크롤 하도록
        endRef.current?.scrollIntoView()
    })

    const validateInputs = (nickName?: string, message?: string): boolean => {
        if (!nickName?.trim()) {
            alert("닉네임을 입력하세요");
            return false;
        }
        if (!message?.trim()) {
            alert("메시지를 입력하세요");
            return false;
        }
        return true;
    }

    const sendMessage = () => {
        if (!validateInputs(nickName, message)) return;

        if (!socket.connected) {
            socket.connect();
            socket.once('connect', () => {
                socket.emit('sendMessage', { sender: nickName, message: message });
            });
        } else {
            socket.emit('sendMessage', { sender: nickName, message: message });
        }

        setMessage('');
        messageRef.current?.focus();
    }

    return (
        <div className="wrap">
            <h2><IoChatbubblesOutline />실시간 채팅</h2>
            <input
                type="text"
                name="nickName"
                value={nickName}
                onChange={(e) => setNickName(e.target.value)}
                placeholder="닉네임을 입력하세요"
                className="input"
            />

            <div className="divMsg">
                {chatList.map((msg, idx) => {
                    const isMe = msg.sender === nickName;
                    return (
                        <div key={idx} className={`chat-message ${isMe ? "me" : "other"}`}>
                            <div className="sender">{msg.sender}</div>
                            <div className="message">{msg.message}</div>
                        </div>
                    );
                })}
                <div ref={endRef} /> {/* 스크롤 위치 지정 */}
            </div>

            <div className="input-area">
                <input
                    type="text"
                    ref={messageRef}
                    value={message}
                    onChange={(e) => setMessage(e.target.value)}
                    onKeyDown={(e) => {
                        if (e.key === 'Enter') {
                            sendMessage();
                        }
                    }}
                    placeholder="메시지를 입력하세요"
                    className="input_msg"
                />
                <Button className="send-btn btn-info" onClick={sendMessage}>Send</Button>
            </div>
        </div>
    )
}