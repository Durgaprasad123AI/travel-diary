/**
 * components/DestinationForm.jsx
 * Reusable "saved place" form (Destinations page modal + TripDetails modal).
 */
import { useState, useEffect } from 'react';
import API from '../services/api';
import ImageUpload from './ImageUpload';

const DestinationForm = ({ tripId, initialData, onSaved, onCancel }) => {
  const isEdit = Boolean(initialData);
  const [trips, setTrips] = useState([]);
  const [form, setForm] = useState(
    initialData
      ? {
          name: initialData.name,
          location: initialData.location || '',
          dateVisited: (initialData.dateVisited || '').slice(0, 10),
          description: initialData.description || '',
          rating: initialData.rating,
          image: initialData.image || '',
          tripId: initialData.tripId || tripId || '',
        }
      : {
          name: '',
          location: '',
          dateVisited: new Date().toISOString().slice(0, 10),
          description: '',
          rating: 5,
          image: '',
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

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!form.name.trim()) {
      setErrors({ name: 'Place name is required' });
      return;
    }

    setSaving(true);
    try {
      const payload = { ...form, rating: Number(form.rating), tripId: form.tripId || null };
      const { data } = isEdit
        ? await API.put(`/destinations/${initialData._id}`, payload)
        : await API.post('/destinations', payload);
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
          <label htmlFor="d-name">Place Name *</label>
          <input
            id="d-name"
            name="name"
            value={form.name}
            onChange={handleChange}
            placeholder="e.g. Rishikonda Beach"
          />
          {errors.name && <p className="form-error">{errors.name}</p>}
        </div>

        <div className="form-group">
          <label htmlFor="d-location">Location</label>
          <input
            id="d-location"
            name="location"
            value={form.location}
            onChange={handleChange}
            placeholder="e.g. Visakhapatnam"
          />
        </div>

        <div className="form-group">
          <label htmlFor="d-date">Date Visited *</label>
          <input id="d-date" name="dateVisited" type="date" value={form.dateVisited} onChange={handleChange} />
        </div>

        <div className="form-group">
          <label htmlFor="d-rating">Rating (1–5)</label>
          <input
            id="d-rating"
            name="rating"
            type="number"
            min="1"
            max="5"
            value={form.rating}
            onChange={handleChange}
          />
        </div>

        {!tripId && (
          <div className="form-group form-group-full">
            <label htmlFor="d-trip">Link to a Trip (optional)</label>
            <select id="d-trip" name="tripId" value={form.tripId || ''} onChange={handleChange}>
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
          <label htmlFor="d-desc">Description</label>
          <textarea
            id="d-desc"
            name="description"
            rows="3"
            value={form.description}
            onChange={handleChange}
            placeholder="Why was this place special?"
          />
        </div>

        <div className="form-group form-group-full">
          <label>Photo</label>
          <ImageUpload value={form.image} onChange={(url) => setForm({ ...form, image: url })} label="photo" />
        </div>
      </div>

      <div className="modal-actions">
        <button type="button" className="btn btn-outline" onClick={onCancel}>
          Cancel
        </button>
        <button type="submit" className="btn btn-primary" disabled={saving}>
          {saving ? 'Saving…' : isEdit ? 'Update Place' : 'Save Place'}
        </button>
      </div>
    </form>
  );
};

export default DestinationForm;
