import { useState } from "react";
import { Stack, Button, ListGroup } from "react-bootstrap";
import { Link, useNavigate } from "react-router-dom";
import { LoginModal } from "./users/LoginModal";
import { useAuthStore } from "../stores/authStore";
import { apiSignOut } from "../api/userApi";
import axios from "axios";

const Side: React.FC = () => {
    const [showLoginModal, setShowLoginModal] = useState(false);
    const authUser = useAuthStore((s) => s.authUser); // 로그인된 사용자 정보
    const loginAuthUser = useAuthStore((s) => s.loginAuthUser);
    const logout = useAuthStore((s) => s.logout)
    const navigate = useNavigate();

    const handleLoginClick = () => {
        setShowLoginModal(true);
    };

    const handleCloseLoginModal = () => {
        setShowLoginModal(false);
    };

    // 로그아웃
    const handleLogout = async () => {
        try {
            await apiSignOut();
            logout();

            // 리프레시 토큰 쿠키 만료 설정
            document.cookie = "refreshToken=; Max-Age=0; path=/"

            // 액세스 토큰 헤더 제거
            delete axios.defaults.headers['Authorization']

            alert("로그아웃 되었습니다!");

            navigate("/");
        } catch (error) {
            alert("로그아웃 실패: " + (error as Error).message);
        }
    };

    return (
        <>
            <Stack gap={2} className="mx-auto w-100">
                <Button variant="primary" as={Link as any} to="/">
                    Home
                </Button>

                <Button variant="outline-success" as={Link as any} to="/signup">
                    SignUp
                </Button>

                {/* 로그인 상태에 따라 다른 메시지 출력 */}
                <div className="alert alert-info text-center">
                    {authUser
                        ? `${authUser.name}님, 환영합니다!`
                        : '로그인 후 더 많은 기능을 이용해보세요.'}
                </div>

                {/* 로그아웃 버튼은 로그인된 사용자가 있을 때만 보이도록 */}
                {authUser && (
                    <Button variant="outline-success" onClick={handleLogout}>
                        Logout
                    </Button>
                )}

                {/* 로그인 버튼 클릭 시 모달 띄우기 */}
                {!authUser && (
                    <Button variant="outline-success" onClick={handleLoginClick}>
                        SignIn
                    </Button>
                )}

                <Button variant="outline-danger">인증 테스트</Button>

                <hr />
                <ListGroup>
                    <ListGroup.Item as={Link} to="/hook1">
                        Menu 1
                    </ListGroup.Item>
                    <ListGroup.Item as={Link} to="/hook2">
                        Menu 2
                    </ListGroup.Item>
                </ListGroup>
            </Stack>

            {/* 로그인 모달을 상태에 따라 표시 */}
            <LoginModal show={showLoginModal} onHide={handleCloseLoginModal} />
        </>
    );
};

export default Side;
