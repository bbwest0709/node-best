import { BrowserRouter, Route, Routes } from 'react-router-dom'
import './App.css'
import Header from './components/Header'
import Side from './components/Side'
import Footer from './components/Footer'
import Home from './pages/Home'
import { Col, Row } from 'react-bootstrap'
import PostApp from "./pages/PostApp"
import PostView from './components/posts/PostView'

function App() {
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

export default App