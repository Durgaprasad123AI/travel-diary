/**
 * pages/AdminSettings.jsx — system info + data management (bulk delete).
 */
import { useState } from 'react';
import API from '../services/api';
import ConfirmDialog from '../components/ConfirmDialog';
import { FaInfoCircle, FaTrash, FaShieldAlt, FaDatabase } from 'react-icons/fa';

const COLLECTIONS = [
  { key: 'memories', label: 'All Memories' },
  { key: 'expenses', label: 'All Expenses' },
  { key: 'destinations', label: 'All Destinations' },
  { key: 'trips', label: 'All Trips (also deletes their memories, expenses & places)' },
];

export default function AdminSettings() {
  const [deleteTarget, setDeleteTarget] = useState(null);
  const [deleting, setDeleting] = useState(false);
  const [message, setMessage] = useState('');

  const confirmDelete = async () => {
    if (!deleteTarget) return;
    setDeleting(true);
    try {
      const { data } = await API.delete(`/admin/data/${deleteTarget.key}`);
      setMessage(data.message);
      setTimeout(() => setMessage(''), 4000);
    } catch (err) {
      setMessage(err.response?.data?.message || 'Operation failed');
    } finally {
      setDeleting(false);
      setDeleteTarget(null);
    }
  };

  return (
    <div className="page">
      <div className="page-header">
        <div>
          <h1>Settings</h1>
          <p>System configuration and data management.</p>
        </div>
      </div>

      {message && <div className="alert alert-success">{message}</div>}

      <div className="settings-grid">
        <div className="card">
          <h3 className="card-title"><FaInfoCircle /> About the System</h3>
          <ul className="settings-list">
            <li><strong>Name:</strong> Travel Diary Management System</li>
            <li><strong>Stack:</strong> MongoDB (Atlas) · Express · React (Vite) · Node.js</li>
            <li><strong>Authentication:</strong> JWT + bcrypt password hashing</li>
            <li><strong>Admin account:</strong> created via <code>npm run seed:admin</code></li>
            <li><strong>Environment:</strong> backend/.env (never committed)</li>
          </ul>
        </div>

        <div className="card">
          <h3 className="card-title"><FaDatabase /> Data Management</h3>
          <p className="muted">Danger zone — these actions permanently delete data and cannot be undone.</p>
          {COLLECTIONS.map((c) => (
            <div className="danger-row" key={c.key}>
              <div>
                <p className="danger-row-title">{c.label}</p>
                <p className="danger-row-meta">Delete every {c.key} record on the platform</p>
              </div>
              <button className="btn btn-danger-outline btn-sm" onClick={() => setDeleteTarget(c)}>
                <FaTrash /> Delete
              </button>
            </div>
          ))}
        </div>

        <div className="card">
          <h3 className="card-title"><FaShieldAlt /> Security Notes</h3>
          <ul className="settings-list">
            <li>Passwords are hashed with bcrypt — never stored in plain text.</li>
            <li>JWT tokens expire after 30 days.</li>
            <li>Admin APIs are protected by role middleware.</li>
            <li>MongoDB credentials live only in <code>.env</code>.</li>
            <li>Image uploads are restricted to image files (max 5 MB).</li>
          </ul>
        </div>
      </div>

      <ConfirmDialog
        open={Boolean(deleteTarget)}
        title={`Delete ${deleteTarget?.label.toLowerCase()}?`}
        message="This permanently removes ALL matching records from the database."
        confirmText={deleting ? 'Deleting…' : 'Delete All'}
        onConfirm={confirmDelete}
        onCancel={() => setDeleteTarget(null)}
      />
    </div>
  );
}
