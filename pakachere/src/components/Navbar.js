import React from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { FaBook, FaMoneyBillWave, FaBolt, FaHome, FaVideo } from 'react-icons/fa';

function Navbar({ role }) {
  const navigate = useNavigate();
  const [darkMode, setDarkMode] = React.useState(() => localStorage.getItem('darkMode') === 'true');
  const [menuOpen, setMenuOpen] = React.useState(false);
  const [lang, setLang] = React.useState(localStorage.getItem('lang') || 'en');
  const [clickedLink, setClickedLink] = React.useState('');
  const [showAppName, setShowAppName] = React.useState(false);

  React.useEffect(() => {
    document.documentElement.classList.toggle('dark', darkMode);
    document.body.classList.toggle('dark', darkMode);
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

  // Links
  let mainLinks = [];
  let extraLinks = [];

  if (role === 'tutor') {
    mainLinks = [
      { icon: <FaHome />, label: 'Home', to: '/tutor-dashboard' },
      { icon: <FaVideo />, label: 'Tutorials', to: '/tutor-upload' },
      { icon: <FaMoneyBillWave />, label: 'Payment', to: '/payment' },
    ];
    extraLinks = [
      { label: 'Profile', to: `/tutor-profile/${localStorage.getItem('userId') || ''}` },
      { label: 'Referral', to: '/referral' },
      { label: 'Help Center', to: '/help' },
    ];
  } else {
    mainLinks = [
      { icon: <FaHome />, label: 'Home', to: '/student-dashboard' },
      { icon: <FaBook />, label: 'Book', to: '/book-session' },
      { icon: <FaVideo />, label: 'Tutorials', to: '/student-tutorials' },
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
    <nav style={navbarStyle}>
      {/* Top bar */}
      <div style={topBarStyle}>
        {/* Left: Logo */}
        <div
          style={logoStyle}
          onMouseEnter={() => setShowAppName(true)}
          onMouseLeave={() => setShowAppName(false)}
        >
          <Link to={role === 'tutor' ? '/tutor-dashboard' : '/student-dashboard'} style={logoLinkStyle}>
            <FaBolt size={26} />
          </Link>
          {showAppName && <span style={appNameStyle}>Pakachere</span>}
        </div>

        {/* Right: Hamburger for sidebar */}
        <button onClick={() => setMenuOpen(m => !m)} style={hamburgerStyle}>
          &#9776;
        </button>
      </div>

      {/* Bottom Fixed Navbar */}
      <div style={mobileBarStyle}>
        {mainLinks.slice(0, 4).map(link => (
          <div key={link.label} style={mobileIconWrapper}>
            <Link
              to={link.to}
              onClick={() => handleMobileClick(link.label)}
              style={mobileLinkStyle}
            >
              {link.icon}
            </Link>
            {clickedLink === link.label && <span style={mobileLabelStyle}>{link.label}</span>}
          </div>
        ))}
      </div>

      {/* Sidebar Dropdown (Top Right) */}
      {menuOpen && (
        <div style={mobileDropdownStyle(darkMode)}>
          {extraLinks.map(link => (
            <Link
              key={link.label}
              to={link.to}
              style={mobileDropdownLinkStyle(darkMode)}
              onClick={() => setMenuOpen(false)}
            >
              {link.label}
            </Link>
          ))}
          <select value={lang} onChange={handleLangChange} style={selectStyle}>
            <option value="en">EN</option>
            <option value="ny">Chic</option>
            <option value="sw">Swah</option>
            <option value="fr">FR</option>
            <option value="de">DE</option>
          </select>
          <button onClick={toggleDarkMode} style={buttonStyle}>{darkMode ? 'Light' : 'Dark'}</button>
          <button onClick={() => { handleLogout(); setMenuOpen(false); }} style={buttonStyle}>Logout</button>
        </div>
      )}
    </nav>
  );
}

/* --- Styles --- */
const navbarStyle = { width: '100%', position: 'relative', background: '#fff', zIndex: 1000 };
const topBarStyle = { display: 'flex', justifyContent: 'space-between', alignItems: 'center', padding: '0 16px', height: '60px', borderBottom: '1px solid #e5e7eb' };
const logoStyle = { display: 'flex', alignItems: 'center', cursor: 'pointer' };
const logoLinkStyle = { textDecoration: 'none', color: '#2563eb', display: 'flex', alignItems: 'center' };
const appNameStyle = { marginLeft: '8px', background: '#2563eb', color: '#fff', padding: '2px 6px', borderRadius: 4, fontSize: '0.85rem' };
const hamburgerStyle = { fontSize: '1.8rem', background: 'none', border: 'none', cursor: 'pointer', color: '#2563eb' };
const mobileBarStyle = { position: 'fixed', bottom: 0, left: 0, width: '100%', display: 'flex', justifyContent: 'space-around', alignItems: 'center', background: '#f9fafb', borderTop: '1px solid #e5e7eb', padding: '0.5rem 0', zIndex: 999 };
const mobileIconWrapper = { display: 'flex', flexDirection: 'column', alignItems: 'center', position: 'relative' };
const mobileLinkStyle = { fontSize: '1.6rem', color: '#2563eb', textDecoration: 'none' };
const mobileLabelStyle = { position: 'absolute', bottom: '45px', background: '#2563eb', color: '#fff', padding: '2px 6px', borderRadius: 4, fontSize: '0.75rem' };
const mobileDropdownStyle = (darkMode) => ({ position: 'absolute', top: '60px', right: '10px', background: darkMode ? '#1e293b' : '#fff', padding: '12px 10px', borderRadius: 8, boxShadow: '0 8px 20px rgba(0,0,0,0.2)', display: 'flex', flexDirection: 'column', gap: '0.5rem', minWidth: '180px' });
const mobileDropdownLinkStyle = (darkMode) => ({ textDecoration: 'none', color: darkMode ? '#fff' : '#222', padding: '6px 10px' });
const selectStyle = { padding: '4px 8px', borderRadius: 6 };
const buttonStyle = { padding: '6px 12px', borderRadius: 6, background: '#2563eb', color: '#fff', border: 'none', cursor: 'pointer' };

export default Navbar;
