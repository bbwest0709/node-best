import React, { useState, useRef, type ChangeEvent, type FormEvent } from "react";
import { Modal, Button, Row, Col, Form } from "react-bootstrap";
import { useAuthStore, type AuthUser } from "../../stores/authStore";
import { apiSignIn } from "../../api/userApi";
import { useNavigate } from "react-router-dom";

interface LoginModalProps {
  show: boolean;
  setShowLogin: (show: boolean) => void;
}

interface LoginUser {
  email: string;
  passwd: string;
}

export default function LoginModal({ show, setShowLogin }: LoginModalProps) {
  const [loginUser, setLoginUser] = useState<LoginUser>({ email: "", passwd: "" });
  const loginAuthUser = useAuthStore((s) => s.loginAuthUser);
  const setLoading = useAuthStore((s) => s.setLoading);
  const navigate = useNavigate();

  const emailRef = useRef<HTMLInputElement>(null);
  const passwdRef = useRef<HTMLInputElement>(null);

  const handleChange = (e: ChangeEvent<HTMLInputElement>) => {
    setLoginUser((prev) => ({ ...prev, [e.target.name]: e.target.value }));
  };

  const validateForm = () => {
    if (!loginUser.email.trim()) {
      alert("이메일을 입력하세요");
      emailRef.current?.focus();
      return false;
    }
    if (!loginUser.passwd.trim()) {
      alert("비밀번호를 입력하세요");
      passwdRef.current?.focus();
      return false;
    }
    return true;
  };

  const reset = () => {
    setLoginUser({ email: "", passwd: "" });
  };

  const requestLogin = async () => {
    try {
      setLoading(true);
      const res = await apiSignIn(loginUser);
      if (res.result === "success" && res.data) {
        alert(`${res.message} ${res.data.name}님 환영합니다`);
      } else {
        alert(res.message || "로그인 실패");
      }
    } catch (error: any) {
      console.error(error.response?.data?.message ?? error.message ?? "로그인 중 오류 발생");
    } finally {
      setLoading(false);
      reset();
    }
  };

  const onSubmit = (e: FormEvent) => {
    e.preventDefault();
    if (!validateForm()) return;
    requestLogin();
  };

  return (
    <Modal show={show} centered onHide={() => setShowLogin(false)}>
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
                  className="form-control-md"
                  autoComplete="on"
                  isInvalid={!loginUser.email.trim()}
                />
                <Form.Control.Feedback type="invalid">이메일을 입력하세요.</Form.Control.Feedback>
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
                  className="form-control-md"
                  autoComplete="new-password"
                  isInvalid={!loginUser.passwd.trim()}
                />
                <Form.Control.Feedback type="invalid">비밀번호를 입력하세요.</Form.Control.Feedback>
              </Form.Group>
            </Col>
          </Row>

          <Button
            variant="primary"
            type="submit"
            className="w-100 btn-md"
            disabled={!loginUser.email || !loginUser.passwd}
          >
            로그인
          </Button>
        </Form>
      </Modal.Body>
    </Modal>
  );
}
