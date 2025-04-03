import { useState } from 'react';

const Login = ({ onSwitch, onLogin }) => {
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');

  const handleLogin = async (e) => {
    e.preventDefault();
    try {
      const response = await fetch('http://localhost:5000/login', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ username, password }),
      });
      const data = await response.json();

      if (response.ok) {
        alert('Login successful');
        onLogin(data.user_id); // Pass user_id to App.jsx after successful login
      } else {
        alert(data.error);
      }
    } catch (error) {
      console.error('Login Error:', error);
      alert('Something went wrong. Try again!');
    }
  };

  return (
    <div className="container">
      <h2>Log In</h2>
      <form onSubmit={handleLogin}>
        <input
          type="text"
          placeholder="Username"
          value={username}
          onChange={(e) => setUsername(e.target.value)}
          required
        />
        <input
          type="password"
          placeholder="Password"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          required
        />
        <button type="submit">Log In</button>
      </form>
      <p>
        Don't have an account?{' '}
        <span onClick={onSwitch} style={{ color: 'blue', cursor: 'pointer' }}>
          Sign up
        </span>
      </p>
    </div>
  );
};

export default Login;
