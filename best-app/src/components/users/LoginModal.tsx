import React, { useState, useRef, type ChangeEvent, type FormEvent, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { Modal, Button, Row, Col, Form } from 'react-bootstrap';
import { useAuthStore, type AuthUser } from '../../stores/authStore';
import { apiSignIn } from '../../api/userApi';

interface LoginModalProps {
    show: boolean;
    onHide: () => void;
}

interface LoginUser {
    email: string;
    passwd: string;
}

export function LoginModal({ show, onHide }: LoginModalProps) {
    const [loginUser, setLoginUser] = useState<LoginUser>({ email: '', passwd: '' });
    const loginAuthUser = useAuthStore((s) => s.loginAuthUser);
    const navigate = useNavigate();

    const emailRef = useRef<HTMLInputElement>(null);
    const passwdRef = useRef<HTMLInputElement>(null);

    const handleChange = (e: ChangeEvent<HTMLInputElement>) => {
        setLoginUser(prev => ({ ...prev, [e.target.name]: e.target.value }));
    };

    // 유효성 검사
    const validateForm = () => {
        if (!loginUser.email.trim()) {
            alert('이메일을 입력하세요');
            emailRef.current?.focus();
            return false;
        }
        if (!loginUser.passwd.trim()) {
            alert('비밀번호를 입력하세요');
            passwdRef.current?.focus();
            return false;
        }
        return true;
    };

    // 로그인 요청
    const requestLogin = async () => {
        try {
            const res = await apiSignIn(loginUser);
            if (res.result === 'success' && res.data) {
                handleLoginSuccess(res.data);
            } else {
                alert('로그인 실패: ' + res.message);
            }
        } catch (error) {
            alert('로그인 실패: ' + (error as Error).message);
        }
    };

    // 로그인 성공 처리
    const handleLoginSuccess = (data: AuthUser) => {
        alert('로그인 성공!');
        loginAuthUser(data);  // 상태에 로그인된 사용자 정보 저장
        console.log('로그인된 사용자 정보:', data);
        onHide();
        navigate('/');
    };

    const onSubmit = async (e: FormEvent) => {
        e.preventDefault();
        if (!validateForm()) return;
        await requestLogin();
    };

    // 로그인 모달 열릴 때마다 비밀번호 초기화
    useEffect(() => {
        if (show) {
            setLoginUser(prev => ({ ...prev, passwd: '' }))
        }
    }, [show])

    return (
        <Modal show={show} onHide={onHide} centered>
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
                                    value={loginUser.email}
                                    onChange={handleChange}
                                    ref={emailRef}
                                    placeholder="이메일을 입력하세요"
                                    autoFocus
                                    required
                                    isInvalid={!loginUser.email.trim()}
                                    className="form-control-md"
                                    autoComplete="on"
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
                                    value={loginUser.passwd}
                                    onChange={handleChange}
                                    ref={passwdRef}
                                    placeholder="비밀번호를 입력하세요"
                                    required
                                    isInvalid={!loginUser.passwd.trim()}
                                    className="form-control-md"
                                    autoComplete="new-password"
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
                        disabled={!loginUser.email || !loginUser.passwd} // 필드가 비어있으면 로그인 버튼 비활성화
                    >
                        로그인
                    </Button>
                </Form>
            </Modal.Body>
        </Modal>
    );
}
