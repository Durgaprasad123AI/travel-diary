/**
 * layouts/AdminLayout.jsx — same shell as UserLayout but with the admin sidebar.
 */
import { useState } from 'react';
import { Outlet } from 'react-router-dom';
import AdminSidebar from '../components/AdminSidebar';
import { FaBars } from 'react-icons/fa';
import { useAuth } from '../context/AuthContext';

const AdminLayout = () => {
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const { user } = useAuth();

  return (
    <div className="app-shell">
      <AdminSidebar open={sidebarOpen} onClose={() => setSidebarOpen(false)} />

      <div className="app-main">
        <div className="topbar admin-topbar">
          <button className="topbar-burger" onClick={() => setSidebarOpen(true)} aria-label="Open menu">
            <FaBars />
          </button>
          <p className="topbar-title">
            Admin Panel — <strong>{user?.name}</strong>
          </p>
          <div className="topbar-right">
            <img
              src={user?.profileImage || `https://ui-avatars.com/api/?background=008CBA&color=fff&name=${encodeURIComponent(user?.name || 'A')}`}
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

export default AdminLayout;
