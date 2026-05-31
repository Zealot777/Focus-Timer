//components/Header.js
import React from 'react';
import { NavLink } from 'react-router-dom';
import './Header.css';

function Header() {
  return (
    <header className="nav-container">
      <NavLink 
        to="/" 
        className={({ isActive }) => isActive ? "nav-link active" : "nav-link"}
      >
        타이머
      </NavLink>
      
      <NavLink 
        to="/history" 
        className={({ isActive }) => isActive ? "nav-link active" : "nav-link"}
      >
        히스토리
      </NavLink>
      
      <NavLink 
        to="/dashboard" 
        className={({ isActive }) => isActive ? "nav-link active" : "nav-link"}
      >
        대시보드
      </NavLink>
    </header>
  );
}

export default Header;