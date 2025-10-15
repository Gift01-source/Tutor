import React from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { FaBook, FaMoneyBillWave, FaBolt } from 'react-icons/fa'; // FaBolt as app symbol

function Navbar({ role }) {
  const navigate = useNavigate();
  const [darkMode, setDarkMode] = React.useState(() => localStorage.getItem('darkMode') === 'true');
  const [menuOpen, setMenuOpen] = React.useState(false);
  const [lang, setLang] = React.useState(localStorage.getItem('lang') || 'en');
  const [clickedLink, setClickedLink] = React.useState('');
  const [showAppName, setShowAppName] = React.useState(false);

  React.useEffect(() => {
    if (darkMode) {
      document.documentElement.classList.add('dark');
      document.body.classList.add('dark');
    } else {
      document.documentElement.classList.remove('dark');
      document.body.classList.remove('dark');
    }
    localStorage.setItem('darkMode', darkMode);
  }, [darkMode]);

  const handleLogout = () => {
    localStorage.clear();
    navigate('/login');
  };

  const toggleDarkMode = () => setDarkMode(dm => !dm);

  const handleLangChange = (e) => {
    setLang(e.target.value);
    localStorage.setItem('lang', e.target.value);
    window.location.reload();
  };

  // Main links based on role
  let mainLinks = [];
  let extraLinks = [];
  if (role === 'tutor') {
    mainLinks = [
      { icon: <FaBook />, label: 'My Sessions', to: '/tutor-sessions' },
      { icon: <FaBook />, label: 'Tutorials', to: '/tutor-upload' },
      { icon: <FaMoneyBillWave />, label: 'Payment', to: '/payment' },
    ];
    extraLinks = [
      { label: 'Profile', to: '/tutor-profile/' + (localStorage.getItem('userId') || '') },
      { label: 'Referral', to: '/referral' },
      { label: 'Help Center', to: '/help' },
    ];
  } else {
    mainLinks = [
      { icon: <FaBook />, label: 'Book Session', to: '/book-session' },
      { icon: <FaBook />, label: 'Tutorials', to: '/student-tutorials' },
      { icon: <FaMoneyBillWave />, label: 'Payment', to: '/payment' },
    ];
    extraLinks = [
      { label: 'Profile', to: '/student-profile' },
      { label: 'Referral', to: '/referral' },
      { label: 'Help Center', to: '/help' },
    ];
  }

  const handleMobileClick = (label) => {
    setClickedLink(label);
    setTimeout(() => setClickedLink(''), 2000);
  };

  return (
    <nav className={`navbar${darkMode ? ' dark' : ''}`}> {/* Use class for dark mode */}
      {/* Logo as symbol */}
      <div
        className="navbar-logo"
        style={logoStyle}
        onMouseEnter={() => setShowAppName(true)}
        onMouseLeave={() => setShowAppName(false)}
        onClick={() => setShowAppName(prev => !prev)}
      >
        <Link to={role === 'tutor' ? '/tutor-dashboard' : '/student-dashboard'} style={logoLinkStyle}>
          <FaBolt size={28} title="Pakachere App" />
        </Link>
        {showAppName && (
          <span style={appNameStyle}>Pakachere</span>
        )}
      </div>

      {/* Desktop Navbar: show all links */}
      <div className="desktop-menu">
        {mainLinks.map(link => (
          <Link key={link.label} to={link.to} className="navbar-link">{link.icon} {link.label}</Link>
        ))}
        {extraLinks.map(link => (
          <Link key={link.label} to={link.to} className="navbar-link">{link.label}</Link>
        ))}
        <select value={lang} onChange={handleLangChange} className="navbar-select">
          <option value="en">EN</option>
          <option value="es">ES</option>
          <option value="fr">FR</option>
          <option value="de">DE</option>
          <option value="ny">Chic</option>
          <option value="sw">Swah</option>
        </select>
        <button onClick={toggleDarkMode} className="navbar-btn">{darkMode ? 'Light Mode' : 'Dark Mode'}</button>
        <button onClick={handleLogout} className="navbar-btn">Logout</button>
      </div>

      {/* Mobile Navbar: show only Book Session, Tutorials, Payment, rest in hamburger */}
      <div className="navbar-mobile-menu">
        {mainLinks.map(link => (
          <div key={link.label} className="navbar-mobile-icon-wrapper">
            <Link
              to={link.to}
              onClick={() => handleMobileClick(link.label)}
              className="navbar-mobile-link"
              style={{ fontSize: '1rem', color: '#2563eb', textDecoration: 'none', fontWeight: 600, padding: '8px 0' }}
            >
              {link.label}
            </Link>
          </div>
        ))}
        {/* Hamburger for extra links */}
        <button onClick={() => setMenuOpen(m => !m)} className="navbar-hamburger">&#9776;</button>
        {menuOpen && (
          <div className="navbar-dropdown" style={{ background: darkMode ? '#1e293b' : '#fff' }}>
            {extraLinks.map(link => (
              <Link key={link.label} to={link.to} className="navbar-dropdown-link" onClick={() => setMenuOpen(false)}>{link.label}</Link>
            ))}
            <select value={lang} onChange={handleLangChange} className="navbar-select">
              <option value="en">EN</option>
              <option value="es">ES</option>
              <option value="fr">FR</option>
              <option value="de">DE</option>
              <option value="ny">Chic</option>
              <option value="sw">Swah</option>
            </select>
            <button onClick={toggleDarkMode} className="navbar-btn">{darkMode ? 'Light Mode' : 'Dark Mode'}</button>
            <button onClick={() => { handleLogout(); setMenuOpen(false); }} className="navbar-btn">Logout</button>
          </div>
        )}
      </div>
    </nav>
  );
}

/* ----- Styles ----- */
const navbarStyle = {
  display: 'flex',
  justifyContent: 'space-between',
  alignItems: 'center',
  padding: '0.5rem 1rem',
  background: '#f9fafb',
  borderBottom: '1px solid #e5e7eb',
  position: 'relative'
};

const logoStyle = {
  flex: 1,
  position: 'relative',
  display: 'flex',
  alignItems: 'center',
  cursor: 'pointer'
};
const logoLinkStyle = { textDecoration: 'none', color: '#2563eb', display: 'flex', alignItems: 'center' };
const appNameStyle = {
  position: 'absolute',
  top: '40px',
  left: '0',
  background: '#2563eb',
  color: '#fff',
  padding: '2px 6px',
  borderRadius: 4,
  fontSize: '0.85rem',
  whiteSpace: 'nowrap',
};

const desktopMenuStyle = { display: 'flex', alignItems: 'center', gap: '1rem' };
const desktopLinkStyle = {
  display: 'flex',
  alignItems: 'center',
  gap: '0.3rem',
  textDecoration: 'none',
  color: '#222',
  fontSize: '1rem',
  padding: '6px 10px',
  borderRadius: 6,
  transition: 'all 0.2s ease',
  cursor: 'pointer'
};

const mobileMenuStyle = { display: 'flex', alignItems: 'center', gap: '1rem', flexWrap: 'nowrap' };
const mobileIconWrapper = { position: 'relative', display: 'flex', flexDirection: 'column', alignItems: 'center', cursor: 'pointer' };
const mobileLinkStyle = { fontSize: '1.8rem', color: '#2563eb', textDecoration: 'none', transition: 'transform 0.2s ease' };
const mobileLabelStyle = { position: 'absolute', top: '-28px', background: '#2563eb', color: '#fff', padding: '2px 6px', borderRadius: 4, fontSize: '0.75rem', whiteSpace: 'nowrap' };
const selectStyle = { padding: '4px 8px', borderRadius: 6, margin: '0.25rem 0', cursor: 'pointer' };
const buttonStyle = { padding: '6px 12px', borderRadius: 6, cursor: 'pointer', background: '#2563eb', color: '#fff', border: 'none', margin: '0.25rem 0', transition: 'all 0.2s ease' };
const hamburgerStyle = { fontSize: '2rem', background: 'none', border: 'none', cursor: 'pointer', color: '#2563eb' };
const mobileDropdownStyle = { position: 'absolute', top: '60px', right: '16px', minWidth: '200px', borderRadius: 8, padding: '12px 0', boxShadow: '0 8px 24px rgba(0,0,0,0.15)', display: 'flex', flexDirection: 'column', gap: '0.5rem', zIndex: 9999 };
const mobileDropdownLinkStyle = (darkMode) => ({ padding: '6px 12px', color: darkMode ? '#fff' : '#222', textDecoration: 'none', fontSize: '1rem', transition: 'background 0.2s' });

export default Navbar;
