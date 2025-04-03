import { useState } from "react";
import Login from "./components/Login";
import Signup from "./components/Signup";
import Chat from "./components/Chat";

function App() {
  const [showLogin, setShowLogin] = useState(true);
  const [userId, setUserId] = useState(localStorage.getItem("userId") || null);

  const handleLogout = () => {
    localStorage.removeItem("userId");
    setUserId(null);
  };

  // if (userId) {
  //   return <Chat userId={userId} onLogout={handleLogout} />;
  // }

  return <Chat />;
}

export default App;
