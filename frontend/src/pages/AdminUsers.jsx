/**
 * pages/AdminUsers.jsx — manage users: search, view details,
 * edit (name/email/role), delete with confirmation.
 */
import { useState, useEffect } from 'react';
import API from '../services/api';
import Modal from '../components/Modal';
import ConfirmDialog from '../components/ConfirmDialog';
import Loader from '../components/Loader';
import { formatCurrency, formatDate } from '../utils/format';
import { FaSearch, FaEye, FaEdit, FaTrash, FaUsers } from 'react-icons/fa';

const avatarFor = (name) =>
  `https://ui-avatars.com/api/?background=008CBA&color=fff&name=${encodeURIComponent(name || 'U')}`;

export default function AdminUsers() {
  const [users, setUsers] = useState([]);
  const [search, setSearch] = useState('');
  const [loading, setLoading] = useState(true);

  const [detail, setDetail] = useState(null); // full user details (modal)
  const [detailLoading, setDetailLoading] = useState(false);
  const [editTarget, setEditTarget] = useState(null);
  const [editForm, setEditForm] = useState({ name: '', email: '', role: 'user' });
  const [deleteTarget, setDeleteTarget] = useState(null);

  const load = async (term = search) => {
    setLoading(true);
    try {
      const params = term ? { params: { search: term } } : {};
      const { data } = await API.get('/admin/users', params);
      setUsers(data);
    } catch {
      setUsers([]);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    load('');
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const openDetail = async (user) => {
    setDetailLoading(true);
    setDetail({ user, stats: null, trips: [] });
    try {
      const { data } = await API.get(`/admin/users/${user._id}`);
      setDetail(data);
    } catch {
      setDetail(null);
    } finally {
      setDetailLoading(false);
    }
  };

  const openEdit = (user) => {
    setEditTarget(user);
    setEditForm({ name: user.name, email: user.email, role: user.role });
  };

  const saveEdit = async (e) => {
    e.preventDefault();
    try {
      await API.put(`/admin/users/${editTarget._id}`, editForm);
      setEditTarget(null);
      load();
    } catch (err) {
      alert(err.response?.data?.message || 'Update failed');
    }
  };

  const confirmDelete = async () => {
    if (!deleteTarget) return;
    try {
      await API.delete(`/admin/users/${deleteTarget._id}`);
      setDeleteTarget(null);
      load();
    } catch (err) {
      alert(err.response?.data?.message || 'Delete failed');
      setDeleteTarget(null);
    }
  };

  if (loading && users.length === 0) return <Loader />;

  return (
    <div className="page">
      <div className="page-header">
        <div>
          <h1>User Management</h1>
          <p>{users.length} user{users.length === 1 ? '' : 's'} found.</p>
        </div>
      </div>

      <div className="search-bar">
        <FaSearch />
        <input
          type="text"
          placeholder="Search by name or email…"
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          onKeyDown={(e) => e.key === 'Enter' && load()}
        />
        <button className="btn btn-primary btn-sm" onClick={() => load()}>
          Search
        </button>
      </div>

      {users.length === 0 ? (
        <div className="empty-state">
          <span className="empty-icon"><FaUsers /></span>
          <h3>No users found</h3>
          <p>Try a different search term.</p>
        </div>
      ) : (
        <div className="card">
          <div className="table-wrap">
            <table className="table">
              <thead>
                <tr>
                  <th>User</th>
                  <th>Email</th>
                  <th>Role</th>
                  <th>Trips</th>
                  <th>Joined</th>
                  <th className="th-actions">Actions</th>
                </tr>
              </thead>
              <tbody>
                {users.map((u) => (
                  <tr key={u._id}>
                    <td>
                      <div className="table-user">
                        <img src={u.profileImage || avatarFor(u.name)} alt={u.name} className="table-avatar" />
                        {u.name}
                      </div>
                    </td>
                    <td>{u.email}</td>
                    <td>
                      <span className={`badge ${u.role === 'admin' ? 'badge-dark' : 'badge-blue'}`}>{u.role}</span>
                    </td>
                    <td>{u.tripCount ?? 0}</td>
                    <td>{formatDate(u.createdAt)}</td>
                    <td>
                      <div className="row-actions">
                        <button className="icon-btn" title="View" onClick={() => openDetail(u)}>
                          <FaEye />
                        </button>
                        <button className="icon-btn" title="Edit" onClick={() => openEdit(u)}>
                          <FaEdit />
                        </button>
                        <button className="icon-btn danger" title="Delete" disabled={u.role === 'admin'} onClick={() => setDeleteTarget(u)}>
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

      {/* ---- View details modal ---- */}
      {detail && (
        <Modal title={`User: ${detail.user?.name}`} onClose={() => setDetail(null)} size="lg">
          {detailLoading ? (
            <Loader />
          ) : (
            <>
              <div className="detail-summary">
                <img src={detail.user?.profileImage || avatarFor(detail.user?.name)} alt="" className="detail-avatar" />
                <div>
                  <h3>{detail.user?.name}</h3>
                  <p>{detail.user?.email}</p>
                  <span className={`badge ${detail.user?.role === 'admin' ? 'badge-dark' : 'badge-blue'}`}>{detail.user?.role}</span>
                </div>
              </div>
              <div className="stats-grid stats-grid-4 compact">
                <div className="stat-card"><div className="stat-info"><p className="stat-value">{detail.stats?.trips}</p><p className="stat-label">Trips</p></div></div>
                <div className="stat-card"><div className="stat-info"><p className="stat-value">{detail.stats?.memories}</p><p className="stat-label">Memories</p></div></div>
                <div className="stat-card"><div className="stat-info"><p className="stat-value">{detail.stats?.expenses}</p><p className="stat-label">Expenses</p></div></div>
                <div className="stat-card"><div className="stat-info"><p className="stat-value">{formatCurrency(detail.stats?.totalExpense)}</p><p className="stat-label">Total Spent</p></div></div>
              </div>

              <h4 className="detail-section-title">Recent Trips</h4>
              {detail.trips?.length === 0 ? (
                <p className="muted">No trips.</p>
              ) : (
                <div className="mini-list">
                  {detail.trips?.slice(0, 5).map((t) => (
                    <div className="mini-list-item" key={t._id}>
                      <span className="mini-list-title">{t.tripName}</span>
                      <span className="mini-list-meta">{t.destination} · {formatDate(t.startDate)}</span>
                    </div>
                  ))}
                </div>
              )}
            </>
          )}
        </Modal>
      )}

      {/* ---- Edit modal ---- */}
      {editTarget && (
        <Modal title={`Edit user: ${editTarget.name}`} onClose={() => setEditTarget(null)}>
          <form onSubmit={saveEdit} noValidate>
            <div className="form-group">
              <label htmlFor="au-name">Name</label>
              <input id="au-name" value={editForm.name} onChange={(e) => setEditForm({ ...editForm, name: e.target.value })} />
            </div>
            <div className="form-group">
              <label htmlFor="au-email">Email</label>
              <input id="au-email" type="email" value={editForm.email} onChange={(e) => setEditForm({ ...editForm, email: e.target.value })} />
            </div>
            <div className="form-group">
              <label htmlFor="au-role">Role</label>
              <select id="au-role" value={editForm.role} onChange={(e) => setEditForm({ ...editForm, role: e.target.value })}>
                <option value="user">user</option>
                <option value="admin">admin</option>
              </select>
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
        title="Delete this user?"
        message={`All trips, memories, expenses and destinations of "${deleteTarget?.name}" will be permanently deleted.`}
        onConfirm={confirmDelete}
        onCancel={() => setDeleteTarget(null)}
      />
    </div>
  );
}
