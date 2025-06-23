import React from 'react'

const SignUpForm: React.FC = () => {
    return (

        <div className="container py-4">
            <h1 className="text-center">회원가입</h1>

            <form>
                {/* 이름 */}
                <div className="mb-3 col-12 col-md-8 offset-md-2">
                    <label className="form-label fw-bold">이름</label>
                    <input className="form-control form-control-lg" name="name" />
                </div>

                {/* 이메일 */}
                <div className="mb-3 col-12 col-md-8 offset-md-2">
                    <label className="form-label fw-bold">이메일</label>
                    <div className="input-group">
                        <input className="form-control" name="email" />
                        <button type="button" className="btn btn-outline-success">중복 체크</button>
                    </div>
                    <div className="mt-1 small">중복 확인 메시지</div>
                </div>

                {/* 비밀번호 */}
                <div className="mb-3 col-12 col-md-8 offset-md-2">
                    <label className="form-label fw-bold">비밀번호</label>
                    <input className="form-control" type="password" name="passwd" />
                </div>

                {/* 역할 */}
                <div className="mb-3 col-12 col-md-8 offset-md-2">
                    <label className="form-label fw-bold">역할</label>
                    <select className="form-select" name="role">
                        <option value="USER">USER</option>
                        <option value="ADMIN">ADMIN</option>
                    </select>
                </div>

                {/* 버튼 */}
                <div className="text-center">
                    <button className="btn btn-primary btn-lg me-2" type="submit">회원가입</button>
                    <button className="btn btn-secondary btn-lg" type="button">초기화</button>
                </div>
            </form>
        </div>
    )
}

export default SignUpForm
