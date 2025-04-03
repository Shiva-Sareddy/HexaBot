// src/components/Sidebar.jsx
import React from "react";
import "./Sidebar.css";

const Sidebar = ({ username, isOpen, toggleSidebar, onLogout }) => {
  return (
    <div className={`sidebar ${isOpen ? "open" : "closed"}`}>
      <button className="toggle-btn" onClick={toggleSidebar}>
        {isOpen ? "❮" : "❯"}
      </button>
      {isOpen && (
        <div className="sidebar-content">
          <h2>Hello, {username}</h2>
          <button className="logout-btn" onClick={onLogout}>
            Logout
          </button>
        </div>
      )}
    </div>
  );
};

export default Sidebar;
