import React, { useEffect, useState } from 'react'
import type { UserWithoutPassword } from './types/user'
import { apiUserList } from '../../api/userApi'

export default function UserList() {

    const [users, setUsers] = useState<UserWithoutPassword[]>([])
    const [loading, setLoading] = useState<boolean>(true)


    useEffect(() => {
        const fetchUsers = async () => {
            try {
                const res = await apiUserList();

                // 성공적인 응답 처리
                if (res.result === 'success' && res.data) {
                    setUsers(res.data);
                } else {
                    alert(res.message);
                }
            } catch (error: any) {
                // 상태 코드에 따라 처리
                if (error.response) {
                    const { status, data } = error.response;
                    console.log(status)
                    if (status === 401) {
                        alert('인증이 필요합니다. 로그인 후 다시 시도해주세요.');
                    } else if (status === 403) {
                        alert('관리자 권한이 필요합니다.');
                    } else {
                        alert('사용자 목록을 불러오는 중 오류가 발생했습니다: ' + (data?.message || '알 수 없는 오류'));
                    }
                } else {
                    alert('네트워크 오류가 발생했습니다.');
                }
            } finally {
                setLoading(false); // 로딩 종료
            }
        };

        fetchUsers();
    }, []);


    if (loading) {
        return <div><h4 className='text-center my-4'>Loading...</h4></div>
    }

    return (
        <div className='container py-3'>
            <h2>회원 목록 [Admin Page]</h2>
            <table className='table table-striped'>
                <thead>
                    <tr>
                        <th>회원ID</th>
                        <th>이  름</th>
                        <th>이메일</th>
                        <th>ROLE</th>
                        <th>가입일</th>
                    </tr>
                </thead>
                <tbody>
                    {users.length === 0 ? (
                        <tr>
                            <td colSpan={4} className="text-center">회원 정보가 없습니다.</td>
                        </tr>
                    ) : (
                        users.map(user => (
                            <tr key={user.id}>
                                <td>{user.id}</td>
                                <td>{user.name}</td>
                                <td>{user.email}</td>
                                <td>{user.role}</td>
                                <td>{user.indate}</td>
                            </tr>
                        ))
                    )}
                </tbody>
            </table>
        </div>
    )
}