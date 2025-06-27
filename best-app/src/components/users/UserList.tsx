import React, { useEffect, useState } from "react";
import type { UserWithoutPassword } from "./types/user";
import { apiUserList } from "../../api/userApi";
import { useAuthStore } from "../../stores/authStore";

export default function UserList() {
    const [users, setUsers] = useState<UserWithoutPassword[]>([]);
    const [loading, setLoading] = useState<boolean>(true);

    const authUser = useAuthStore((s) => s.authUser);
    const isLoading = useAuthStore((s) => s.isLoading);

    useEffect(() => {
        const fetchUsers = async () => {
            try {
                const res = await apiUserList();

                if (res.result === "success" && res.data) {
                    setUsers(res.data);
                } else {
                    alert(res.message || "사용자 목록 불러오기 실패");
                }
            } catch (error: any) {
                console.error(error);

                if (error.response) {
                    const { status, data } = error.response;
                    if (status === 401) {
                        alert("인증이 필요합니다. 로그인 후 시도해주세요.");
                    } else if (status === 403) {
                        alert("관리자 권한이 필요합니다.");
                    } else {
                        alert(data?.message || "오류 발생");
                    }
                } else {
                    alert("네트워크 오류");
                }
            } finally {
                setLoading(false);
            }
        };

        // 인증 상태 체크 후 실행
        if (!isLoading) {
            if (!authUser) {
                alert("로그인이 필요합니다.");
                setLoading(false);
                return;
            }

            if (authUser.role !== "ADMIN") {
                alert("관리자만 접근 가능합니다.");
                setLoading(false);
                return;
            }

            fetchUsers();
        }
    }, [authUser, isLoading]);

    if (loading) {
        return <div><h4 className="text-center my-4">Loading...</h4></div>;
    }

    return (
        <div className="container py-3">
            <h2>회원 목록 [Admin Page]</h2>
            <table className="table table-striped">
                <thead>
                    <tr>
                        <th>회원ID</th>
                        <th>이름</th>
                        <th>이메일</th>
                        <th>ROLE</th>
                        <th>가입일</th>
                    </tr>
                </thead>
                <tbody>
                    {users.length === 0 ? (
                        <tr>
                            <td colSpan={5} className="text-center">회원 정보가 없습니다.</td>
                        </tr>
                    ) : (
                        users.map((user) => (
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
    );
}
