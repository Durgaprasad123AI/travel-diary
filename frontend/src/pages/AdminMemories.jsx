/**
 * pages/AdminMemories.jsx — review all memories, delete inappropriate ones.
 */
import { useState, useEffect } from 'react';
import API from '../services/api';
import Modal from '../components/Modal';
import ConfirmDialog from '../components/ConfirmDialog';
import Loader from '../components/Loader';
import { formatDate, MOOD_EMOJI } from '../utils/format';
import { FaTrash, FaEye, FaBookOpen } from 'react-icons/fa';

export default function AdminMemories() {
  const [memories, setMemories] = useState([]);
  const [loading, setLoading] = useState(true);
  const [view, setView] = useState(null);
  const [deleteTarget, setDeleteTarget] = useState(null);

  const load = async () => {
    setLoading(true);
    try {
      const { data } = await API.get('/admin/memories');
      setMemories(data);
    } catch {
      setMemories([]);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    load();
  }, []);

  const confirmDelete = async () => {
    if (!deleteTarget) return;
    try {
      await API.delete(`/admin/memories/${deleteTarget._id}`);
      setDeleteTarget(null);
      load();
    } catch {
      setDeleteTarget(null);
    }
  };

  if (loading && memories.length === 0) return <Loader />;

  return (
    <div className="page">
      <div className="page-header">
        <div>
          <h1>Memory Review</h1>
          <p>{memories.length} memory{memories.length === 1 ? '' : 'ies'} shared by users.</p>
        </div>
      </div>

      {memories.length === 0 ? (
        <div className="empty-state">
          <span className="empty-icon"><FaBookOpen /></span>
          <h3>No memories yet</h3>
          <p>Users' diary entries will appear here.</p>
        </div>
      ) : (
        <div className="card">
          <div className="table-wrap">
            <table className="table">
              <thead>
                <tr>
                  <th>Memory</th>
                  <th>Author</th>
                  <th>Trip</th>
                  <th>Mood</th>
                  <th>Date</th>
                  <th className="th-actions">Actions</th>
                </tr>
              </thead>
              <tbody>
                {memories.map((m) => (
                  <tr key={m._id}>
                    <td className="trip-name-cell">{m.title}</td>
                    <td>{m.userId?.name || '—'}</td>
                    <td>{m.tripId?.tripName || '—'}</td>
                    <td><span className="mood-chip">{MOOD_EMOJI[m.mood] || '😊'} {m.mood}</span></td>
                    <td>{formatDate(m.date)}</td>
                    <td>
                      <div className="row-actions">
                        <button className="icon-btn" title="View" onClick={() => setView(m)}>
                          <FaEye />
                        </button>
                        <button className="icon-btn danger" title="Delete" onClick={() => setDeleteTarget(m)}>
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

      {view && (
        <Modal title="Memory details" onClose={() => setView(null)}>
          {view.image && <img src={view.image} alt={view.title} className="modal-image" />}
          <h3 className="modal-title">{view.title}</h3>
          <p className="modal-meta">
            By {view.userId?.name} · {formatDate(view.date)} · {MOOD_EMOJI[view.mood]} {view.mood}
            {view.location ? ` · 📍 ${view.location}` : ''}
          </p>
          <p className="modal-text">{view.description || 'No description.'}</p>
        </Modal>
      )}

      <ConfirmDialog
        open={Boolean(deleteTarget)}
        title="Delete this memory?"
        message={`"${deleteTarget?.title}" by ${deleteTarget?.userId?.name} will be permanently removed.`}
        onConfirm={confirmDelete}
        onCancel={() => setDeleteTarget(null)}
      />
    </div>
  );
}
