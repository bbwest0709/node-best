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
                if (res.result === 'success' && res.data) {
                    setUsers(res.data);
                } else {
                    alert(res.message);
                }
            } catch (error) {
                alert('사용자 목록을 불러오는 중 오류가 발생했습니다: ' + (error as Error).message);
            } finally {
                setLoading(false); // 성공/실패 여부와 상관없이 로딩 상태 종료
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