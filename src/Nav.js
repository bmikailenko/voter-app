import React from 'react';
import './App.css';
import { Link } from 'react-router-dom'

function Nav() {
  const navStyle = {
    color: 'white'
  }

  return (
    <nav>
      <Link style={navStyle} to="/">
        <h3>Voter App</h3>
      </Link>
      <ul className="nav-links">
        <Link style={navStyle} to="/about">
          <li>About</li>
        </Link>
        <Link style={navStyle} to="/login">
          <li>Login</li>
        </Link>
        <Link style={navStyle} to="/signup">
          <li>Signup</li>
        </Link>
      </ul>
    </nav>
  );
}

export default Nav;
