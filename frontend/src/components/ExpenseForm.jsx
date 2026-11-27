/**
 * components/ExpenseForm.jsx
 * Reusable expense form (used in Expenses page modal + TripDetails modal).
 */
import { useState, useEffect } from 'react';
import API from '../services/api';

const CATEGORIES = ['Food', 'Transport', 'Hotel', 'Shopping', 'Entertainment', 'Other'];

const ExpenseForm = ({ tripId, initialData, onSaved, onCancel }) => {
  const isEdit = Boolean(initialData);
  const [trips, setTrips] = useState([]);
  const [form, setForm] = useState(
    initialData
      ? {
          name: initialData.name,
          category: initialData.category,
          amount: initialData.amount,
          date: (initialData.date || '').slice(0, 10),
          description: initialData.description || '',
          tripId: initialData.tripId || tripId || '',
        }
      : {
          name: '',
          category: 'Food',
          amount: '',
          date: new Date().toISOString().slice(0, 10),
          description: '',
          tripId: tripId || '',
        }
  );
  const [errors, setErrors] = useState({});
  const [saving, setSaving] = useState(false);

  useEffect(() => {
    API.get('/trips')
      .then(({ data }) => setTrips(data))
      .catch(() => {});
  }, []);

  const handleChange = (e) => setForm({ ...form, [e.target.name]: e.target.value });

  const validate = () => {
    const errs = {};
    if (!form.name.trim()) errs.name = 'Expense name is required';
    if (form.amount === '' || Number.isNaN(Number(form.amount)) || Number(form.amount) < 0) {
      errs.amount = 'Please enter a valid amount';
    }
    if (!form.date) errs.date = 'Date is required';
    return errs;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    const errs = validate();
    setErrors(errs);
    if (Object.keys(errs).length > 0) return;

    setSaving(true);
    try {
      const payload = { ...form, amount: Number(form.amount), tripId: form.tripId || null };
      const { data } = isEdit
        ? await API.put(`/expenses/${initialData._id}`, payload)
        : await API.post('/expenses', payload);
      onSaved?.(data);
    } catch (err) {
      setErrors({ form: err.response?.data?.message || 'Something went wrong. Please try again.' });
      setSaving(false);
    }
  };

  return (
    <form onSubmit={handleSubmit} noValidate>
      {errors.form && <div className="alert alert-error">{errors.form}</div>}
      <div className="form-grid">
        <div className="form-group">
          <label htmlFor="e-name">Expense Name *</label>
          <input
            id="e-name"
            name="name"
            value={form.name}
            onChange={handleChange}
            placeholder="e.g. Beachside dinner"
          />
          {errors.name && <p className="form-error">{errors.name}</p>}
        </div>

        <div className="form-group">
          <label htmlFor="e-category">Category *</label>
          <select id="e-category" name="category" value={form.category} onChange={handleChange}>
            {CATEGORIES.map((c) => (
              <option key={c} value={c}>
                {c}
              </option>
            ))}
          </select>
        </div>

        <div className="form-group">
          <label htmlFor="e-amount">Amount (₹) *</label>
          <input
            id="e-amount"
            name="amount"
            type="number"
            min="0"
            step="0.01"
            value={form.amount}
            onChange={handleChange}
            placeholder="e.g. 1500"
          />
          {errors.amount && <p className="form-error">{errors.amount}</p>}
        </div>

        <div className="form-group">
          <label htmlFor="e-date">Date *</label>
          <input id="e-date" name="date" type="date" value={form.date} onChange={handleChange} />
          {errors.date && <p className="form-error">{errors.date}</p>}
        </div>

        {!tripId && (
          <div className="form-group form-group-full">
            <label htmlFor="e-trip">Link to a Trip (optional)</label>
            <select id="e-trip" name="tripId" value={form.tripId || ''} onChange={handleChange}>
              <option value="">— No trip —</option>
              {trips.map((t) => (
                <option key={t._id} value={t._id}>
                  {t.tripName} ({t.destination})
                </option>
              ))}
            </select>
          </div>
        )}

        <div className="form-group form-group-full">
          <label htmlFor="e-desc">Description</label>
          <input
            id="e-desc"
            name="description"
            value={form.description}
            onChange={handleChange}
            placeholder="Optional notes about this expense"
          />
        </div>
      </div>

      <div className="modal-actions">
        <button type="button" className="btn btn-outline" onClick={onCancel}>
          Cancel
        </button>
        <button type="submit" className="btn btn-primary" disabled={saving}>
          {saving ? 'Saving…' : isEdit ? 'Update Expense' : 'Add Expense'}
        </button>
      </div>
    </form>
  );
};

export default ExpenseForm;
