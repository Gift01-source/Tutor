import React, { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import logo from '../assets/image.png';
import API from '../api';
import './pages.css';

function Login() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const navigate = useNavigate();
  const [showPassword, setShowPassword] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();

    // Simulate login using localStorage
    const users = JSON.parse(localStorage.getItem('users') || '[]');
    const user = users.find(u => u.email === email && u.password === password);
    if (!user) {
      alert('Login failed: Invalid credentials');
      return;
    }
    localStorage.setItem('token', 'dummy-token');
    localStorage.setItem('role', user.role);
    if (user.role === 'tutor') {
      navigate('/tutor-dashboard');
    } else if (user.role === 'student') {
      navigate('/student-dashboard');
    } else {
      alert('Unknown role: ' + user.role);
    }
  };

  return (
    <div className="page-container">
      <div className="form-box">
        <img src={logo} alt="TutorApp Logo" className="logo" />
        <h1 className="title">Login</h1>
        <form onSubmit={handleSubmit}>
          <input
            type="email"
            placeholder="Email"
            className="input"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            required
          />
          <input
            type={showPassword ? "text" : "password"}
            placeholder="Password"
            className="input"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            required
          />
          <span
            className="tongle-eye"
            onClick={() => setShowPassword((prev) => !prev)}
            style={{
              right: '10px',
                     
              marginLeft: '-30px',
              zIndex: 1,
              cursor: 'pointer',
              fontSize: '16px',
              color: '#555',
              userSelect: 'none'
            }}
          >
            {showPassword ? '🙈' : '👁️'}  
          </span> 
          <button type="submit" className="button">Log In</button>
        </form>
        <p>
          Don’t have an account?{' '}
          <Link to="/register" className="link">Register</Link>
        </p>
        <p>
          <Link to="/reset-password" className="link">Forgot Password?</Link>
        </p>
      </div>
    </div>
  );
}

export default Login;
