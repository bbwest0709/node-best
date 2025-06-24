import React, { useRef, type ChangeEvent, type FormEvent } from 'react';
import { useUserStore } from '../../stores/UserStore';
import { useNavigate } from 'react-router-dom';
// import { apiSignIn } from '../../api/userApi';

const SignInForm: React.FC = () => {
    const navigate = useNavigate();
    const emailRef = useRef<HTMLInputElement>(null);
    const passwdRef = useRef<HTMLInputElement>(null);
    const { user, setField } = useUserStore();

    const handleChange = (e: ChangeEvent<HTMLInputElement>) => {
        setField(e.target.name as keyof typeof user, e.target.value);
    };

    const onSubmit = async (e: FormEvent) => {
        e.preventDefault();

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

        try {
            // const res = await apiSignIn({ email: user.email, passwd: user.passwd });
            // 로그인 성공 시 처리 (토큰 저장 등)
            alert('로그인 성공!');
            navigate('/'); // 예: 메인 페이지로 이동
        } catch (error) {
            alert('로그인 실패: ' + (error as Error).message);
        }
    };

    return (
        <div className="container py-4">
            <h1 className="text-center">로그인</h1>
            <form onSubmit={onSubmit} className="col-12 col-md-6 offset-md-3">
                <div className="mb-3">
                    <label htmlFor="email" className="form-label fw-bold">
                        이메일
                    </label>
                    <input
                        type="email"
                        id="email"
                        name="email"
                        className="form-control"
                        value={user.email}
                        onChange={handleChange}
                        ref={emailRef}
                    />
                </div>
                <div className="mb-3">
                    <label htmlFor="passwd" className="form-label fw-bold">
                        비밀번호
                    </label>
                    <input
                        type="password"
                        id="passwd"
                        name="passwd"
                        className="form-control"
                        value={user.passwd}
                        onChange={handleChange}
                        ref={passwdRef}
                    />
                </div>
                <div className="d-grid gap-2">
                    <button type="submit" className="btn btn-primary btn-lg">
                        로그인
                    </button>
                </div>
            </form>
        </div>
    );
};

export default SignInForm;
