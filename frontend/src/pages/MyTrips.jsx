/**
 * pages/MyTrips.jsx — all trips of the logged-in user as cards,
 * with View / Edit / Delete and a delete confirmation dialog.
 */
import { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import API from '../services/api';
import TripCard from '../components/TripCard';
import ConfirmDialog from '../components/ConfirmDialog';
import Loader from '../components/Loader';
import { FaPlus } from 'react-icons/fa';

export default function MyTrips() {
  const navigate = useNavigate();
  const [trips, setTrips] = useState([]);
  const [loading, setLoading] = useState(true);
  const [deleteTarget, setDeleteTarget] = useState(null);
  const [deleting, setDeleting] = useState(false);

  const loadTrips = async () => {
    try {
      const { data } = await API.get('/trips');
      setTrips(data);
    } catch {
      setTrips([]);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadTrips();
  }, []);

  const confirmDelete = async () => {
    if (!deleteTarget) return;
    setDeleting(true);
    try {
      await API.delete(`/trips/${deleteTarget._id}`);
      setTrips((prev) => prev.filter((t) => t._id !== deleteTarget._id));
    } catch {
      // keep the dialog open on failure? simpler: close silently
    } finally {
      setDeleting(false);
      setDeleteTarget(null);
    }
  };

  if (loading) return <Loader />;

  return (
    <div className="page">
      <div className="page-header">
        <div>
          <h1>My Trips</h1>
          <p>All the journeys you've planned and lived.</p>
        </div>
        <Link to="/trips/add" className="btn btn-primary">
          <FaPlus /> Add New Trip
        </Link>
      </div>

      {trips.length === 0 ? (
        <div className="empty-state">
          <span className="empty-icon">🧳</span>
          <h3>No trips yet</h3>
          <p>Your adventures are waiting — plan your first trip now.</p>
          <Link to="/trips/add" className="btn btn-primary">
            <FaPlus /> Add Your First Trip
          </Link>
        </div>
      ) : (
        <div className="trips-grid">
          {trips.map((trip) => (
            <TripCard
              key={trip._id}
              trip={trip}
              onView={() => navigate(`/trips/${trip._id}`)}
              onEdit={() => navigate(`/trips/edit/${trip._id}`)}
              onDelete={() => setDeleteTarget(trip)}
            />
          ))}
        </div>
      )}

      <ConfirmDialog
        open={Boolean(deleteTarget)}
        title="Delete this trip?"
        message={`"${deleteTarget?.tripName}" and all its memories, expenses and places will be permanently removed.`}
        confirmText={deleting ? 'Deleting…' : 'Delete'}
        onConfirm={confirmDelete}
        onCancel={() => setDeleteTarget(null)}
      />
    </div>
  );
}
