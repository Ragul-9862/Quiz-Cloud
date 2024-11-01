import React from "react";
import Container from "react-bootstrap/Container";
import Nav from "react-bootstrap/Nav";
import Navbar from "react-bootstrap/Navbar";
import logo from "../assets/images/logo.png";

export default function Header() {
  return (
    <div>
      <Navbar expand="lg" className=" fixed-top">
        <Container>
          <Navbar.Brand href="#home">
            <img width="50px" src={logo} alt="" srcset="" />
          </Navbar.Brand>
          <Navbar.Toggle aria-controls="basic-navbar-nav" />
          <Navbar.Collapse id="basic-navbar-nav">
            <Nav className="me-auto">
              <Nav.Link href="#home">About </Nav.Link>
              <Nav.Link href="#home">Contact Us </Nav.Link>
            </Nav>
          </Navbar.Collapse>
        </Container>
      </Navbar>
    </div>
  );
}
