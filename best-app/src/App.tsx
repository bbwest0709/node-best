import { BrowserRouter, Route, Routes } from 'react-router-dom';
import './App.css';
import Header from './components/Header';
import Side from './components/Side';
import Footer from './components/Footer';
import Home from './pages/Home';
import { Col, Row } from 'react-bootstrap';
import PostApp from "./pages/PostApp";
import PostView from './components/posts/PostView';
import PostEdit from './components/posts/PostEdit';
import SignUpForm from './components/users/SignUpForm';
import UserList from './components/users/UserList';
import LoginModal from './components/users/LoginModal';
import { useAuthStore, type AuthUser } from './stores/authStore';
import { useEffect, useState } from 'react';
import axiosInstance from './api/axiosInstance';
import ChatApp from './components/chat/chatApp';

function App() {
  const [showLogin, setShowLogin] = useState<boolean>(false);

  const loginAuthUser = useAuthStore(s => s.loginAuthUser);
  const setLoading = useAuthStore(s => s.setLoading);
  const isLoading = useAuthStore(s => s.isLoading);
  const authUser = useAuthStore(s => s.authUser);   // 현재 로그인 유저 상태 확인용

  const requestAuthUser = async () => {
    try {
      setLoading(true);
      const accessToken = sessionStorage.getItem('accessToken');
      console.log('requestAuthUser accessToken:', accessToken);

      if (accessToken) {
        const response = await axiosInstance.get<AuthUser>('/auth/user', {
          headers: {
            Authorization: `Bearer ${accessToken}`
          }
        });
        console.log('requestAuthUser response.data:', response.data);
        loginAuthUser(response.data);
      } else {
        console.log('No access token found, skipping user request');
      }
    } catch (error) {
      console.error('requestAuthUser error:', error);
      sessionStorage.removeItem('accessToken');
      localStorage.removeItem('refreshToken');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (!authUser) {
      requestAuthUser();
    } else {
      setLoading(false);  // 이미 zustand에 유저 있으면 바로 로딩 종료
    }
  }, []);

  if (isLoading) {
    return (
      <div className="text-center py-5">
        <div className="spinner-border text-primary" role="status">
          <span className="visually-hidden">Loading...</span>
        </div>
      </div>
    );
  }

  return (
    <BrowserRouter>
      <div className="container-fluid py-5">
        <Row>
          <Col className="mb-5">
            <Header />
          </Col>
        </Row>
        <Row className="main">
          <Col xs={12} sm={4} md={4} lg={3} className="d-none d-sm-block mt-3">
            <Side setShowLogin={setShowLogin} />
          </Col>
          <Col xs={12} sm={8} md={8} lg={9}>
            <LoginModal show={showLogin} setShowLogin={setShowLogin} />
            <Routes>
              <Route path="/" element={<Home />} />
              <Route path="/posts" element={<PostApp />} />
              <Route path="/posts/:id" element={<PostView />} />
              <Route path="/posts/edit/:id" element={<PostEdit />} />
              <Route path="/signup" element={<SignUpForm />} />
              <Route path="/admin/users" element={<UserList />} />
              <Route path="/chatting" element={<ChatApp />} />
            </Routes>
          </Col>
        </Row>
        <Row>
          <Col lg={12}>
            <Footer />
          </Col>
        </Row>
      </div>
    </BrowserRouter>
  );
}

export default App;
