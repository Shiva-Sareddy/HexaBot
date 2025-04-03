import { useState } from "react";
import Chat from "./components/Chat";
import Sidebar from "./components/Sidebar";
import "./index.css";

function App() {
  const [userId, setUserId] = useState(localStorage.getItem("userId") || null);
  const [darkMode, setDarkMode] = useState(false);
  const [sidebarOpen, setSidebarOpen] = useState(true);

  const handleLogout = () => {
    localStorage.removeItem("userId");
    setUserId(null);
  };

  const toggleDarkMode = () => {
    setDarkMode((prev) => !prev);
    document.body.classList.toggle("dark-mode");
  };

  return (
    <div className={`app-container ${darkMode ? "dark" : ""}`}>
      {userId && (
        <Sidebar
          username={`User${userId}`}
          isOpen={sidebarOpen}
          toggleSidebar={() => setSidebarOpen(!sidebarOpen)}
          onLogout={handleLogout}
        />
      )}
      <div className="main-content">
        <div className="header">
          <h1>HEXABOT</h1>
          <button className="toggle-mode" onClick={toggleDarkMode}>
            {darkMode ? "Light Mode" : "Dark Mode"}
          </button>
        </div>
        {userId ? (
          <Chat userId={userId} />
        ) : (
          <p>Please log in to start chatting.</p>
        )}
      </div>
    </div>
  );
}

export default App;
