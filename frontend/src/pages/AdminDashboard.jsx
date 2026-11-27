/**
 * pages/AdminDashboard.jsx — platform-wide statistics + recent users.
 */
import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import API from '../services/api';
import StatCard from '../components/StatCard';
import Loader from '../components/Loader';
import { formatCurrency, formatDate } from '../utils/format';
import {
  FaUsers,
  FaSuitcase,
  FaBookOpen,
  FaMapMarkerAlt,
  FaWallet,
  FaArrowRight,
} from 'react-icons/fa';

export default function AdminDashboard() {
  const [stats, setStats] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    API.get('/admin/stats')
      .then(({ data }) => setStats(data))
      .catch(() => {})
      .finally(() => setLoading(false));
  }, []);

  if (loading) return <Loader />;

  return (
    <div className="page">
      <div className="welcome-banner admin-banner">
        <div>
          <h1>Admin Dashboard</h1>
          <p>Overview of the whole Travel Diary platform.</p>
        </div>
        <Link to="/admin/reports" className="btn btn-primary">
          View Reports <FaArrowRight />
        </Link>
      </div>

      <div className="stats-grid">
        <StatCard icon={<FaUsers />} label="Total Users" value={stats?.users ?? 0} color="#008CBA" />
        <StatCard icon={<FaSuitcase />} label="Total Trips" value={stats?.trips ?? 0} color="#8b5cf6" />
        <StatCard icon={<FaBookOpen />} label="Total Memories" value={stats?.memories ?? 0} color="#10b981" />
        <StatCard icon={<FaMapMarkerAlt />} label="Total Destinations" value={stats?.destinations ?? 0} color="#f59e0b" />
        <StatCard icon={<FaWallet />} label="Total Expenses" value={formatCurrency(stats?.totalExpense)} color="#ef4444" />
      </div>

      <div className="admin-dashboard-lower">
        <div className="card">
          <div className="card-head">
            <h3>Recently Registered Users</h3>
            <Link to="/admin/users" className="see-all">
              Manage users <FaArrowRight />
            </Link>
          </div>
          {stats?.recentUsers?.length === 0 ? (
            <p className="muted">No users yet.</p>
          ) : (
            <div className="table-wrap">
              <table className="table">
                <thead>
                  <tr>
                    <th>User</th>
                    <th>Email</th>
                    <th>Role</th>
                    <th>Joined</th>
                  </tr>
                </thead>
                <tbody>
                  {stats?.recentUsers?.map((u) => (
                    <tr key={u._id}>
                      <td>
                        <div className="table-user">
                          <img src={u.profileImage || `https://ui-avatars.com/api/?background=008CBA&color=fff&name=${encodeURIComponent(u.name)}`} alt={u.name} className="table-avatar" />
                          {u.name}
                        </div>
                      </td>
                      <td>{u.email}</td>
                      <td>
                        <span className={`badge ${u.role === 'admin' ? 'badge-dark' : 'badge-blue'}`}>{u.role}</span>
                      </td>
                      <td>{formatDate(u.createdAt)}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
