/**
 * components/RatingStars.jsx — NEW (Explore feature)
 * Stars   : read-only star display
 * StarPicker : clickable 1–5 star input
 */
import { FaStar, FaRegStar } from 'react-icons/fa';

/** Read-only stars (rounded to nearest star for display). */
export const Stars = ({ rating = 0, size = '0.95rem' }) => (
  <span className="stars" style={{ fontSize: size }}>
    {[1, 2, 3, 4, 5].map((i) =>
      i <= Math.round(rating) ? <FaStar key={i} /> : <FaRegStar key={i} />
    )}
  </span>
);

/** Interactive star picker — click a star to rate. */
export const StarPicker = ({ value = 0, onChange, size = '1.7rem' }) => (
  <span className="star-picker">
    {[1, 2, 3, 4, 5].map((i) => (
      <button
        key={i}
        type="button"
        className={`star-btn ${i <= value ? 'on' : ''}`}
        style={{ fontSize: size }}
        onClick={() => onChange(i)}
        aria-label={`Rate ${i} star${i > 1 ? 's' : ''}`}
      >
        {i <= value ? <FaStar /> : <FaRegStar />}
      </button>
    ))}
  </span>
);
