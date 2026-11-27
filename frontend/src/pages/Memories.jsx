/**
 * pages/Memories.jsx — all diary memories in a beautiful card grid,
 * with optional trip filter, edit and delete.
 */
import { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import API from '../services/api';
import MemoryCard from '../components/MemoryCard';
import ConfirmDialog from '../components/ConfirmDialog';
import Loader from '../components/Loader';
import { FaPlus } from 'react-icons/fa';

export default function Memories() {
  const navigate = useNavigate();
  const [memories, setMemories] = useState([]);
  const [trips, setTrips] = useState([]);
  const [tripFilter, setTripFilter] = useState('');
  const [loading, setLoading] = useState(true);
  const [deleteTarget, setDeleteTarget] = useState(null);

  const load = async (tripId = tripFilter) => {
    setLoading(true);
    try {
      const params = tripId ? { params: { tripId } } : {};
      const { data } = await API.get('/memories', params);
      setMemories(data);
    } catch {
      setMemories([]);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    API.get('/trips')
      .then(({ data }) => setTrips(data))
      .catch(() => {});
    load('');
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const confirmDelete = async () => {
    if (!deleteTarget) return;
    try {
      await API.delete(`/memories/${deleteTarget._id}`);
      setMemories((prev) => prev.filter((m) => m._id !== deleteTarget._id));
    } finally {
      setDeleteTarget(null);
    }
  };

  return (
    <div className="page">
      <div className="page-header">
        <div>
          <h1>Travel Memories</h1>
          <p>Your diary — every moment worth remembering.</p>
        </div>
        <Link to="/memories/add" className="btn btn-primary">
          <FaPlus /> Add Memory
        </Link>
      </div>

      {/* Filter */}
      <div className="filter-bar">
        <label htmlFor="trip-filter">Filter by trip:</label>
        <select
          id="trip-filter"
          value={tripFilter}
          onChange={(e) => {
            setTripFilter(e.target.value);
            load(e.target.value);
          }}
        >
          <option value="">All trips</option>
          {trips.map((t) => (
            <option key={t._id} value={t._id}>
              {t.tripName}
            </option>
          ))}
        </select>
      </div>

      {loading ? (
        <Loader />
      ) : memories.length === 0 ? (
        <div className="empty-state">
          <span className="empty-icon">📖</span>
          <h3>No memories yet</h3>
          <p>Write about a sunset, a meal, a laugh — capture it all.</p>
          <Link to="/memories/add" className="btn btn-primary">
            <FaPlus /> Write Your First Memory
          </Link>
        </div>
      ) : (
        <div className="memories-grid">
          {memories.map((m) => (
            <MemoryCard
              key={m._id}
              memory={m}
              onEdit={() => navigate(`/memories/edit/${m._id}`)}
              onDelete={() => setDeleteTarget(m)}
            />
          ))}
        </div>
      )}

      <ConfirmDialog
        open={Boolean(deleteTarget)}
        title="Delete this memory?"
        message={`"${deleteTarget?.title}" will be permanently removed from your diary.`}
        onConfirm={confirmDelete}
        onCancel={() => setDeleteTarget(null)}
      />
    </div>
  );
}
