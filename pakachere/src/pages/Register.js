import React, { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import logo from '../assets/image.png';
import API from '../api';
import './pages.css';

function Register() {
  const [formData, setFormData] = useState({
    role: 'student',
    fullName: '',
    email: '',
    password: '',
  });

  const [error, setError] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [acceptedTerms, setAcceptedTerms] = useState(false);
  const navigate = useNavigate();
  const [showPassword, setShowPassword] = useState(false);


  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prevData) => ({
      ...prevData,
      [name]: value,
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    if (!acceptedTerms) {
      setError('You must accept the Terms and Conditions to register.');
      return;
    }
    setIsSubmitting(true);

    // Simulate registration without backend
    const users = JSON.parse(localStorage.getItem('users') || '[]');
    users.push({
      email: formData.email,
      password: formData.password,
      name: formData.fullName,
      role: formData.role
    });
    localStorage.setItem('users', JSON.stringify(users));
    setTimeout(() => {
      setError('');
      navigate('/login', { state: { registrationSuccess: true } });
      setIsSubmitting(false);
    }, 1000);
  };

  return (
    <div className="page-container">
      <div className="form-box">
        <img src={logo} alt="App Logo" className="logo" />
        <h2 className="title">Create Account</h2>

        {error && <div className="error">{error}</div>}

        <form onSubmit={handleSubmit}>
          <input
            type="text"
            name="fullName"
            placeholder="Full Name"
            className="input"
            value={formData.fullName}
            onChange={handleChange}
            required
          />

          <input
            type="email"
            name="email"
            placeholder="Email"
            className="input"
            value={formData.email}
            onChange={handleChange}
            required
          />

          <input
            type={showPassword ? "text" : "password"}
            name="password"
            className="input"
            placeholder="Password (min 6 characters)"
            value={formData.password}
            onChange={handleChange}
            minLength="6"
            required
          />
          <span
            className="tongle-eye"
            onClick={() => setShowPassword((prev) => !prev)}
            style={{
              marginLeft: '-30px',
              zIndex: 1,
              cursor: 'pointer',
              fontSize: '18px',
              color: '#555',
              userSelect: 'none'
            }}
          >
            {showPassword ? '🙈' : '👁️'}  
          </span>         


         {/*
          <input
            type="password"
            name="password"
            placeholder="Password (min 6 characters)"
            className="input"
            value={formData.password}
            onChange={handleChange}
            minLength="6"
            required
          />*/}

          <select
            name="role"
            placeholder="Select Role"
            className="input"
            value={formData.role}
            onChange={handleChange}
            required
          >
            <option value="" disabled>
              Select Role
            </option>
            <option value="student">Student</option>
            <option value="tutor">Tutor</option>
          </select>

          {/*<div style={{margin:'10px', textAlign:'l'}}>
            <label style={{display:'flex', alignItems:'center', fontSize:'0.98rem'}}>
              <input
                type="checkbox"
                checked={acceptedTerms}
                onChange={e => setAcceptedTerms(e.target.checked)}
                style={{marginRight:8}}
                required
              />
              I accept the <a href="/terms" target="_blank" rel="noopener noreferrer" style={{color:'#2563eb', textDecoration:'underline', marginLeft:4}}>Terms and Conditions</a>
            </label>
          </div>*/}
         <div style={{ margin: '16px 0', textAlign: 'left' }}>
         <label style={{
           display: 'flex',
           alignItems: 'center',
           fontSize: '1rem',
           lineHeight: '1.5',
          cursor: 'pointer'
      }}>
    <input
      type="checkbox"
      checked={acceptedTerms}
      onChange={e => setAcceptedTerms(e.target.checked)}
      style={{
        marginRight: '12px',
        width: '18px',
        height: '18px',
        accentColor: '#007bff'
      }}
      required
    />
    I accept the<a href="/terms" target="_blank" rel="noopener noreferrer" style={{color:'#2563eb', textDecoration:'underline', marginLeft:4}}>Terms & Conditions</a>
  </label>
</div>


          <button type="submit" disabled={isSubmitting} className="button">
            {isSubmitting ? 'Registering...' : 'Register'}
          </button>
        </form>

        <p>
          Already have an account?{' '}
          <Link to="/Login" className="link">
            Login here
          </Link>
        </p>
       </div>
    </div>
  );
}

export default Register;