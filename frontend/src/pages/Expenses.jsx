/**
 * pages/Expenses.jsx — expense tracking with totals, category breakdown
 * bars and full CRUD through a modal form.
 */
import { useState, useEffect, useCallback } from 'react';
import API from '../services/api';
import ExpenseCard from '../components/ExpenseCard';
import ExpenseForm from '../components/ExpenseForm';
import Modal from '../components/Modal';
import ConfirmDialog from '../components/ConfirmDialog';
import Loader from '../components/Loader';
import { formatCurrency } from '../utils/format';
import { FaPlus, FaWallet, FaUtensils, FaCar, FaHotel, FaShoppingBag, FaMusic, FaEllipsisH } from 'react-icons/fa';

const CATEGORY_ICONS = {
  Food: <FaUtensils />,
  Transport: <FaCar />,
  Hotel: <FaHotel />,
  Shopping: <FaShoppingBag />,
  Entertainment: <FaMusic />,
  Other: <FaEllipsisH />,
};

const CATEGORY_COLORS = {
  Food: '#f59e0b',
  Transport: '#008CBA',
  Hotel: '#8b5cf6',
  Shopping: '#10b981',
  Entertainment: '#ef4444',
  Other: '#64748b',
};

export default function Expenses() {
  const [data, setData] = useState(null);
  const [trips, setTrips] = useState([]);
  const [tripFilter, setTripFilter] = useState('');
  const [modal, setModal] = useState({ open: false, editing: null });
  const [deleteTarget, setDeleteTarget] = useState(null);
  const [loading, setLoading] = useState(true);

  const load = useCallback(async (tripId = tripFilter) => {
    setLoading(true);
    try {
      const params = tripId ? { params: { tripId } } : {};
      const { data } = await API.get('/expenses', params);
      setData(data);
    } catch {
      setData({ expenses: [], total: 0, categoryTotals: [] });
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
      await API.delete(`/expenses/${deleteTarget._id}`);
      setDeleteTarget(null);
      load();
    } catch {
      setDeleteTarget(null);
    }
  };

  if (loading && !data) return <Loader />;

  const total = data?.total || 0;
  const categoryTotals = data?.categoryTotals || [];
  const maxCategory = categoryTotals.reduce((m, c) => Math.max(m, c.total), 1);

  return (
    <div className="page">
      <div className="page-header">
        <div>
          <h1>Expenses</h1>
          <p>Know exactly where your travel money goes.</p>
        </div>
        <button className="btn btn-primary" onClick={() => setModal({ open: true, editing: null })}>
          <FaPlus /> Add Expense
        </button>
      </div>

      {/* Summary cards */}
      <div className="stats-grid stats-grid-3">
        <div className="stat-card">
          <div className="stat-icon" style={{ backgroundColor: '#f59e0b18', color: '#f59e0b' }}>
            <FaWallet />
          </div>
          <div className="stat-info">
            <p className="stat-value">{formatCurrency(total)}</p>
            <p className="stat-label">Total Expenses</p>
          </div>
        </div>
        <div className="stat-card">
          <div className="stat-icon" style={{ backgroundColor: '#008cba18', color: '#008CBA' }}>
            <FaWallet />
          </div>
          <div className="stat-info">
            <p className="stat-value">{data?.expenses.length || 0}</p>
            <p className="stat-label">Expense Records</p>
          </div>
        </div>
        <div className="stat-card">
          <div className="stat-icon" style={{ backgroundColor: '#10b98118', color: '#10b981' }}>
            <FaWallet />
          </div>
          <div className="stat-info">
            <p className="stat-value">{categoryTotals.length}</p>
            <p className="stat-label">Categories Used</p>
          </div>
        </div>
      </div>

      {/* Filter */}
      <div className="filter-bar">
        <label htmlFor="exp-filter">Filter by trip:</label>
        <select
          id="exp-filter"
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

      <div className="expenses-layout">
        {/* Category breakdown */}
        <div className="card">
          <h3 className="card-title">Spending by Category</h3>
          {categoryTotals.length === 0 ? (
            <p className="muted">Add an expense to see the breakdown.</p>
          ) : (
            categoryTotals.map((c) => (
              <div className="category-bar" key={c.category}>
                <div className="category-bar-head">
                  <span className="category-name">
                    <span style={{ color: CATEGORY_COLORS[c.category] }}>{CATEGORY_ICONS[c.category]}</span>
                    {c.category}
                  </span>
                  <span className="category-amount">{formatCurrency(c.total)}</span>
                </div>
                <div className="category-track">
                  <div
                    className="category-fill"
                    style={{
                      width: `${(c.total / maxCategory) * 100}%`,
                      backgroundColor: CATEGORY_COLORS[c.category],
                    }}
                  />
                </div>
              </div>
            ))
          )}
        </div>

        {/* Records */}
        <div className="card">
          <h3 className="card-title">Expense Records</h3>
          {data?.expenses.length === 0 ? (
            <div className="empty-state small">
              <span className="empty-icon">💸</span>
              <h3>No expenses yet</h3>
              <p>Start tracking your spending.</p>
            </div>
          ) : (
            data?.expenses.map((e) => (
              <ExpenseCard
                key={e._id}
                expense={e}
                onEdit={() => setModal({ open: true, editing: e })}
                onDelete={() => setDeleteTarget(e)}
              />
            ))
          )}
        </div>
      </div>

      {modal.open && (
        <Modal title={modal.editing ? 'Edit Expense' : 'Add Expense'} onClose={() => setModal({ open: false, editing: null })}>
          <ExpenseForm
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
        title="Delete this expense?"
        message={`"${deleteTarget?.name}" (${deleteTarget ? formatCurrency(deleteTarget.amount) : ''}) will be removed.`}
        onConfirm={confirmDelete}
        onCancel={() => setDeleteTarget(null)}
      />
    </div>
  );
}
