import React, { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import logo from '../assets/image.png';
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
  const [showPassword, setShowPassword] = useState(false);
  const navigate = useNavigate();

  // handle input change
  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prevData) => ({
      ...prevData,
      [name]: value,
    }));
  };

  // handle form submit
  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');

    if (!acceptedTerms) {
      setError('You must accept the Terms and Conditions to register.');
      return;
    }

    setIsSubmitting(true);

    try {
      const res = await fetch('https://tutorbackend-tr3q.onrender.com/api/auth/register', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(formData),
      });

      const data = await res.json();

      if (!res.ok) throw new Error(data.error || 'Failed to register');

      navigate('/login', { state: { registrationSuccess: true } });
    } catch (err) {
      setError(err.message);
    } finally {
      setIsSubmitting(false);
    }
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

          <div style={{ display: 'flex', alignItems: 'center' }}>
            <input
              type={showPassword ? 'text' : 'password'}
              name="password"
              className="input"
              placeholder="Password (min 6 characters)"
              value={formData.password}
              onChange={handleChange}
              minLength="6"
              required
              style={{ flex: 1 }}
            />
            <span
              className="toggle-eye"
              onClick={() => setShowPassword((prev) => !prev)}
              style={{
                marginLeft: '-30px',
                cursor: 'pointer',
                fontSize: '18px',
                color: '#555',
                userSelect: 'none',
              }}
            >
              {showPassword ? '🙈' : '👁️'}
            </span>
          </div>

          <select
            name="role"
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

          <div style={{ margin: '16px 0', textAlign: 'left' }}>
            <label
              style={{
                display: 'flex',
                alignItems: 'center',
                fontSize: '1rem',
                cursor: 'pointer',
              }}
            >
              <input
                type="checkbox"
                checked={acceptedTerms}
                onChange={(e) => setAcceptedTerms(e.target.checked)}
                style={{
                  marginRight: '12px',
                  width: '18px',
                  height: '18px',
                  accentColor: '#007bff',
                }}
                required
              />
              I accept{' '}
              <a
                href="/terms"
                target="_blank"
                rel="noopener noreferrer"
                style={{
                  color: '#2563eb',
                  textDecoration: 'underline',
                  marginLeft: 4,
                }}
              >
                Terms & Conditions
              </a>
            </label>
          </div>

          <button type="submit" disabled={isSubmitting} className="button">
            {isSubmitting ? 'Registering...' : 'Register'}
          </button>
        </form>

        <p>
          Already have an account?{' '}
          <Link to="/login" className="link">
            Login here
          </Link>
        </p>
      </div>
    </div>
  );
}

export default Register;
