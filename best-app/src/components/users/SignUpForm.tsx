import React, { useRef, type ChangeEvent, type FormEvent } from 'react'
import { useUserStore } from '../../stores/UserStore'
import type { Role } from './types/user'
import { useNavigate } from 'react-router-dom'
import { useState } from 'react'
import { apiCheckEmailDuplicate, apiSignUp } from '../../api/userApi'

const SignUpForm: React.FC = () => {
    const navigate = useNavigate();
    const nameRef = useRef<HTMLInputElement>(null);
    const emailRef = useRef<HTMLInputElement>(null);
    const passwdRef = useRef<HTMLInputElement>(null);
    const { user, duplicateChecked, setField, reset, setDuplicateChecked } = useUserStore();
    const [emailCheckMessage, setEmailCheckMessage] = useState('');

    const handleChange = (e: ChangeEvent<HTMLInputElement>) => {
        setField(e.target.name as keyof typeof user, e.target.value)
    }

    const handleChangeRole = (e: ChangeEvent<HTMLSelectElement>) => {
        setField('role', e.target.value as Role)
    }

    const handleCheckEmail = async () => {
        if (!user.email.trim()) {
            alert('이메일을 입력하세요');
            emailRef.current?.focus();
            return;
        }
        try {
            const res = await apiCheckEmailDuplicate(user.email)
            setEmailCheckMessage(res.message)

            if (res.result === 'success') {
                setDuplicateChecked(true);
            } else {
                setDuplicateChecked(false);
            }
        } catch (error) {
            alert('Server Error: ' + (error as Error).message);
        }
    }

    const validateForm = (): boolean => {
        if (!user.name.trim()) {
            alert('이름을 입력하세요');
            nameRef.current?.focus();
            return false;
        }
        if (!user.email.trim()) {
            alert('이메일을 입력하세요');
            emailRef.current?.focus();
            return false;
        }
        if (!user.passwd.trim()) {
            alert('비밀번호를 입력하세요');
            passwdRef.current?.focus();
            return false;
        }
        if (!duplicateChecked) {
            alert('이메일 중복 확인을 먼저 해주세요.');
            return false;
        }

        return true;
    };

    const onSubmit = async (e: FormEvent) => {
        e.preventDefault();

        // 유효성 체크
        if (!validateForm()) return;

        try {
            // api 요청
            await apiSignUp(user)
            navigate('/login');
        } catch (error) {
            alert('Server Error: ' + (error as Error).message)
        }
    }

    return (

        <div className="container py-4">
            <h1 className="text-center">회원가입</h1>

            <form onSubmit={onSubmit}>
                {/* 이름 */}
                <div className="mb-3 col-12 col-md-8 offset-md-2">
                    <label className="form-label fw-bold">이름</label>
                    <input className="form-control form-control-lg" name="name" value={user.name} onChange={handleChange} ref={nameRef} />
                </div>

                {/* 이메일 */}
                <div className="mb-3 col-12 col-md-8 offset-md-2">
                    <label className="form-label fw-bold">이메일</label>
                    <div className="input-group">
                        <input className="form-control" name="email" value={user.email} onChange={handleChange} ref={emailRef} />
                        <button type="button" className="btn btn-outline-success" onClick={handleCheckEmail}>중복 체크</button>
                    </div>
                    <div className="mt-1 small">{emailCheckMessage}</div>
                </div>

                {/* 비밀번호 */}
                <div className="mb-3 col-12 col-md-8 offset-md-2">
                    <label className="form-label fw-bold">비밀번호</label>
                    <input className="form-control" type="password" name="passwd" value={user.passwd} onChange={handleChange} ref={passwdRef} />
                </div>

                {/* 역할 */}
                <div className="mb-3 col-12 col-md-8 offset-md-2">
                    <label className="form-label fw-bold">역할</label>
                    <select className="form-select" name="role" value={user.role} onChange={handleChangeRole}>
                        <option value="USER">USER</option>
                        <option value="ADMIN">ADMIN</option>
                    </select>
                </div>

                {/* 버튼 */}
                <div className="text-center">
                    <button className="btn btn-primary btn-lg me-2" type="submit">회원가입</button>
                    <button className="btn btn-secondary btn-lg" type="button" onClick={() => reset()}>입력 초기화</button>
                </div>
            </form>
        </div>
    )

}

export default SignUpForm
