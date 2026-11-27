/**
 * pages/AdminTrips.jsx — manage all trips: search, edit, delete.
 */
import { useState, useEffect } from 'react';
import API from '../services/api';
import Modal from '../components/Modal';
import ConfirmDialog from '../components/ConfirmDialog';
import Loader from '../components/Loader';
import { formatCurrency, formatDate } from '../utils/format';
import { FaSearch, FaEdit, FaTrash, FaSuitcase } from 'react-icons/fa';

const TRAVEL_TYPES = ['Solo', 'Family', 'Friends', 'Business', 'Couple'];

export default function AdminTrips() {
  const [trips, setTrips] = useState([]);
  const [search, setSearch] = useState('');
  const [loading, setLoading] = useState(true);

  const [editTarget, setEditTarget] = useState(null);
  const [editForm, setEditForm] = useState({});
  const [deleteTarget, setDeleteTarget] = useState(null);

  const load = async (term = search) => {
    setLoading(true);
    try {
      const params = term ? { params: { search: term } } : {};
      const { data } = await API.get('/admin/trips', params);
      setTrips(data);
    } catch {
      setTrips([]);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    load('');
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const openEdit = (trip) => {
    setEditTarget(trip);
    setEditForm({
      tripName: trip.tripName,
      destination: trip.destination,
      country: trip.country || '',
      travelType: trip.travelType,
      budget: trip.budget || '',
      startDate: (trip.startDate || '').slice(0, 10),
      endDate: (trip.endDate || '').slice(0, 10),
    });
  };

  const saveEdit = async (e) => {
    e.preventDefault();
    try {
      await API.put(`/admin/trips/${editTarget._id}`, editForm);
      setEditTarget(null);
      load();
    } catch (err) {
      alert(err.response?.data?.message || 'Update failed');
    }
  };

  const confirmDelete = async () => {
    if (!deleteTarget) return;
    try {
      await API.delete(`/admin/trips/${deleteTarget._id}`);
      setDeleteTarget(null);
      load();
    } catch {
      setDeleteTarget(null);
    }
  };

  if (loading && trips.length === 0) return <Loader />;

  return (
    <div className="page">
      <div className="page-header">
        <div>
          <h1>Trip Management</h1>
          <p>{trips.length} trip{trips.length === 1 ? '' : 's'} on the platform.</p>
        </div>
      </div>

      <div className="search-bar">
        <FaSearch />
        <input
          type="text"
          placeholder="Search by trip name or destination…"
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          onKeyDown={(e) => e.key === 'Enter' && load()}
        />
        <button className="btn btn-primary btn-sm" onClick={() => load()}>
          Search
        </button>
      </div>

      {trips.length === 0 ? (
        <div className="empty-state">
          <span className="empty-icon"><FaSuitcase /></span>
          <h3>No trips found</h3>
          <p>Try a different search term.</p>
        </div>
      ) : (
        <div className="card">
          <div className="table-wrap">
            <table className="table">
              <thead>
                <tr>
                  <th>Trip</th>
                  <th>Owner</th>
                  <th>Destination</th>
                  <th>Type</th>
                  <th>Dates</th>
                  <th>Budget</th>
                  <th className="th-actions">Actions</th>
                </tr>
              </thead>
              <tbody>
                {trips.map((t) => (
                  <tr key={t._id}>
                    <td className="trip-name-cell">{t.tripName}</td>
                    <td>{t.userId?.name || '—'}</td>
                    <td>
                      {t.destination}
                      {t.country ? `, ${t.country}` : ''}
                    </td>
                    <td><span className="badge badge-blue">{t.travelType}</span></td>
                    <td>{formatDate(t.startDate)} → {formatDate(t.endDate)}</td>
                    <td>{formatCurrency(t.budget)}</td>
                    <td>
                      <div className="row-actions">
                        <button className="icon-btn" title="Edit" onClick={() => openEdit(t)}>
                          <FaEdit />
                        </button>
                        <button className="icon-btn danger" title="Delete" onClick={() => setDeleteTarget(t)}>
                          <FaTrash />
                        </button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {editTarget && (
        <Modal title={`Edit trip: ${editTarget.tripName}`} onClose={() => setEditTarget(null)}>
          <form onSubmit={saveEdit} noValidate>
            <div className="form-grid">
              <div className="form-group">
                <label htmlFor="at-name">Trip Name</label>
                <input id="at-name" value={editForm.tripName} onChange={(e) => setEditForm({ ...editForm, tripName: e.target.value })} />
              </div>
              <div className="form-group">
                <label htmlFor="at-type">Travel Type</label>
                <select id="at-type" value={editForm.travelType} onChange={(e) => setEditForm({ ...editForm, travelType: e.target.value })}>
                  {TRAVEL_TYPES.map((t) => (
                    <option key={t} value={t}>{t}</option>
                  ))}
                </select>
              </div>
              <div className="form-group">
                <label htmlFor="at-dest">Destination</label>
                <input id="at-dest" value={editForm.destination} onChange={(e) => setEditForm({ ...editForm, destination: e.target.value })} />
              </div>
              <div className="form-group">
                <label htmlFor="at-country">Country</label>
                <input id="at-country" value={editForm.country} onChange={(e) => setEditForm({ ...editForm, country: e.target.value })} />
              </div>
              <div className="form-group">
                <label htmlFor="at-start">Start Date</label>
                <input id="at-start" type="date" value={editForm.startDate} onChange={(e) => setEditForm({ ...editForm, startDate: e.target.value })} />
              </div>
              <div className="form-group">
                <label htmlFor="at-end">End Date</label>
                <input id="at-end" type="date" value={editForm.endDate} onChange={(e) => setEditForm({ ...editForm, endDate: e.target.value })} />
              </div>
              <div className="form-group">
                <label htmlFor="at-budget">Budget (₹)</label>
                <input id="at-budget" type="number" min="0" value={editForm.budget} onChange={(e) => setEditForm({ ...editForm, budget: e.target.value })} />
              </div>
            </div>
            <div className="modal-actions">
              <button type="button" className="btn btn-outline" onClick={() => setEditTarget(null)}>
                Cancel
              </button>
              <button type="submit" className="btn btn-primary">
                Save Changes
              </button>
            </div>
          </form>
        </Modal>
      )}

      <ConfirmDialog
        open={Boolean(deleteTarget)}
        title="Delete this trip?"
        message={`"${deleteTarget?.tripName}" and its memories, expenses and places will be removed.`}
        onConfirm={confirmDelete}
        onCancel={() => setDeleteTarget(null)}
      />
    </div>
  );
}
