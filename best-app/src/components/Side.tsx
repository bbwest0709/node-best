import { Stack, Button, ListGroup } from "react-bootstrap";
import { Link, useNavigate } from "react-router-dom";
import { useAuthStore } from "../stores/authStore";
import { apiSignOut } from "../api/userApi";
import axiosInstance from "../api/axiosInstance";

interface SideProps {
  setShowLogin: (show: boolean) => void;
}

const Side: React.FC<SideProps> = ({ setShowLogin }) => {
  const authUser = useAuthStore((s) => s.authUser);
  const logout = useAuthStore((s) => s.logout);
  const setLoading = useAuthStore((s) => s.setLoading);
  const isLoading = useAuthStore((s) => s.isLoading);
  const navigate = useNavigate();

  // 로그인 버튼 클릭 시
  const handleLoginClick = () => {
    setShowLogin(true);
  };

  // 로그아웃 처리
  const handleLogout = async () => {
    try {
      setLoading(true);

      await apiSignOut();

      logout();

      // 리프레시 토큰 쿠키 삭제
      document.cookie = "refreshToken=; Max-Age=0; path=/";

      // accessToken 헤더에서 삭제
      delete axiosInstance.defaults.headers.common["Authorization"];

      sessionStorage.removeItem("accessToken");
      localStorage.removeItem("refreshToken");
      sessionStorage.removeItem("authUser");

      alert("로그아웃 되었습니다!");
      navigate("/");
    } catch (error: any) {
      console.error(error);
      alert(error.response?.data?.message ?? "로그아웃 중 오류 발생");
    } finally {
      setLoading(false);
    }
  };

  const handleAuthTest = async () => {
    try {
      const accessToken = sessionStorage.getItem("accessToken");

      const response = await axiosInstance.get("/auth/mypage", {
        headers: {
          Authorization: `Bearer ${accessToken}`,
        },
      });

      alert(response.data.message);
    } catch (error: any) {
      console.error(error);
      alert(error.response?.data?.message ?? "인증 테스트 실패");
    }
  };

  return (
    <Stack gap={2} className="mx-auto w-100">
      <Button variant="primary" as={Link as any} to="/">
        Home
      </Button>

      {!authUser && (
        <Button variant="outline-success" as={Link as any} to="/signup">
          SignUp
        </Button>
      )}

      <div className="alert alert-info text-center">
        {isLoading
          ? "로딩 중..."
          : authUser && authUser.name
            ? `${authUser.name}님, 환영합니다!`
            : "로그인 후 더 많은 기능을 이용해보세요."}
      </div>

      {authUser ? (
        <Button variant="outline-success" onClick={handleLogout}>
          Logout
        </Button>
      ) : (
        <Button variant="outline-success" onClick={handleLoginClick}>
          SignIn
        </Button>
      )}

      <Button variant="outline-danger" onClick={handleAuthTest}>
        인증 테스트
      </Button>

      <hr />

      <ListGroup>
        <ListGroup.Item as={Link} to="/hook1">
          Menu 1
        </ListGroup.Item>
        <ListGroup.Item as={Link} to="/hook2">
          Menu 2
        </ListGroup.Item>
      </ListGroup>
    </Stack>
  );
};

export default Side;
