
 import React, { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import logo from '../assets/image.png';
import './pages.css';

function Register() {
  const [formData, setFormData] = useState({
    role: '',
    fullName: '',
    email: '',
    password: '',
  });
  const [error, setError] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [acceptedTerms, setAcceptedTerms] = useState(false);
  const [showPassword, setShowPassword] = useState(false);
  const navigate = useNavigate();

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');

    if (!acceptedTerms) {
      setError('You must accept the Terms and Conditions to register.');
      return;
    }

    setIsSubmitting(true);

    try {
      const res = await fetch('https://supreme-train-pjpvw497vvqqf7559-5000.app.github.dev/api/auth/register', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(formData),
      });

      const data = await res.json();
      if (!res.ok) throw new Error(data.error || 'Failed to register');

      // Save userId locally
      localStorage.setItem('userId', data.user.id);

      // Redirect based on role
      if (formData.role === 'tutor') {
        navigate('/tutordetails');
      } else {
        navigate('/login', { state: { registrationSuccess: true } });
      }
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
          <input type="text" name="fullName" placeholder="Full Name" className="input" value={formData.fullName} onChange={handleChange} required />
          <input type="email" name="email" placeholder="Email" className="input" value={formData.email} onChange={handleChange} required />
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
            <span onClick={() => setShowPassword((prev) => !prev)} style={{ marginLeft: '-30px', cursor: 'pointer', fontSize: '18px', color: '#555', userSelect: 'none' }}>
              {showPassword ? '🙈' : '👁️'}
            </span>
          </div>

          <div style={{ position: 'relative', marginBottom: '16px' }}>
            <select
              name="role"
              value={formData.role}
              onChange={handleChange}
              required
              style={{ width: '100%', padding: '12px 16px', borderRadius: '6px', border: '1px solid #ccc', fontSize: '16px', color: formData.role ? '#000' : '#888', appearance: 'none', outline: 'none', boxSizing: 'border-box' }}
            >
              <option value="" disabled hidden>Select your role</option>
              <option value="student">Student</option>
              <option value="tutor">Tutor</option>
            </select>
            <span style={{ position: 'absolute', right: '12px', top: '50%', transform: 'translateY(-50%)', pointerEvents: 'none', fontSize: '14px', color: '#555' }}>▼</span>
          </div>

          <div style={{ margin: '16px 0', textAlign: 'left' }}>
            <label style={{ display: 'flex', alignItems: 'center', fontSize: '1rem', cursor: 'pointer' }}>
              <input type="checkbox" checked={acceptedTerms} onChange={(e) => setAcceptedTerms(e.target.checked)} style={{ marginRight: '12px', width: '18px', height: '18px', accentColor: '#007bff' }} required />
              I accept <a href="/terms" target="_blank" rel="noopener noreferrer" style={{ color: '#2563eb', textDecoration: 'underline', marginLeft: 4 }}>Terms & Conditions</a>
            </label>
          </div>

          <button type="submit" disabled={isSubmitting} className="button">
            {isSubmitting ? 'Registering...' : 'Register'}
          </button>
        </form>
        <p>Already have an account? <Link to="/login" className="link">Login here</Link></p>
      </div>
    </div>
  );
}

export default Register;
