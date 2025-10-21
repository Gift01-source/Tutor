import React, { useState } from 'react';
import { useSearchParams, Link } from 'react-router-dom';
import './pages.css';

function NewPassword() {
  const [searchParams] = useSearchParams();
  const token = searchParams.get('token'); // token passed in the URL
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [submitted, setSubmitted] = useState(false);
  const [message, setMessage] = useState('');
  const [error, setError] = useState('');

  const API_URL = 'http://localhost:5000/api/reset';

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setMessage('');

    if (password !== confirmPassword) {
      setError("Passwords don't match");
      return;
    }

    try {
      const res = await fetch(`${API_URL}/reset`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ token, password }),
      });

      const data = await res.json();

      if (res.ok) {
        setSubmitted(true);
        setMessage('✅ Password has been reset successfully!');
      } else {
        setError(data.error || 'Failed to reset password');
      }
    } catch (err) {
      console.error(err);
      setError('Network error. Please try again.');
    }
  };

  return (
    <div
      className="landing-container"
      style={{
        background: '#f9fafb',
        minHeight: '100vh',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
      }}
    >
      <div
        style={{
          background: '#fff',
          borderRadius: '18px',
          boxShadow: '0 2px 12px rgba(37,99,235,0.10)',
          padding: '40px 32px',
          maxWidth: '400px',
          width: '90%',
          textAlign: 'center',
        }}
      >
        <h1
          style={{
            fontSize: '2rem',
            fontWeight: 'bold',
            color: '#2563eb',
            marginBottom: '1rem',
          }}
        >
          Set New Password
        </h1>

        {!submitted ? (
          <form onSubmit={handleSubmit}>
            <input
              type="password"
              placeholder="New Password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required
              style={{
                width: '100%',
                padding: '12px',
                borderRadius: '8px',
                border: '1px solid #cbd5e1',
                marginBottom: '1rem',
                outline: 'none',
              }}
            />
            <input
              type="password"
              placeholder="Confirm Password"
              value={confirmPassword}
              onChange={(e) => setConfirmPassword(e.target.value)}
              required
              style={{
                width: '100%',
                padding: '12px',
                borderRadius: '8px',
                border: '1px solid #cbd5e1',
                marginBottom: '1.2rem',
                outline: 'none',
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
                cursor: 'pointer',
              }}
            >
              Reset Password
            </button>
          </form>
        ) : (
          <div style={{ color: '#16a34a', fontWeight: '600', marginTop: '1rem' }}>
            {message}
          </div>
        )}

        {error && (
          <div style={{ color: '#b91c1c', fontWeight: '600', marginTop: '1rem' }}>
            ❌ {error}
          </div>
        )}

        <div style={{ marginTop: '2rem' }}>
          <Link
            to="/login"
            style={{ color: '#2563eb', textDecoration: 'underline', fontWeight: '500' }}
          >
            Back to Login
          </Link>
        </div>
      </div>
    </div>
  );
}

export default NewPassword;
