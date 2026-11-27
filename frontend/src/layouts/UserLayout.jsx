/**
 * layouts/UserLayout.jsx
 * Wraps every logged-in user page: responsive sidebar + top bar + content area.
 */
import { useState } from 'react';
import { Outlet } from 'react-router-dom';
import Sidebar from '../components/Sidebar';
import { FaBars, FaBell } from 'react-icons/fa';
import { useAuth } from '../context/AuthContext';

const UserLayout = () => {
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const { user } = useAuth();

  return (
    <div className="app-shell">
      <Sidebar open={sidebarOpen} onClose={() => setSidebarOpen(false)} />

      <div className="app-main">
        <div className="topbar">
          <button className="topbar-burger" onClick={() => setSidebarOpen(true)} aria-label="Open menu">
            <FaBars />
          </button>
          <p className="topbar-title">
            Welcome back, <strong>{user?.name?.split(' ')[0]}</strong> 👋
          </p>
          <div className="topbar-right">
            <span className="topbar-bell">
              <FaBell />
            </span>
            <img
              src={user?.profileImage || `https://ui-avatars.com/api/?background=008CBA&color=fff&name=${encodeURIComponent(user?.name || 'U')}`}
              alt={user?.name}
              className="topbar-avatar"
            />
          </div>
        </div>

        <main className="app-content">
          <Outlet />
        </main>
      </div>
    </div>
  );
};

export default UserLayout;
