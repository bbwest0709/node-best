import { Navbar, Container, Nav, NavDropdown } from "react-bootstrap"
import { Link } from "react-router-dom"

const Header: React.FC = () => {
    return (
        <Navbar collapseOnSelect expand="lg" className="bg-body-tertiary" fixed="top" bg="dark" data-bs-theme="dark">
            <Container>
                <Navbar.Brand as={Link} to="/">
                    Ezen
                </Navbar.Brand>
                <Navbar.Toggle aria-controls="responsive-navbar-nav" />
                <Navbar.Collapse id="responsive-navbar-nav">
                    <Nav className="me-auto">
                        <Nav.Link as={Link} to="/signup">
                            SignUp
                        </Nav.Link>
                        <Nav.Link href="#pricing">Pricing</Nav.Link>
                        <NavDropdown title="Admin 관리" id="collapsible-nav-dropdown">
                            <NavDropdown.Item as={Link} to="/admin/users">회원 관리</NavDropdown.Item>
                            <NavDropdown.Item href="#action/3.2">상품 관리</NavDropdown.Item>
                            <NavDropdown.Item href="#action/3.3">주문 관리</NavDropdown.Item>
                            <NavDropdown.Divider />
                            <NavDropdown.Item href="#action/3.4">Separated link</NavDropdown.Item>
                        </NavDropdown>
                    </Nav>
                    <Nav>
                        <Nav.Link as={Link} to="/posts">
                            Posts
                        </Nav.Link>
                        <Nav.Link eventKey={2} as={Link} to="/mypage">
                            MyPage
                        </Nav.Link>
                        <Nav.Link as={Link} to="/chatting">
                            Chatting
                        </Nav.Link>
                    </Nav>
                </Navbar.Collapse>
            </Container>
        </Navbar>
    )
}
export default Header;