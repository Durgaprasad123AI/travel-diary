/**
 * components/ExploreTripCard.jsx — NEW (Explore feature)
 * Card for the Explore feed: another user's trip + owner + rating + comments.
 */
import { Link } from 'react-router-dom';
import { FaMapMarkerAlt, FaCalendarAlt, FaComment, FaEye, FaWallet } from 'react-icons/fa';
import { getDefaultTripImage } from '../constants/images';
import { formatDate, formatCurrency } from '../utils/format';
import { Stars } from './RatingStars';

const avatarFor = (name) =>
  `https://ui-avatars.com/api/?background=008CBA&color=fff&name=${encodeURIComponent(name || 'T')}`;

const ExploreTripCard = ({ trip }) => (
  <div className="trip-card explore-card">
    <div className="trip-card-img">
      <img src={trip.coverImage || getDefaultTripImage()} alt={trip.tripName} />
      <span className="trip-type-badge">{trip.travelType}</span>
    </div>
    <div className="trip-card-body">
      <div className="explore-owner">
        <img
          src={trip.userId?.profileImage || avatarFor(trip.userId?.name)}
          alt={trip.userId?.name}
          className="explore-owner-avatar"
        />
        <span>by {trip.userId?.name}</span>
      </div>
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
        <span className="explore-rating">
          <Stars rating={trip.avgRating} />
          <b>{trip.avgRating || '—'}</b>
          <small>({trip.ratingCount})</small>
          <span className="meta-counts">
            <FaComment /> {trip.commentCount}
          </span>
        </span>
      </div>
      <Link to={`/explore/${trip._id}`} className="btn btn-primary btn-sm btn-block">
        <FaEye /> View Experience
      </Link>
    </div>
  </div>
);

export default ExploreTripCard;
