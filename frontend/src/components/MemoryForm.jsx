/**
 * components/MemoryForm.jsx
 * Reusable diary-entry form.
 *  - Page usage (AddMemory): onSaved navigates to /memories
 *  - Modal usage (TripDetails): onSaved refreshes the trip page
 */
import { useState, useEffect } from 'react';
import API from '../services/api';
import ImageUpload from './ImageUpload';

const MOODS = ['Happy', 'Excited', 'Adventurous', 'Relaxed', 'Grateful', 'Tired', 'Nostalgic'];

const MemoryForm = ({ tripId, initialData, onSaved, onCancel }) => {
  const isEdit = Boolean(initialData);
  const [trips, setTrips] = useState([]);
  const [form, setForm] = useState(
    initialData
      ? {
          title: initialData.title,
          description: initialData.description || '',
          date: (initialData.date || '').slice(0, 10),
          mood: initialData.mood,
          location: initialData.location || '',
          image: initialData.image || '',
          tripId: initialData.tripId || tripId || '',
        }
      : {
          title: '',
          description: '',
          date: new Date().toISOString().slice(0, 10),
          mood: 'Happy',
          location: '',
          image: '',
          tripId: tripId || '',
        }
  );
  const [errors, setErrors] = useState({});
  const [saving, setSaving] = useState(false);

  // For the "link to trip" dropdown
  useEffect(() => {
    API.get('/trips')
      .then(({ data }) => setTrips(data))
      .catch(() => {});
  }, []);

  const handleChange = (e) => setForm({ ...form, [e.target.name]: e.target.value });

  const validate = () => {
    const errs = {};
    if (!form.title.trim()) errs.title = 'Title is required';
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
      const payload = { ...form, tripId: form.tripId || null };
      const { data } = isEdit ? await API.put(`/memories/${initialData._id}`, payload) : await API.post('/memories', payload);
      onSaved?.(data);
    } catch (err) {
      setErrors({ form: err.response?.data?.message || 'Something went wrong. Please try again.' });
      setSaving(false);
    }
  };

  return (
    <form className="card form-card" onSubmit={handleSubmit} noValidate>
      {errors.form && <div className="alert alert-error">{errors.form}</div>}
      <h2 className="form-title">{isEdit ? '✏️ Edit Memory' : '📖 Add Travel Memory'}</h2>
      <p className="form-subtitle">Capture the moments that made your journey special.</p>

      <div className="form-grid">
        <div className="form-group">
          <label htmlFor="m-title">Title *</label>
          <input
            id="m-title"
            name="title"
            value={form.title}
            onChange={handleChange}
            placeholder="e.g. Sunset at Vizag Beach"
          />
          {errors.title && <p className="form-error">{errors.title}</p>}
        </div>

        <div className="form-group">
          <label htmlFor="m-date">Date *</label>
          <input id="m-date" name="date" type="date" value={form.date} onChange={handleChange} />
          {errors.date && <p className="form-error">{errors.date}</p>}
        </div>

        <div className="form-group">
          <label htmlFor="m-mood">Mood</label>
          <select id="m-mood" name="mood" value={form.mood} onChange={handleChange}>
            {MOODS.map((m) => (
              <option key={m} value={m}>
                {m}
              </option>
            ))}
          </select>
        </div>

        <div className="form-group">
          <label htmlFor="m-location">Location</label>
          <input
            id="m-location"
            name="location"
            value={form.location}
            onChange={handleChange}
            placeholder="e.g. Vizag Beach, Andhra Pradesh"
          />
        </div>

        <div className="form-group form-group-full">
          <label htmlFor="m-trip">Link to a Trip (optional)</label>
          <select id="m-trip" name="tripId" value={form.tripId || ''} onChange={handleChange}>
            <option value="">— No trip —</option>
            {trips.map((t) => (
              <option key={t._id} value={t._id}>
                {t.tripName} ({t.destination})
              </option>
            ))}
          </select>
        </div>

        <div className="form-group form-group-full">
          <label htmlFor="m-desc">Description</label>
          <textarea
            id="m-desc"
            name="description"
            rows="4"
            value={form.description}
            onChange={handleChange}
            placeholder="What happened? How did you feel? What did you see…"
          />
        </div>

        <div className="form-group form-group-full">
          <label>Photo</label>
          <ImageUpload value={form.image} onChange={(url) => setForm({ ...form, image: url })} label="photo" />
        </div>
      </div>

      <div className="form-actions">
        {onCancel ? (
          <button type="button" className="btn btn-outline" onClick={onCancel}>
            Cancel
          </button>
        ) : (
          <button type="button" className="btn btn-outline" onClick={() => window.history.back()}>
            Cancel
          </button>
        )}
        <button type="submit" className="btn btn-primary" disabled={saving}>
          {saving ? 'Saving…' : isEdit ? 'Update Memory' : 'Save Memory'}
        </button>
      </div>
    </form>
  );
};

export default MemoryForm;
