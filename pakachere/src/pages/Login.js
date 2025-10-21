import React, { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import logo from '../assets/image.png';
import './pages.css';

function Login() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const navigate = useNavigate();
  const [showPassword, setShowPassword] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();

    try {
      const res = await fetch(
        "https://tutorbackend-tr3q.onrender.comv/api/auth/login",
        {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ email, password }),
        }
      );

      const data = await res.json();
      if (!res.ok) throw new Error(data.error || "Login failed");

      localStorage.setItem("token", data.token);
      localStorage.setItem("role", data.user.role);
       localStorage.setItem("userId", data.user.id);
      localStorage.setItem("role", data.user.role);
      localStorage.setItem("fullName", data.user.fullName);
      localStorage.setItem("email", data.user.email);  // add this line

      localStorage.setItem("tutorDetails", JSON.stringify(data.user.tutorDetails || null));
      

      if (data.user.role === "tutor") {
        navigate("/tutor-dashboard");
        alert("Login successful!");
      } else {
        navigate("/student-dashboard");
        alert("Login successful!");
      }
    } catch (err) {
      alert(err.message);
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
