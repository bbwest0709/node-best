import { useState } from "react";
import { Stack, Button, ListGroup } from "react-bootstrap"
import { Link } from "react-router-dom"
import { LoginModal } from "./users/LoginModal";

const Side: React.FC = () => {

    const [showLoginModal, setShowLoginModal] = useState(false);

    const handleLoginClick = () => {
        setShowLoginModal(true);
    };

    const handleCloseLoginModal = () => {
        setShowLoginModal(false);
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
                <div className="alert alert-danger">a님 로그인 중 ...</div>

                <Button variant="outline-success">Logout</Button>

                {/* 로그인 버튼 클릭 시 모달 띄우기 */}
                <Button variant="outline-success" onClick={handleLoginClick}>
                    SignIn
                </Button>

                <Button variant="outline-danger">인증 테스트</Button>

                <hr></hr>
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
    )
}

export default Side;