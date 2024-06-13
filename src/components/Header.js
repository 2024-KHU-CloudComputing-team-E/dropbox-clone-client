import Container from "react-bootstrap/Container";
import Form from "react-bootstrap/Form";
import Navbar from "react-bootstrap/Navbar";
import "bootstrap/dist/css/bootstrap.min.css";
import "./Header.css";

function Header() {
  return (
    <>
      <Navbar className="header-navbar" bg="light" variant="light">
        <Container>
          <Form className="d-flex search-form">
            <Form.Control
              type="search"
              placeholder="Search"
              className="search-bar"
              aria-label="Search"
            />
          </Form>
        </Container>
      </Navbar>
    </>
  );
}

export default Header;
