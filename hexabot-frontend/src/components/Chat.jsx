// src/components/Chat.jsx
import React, { useState, useEffect } from "react";
import "./Chat.css";

const Chat = ({ userId }) => {
  const [messages, setMessages] = useState([]);
  const [input, setInput] = useState("");

  useEffect(() => {
    const fetchMessages = async () => {
      if (userId) {
        const response = await fetch(`http://localhost:5000/chat/${userId}`);
        const data = await response.json();
        setMessages(data);
      }
    };
    fetchMessages();
  }, [userId]);

  const handleSendMessage = async () => {
    if (input.trim()) {
      const newMessage = { message_text: input, is_user: true };
      setMessages((prev) => [...prev, newMessage]);
      setInput("");

      try {
        const response = await fetch(`http://localhost:5000/chat/${userId}`, {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ message: input }),
        });
        const data = await response.json();
        setMessages((prev) => [
          ...prev,
          { message_text: data, is_user: false },
        ]);
      } catch (error) {
        setMessages((prev) => [
          ...prev,
          { message_text: "Error occurred.", is_user: false },
        ]);
      }
    }
  };

  return (
    <div className="chat-container">
      {/* Chat Window */}
      <div className="chat-window">
        {messages.map((msg, index) => (
          <div
            key={index}
            className={`message ${msg.is_user ? "user" : "bot"}`}>
            {msg.message_text}
          </div>
        ))}
      </div>

      {/* Input Box */}
      <div className="chat-input">
        <input
          type="text"
          placeholder="Type a message..."
          value={input}
          onChange={(e) => setInput(e.target.value)}
          onKeyDown={(e) => e.key === "Enter" && handleSendMessage()}
        />
        <button onClick={handleSendMessage}>Send</button>
      </div>
    </div>
  );
};

export default Chat;
