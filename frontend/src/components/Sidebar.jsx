/**
 * components/Sidebar.jsx — user dashboard sidebar (desktop fixed, mobile drawer).
 */
import { NavLink } from 'react-router-dom';
import {
  FaTachometerAlt,
  FaSuitcase,
  FaPlus,
  FaBookOpen,
  FaWallet,
  FaMapMarkerAlt,
  FaUserCircle,
  FaSignOutAlt,
  FaTimes,
  FaPlaneDeparture,
  FaCompass,
} from 'react-icons/fa';
import { useAuth } from '../context/AuthContext';

const Sidebar = ({ open, onClose }) => {
  const { user, logout } = useAuth();

  const links = [
    { to: '/dashboard', icon: <FaTachometerAlt />, label: 'Dashboard' },
    { to: '/trips', icon: <FaSuitcase />, label: 'My Trips' },
    { to: '/trips/add', icon: <FaPlus />, label: 'Add Trip' },
    { to: '/explore', icon: <FaCompass />, label: 'Explore' },
    { to: '/memories', icon: <FaBookOpen />, label: 'Memories' },
    { to: '/expenses', icon: <FaWallet />, label: 'Expenses' },
    { to: '/destinations', icon: <FaMapMarkerAlt />, label: 'Destinations' },
    { to: '/profile', icon: <FaUserCircle />, label: 'My Profile' },
  ];

  return (
    <>
      {open && <div className="sidebar-backdrop" onClick={onClose} />}
      <aside className={`sidebar ${open ? 'open' : ''}`}>
        <div className="sidebar-header">
          <NavLink to="/dashboard" className="brand brand-light" onClick={onClose}>
            <span className="brand-icon">
              <FaPlaneDeparture />
            </span>
            <span className="brand-text">
              Travel <span>Diary</span>
            </span>
          </NavLink>
          <button className="sidebar-close" onClick={onClose} aria-label="Close menu">
            <FaTimes />
          </button>
        </div>

        <nav className="sidebar-links">
          {links.map((l) => (
            <NavLink
              key={l.to}
              to={l.to}
              end={l.to === '/dashboard'}
              className={({ isActive }) => `sidebar-link ${isActive ? 'active' : ''}`}
              onClick={onClose}
            >
              <span className="sidebar-icon">{l.icon}</span>
              {l.label}
            </NavLink>
          ))}
        </nav>

        <div className="sidebar-footer">
          <div className="sidebar-user">
            <img
              src={user?.profileImage || `https://ui-avatars.com/api/?background=008CBA&color=fff&name=${encodeURIComponent(user?.name || 'U')}`}
              alt={user?.name}
              className="sidebar-avatar"
            />
            <div>
              <p className="sidebar-username">{user?.name}</p>
              <p className="sidebar-email">{user?.email}</p>
            </div>
          </div>
          <button className="btn btn-danger-outline btn-sm btn-block" onClick={logout}>
            <FaSignOutAlt /> Logout
          </button>
        </div>
      </aside>
    </>
  );
};

export default Sidebar;
