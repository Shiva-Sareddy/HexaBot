// src/components/Chat.jsx
import React, { useState, useEffect, useRef } from "react";
import styles from "./Chat.module.css"; // Changed to CSS modules

const Chat = ({ userId }) => {
  const [messages, setMessages] = useState([
    {
      message_text: "Hello, I'm Hexabot. What Can I Help With?",
      is_user: false,
    },
  ]);
  const [input, setInput] = useState("");
  const messagesEndRef = useRef(null);
  const chatWindowRef = useRef(null);

  // For demo purposes, using the static messages
  // Uncomment this for actual API usage
  useEffect(() => {
    const fetchMessages = async () => {
      if (userId) {
        try {
          const response = await fetch(`http://localhost:5000/chat/${userId}`);
          const data = await response.json();
          setMessages(data);
        } catch (error) {
          console.error("Failed to fetch messages:", error);
        }
      }
    };
    fetchMessages();
  }, [userId]);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  };

  // Auto-scroll to bottom when messages change
  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  const handleSendMessage = async () => {
    if (input.trim()) {
      const newMessage = { message_text: input, is_user: true };
      setMessages((prev) => [...prev, newMessage]);
      setInput("");

      // For demo, add an "Error occurred" message
      // In actual implementation, uncomment the API call
      // setTimeout(() => {
      //   setMessages((prev) => [
      //     ...prev,
      //     { message_text: "Error occurred.", is_user: false },
      //   ]);
      // }, 1000);

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
    <div className={styles.chatContainer}>
      <div className={styles.chatWindow} ref={chatWindowRef}>
        {messages.map((msg, index) => (
          <div
            key={index}
            className={`${styles.message} ${
              msg.is_user ? styles.userMessage : styles.botMessage
            }`}>
            {msg.message_text}
          </div>
        ))}
        <div ref={messagesEndRef} />
      </div>

      <div className={styles.chatInput}>
        <input
          type="text"
          placeholder="Ask Anything?"
          value={input}
          onChange={(e) => setInput(e.target.value)}
          onKeyDown={(e) => e.key === "Enter" && handleSendMessage()}
        />
        <button onClick={handleSendMessage}>
          <i className="fa-solid fa-paper-plane"></i>
        </button>
      </div>
      <div className={styles.disclaimer}>AI-Generated, for reference only</div>
    </div>
  );
};

export default Chat;
