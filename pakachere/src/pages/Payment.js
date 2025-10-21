import React, { useState } from 'react';
import './pages.css';

const countryOptions = [
  { code: '+265', flag: '🇲🇼', name: 'Malawi' },
  { code: '+267', flag: '🇧🇼', name: 'Botswana' },
  { code: '+268', flag: '🇸🇿', name: 'Eswatini' },
];

function Payment() {
  const [method, setMethod] = useState('');
  const [amount, setAmount] = useState(null);
  const [bank, setBank] = useState('');
  const [accountNumber, setAccountNumber] = useState('');
  const [mobileProvider, setMobileProvider] = useState('');
  const [mobileNumber, setMobileNumber] = useState('');
  const [countryCode, setCountryCode] = useState(countryOptions[0].code);
  const [processing, setProcessing] = useState(false);

  const sessionOptions = [
    { label: '1 Session (1 hr)', value: 2000 },
    { label: '3 Sessions', value: 5000 },
  ];

  const bankOptions = ['National Bank of Malawi', 'FDH Bank', 'Standard Bank', 'NBS Bank'];
  const mobileOptions = ['Airtel Money', 'TNM Mpamba'];

  // ----------- Connect to Backend & Flutterwave -----------
  const handlePayment = async (e) => {
    e.preventDefault();
    if (!amount || !method) return alert("Select amount & method");
    setProcessing(true);

    const payload = {
      method,
      amount,
      bank,
      account_number: accountNumber,
      mobile_provider: mobileProvider,
      mobile_number: mobileNumber,
      country_code: countryCode,
      name: "Student",
      email: "student@example.com"
    };

    try {
      const res = await fetch("https://tutorbackend-tr3q.onrender.com/api/payments", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload)
      });
      const data = await res.json();
      if (res.ok) {
        setProcessing(false);
        // Redirect to Flutterwave checkout page
        window.location.href = data.payment_link;
      } else {
        setProcessing(false);
        alert(data.error || "Payment failed");
      }
    } catch (err) {
      setProcessing(false);
      console.error(err);
      alert("Payment failed. Check backend connection.");
    }
  };

  return (
    <div className="landing-container payment-root" style={{ background: '#f9fafb', minHeight: '100vh', display: 'flex', justifyContent: 'center', alignItems: 'center', padding: '1rem' }}>
      <div className="payment-card" style={{ background: '#fff', borderRadius: '18px', boxShadow: '0 2px 12px rgba(37,99,235,0.10)', padding: '32px 24px', maxWidth: '380px', width: '100%', textAlign: 'center' }}>
        <h1 style={{ fontSize: '1.8rem', fontWeight: 'bold', color: '#2563eb', marginBottom: '1rem' }}>Payment</h1>
        <p style={{ color: '#2563eb', marginBottom: '1.5rem' }}>Choose a session package and payment method</p>

        <div className="session-cards" style={{ display: 'flex', gap: '0.8rem', justifyContent: 'center', flexWrap: 'wrap', marginBottom: '1.2rem' }}>
          {sessionOptions.map((option) => (
            <div key={option.value} onClick={() => setAmount(option.value)} style={cardStyle(option.value === amount)}>
              <p style={{ fontWeight: '600', marginBottom: '0.3rem', fontSize: '0.95rem' }}>{option.label}</p>
              <p style={{ fontSize: '0.9rem' }}>K{option.value.toLocaleString()}</p>
            </div>
          ))}
        </div>

        <div className="payment-methods" style={{ display: 'flex', gap: '0.8rem', justifyContent: 'center', flexWrap: 'wrap', marginBottom: '1.2rem' }}>
          <PaymentCard title="Bank" image="https://cdn-icons-png.flaticon.com/512/4228/4228706.png" selected={method === 'bank'} onClick={() => setMethod('bank')} />
          <PaymentCard title="Mobile Money" image="https://cdn-icons-png.flaticon.com/512/2821/2821637.png" selected={method === 'mobile'} onClick={() => setMethod('mobile')} />
        </div>

        {method && (
          <form onSubmit={handlePayment} style={{ textAlign: 'left', marginTop: '1rem' }}>
            {method === 'bank' && (
              <>
                <label style={labelStyle}>Select Bank</label>
                <select value={bank} onChange={(e) => setBank(e.target.value)} required style={inputStyle}>
                  <option value="">Choose Bank</option>
                  {bankOptions.map((b) => <option key={b}>{b}</option>)}
                </select>

                <label style={labelStyle}>Account Number</label>
                <input type="text" placeholder="Enter your account number" value={accountNumber} onChange={(e) => setAccountNumber(e.target.value)} required style={inputStyle} />
              </>
            )}

            {method === 'mobile' && (
              <>
                <label style={labelStyle}>Mobile Money Provider</label>
                <select value={mobileProvider} onChange={(e) => setMobileProvider(e.target.value)} required style={inputStyle}>
                  <option value="">Choose Provider</option>
                  {mobileOptions.map((m) => <option key={m}>{m}</option>)}
                </select>

                <label style={labelStyle}>Mobile Number</label>
                <div style={{ display: 'flex', gap: '0.5rem', marginBottom: '1rem' }}>
                  <select value={countryCode} onChange={(e) => setCountryCode(e.target.value)} style={countryInputStyle}>
                    {countryOptions.map((c) => (
                      <option key={c.code} value={c.code}>{c.flag} {c.code}</option>
                    ))}
                  </select>
                  <input type="text" placeholder="Enter number" value={mobileNumber} onChange={(e) => setMobileNumber(e.target.value)} required style={{ ...inputStyle, flex: 1 }} />
                </div>
              </>
            )}

            {amount && method && (
              <button type="submit" disabled={processing} style={payButtonStyle(processing)}>
                {processing ? 'Processing...' : `Pay K${amount.toLocaleString()} via ${method === 'bank' ? 'Bank' : 'Mobile Money'}`}
              </button>
            )}
          </form>
        )}
      </div>
    </div>
  );
}

// ---------------- Styles ----------------
const cardStyle = (selected) => ({
  flex: '0 0 45%',
  background: selected ? '#2563eb' : '#fff',
  color: selected ? '#fff' : '#2563eb',
  border: '2px solid #2563eb',
  borderRadius: '16px',
  padding: '12px',
  textAlign: 'center',
  cursor: 'pointer',
  boxShadow: selected ? '0 4px 24px rgba(37,99,235,0.18)' : '0 2px 8px rgba(37,99,235,0.08)',
  transition: 'all 0.3s ease',
  minWidth: '120px',
});

const inputStyle = {
  width: '100%',
  padding: '10px',
  borderRadius: '8px',
  border: '1px solid #cbd5e1',
  outline: 'none',
  fontSize: '0.95rem',
  marginBottom: '0.8rem',
};

const labelStyle = {
  fontWeight: '500',
  color: '#2563eb',
  marginBottom: '0.2rem',
  display: 'block',
  fontSize: '0.95rem',
};

const countryInputStyle = {
  flex: '0 0 35%',
  padding: '10px',
  borderRadius: '8px',
  border: '1px solid #cbd5e1',
  outline: 'none',
  fontSize: '0.95rem',
  backgroundColor: '#fff',
  cursor: 'pointer',
};

const PaymentCard = ({ title, image, selected, onClick }) => (
  <div onClick={onClick} style={{
    flex: '0 0 45%',
    background: selected ? '#2563eb' : '#fff',
    color: selected ? '#fff' : '#2563eb',
    border: '2px solid #2563eb',
    borderRadius: '16px',
    padding: '12px',
    textAlign: 'center',
    cursor: 'pointer',
    boxShadow: selected ? '0 4px 24px rgba(37,99,235,0.18)' : '0 2px 8px rgba(37,99,235,0.08)',
    transition: 'all 0.3s ease',
    minWidth: '140px',
    marginBottom: '0.5rem'
  }}>
    <img src={image} alt={title} style={{ width: '40px', height: '40px', marginBottom: '0.5rem' }} />
    <p style={{ fontWeight: '600', fontSize: '0.95rem' }}>{title}</p>
  </div>
);

const payButtonStyle = (processing) => ({
  width: '100%',
  padding: '12px',
  borderRadius: '32px',
  background: processing ? '#9ca3af' : '#16a34a',
  color: '#fff',
  fontWeight: 'bold',
  boxShadow: '0 4px 24px rgba(22,163,74,0.18)',
  cursor: processing ? 'not-allowed' : 'pointer',
  marginTop: '0.5rem',
  fontSize: '1rem',
  transition: 'all 0.3s',
});

export default Payment;
