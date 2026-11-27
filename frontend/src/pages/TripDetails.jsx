/**
 * pages/TripDetails.jsx — one trip with everything attached to it.
 * Tabs: Overview | Expenses | Memories | Places
 * Each tab has an "Add" button that opens a modal form.
 */
import { useState, useEffect, useCallback } from 'react';
import { Link, useNavigate, useParams } from 'react-router-dom';
import API from '../services/api';
import { getDefaultTripImage } from '../constants/images';
import { formatDate, formatCurrency } from '../utils/format';
import ExpenseCard from '../components/ExpenseCard';
import MemoryCard from '../components/MemoryCard';
import DestinationCard from '../components/DestinationCard';
import ExpenseForm from '../components/ExpenseForm';
import MemoryForm from '../components/MemoryForm';
import DestinationForm from '../components/DestinationForm';
import Modal from '../components/Modal';
import ConfirmDialog from '../components/ConfirmDialog';
import Loader from '../components/Loader';
import {
  FaMapMarkerAlt,
  FaCalendarAlt,
  FaWallet,
  FaPlus,
  FaEdit,
  FaTrash,
  FaArrowLeft,
  FaBookOpen,
  FaMoneyBillWave,
  FaMapMarkedAlt,
} from 'react-icons/fa';

const TABS = [
  { id: 'overview', label: 'Overview', icon: <FaMapMarkedAlt /> },
  { id: 'expenses', label: 'Expenses', icon: <FaMoneyBillWave /> },
  { id: 'memories', label: 'Memories', icon: <FaBookOpen /> },
  { id: 'places', label: 'Places', icon: <FaMapMarkerAlt /> },
];

export default function TripDetails() {
  const { id } = useParams();
  const navigate = useNavigate();

  const [trip, setTrip] = useState(null);
  const [memories, setMemories] = useState([]);
  const [expenses, setExpenses] = useState([]);
  const [destinations, setDestinations] = useState([]);
  const [totalExpense, setTotalExpense] = useState(0);
  const [loading, setLoading] = useState(true);
  const [tab, setTab] = useState('overview');

  // Modal state
  const [expenseModal, setExpenseModal] = useState({ open: false, editing: null });
  const [memoryModal, setMemoryModal] = useState({ open: false, editing: null });
  const [placeModal, setPlaceModal] = useState({ open: false, editing: null });
  const [confirmDelete, setConfirmDelete] = useState(null); // { kind: 'memory'|'expense'|'place', item }
  const [deleteTripOpen, setDeleteTripOpen] = useState(false);

  const load = useCallback(async () => {
    try {
      const { data } = await API.get(`/trips/${id}`);
      setTrip(data.trip);
      setMemories(data.memories);
      setExpenses(data.expenses);
      setDestinations(data.destinations);
      setTotalExpense(data.totalExpense);
    } catch {
      navigate('/trips');
    } finally {
      setLoading(false);
    }
  }, [id, navigate]);

  useEffect(() => {
    load();
  }, [load]);

  const handleDelete = async () => {
    if (!confirmDelete) return;
    const { kind, item } = confirmDelete;
    try {
      await API.delete(`/${kind}s/${item._id}`);
      if (kind === 'memory') setMemories((prev) => prev.filter((m) => m._id !== item._id));
      if (kind === 'expense') setExpenses((prev) => prev.filter((e) => e._id !== item._id));
      if (kind === 'place') setDestinations((prev) => prev.filter((d) => d._id !== item._id));
    } finally {
      setConfirmDelete(null);
    }
  };

  const deleteTrip = async () => {
    try {
      await API.delete(`/trips/${id}`);
      navigate('/trips');
    } catch {
      setDeleteTripOpen(false);
    }
  };

  if (loading) return <Loader />;

  const budgetUsed = trip.budget > 0 ? Math.min(100, Math.round((totalExpense / trip.budget) * 100)) : 0;

  return (
    <div className="page">
      <Link to="/trips" className="back-link">
        <FaArrowLeft /> Back to My Trips
      </Link>

      {/* Hero */}
      <div className="trip-hero" style={{ backgroundImage: `url(${trip.coverImage || getDefaultTripImage()})` }}>
        <div className="trip-hero-overlay" />
        <div className="trip-hero-content">
          <span className="trip-type-badge">{trip.travelType}</span>
          <h1>{trip.tripName}</h1>
          <p className="trip-hero-location">
            <FaMapMarkerAlt /> {trip.destination}
            {trip.country ? `, ${trip.country}` : ''}
          </p>
          <p className="trip-hero-dates">
            <FaCalendarAlt /> {formatDate(trip.startDate)} — {formatDate(trip.endDate)}
          </p>
          <div className="trip-hero-actions">
            <button className="btn btn-primary btn-sm" onClick={() => navigate(`/trips/edit/${trip._id}`)}>
              <FaEdit /> Edit Trip
            </button>
            <button className="btn btn-danger btn-sm" onClick={() => setDeleteTripOpen(true)}>
              <FaTrash /> Delete Trip
            </button>
          </div>
        </div>
      </div>

      {/* Quick stat chips */}
      <div className="trip-summary">
        <div className="trip-summary-item">
          <span className="trip-summary-icon"><FaWallet /></span>
          <div>
            <p className="trip-summary-value">{formatCurrency(trip.budget)}</p>
            <p className="trip-summary-label">Budget</p>
          </div>
        </div>
        <div className="trip-summary-item">
          <span className="trip-summary-icon"><FaMoneyBillWave /></span>
          <div>
            <p className="trip-summary-value">{formatCurrency(totalExpense)}</p>
            <p className="trip-summary-label">Spent</p>
          </div>
        </div>
        <div className="trip-summary-item">
          <span className="trip-summary-icon"><FaBookOpen /></span>
          <div>
            <p className="trip-summary-value">{memories.length}</p>
            <p className="trip-summary-label">Memories</p>
          </div>
        </div>
        <div className="trip-summary-item">
          <span className="trip-summary-icon"><FaMapMarkerAlt /></span>
          <div>
            <p className="trip-summary-value">{destinations.length}</p>
            <p className="trip-summary-label">Places Visited</p>
          </div>
        </div>
        <div className="trip-summary-item trip-budget-bar-wrap">
          <div className="trip-budget-bar">
            <div className="trip-budget-fill" style={{ width: `${budgetUsed}%` }} />
          </div>
          <p className="trip-summary-label">{budgetUsed}% of budget used</p>
        </div>
      </div>

      {/* Tabs */}
      <div className="tabs">
        {TABS.map((t) => (
          <button key={t.id} className={`tab ${tab === t.id ? 'active' : ''}`} onClick={() => setTab(t.id)}>
            {t.icon} {t.label}
          </button>
        ))}
      </div>

      {/* ---- OVERVIEW ---- */}
      {tab === 'overview' && (
        <div className="tab-content">
          {trip.description ? (
            <div className="card overview-card">
              <h3>About this trip</h3>
              <p>{trip.description}</p>
            </div>
          ) : (
            <div className="card overview-card">
              <h3>About this trip</h3>
              <p className="muted">No description added yet.</p>
            </div>
          )}

          <div className="overview-lists">
            <div className="card">
              <div className="card-head">
                <h3>Recent Memories</h3>
                <button className="btn btn-primary btn-sm" onClick={() => setMemoryModal({ open: true, editing: null })}>
                  <FaPlus /> Add
                </button>
              </div>
              {memories.length === 0 ? (
                <p className="muted">No memories yet.</p>
              ) : (
                <div className="mini-grid">
                  {memories.slice(0, 3).map((m) => (
                    <MemoryCard key={m._id} memory={m} onEdit={() => setMemoryModal({ open: true, editing: m })} onDelete={() => setConfirmDelete({ kind: 'memory', item: m })} />
                  ))}
                </div>
              )}
            </div>

            <div className="card">
              <div className="card-head">
                <h3>Places Visited</h3>
                <button className="btn btn-primary btn-sm" onClick={() => setPlaceModal({ open: true, editing: null })}>
                  <FaPlus /> Add
                </button>
              </div>
              {destinations.length === 0 ? (
                <p className="muted">No places saved yet.</p>
              ) : (
                <div className="mini-grid">
                  {destinations.slice(0, 3).map((d) => (
                    <DestinationCard key={d._id} destination={d} onEdit={() => setPlaceModal({ open: true, editing: d })} onDelete={() => setConfirmDelete({ kind: 'place', item: d })} />
                  ))}
                </div>
              )}
            </div>
          </div>
        </div>
      )}

      {/* ---- EXPENSES ---- */}
      {tab === 'expenses' && (
        <div className="tab-content">
          <div className="card">
            <div className="card-head">
              <h3>Expenses ({expenses.length})</h3>
              <button className="btn btn-primary btn-sm" onClick={() => setExpenseModal({ open: true, editing: null })}>
                <FaPlus /> Add Expense
              </button>
            </div>
            {expenses.length === 0 ? (
              <p className="muted">No expenses recorded for this trip yet.</p>
            ) : (
              expenses.map((e) => (
                <ExpenseCard
                  key={e._id}
                  expense={e}
                  onEdit={() => setExpenseModal({ open: true, editing: e })}
                  onDelete={() => setConfirmDelete({ kind: 'expense', item: e })}
                />
              ))
            )}
          </div>
        </div>
      )}

      {/* ---- MEMORIES ---- */}
      {tab === 'memories' && (
        <div className="tab-content">
          <div className="section-row-head">
            <h2>Memories ({memories.length})</h2>
            <button className="btn btn-primary btn-sm" onClick={() => setMemoryModal({ open: true, editing: null })}>
              <FaPlus /> Add Memory
            </button>
          </div>
          {memories.length === 0 ? (
            <div className="empty-state">
              <span className="empty-icon">📖</span>
              <h3>No memories yet</h3>
              <p>Write your first diary entry for this trip.</p>
            </div>
          ) : (
            <div className="memories-grid">
              {memories.map((m) => (
                <MemoryCard key={m._id} memory={m} onEdit={() => setMemoryModal({ open: true, editing: m })} onDelete={() => setConfirmDelete({ kind: 'memory', item: m })} />
              ))}
            </div>
          )}
        </div>
      )}

      {/* ---- PLACES ---- */}
      {tab === 'places' && (
        <div className="tab-content">
          <div className="section-row-head">
            <h2>Places Visited ({destinations.length})</h2>
            <button className="btn btn-primary btn-sm" onClick={() => setPlaceModal({ open: true, editing: null })}>
              <FaPlus /> Add Place
            </button>
          </div>
          {destinations.length === 0 ? (
            <div className="empty-state">
              <span className="empty-icon">📍</span>
              <h3>No places saved yet</h3>
              <p>Save the spots that made this trip unforgettable.</p>
            </div>
          ) : (
            <div className="destinations-grid">
              {destinations.map((d) => (
                <DestinationCard key={d._id} destination={d} onEdit={() => setPlaceModal({ open: true, editing: d })} onDelete={() => setConfirmDelete({ kind: 'place', item: d })} />
              ))}
            </div>
          )}
        </div>
      )}

      {/* ---- Modals ---- */}
      {expenseModal.open && (
        <Modal title={expenseModal.editing ? 'Edit Expense' : 'Add Expense'} onClose={() => setExpenseModal({ open: false, editing: null })}>
          <ExpenseForm
            tripId={trip._id}
            initialData={expenseModal.editing}
            onCancel={() => setExpenseModal({ open: false, editing: null })}
            onSaved={() => {
              setExpenseModal({ open: false, editing: null });
              load();
            }}
          />
        </Modal>
      )}

      {memoryModal.open && (
        <Modal title={memoryModal.editing ? 'Edit Memory' : 'Add Memory'} onClose={() => setMemoryModal({ open: false, editing: null })}>
          <MemoryForm
            tripId={trip._id}
            initialData={memoryModal.editing}
            onCancel={() => setMemoryModal({ open: false, editing: null })}
            onSaved={() => {
              setMemoryModal({ open: false, editing: null });
              load();
            }}
          />
        </Modal>
      )}

      {placeModal.open && (
        <Modal title={placeModal.editing ? 'Edit Place' : 'Add Place'} onClose={() => setPlaceModal({ open: false, editing: null })}>
          <DestinationForm
            tripId={trip._id}
            initialData={placeModal.editing}
            onCancel={() => setPlaceModal({ open: false, editing: null })}
            onSaved={() => {
              setPlaceModal({ open: false, editing: null });
              load();
            }}
          />
        </Modal>
      )}

      <ConfirmDialog
        open={Boolean(confirmDelete)}
        title="Delete this item?"
        message="It will be permanently removed from this trip."
        onConfirm={handleDelete}
        onCancel={() => setConfirmDelete(null)}
      />

      <ConfirmDialog
        open={deleteTripOpen}
        title="Delete this trip?"
        message="All memories, expenses and places of this trip will be deleted too."
        confirmText="Delete Trip"
        onConfirm={deleteTrip}
        onCancel={() => setDeleteTripOpen(false)}
      />
    </div>
  );
}
