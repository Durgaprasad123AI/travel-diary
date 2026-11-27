/**
 * components/MemoryCard.jsx — diary-style memory card.
 */
import { FaMapMarkerAlt, FaCalendarAlt, FaEdit, FaTrash, FaHeart } from 'react-icons/fa';
import { formatDate, MOOD_EMOJI, MOOD_COLOR } from '../utils/format';

const MemoryCard = ({ memory, onEdit, onDelete }) => (
  <div className="memory-card">
    {memory.image ? (
      <div className="memory-card-img">
        <img src={memory.image} alt={memory.title} />
        <span className="memory-mood" style={{ backgroundColor: MOOD_COLOR[memory.mood] }}>
          {MOOD_EMOJI[memory.mood] || '😊'}
        </span>
      </div>
    ) : (
      <div className="memory-card-img memory-card-img-empty">
        <FaHeart />
        <span className="memory-mood" style={{ backgroundColor: MOOD_COLOR[memory.mood] }}>
          {MOOD_EMOJI[memory.mood] || '😊'}
        </span>
      </div>
    )}
    <div className="memory-card-body">
      <p className="memory-card-date">
        <FaCalendarAlt /> {formatDate(memory.date)}
      </p>
      <h3 className="memory-card-title">{memory.title}</h3>
      {memory.location && (
        <p className="memory-card-location">
          <FaMapMarkerAlt /> {memory.location}
        </p>
      )}
      {memory.description && <p className="memory-card-desc">{memory.description}</p>}
      <div className="memory-card-actions">
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

export default MemoryCard;
