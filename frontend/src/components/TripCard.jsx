/**
 * components/TripCard.jsx — trip card shown on My Trips & Dashboard.
 */
import { FaMapMarkerAlt, FaWallet, FaCalendarAlt, FaEye, FaEdit, FaTrash } from 'react-icons/fa';
import { getDefaultTripImage } from '../constants/images';
import { formatDate, formatCurrency } from '../utils/format';

const TripCard = ({ trip, onView, onEdit, onDelete }) => (
  <div className="trip-card">
    <div className="trip-card-img">
      <img src={trip.coverImage || getDefaultTripImage()} alt={trip.tripName} />
      <span className="trip-type-badge">{trip.travelType}</span>
    </div>
    <div className="trip-card-body">
      <h3 className="trip-card-title">{trip.tripName}</h3>
      <p className="trip-card-location">
        <FaMapMarkerAlt /> {trip.destination}
        {trip.country ? `, ${trip.country}` : ''}
      </p>
      <p className="trip-card-dates">
        <FaCalendarAlt /> {formatDate(trip.startDate)} — {formatDate(trip.endDate)}
      </p>
      {trip.description && <p className="trip-card-desc">{trip.description}</p>}
      <div className="trip-card-meta">
        <span className="meta-budget">
          <FaWallet /> {formatCurrency(trip.budget)}
        </span>
        <span className="meta-counts">
          {trip.memoryCount ?? 0} 📖 · {trip.expenseCount ?? 0} 💸 · {trip.destinationCount ?? 0} 📍
        </span>
      </div>
      <div className="trip-card-actions">
        <button className="btn btn-primary btn-sm" onClick={onView}>
          <FaEye /> View
        </button>
        <button className="btn btn-outline btn-sm" onClick={onEdit}>
          <FaEdit /> Edit
        </button>
        <button className="btn btn-danger-outline btn-sm" onClick={onDelete}>
          <FaTrash /> Delete
        </button>
      </div>
    </div>
  </div>
);

export default TripCard;
