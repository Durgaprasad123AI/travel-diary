/**
 * pages/Dashboard.jsx — logged-in user's home: stats + quick actions + recent trips.
 */
import { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import API from '../services/api';
import { useAuth } from '../context/AuthContext';
import StatCard from '../components/StatCard';
import TripCard from '../components/TripCard';
import Loader from '../components/Loader';
import { formatCurrency } from '../utils/format';
import {
  FaSuitcase,
  FaMapMarkerAlt,
  FaWallet,
  FaBookOpen,
  FaPlus,
  FaUserCircle,
  FaArrowRight,
} from 'react-icons/fa';

const QUICK_ACTIONS = [
  { to: '/trips/add', icon: <FaPlus />, label: 'Add New Trip', color: '#008CBA' },
  { to: '/trips', icon: <FaSuitcase />, label: 'My Trips', color: '#8b5cf6' },
  { to: '/memories/add', icon: <FaBookOpen />, label: 'Add Travel Memory', color: '#10b981' },
  { to: '/expenses', icon: <FaWallet />, label: 'View Expenses', color: '#f59e0b' },
  { to: '/destinations', icon: <FaMapMarkerAlt />, label: 'Destinations', color: '#ef4444' },
  { to: '/profile', icon: <FaUserCircle />, label: 'My Profile', color: '#172033' },
];

export default function Dashboard() {
  const { user } = useAuth();
  const navigate = useNavigate();
  const [profile, setProfile] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    API.get('/users/profile')
      .then(({ data }) => setProfile(data))
      .catch(() => {})
      .finally(() => setLoading(false));
  }, []);

  if (loading) return <Loader />;

  const stats = profile?.stats || {};
  const recentTrips = profile?.recentTrips || [];

  return (
    <div className="page">
      {/* Welcome banner */}
      <div className="welcome-banner">
        <div>
          <h1>Hello, {profile?.name} 👋</h1>
          <p>Here's what your travel diary looks like today.</p>
        </div>
        <Link to="/trips/add" className="btn btn-primary">
          <FaPlus /> New Trip
        </Link>
      </div>

      {/* Stats */}
      <div className="stats-grid">
        <StatCard icon={<FaSuitcase />} label="Total Trips" value={stats.trips ?? 0} color="#008CBA" />
        <StatCard icon={<FaMapMarkerAlt />} label="Total Destinations" value={stats.destinations ?? 0} color="#8b5cf6" />
        <StatCard icon={<FaWallet />} label="Total Expenses" value={formatCurrency(stats.totalExpense)} color="#f59e0b" />
        <StatCard icon={<FaBookOpen />} label="Memories" value={stats.memories ?? 0} color="#10b981" />
      </div>

      {/* Quick actions */}
      <div className="quick-actions">
        {QUICK_ACTIONS.map((a) => (
          <Link key={a.to} to={a.to} className="quick-action">
            <span className="quick-action-icon" style={{ backgroundColor: `${a.color}18`, color: a.color }}>
              {a.icon}
            </span>
            <span>{a.label}</span>
            <FaArrowRight className="quick-action-arrow" />
          </Link>
        ))}
      </div>

      {/* Recent trips */}
      <div className="section-row">
        <div className="section-row-head">
          <h2>Recent Trips</h2>
          {recentTrips.length > 0 && (
            <Link to="/trips" className="see-all">
              See all <FaArrowRight />
            </Link>
          )}
        </div>

        {recentTrips.length === 0 ? (
          <div className="empty-state">
            <span className="empty-icon">🧳</span>
            <h3>No trips yet</h3>
            <p>Plan your first journey and start your travel diary.</p>
            <Link to="/trips/add" className="btn btn-primary">
              <FaPlus /> Add Your First Trip
            </Link>
          </div>
        ) : (
          <div className="trips-grid">
            {recentTrips.map((trip) => (
              <TripCard
                key={trip._id}
                trip={trip}
                onView={() => navigate(`/trips/${trip._id}`)}
                onEdit={() => navigate(`/trips/edit/${trip._id}`)}
                onDelete={() => navigate(`/trips`)}
              />
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
