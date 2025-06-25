import { BrowserRouter, Route, Routes } from 'react-router-dom'
import './App.css'
import Header from './components/Header'
import Side from './components/Side'
import Footer from './components/Footer'
import Home from './pages/Home'
import { Col, Row } from 'react-bootstrap'
import PostApp from "./pages/PostApp"
import PostView from './components/posts/PostView'
import PostEdit from './components/posts/PostEdit'
import SignUpForm from './components/users/SignUpForm'
import UserList from './components/users/UserList'
import { useAuthStore, type AuthUser } from './stores/authStore'
import { useEffect } from 'react'
import axiosInstance from './api/axiosInstance'

function App() {
  const loginAuthUser = useAuthStore(s => s.loginAuthUser)

  useEffect(() => {
    const restoreLogin = async () => {
      const accessToken = sessionStorage.getItem('accessToken')
      if (!accessToken) return

      try {
        const res = await axiosInstance.get<AuthUser>('/auth/user', {
          headers: {
            Authorization: `Bearer ${accessToken}`,
          },
        })
        loginAuthUser(res.data)
      } catch (err) {
        console.error('자동 로그인 실패:', err)
        sessionStorage.removeItem('accessToken')
        document.cookie = "refreshToken=; Max-Age=0; path=/"
      }
    }

    restoreLogin()
  }, [loginAuthUser])


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
            <Side />
          </Col>
          <Col xs={12} sm={8} md={8} lg={9}>
            <Routes>
              <Route path="/" element={<Home />} />
              <Route path="/posts" element={<PostApp />} />
              <Route path="/posts/:id" element={<PostView />} />
              <Route path="/posts/edit/:id" element={<PostEdit />} />
              <Route path="/signup" element={<SignUpForm />} />
              <Route path="/admin/users" element={<UserList />} />
            </Routes>
          </Col>
        </Row>
        <Row>
          <Col lg={12}>
            <Footer />
          </Col>
        </Row>
      </div>

      {/* 로그인 모달 제어
      <Button className="position-fixed bottom-0 start-50 translate-middle-x mb-3" variant="outline-success" onClick={handleShowModal}>
        로그인
      </Button>

      <LoginModal show={modalShow} onHide={handleHideModal} /> */}

    </BrowserRouter>
  );
}

export default App