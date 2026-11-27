/**
 * components/Navbar.jsx — public site navigation (Home page only).
 * Shows Login/Register when logged out, or a Dashboard button when logged in.
 */
import { useState } from 'react';
import { Link } from 'react-router-dom';
import { FaPlaneDeparture, FaBars, FaTimes } from 'react-icons/fa';
import { useAuth } from '../context/AuthContext';

const Navbar = () => {
  const { user } = useAuth();
  const [open, setOpen] = useState(false);

  const links = [
    { label: 'Home', href: '#home' },
    { label: 'Features', href: '#features' },
    { label: 'About', href: '#about' },
  ];

  return (
    <header className="site-nav">
      <div className="container nav-inner">
        <Link to="/" className="brand" onClick={() => setOpen(false)}>
          <span className="brand-icon">
            <FaPlaneDeparture />
          </span>
          <span className="brand-text">
            Travel <span>Diary</span>
          </span>
        </Link>

        <nav className={`nav-links ${open ? 'open' : ''}`}>
          {links.map((l) => (
            <a key={l.href} href={l.href} onClick={() => setOpen(false)}>
              {l.label}
            </a>
          ))}
        </nav>

        <div className="nav-auth">
          {user ? (
            <Link to={user.role === 'admin' ? '/admin' : '/dashboard'} className="btn btn-primary btn-sm">
              Go to Dashboard
            </Link>
          ) : (
            <>
              <Link to="/login" className="btn btn-ghost btn-sm" onClick={() => setOpen(false)}>
                Login
              </Link>
              <Link to="/register" className="btn btn-primary btn-sm" onClick={() => setOpen(false)}>
                Register
              </Link>
            </>
          )}
        </div>

        <button className="nav-toggle" onClick={() => setOpen(!open)} aria-label="Toggle menu">
          {open ? <FaTimes /> : <FaBars />}
        </button>
      </div>
    </header>
  );
};

export default Navbar;
