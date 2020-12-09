import React, { useState, useEffect } from 'react';
import { AmplifySignOut } from '@aws-amplify/ui-react';
import Auth from '@aws-amplify/auth';
import { Navbar, Nav } from 'react-bootstrap';
import './App.css';
import './Navigation.css'

function Navigation() {
  let [user, setUser] = useState(null);

  useEffect(() => {
    let updateUser = async authState => {
      try {
        let user = await Auth.currentAuthenticatedUser();
        setUser(user);
      } catch {
        setUser(null);
      }
    }
    updateUser();
  },[]);

  return (!user) ? (
    <Navbar>
      <Navbar.Brand href="/">Voter App</Navbar.Brand>
      <Navbar.Toggle aria-controls="basic-navbar-nav" />
      <Navbar.Collapse className="justify-content-end" id="basic-navbar-nav">
        <Nav>
            <Nav.Link href="/about">About</Nav.Link>
            <Nav.Link href="/dashboard">Dashboard</Nav.Link>
        </Nav>
      </Navbar.Collapse>
    </Navbar>
  ) : (
    <Navbar>
      <Navbar.Brand href="/">Voter App</Navbar.Brand>
      <Navbar.Toggle aria-controls="basic-navbar-nav" />
      <Navbar.Collapse className="justify-content-end" id="basic-navbar-nav">
        <Nav>
            <Nav.Link href="/about">About</Nav.Link>
            <Nav.Link href="/dashboard">Dashboard</Nav.Link>
            <AmplifySignOut />
        </Nav>
      </Navbar.Collapse>
    </Navbar>
  );
}

export default Navigation;
