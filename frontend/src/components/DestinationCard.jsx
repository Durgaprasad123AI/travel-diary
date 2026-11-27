/**
 * components/DestinationCard.jsx — saved place card with star rating.
 */
import { FaMapMarkerAlt, FaCalendarAlt, FaEdit, FaTrash } from 'react-icons/fa';
import { formatDate } from '../utils/format';

const Stars = ({ rating }) => (
  <span className="stars" title={`${rating} / 5`}>
    {'★'.repeat(rating)}
    {'☆'.repeat(5 - rating)}
  </span>
);

const DestinationCard = ({ destination, onEdit, onDelete }) => (
  <div className="destination-card">
    <div className="destination-card-img">
      <img src={destination.image || `https://images.unsplash.com/photo-1506905925346-21bda4d32df4?auto=format&fit=crop&w=800&q=80`} alt={destination.name} />
      <span className="destination-rating-badge">
        <Stars rating={destination.rating} />
      </span>
    </div>
    <div className="destination-card-body">
      <h3 className="destination-card-title">{destination.name}</h3>
      {destination.location && (
        <p className="destination-card-location">
          <FaMapMarkerAlt /> {destination.location}
        </p>
      )}
      <p className="destination-card-date">
        <FaCalendarAlt /> {formatDate(destination.dateVisited)}
      </p>
      {destination.description && <p className="destination-card-desc">{destination.description}</p>}
      <div className="destination-card-actions">
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

export default DestinationCard;
