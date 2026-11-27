/**
 * pages/Destinations.jsx — saved places with ratings, optional trip filter,
 * add/edit via modal, delete with confirmation.
 */
import { useState, useEffect, useCallback } from 'react';
import API from '../services/api';
import DestinationCard from '../components/DestinationCard';
import DestinationForm from '../components/DestinationForm';
import Modal from '../components/Modal';
import ConfirmDialog from '../components/ConfirmDialog';
import Loader from '../components/Loader';
import { FaPlus, FaMapMarkerAlt } from 'react-icons/fa';

export default function Destinations() {
  const [destinations, setDestinations] = useState([]);
  const [trips, setTrips] = useState([]);
  const [tripFilter, setTripFilter] = useState('');
  const [modal, setModal] = useState({ open: false, editing: null });
  const [deleteTarget, setDeleteTarget] = useState(null);
  const [loading, setLoading] = useState(true);

  const load = useCallback(async (tripId = tripFilter) => {
    setLoading(true);
    try {
      const params = tripId ? { params: { tripId } } : {};
      const { data } = await API.get('/destinations', params);
      setDestinations(data);
    } catch {
      setDestinations([]);
    } finally {
      setLoading(false);
    }
  }, [tripFilter]);

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
      await API.delete(`/destinations/${deleteTarget._id}`);
      setDeleteTarget(null);
      load();
    } catch {
      setDeleteTarget(null);
    }
  };

  if (loading && destinations.length === 0) return <Loader />;

  return (
    <div className="page">
      <div className="page-header">
        <div>
          <h1>Destinations</h1>
          <p>Places you visited — the ones worth remembering.</p>
        </div>
        <button className="btn btn-primary" onClick={() => setModal({ open: true, editing: null })}>
          <FaPlus /> Add Place
        </button>
      </div>

      <div className="filter-bar">
        <label htmlFor="dest-filter">Filter by trip:</label>
        <select
          id="dest-filter"
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

      {destinations.length === 0 ? (
        <div className="empty-state">
          <span className="empty-icon">📍</span>
          <h3>No places saved yet</h3>
          <p>Save the spots that made your travels unforgettable.</p>
          <button className="btn btn-primary" onClick={() => setModal({ open: true, editing: null })}>
            <FaMapMarkerAlt /> Add Your First Place
          </button>
        </div>
      ) : (
        <div className="destinations-grid">
          {destinations.map((d) => (
            <DestinationCard
              key={d._id}
              destination={d}
              onEdit={() => setModal({ open: true, editing: d })}
              onDelete={() => setDeleteTarget(d)}
            />
          ))}
        </div>
      )}

      {modal.open && (
        <Modal title={modal.editing ? 'Edit Place' : 'Add Place'} onClose={() => setModal({ open: false, editing: null })}>
          <DestinationForm
            tripId={tripFilter || undefined}
            initialData={modal.editing}
            onCancel={() => setModal({ open: false, editing: null })}
            onSaved={() => {
              setModal({ open: false, editing: null });
              load();
            }}
          />
        </Modal>
      )}

      <ConfirmDialog
        open={Boolean(deleteTarget)}
        title="Delete this place?"
        message={`"${deleteTarget?.name}" will be removed from your saved destinations.`}
        onConfirm={confirmDelete}
        onCancel={() => setDeleteTarget(null)}
      />
    </div>
  );
}
