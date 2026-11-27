/**
 * components/AdminSidebar.jsx — admin panel sidebar.
 */
import { NavLink } from 'react-router-dom';
import {
  FaTachometerAlt,
  FaUsers,
  FaSuitcase,
  FaBookOpen,
  FaChartBar,
  FaCog,
  FaSignOutAlt,
  FaTimes,
  FaShieldAlt,
} from 'react-icons/fa';
import { useAuth } from '../context/AuthContext';

const AdminSidebar = ({ open, onClose }) => {
  const { user, logout } = useAuth();

  const links = [
    { to: '/admin', icon: <FaTachometerAlt />, label: 'Dashboard' },
    { to: '/admin/users', icon: <FaUsers />, label: 'Users' },
    { to: '/admin/trips', icon: <FaSuitcase />, label: 'Trips' },
    { to: '/admin/memories', icon: <FaBookOpen />, label: 'Memories' },
    { to: '/admin/reports', icon: <FaChartBar />, label: 'Reports' },
    { to: '/admin/settings', icon: <FaCog />, label: 'Settings' },
  ];

  return (
    <>
      {open && <div className="sidebar-backdrop" onClick={onClose} />}
      <aside className={`sidebar admin-sidebar ${open ? 'open' : ''}`}>
        <div className="sidebar-header">
          <NavLink to="/admin" className="brand brand-light" onClick={onClose}>
            <span className="brand-icon">
              <FaShieldAlt />
            </span>
            <span className="brand-text">
              Travel <span>Diary</span>
            </span>
          </NavLink>
          <button className="sidebar-close" onClick={onClose} aria-label="Close menu">
            <FaTimes />
          </button>
        </div>

        <p className="sidebar-section-label">Admin Panel</p>
        <nav className="sidebar-links">
          {links.map((l) => (
            <NavLink
              key={l.to}
              to={l.to}
              end={l.to === '/admin'}
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
              src={user?.profileImage || `https://ui-avatars.com/api/?background=008CBA&color=fff&name=${encodeURIComponent(user?.name || 'A')}`}
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

export default AdminSidebar;
