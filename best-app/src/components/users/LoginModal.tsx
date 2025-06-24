import React, { useRef, type ChangeEvent, type FormEvent } from 'react';
import { useUserStore } from '../../stores/UserStore';
import { useNavigate } from 'react-router-dom';
import { Modal, Button, Row, Col, Form } from 'react-bootstrap';
// import { apiSignIn } from '../../api/userApi';

interface LoginModalProps {
    show: boolean;
    onHide: () => void;
}

export function LoginModal({ show, onHide }: LoginModalProps) {
    const navigate = useNavigate();
    const emailRef = useRef<HTMLInputElement>(null);
    const passwdRef = useRef<HTMLInputElement>(null);
    const { user, setField } = useUserStore();

    const handleChange = (e: ChangeEvent<HTMLInputElement>) => {
        setField(e.target.name as keyof typeof user, e.target.value);
    };

    const validateForm = () => {
        if (!user.email.trim()) {
            alert('이메일을 입력하세요');
            emailRef.current?.focus();
            return;
        }
        if (!user.passwd.trim()) {
            alert('비밀번호를 입력하세요');
            passwdRef.current?.focus();
            return;
        }
        return true;
    }

    const onSubmit = async (e: FormEvent) => {
        e.preventDefault();

        if (!validateForm()) return;

        try {
            // const res = await apiSignIn({ email: user.email, passwd: user.passwd });
            alert('로그인 성공!');
            onHide();
            navigate('/');
        } catch (error) {
            alert('로그인 실패: ' + (error as Error).message);
        }
    };

    return (
        <Modal show={show} onHide={onHide} centered size="md">
            <Modal.Header closeButton>
                <Modal.Title className="text-center w-100">로그인</Modal.Title>
            </Modal.Header>
            <Modal.Body>
                <Form onSubmit={onSubmit}>
                    <Row className="mb-3">
                        <Col>
                            <Form.Group controlId="email">
                                <Form.Label className="fw-bold">이메일</Form.Label>
                                <Form.Control
                                    type="email"
                                    name="email"
                                    value={user.email}
                                    onChange={handleChange}
                                    ref={emailRef}
                                    placeholder="이메일을 입력하세요"
                                    autoFocus
                                    required
                                    isInvalid={!user.email.trim()}
                                    className="form-control-md"
                                />
                                <Form.Control.Feedback type="invalid">
                                    이메일을 입력하세요.
                                </Form.Control.Feedback>
                            </Form.Group>
                        </Col>
                    </Row>

                    <Row className="mb-3">
                        <Col>
                            <Form.Group controlId="passwd">
                                <Form.Label className="fw-bold">비밀번호</Form.Label>
                                <Form.Control
                                    type="password"
                                    name="passwd"
                                    value={user.passwd}
                                    onChange={handleChange}
                                    ref={passwdRef}
                                    placeholder="비밀번호를 입력하세요"
                                    required
                                    isInvalid={!user.passwd.trim()}
                                    className="form-control-md"
                                />
                                <Form.Control.Feedback type="invalid">
                                    비밀번호를 입력하세요.
                                </Form.Control.Feedback>
                            </Form.Group>
                        </Col>
                    </Row>

                    <Button
                        variant="primary"
                        type="submit"
                        className="w-100 btn-md"
                        disabled={!user.email || !user.passwd} // 필드가 비어있으면 로그인 버튼 비활성화
                    >
                        로그인
                    </Button>
                </Form>
            </Modal.Body>
        </Modal>
    );
}