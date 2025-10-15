import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import './pages.css';

function ResetPassword() {
  const [email, setEmail] = useState('');
  const [submitted, setSubmitted] = useState(false);

  const handleSubmit = (e) => {
    e.preventDefault();
    setTimeout(() => {
      setSubmitted(true);
    }, 1000);
  };

  return (
    <div className="landing-container" style={{ background: '#f9fafb', minHeight: '100vh', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
      <div style={{
        background: '#fff',
        borderRadius: '18px',
        boxShadow: '0 2px 12px rgba(37,99,235,0.10)',
        padding: '40px 32px',
        maxWidth: '400px',
        width: '90%',
        textAlign: 'center'
      }}>
        <h1 style={{ fontSize: '2rem', fontWeight: 'bold', color: '#2563eb', marginBottom: '1rem' }}>Reset Password</h1>
        <p style={{ color: '#2563eb', marginBottom: '2rem' }}>
          Enter your registered email address and we’ll send you a reset link.
        </p>

        {!submitted ? (
          <form onSubmit={handleSubmit}>
            <input
              type="email"
              placeholder="Enter your email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
              style={{
                width: '100%',
                padding: '12px',
                borderRadius: '8px',
                border: '1px solid #cbd5e1',
                marginBottom: '1.2rem',
                outline: 'none'
              }}
            />
            <button
              type="submit"
              style={{
                width: '100%',
                padding: '12px',
                borderRadius: '32px',
                background: '#2563eb',
                color: '#fff',
                fontWeight: 'bold',
                boxShadow: '0 4px 24px rgba(37,99,235,0.18)',
                cursor: 'pointer'
              }}
            >
              Send Reset Link
            </button>
          </form>
        ) : (
          <div style={{ color: '#16a34a', fontWeight: '600', marginTop: '1rem' }}>
            ✅ Reset link sent to <strong>{email}</strong>
          </div>
        )}

        <div style={{ marginTop: '2rem' }}>
          <Link to="/login" style={{ color: '#2563eb', textDecoration: 'underline', fontWeight: '500' }}>
            Back to Login
          </Link>
        </div>
      </div>
    </div>
  );
}

export default ResetPassword;
