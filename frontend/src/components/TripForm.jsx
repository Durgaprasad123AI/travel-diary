/**
 * components/TripForm.jsx
 * Used by the Add Trip page for BOTH creating (/trips/add) and
 * editing (/trips/edit/:id) a trip.
 */
import { useState, useEffect } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import API from '../services/api';
import ImageUpload from './ImageUpload';

const TRAVEL_TYPES = ['Solo', 'Family', 'Friends', 'Business', 'Couple'];

const TripForm = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const isEdit = Boolean(id);

  const [form, setForm] = useState({
    tripName: '',
    destination: '',
    country: '',
    startDate: '',
    endDate: '',
    description: '',
    travelType: 'Solo',
    budget: '',
    coverImage: '',
  });
  const [errors, setErrors] = useState({});
  const [saving, setSaving] = useState(false);
  const [loading, setLoading] = useState(isEdit);

  // Edit mode: pre-fill the form with the existing trip
  useEffect(() => {
    if (!isEdit) return;
    let active = true;
    API.get(`/trips/${id}`)
      .then(({ data }) => {
        if (!active) return;
        const t = data.trip;
        setForm({
          tripName: t.tripName,
          destination: t.destination,
          country: t.country || '',
          startDate: (t.startDate || '').slice(0, 10),
          endDate: (t.endDate || '').slice(0, 10),
          description: t.description || '',
          travelType: t.travelType,
          budget: t.budget || '',
          coverImage: t.coverImage || '',
        });
      })
      .catch(() => navigate('/trips'))
      .finally(() => active && setLoading(false));
    return () => {
      active = false;
    };
  }, [id, isEdit, navigate]);

  const handleChange = (e) => setForm({ ...form, [e.target.name]: e.target.value });

  const validate = () => {
    const errs = {};
    if (!form.tripName.trim()) errs.tripName = 'Trip name is required';
    if (!form.destination.trim()) errs.destination = 'Destination is required';
    if (!form.startDate) errs.startDate = 'Start date is required';
    if (!form.endDate) errs.endDate = 'End date is required';
    if (form.startDate && form.endDate && form.endDate < form.startDate) {
      errs.endDate = 'End date cannot be before start date';
    }
    if (form.budget !== '' && (Number(form.budget) < 0 || Number.isNaN(Number(form.budget)))) {
      errs.budget = 'Budget must be a positive number';
    }
    return errs;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    const errs = validate();
    setErrors(errs);
    if (Object.keys(errs).length > 0) return;

    const payload = {
      ...form,
      budget: Number(form.budget) || 0,
      coverImage: form.coverImage || '', // fallback image is applied on the card if empty
    };

    setSaving(true);
    try {
      if (isEdit) {
        const { data } = await API.put(`/trips/${id}`, payload);
        navigate(`/trips/${data._id}`);
      } else {
        const { data } = await API.post('/trips', payload);
        navigate(`/trips/${data._id}`);
      }
    } catch (err) {
      setErrors({ form: err.response?.data?.message || 'Something went wrong. Please try again.' });
      setSaving(false);
    }
  };

  if (loading) return <div className="spinner" />;

  return (
    <form className="card form-card" onSubmit={handleSubmit} noValidate>
      {errors.form && <div className="alert alert-error">{errors.form}</div>}
      <h2 className="form-title">{isEdit ? '✏️ Edit Trip' : '🌍 Add New Trip'}</h2>
      <p className="form-subtitle">
        {isEdit ? 'Update the details of your journey.' : 'Plan your next adventure — every journey tells a story.'}
      </p>

      <div className="form-grid">
        <div className="form-group">
          <label htmlFor="tripName">Trip Name *</label>
          <input
            id="tripName"
            name="tripName"
            value={form.tripName}
            onChange={handleChange}
            placeholder="e.g. Goa Beach Trip"
          />
          {errors.tripName && <p className="form-error">{errors.tripName}</p>}
        </div>

        <div className="form-group">
          <label htmlFor="travelType">Travel Type *</label>
          <select id="travelType" name="travelType" value={form.travelType} onChange={handleChange}>
            {TRAVEL_TYPES.map((t) => (
              <option key={t} value={t}>
                {t}
              </option>
            ))}
          </select>
        </div>

        <div className="form-group">
          <label htmlFor="destination">Destination *</label>
          <input
            id="destination"
            name="destination"
            value={form.destination}
            onChange={handleChange}
            placeholder="e.g. Goa"
          />
          {errors.destination && <p className="form-error">{errors.destination}</p>}
        </div>

        <div className="form-group">
          <label htmlFor="country">Country</label>
          <input
            id="country"
            name="country"
            value={form.country}
            onChange={handleChange}
            placeholder="e.g. India"
          />
        </div>

        <div className="form-group">
          <label htmlFor="startDate">Start Date *</label>
          <input id="startDate" name="startDate" type="date" value={form.startDate} onChange={handleChange} />
          {errors.startDate && <p className="form-error">{errors.startDate}</p>}
        </div>

        <div className="form-group">
          <label htmlFor="endDate">End Date *</label>
          <input id="endDate" name="endDate" type="date" value={form.endDate} onChange={handleChange} />
          {errors.endDate && <p className="form-error">{errors.endDate}</p>}
        </div>

        <div className="form-group">
          <label htmlFor="budget">Total Budget (₹)</label>
          <input
            id="budget"
            name="budget"
            type="number"
            min="0"
            value={form.budget}
            onChange={handleChange}
            placeholder="e.g. 50000"
          />
          {errors.budget && <p className="form-error">{errors.budget}</p>}
        </div>

        <div className="form-group form-group-full">
          <label htmlFor="description">Trip Description</label>
          <textarea
            id="description"
            name="description"
            rows="4"
            value={form.description}
            onChange={handleChange}
            placeholder="Describe your trip — places, people, plans…"
          />
        </div>

        <div className="form-group form-group-full">
          <label>Cover Image</label>
          <ImageUpload value={form.coverImage} onChange={(url) => setForm({ ...form, coverImage: url })} label="cover image" />
        </div>
      </div>

      <div className="form-actions">
        <button type="button" className="btn btn-outline" onClick={() => navigate(-1)}>
          Cancel
        </button>
        <button type="submit" className="btn btn-primary" disabled={saving}>
          {saving ? 'Saving…' : isEdit ? 'Update Trip' : 'Create Trip'}
        </button>
      </div>
    </form>
  );
};

export default TripForm;
