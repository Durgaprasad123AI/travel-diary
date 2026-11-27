/**
 * pages/ExploreTripDetails.jsx — NEW (Explore feature)
 * Public view of another user's trip: full experience + rating + comments.
 * Read-only content; the only interactions are rating and commenting.
 */
import { useState, useEffect } from 'react';
import { Link, useParams } from 'react-router-dom';
import API from '../services/api';
import { useAuth } from '../context/AuthContext';
import { Stars, StarPicker } from '../components/RatingStars';
import Loader from '../components/Loader';
import { getDefaultTripImage } from '../constants/images';
import { formatDate, formatCurrency, MOOD_EMOJI } from '../utils/format';
import {
  FaArrowLeft,
  FaMapMarkerAlt,
  FaCalendarAlt,
  FaWallet,
  FaMoneyBillWave,
  FaBookOpen,
  FaComment,
  FaTrash,
  FaPaperPlane,
} from 'react-icons/fa';

const TABS = [
  { id: 'overview', label: 'Overview' },
  { id: 'memories', label: 'Memories' },
  { id: 'places', label: 'Places' },
  { id: 'expenses', label: 'Expenses' },
];

const avatarFor = (name) =>
  `https://ui-avatars.com/api/?background=008CBA&color=fff&name=${encodeURIComponent(name || 'T')}`;

export default function ExploreTripDetails() {
  const { id } = useParams();
  const { user } = useAuth();

  const [data, setData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [tab, setTab] = useState('overview');

  // Rating state
  const [starHover, setStarHover] = useState(0);
  const [ratingMsg, setRatingMsg] = useState('');
  const [savingRating, setSavingRating] = useState(false);

  // Comment state
  const [commentText, setCommentText] = useState('');
  const [sendingComment, setSendingComment] = useState(false);

  const load = async () => {
    try {
      const { data } = await API.get(`/explore/${id}`);
      setData(data);
    } catch {
      setData(null);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    load();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [id]);

  if (loading) return <Loader />;

  if (!data) {
    return (
      <div className="page">
        <div className="empty-state">
          <span className="empty-icon">🧭</span>
          <h3>Trip not found</h3>
          <Link to="/explore" className="btn btn-primary">
            Back to Explore
          </Link>
        </div>
      </div>
    );
  }

  const { trip, memories, expenses, destinations, totalExpense, avgRating, ratingCount, myRating, comments } = data;

  const handleRate = async (value) => {
    setSavingRating(true);
    setRatingMsg('');
    try {
      const { data: res } = await API.post(`/explore/${id}/rate`, { rating: value });
      setRatingMsg(res.message);
      setData({ ...data, myRating: value });
      setTimeout(() => setRatingMsg(''), 3000);
    } catch (err) {
      setRatingMsg(err.response?.data?.message || 'Could not save rating');
    } finally {
      setSavingRating(false);
    }
  };

  const handleComment = async (e) => {
    e.preventDefault();
    if (!commentText.trim()) return;
    setSendingComment(true);
    try {
      const { data: created } = await API.post(`/explore/${id}/comments`, { text: commentText.trim() });
      setData({ ...data, comments: [created, ...comments] });
      setCommentText('');
    } catch (err) {
      setRatingMsg(err.response?.data?.message || 'Could not post comment');
    } finally {
      setSendingComment(false);
    }
  };

  const handleDeleteComment = async (commentId) => {
    try {
      await API.delete(`/explore/comments/${commentId}`);
      setData({ ...data, comments: comments.filter((c) => c._id !== commentId) });
    } catch {
      // ignore
    }
  };

  return (
    <div className="page">
      <Link to="/explore" className="back-link">
        <FaArrowLeft /> Back to Explore
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
          <div className="explore-owner explore-owner-hero">
            <img
              src={trip.userId?.profileImage || avatarFor(trip.userId?.name)}
              alt={trip.userId?.name}
              className="explore-owner-avatar"
            />
            <span>
              Shared by <strong>{trip.userId?.name}</strong>
            </span>
          </div>
        </div>
      </div>

      {/* Rating + summary */}
      <div className="trip-summary explore-summary">
        <div className="rating-panel">
          <div>
            <p className="rating-big">
              {avgRating || '—'} <small>/ 5</small>
            </p>
            <p className="rating-count">
              <Stars rating={avgRating} /> {ratingCount} rating{ratingCount === 1 ? '' : 's'}
            </p>
          </div>
          <div className="rating-cta">
            <p className="rating-cta-title">{myRating ? 'Your rating:' : 'Rate this trip:'}</p>
            <StarPicker
              value={starHover || myRating}
              onChange={(v) => setStarHover(v)}
            />
            {myRating > 0 && starHover === 0 && (
              <button className="btn btn-primary btn-sm" disabled={savingRating} onClick={() => handleRate(myRating)}>
                {savingRating ? 'Saving…' : `Save my ${myRating}★`}
              </button>
            )}
            {starHover > 0 && (
              <button className="btn btn-primary btn-sm" disabled={savingRating} onClick={() => handleRate(starHover)}>
                {savingRating ? 'Saving…' : `Rate ${starHover}★`}
              </button>
            )}
          </div>
        </div>
        {ratingMsg && <p className="form-error">{ratingMsg}</p>}

        <div className="trip-summary-stats">
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
              <p className="trip-summary-label">Places</p>
            </div>
          </div>
        </div>
      </div>

      {/* Tabs */}
      <div className="tabs">
        {TABS.map((t) => (
          <button key={t.id} className={`tab ${tab === t.id ? 'active' : ''}`} onClick={() => setTab(t.id)}>
            {t.label}
          </button>
        ))}
      </div>

      {/* Overview */}
      {tab === 'overview' && (
        <div className="tab-content">
          <div className="card overview-card">
            <h3>About this trip</h3>
            <p>{trip.description || <span className="muted">No description added.</span>}</p>
          </div>
          <div className="overview-lists">
            <div className="card">
              <div className="card-head">
                <h3>Recent Memories</h3>
                <span className="muted">{memories.length}</span>
              </div>
              {memories.length === 0 ? (
                <p className="muted">No memories shared.</p>
              ) : (
                <div className="mini-grid">
                  {memories.slice(0, 3).map((m) => (
                    <div className="public-memory" key={m._id}>
                      {m.image ? (
                        <img src={m.image} alt={m.title} />
                      ) : (
                        <div className="public-memory-ph">📖</div>
                      )}
                      <div className="public-memory-body">
                        <p className="public-memory-date">
                          {formatDate(m.date)} {MOOD_EMOJI[m.mood] || ''}
                        </p>
                        <h4>{m.title}</h4>
                        {m.location && (
                          <p className="public-memory-loc">
                            <FaMapMarkerAlt /> {m.location}
                          </p>
                        )}
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>
            <div className="card">
              <div className="card-head">
                <h3>Places Visited</h3>
                <span className="muted">{destinations.length}</span>
              </div>
              {destinations.length === 0 ? (
                <p className="muted">No places shared.</p>
              ) : (
                <div className="mini-grid">
                  {destinations.slice(0, 3).map((d) => (
                    <div className="public-place" key={d._id}>
                      <img
                        src={d.image || 'https://images.unsplash.com/photo-1506905925346-21bda4d32df4?auto=format&fit=crop&w=800&q=80'}
                        alt={d.name}
                      />
                      <div>
                        <h4>{d.name}</h4>
                        <Stars rating={d.rating} />
                        {d.location && <p className="public-place-loc">{d.location}</p>}
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>
          </div>
        </div>
      )}

      {/* Memories */}
      {tab === 'memories' && (
        <div className="tab-content">
          <div className="card">
            <h3 className="card-title">Memories ({memories.length})</h3>
            {memories.length === 0 ? (
              <p className="muted">No memories shared for this trip.</p>
            ) : (
              <div className="memories-grid">
                {memories.map((m) => (
                  <div className="public-memory large" key={m._id}>
                    {m.image ? (
                      <img src={m.image} alt={m.title} />
                    ) : (
                      <div className="public-memory-ph">📖</div>
                    )}
                    <div className="public-memory-body">
                      <p className="public-memory-date">
                        {formatDate(m.date)} {MOOD_EMOJI[m.mood] || ''}
                      </p>
                      <h4>{m.title}</h4>
                      {m.location && (
                        <p className="public-memory-loc">
                          <FaMapMarkerAlt /> {m.location}
                        </p>
                      )}
                      {m.description && <p className="public-memory-desc">{m.description}</p>}
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>
      )}

      {/* Places */}
      {tab === 'places' && (
        <div className="tab-content">
          <div className="card">
            <h3 className="card-title">Places Visited ({destinations.length})</h3>
            {destinations.length === 0 ? (
              <p className="muted">No places shared for this trip.</p>
            ) : (
              <div className="destinations-grid">
                {destinations.map((d) => (
                  <div className="public-place card" key={d._id}>
                    <img
                      src={d.image || 'https://images.unsplash.com/photo-1506905925346-21bda4d32df4?auto=format&fit=crop&w=800&q=80'}
                      alt={d.name}
                    />
                    <div className="public-place-body">
                      <h4>{d.name}</h4>
                      <Stars rating={d.rating} />
                      {d.location && <p className="public-place-loc">{d.location}</p>}
                      {d.description && <p className="public-place-desc">{d.description}</p>}
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>
      )}

      {/* Expenses */}
      {tab === 'expenses' && (
        <div className="tab-content">
          <div className="card">
            <h3 className="card-title">
              Expenses ({expenses.length}) — Total {formatCurrency(totalExpense)}
            </h3>
            {expenses.length === 0 ? (
              <p className="muted">No expenses shared for this trip.</p>
            ) : (
              expenses.map((e) => (
                <div className="expense-row" key={e._id}>
                  <div className="expense-cat-icon">{e.category.slice(0, 2).toUpperCase()}</div>
                  <div className="expense-info">
                    <p className="expense-name">{e.name}</p>
                    <p className="expense-meta">
                      {e.category} · {formatDate(e.date)}
                    </p>
                  </div>
                  <p className="expense-amount">{formatCurrency(e.amount)}</p>
                </div>
              ))
            )}
          </div>
        </div>
      )}

      {/* Comments */}
      <div className="card comments-section">
        <div className="card-head">
          <h3>
            <FaComment /> Comments ({comments.length})
          </h3>
        </div>

        <form className="comment-form" onSubmit={handleComment}>
          <img src={user?.profileImage || avatarFor(user?.name)} alt={user?.name} className="comment-avatar" />
          <input
            type="text"
            placeholder="Share your thoughts about this trip…"
            value={commentText}
            maxLength={500}
            onChange={(e) => setCommentText(e.target.value)}
          />
          <button type="submit" className="btn btn-primary btn-sm" disabled={sendingComment || !commentText.trim()}>
            <FaPaperPlane /> {sendingComment ? 'Posting…' : 'Post'}
          </button>
        </form>

        {comments.length === 0 ? (
          <p className="muted">No comments yet — be the first to comment!</p>
        ) : (
          comments.map((c) => (
            <div className="comment" key={c._id}>
              <img
                src={c.userId?.profileImage || avatarFor(c.userId?.name)}
                alt={c.userId?.name}
                className="comment-avatar"
              />
              <div className="comment-body">
                <div className="comment-head">
                  <span className="comment-author">{c.userId?.name}</span>
                  <span className="comment-time">{formatDate(c.createdAt)}</span>
                  {c.userId?._id === user?._id && (
                    <button className="icon-btn danger comment-delete" onClick={() => handleDeleteComment(c._id)} title="Delete comment">
                      <FaTrash />
                    </button>
                  )}
                </div>
                <p className="comment-text">{c.text}</p>
              </div>
            </div>
          ))
        )}
      </div>
    </div>
  );
}
