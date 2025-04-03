// server.js
const express = require("express");
const { Pool } = require("pg");
const bcrypt = require("bcrypt");
const axios = require("axios");
const app = express();
const port = 5000;
const cors = require("cors");
app.use(cors());

app.use(express.json());

const pool = new Pool({
  user: "postgres",
  host: "localhost",
  database: "hexabot_db",
  password: "abc123", // Replace with your actual password
  port: 5432,
});

app.post("/register", async (req, res) => {
  console.log("Register endpoint called");
  try {
    const { username, password } = req.body;
    const hashedPassword = await bcrypt.hash(password, 10);
    await pool.query(
      "INSERT INTO users (username, password_hash) VALUES ($1, $2)",
      [username, hashedPassword]
    );
    res.status(201).json({ message: "User registered successfully" });
  } catch (error) {
    console.error("Registration Error:", error);
    res
      .status(400)
      .json({ error: "Username already exists or other registration error" });
  }
});

app.post("/login", async (req, res) => {
  try {
    const { username, password } = req.body;
    const result = await pool.query(
      "SELECT user_id, password_hash FROM users WHERE username = $1",
      [username]
    );
    if (result.rows.length > 0) {
      const user = result.rows[0];
      const passwordMatch = await bcrypt.compare(password, user.password_hash);
      if (passwordMatch) {
        res.json({ user_id: user.user_id, username });
      } else {
        res.status(401).json({ error: "Invalid credentials" });
      }
    } else {
      res.status(401).json({ error: "Invalid credentials" });
    }
  } catch (error) {
    console.error("Login Error:", error);
    res.status(500).json({ error: "Server error" });
  }
});

app.get("/chat/:userId", async (req, res) => {
  try {
    const { userId } = req.params;
    const result = await pool.query(
      "SELECT message_text, is_user FROM chat_history WHERE user_id = $1 ORDER BY timestamp",
      [userId]
    );
    res.json(result.rows);
  } catch (error) {
    console.error("Chat Get Error:", error);
    res.status(500).json({ error: "Server error" });
  }
});

app.post("/chat/:userId", async (req, res) => {
  try {
    const { userId } = req.params;
    const { message } = req.body;
    await pool.query(
      "INSERT INTO chat_history (user_id, message_text, is_user) VALUES ($1, $2, $3)",
      [userId, message, true]
    );
    const pythonResponse = await axios.post("http://localhost:5001/generate", {
      message,
    });
    await pool.query(
      "INSERT INTO chat_history (user_id, message_text, is_user) VALUES ($1, $2, $3)",
      [userId, pythonResponse.data, false]
    );
    res.json(pythonResponse.data);
  } catch (error) {
    console.error("Chat Post Error:", error);
    res.status(500).json({ error: "Server error" });
  }
});

app.listen(port, () => {
  console.log(`Server listening at http://localhost:${port}`);
});
