import { useState, useRef, useEffect } from "react";
import Login from "./components/Login";
import Signup from "./components/Signup";
import Chat from "./components/Chat";
import "./index.css";

function App() {
  const [darkMode, setDarkMode] = useState(false);
  const [isSettingsOpen, setIsSettingsOpen] = useState(false);
  const [showLogin, setShowLogin] = useState(true);
  const [userId, setUserId] = useState(localStorage.getItem("userId") || null);
  const popupRef = useRef(null);

  useEffect(() => {
    if (darkMode) {
      document.body.classList.add("dark-mode");
      document.body.classList.remove("light-mode");
    } else {
      document.body.classList.add("light-mode");
      document.body.classList.remove("dark-mode");
    }
  }, [darkMode]);

  const toggleDarkMode = () => setDarkMode((prev) => !prev);
  const toggleSettings = () => setIsSettingsOpen((prev) => !prev);

  const handleLogout = () => {
    localStorage.removeItem("userId");
    setUserId(null);
    setIsSettingsOpen(false);
  };

  useEffect(() => {
    const handleClickOutside = (event) => {
      if (
        isSettingsOpen &&
        popupRef.current &&
        !popupRef.current.contains(event.target)
      ) {
        setIsSettingsOpen(false);
      }
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, [isSettingsOpen]);

  // ✅ Main UI Rendering
  if (!userId) {
    return showLogin ? (
      <Login
        onSwitch={() => setShowLogin(false)}
        onLogin={(id) => {
          localStorage.setItem("userId", id);
          setUserId(id);
        }}
      />
    ) : (
      <Signup onSwitch={() => setShowLogin(true)} />
    );
  }

  return (
    <div className={`app-container ${darkMode ? "dark-mode" : "light-mode"}`}>
      <div className={`main-content ${isSettingsOpen ? "blurred" : ""}`}>
        <div className="header">
          <h1 className="title">
            <img width={30} src="src/icons/polygon.png" alt="HexaBot Logo" />
            HexaBot: Personalized AI
          </h1>
          <button className="settings-btn" onClick={toggleSettings}>
            <i className="fa-solid fa-gear"></i>
          </button>
        </div>

        <Chat userId={userId} />
      </div>

      {isSettingsOpen && (
        <div className="settings-overlay" onClick={toggleSettings}>
          <div
            className="settings-popup"
            ref={popupRef}
            onClick={(e) => e.stopPropagation()}>
            <div className="settings-header">
              <h2>Settings</h2>
              <button className="close-btn" onClick={toggleSettings}>
                ×
              </button>
            </div>
            <div className="settings-content">
              <div className="settings-row">
                <span>Theme</span>
                <div className="theme-toggle">
                  <button
                    className={`theme-btn ${!darkMode ? "active" : ""}`}
                    onClick={() => darkMode && toggleDarkMode()}>
                    Light
                  </button>
                  <button
                    className={`theme-btn ${darkMode ? "active" : ""}`}
                    onClick={() => !darkMode && toggleDarkMode()}>
                    Dark
                  </button>
                </div>
              </div>
              <div className="settings-row">
                <button className="logout-btn" onClick={handleLogout}>
                  Logout
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

export default App;
