/**
 * pages/Explore.jsx — NEW (Explore feature)
 * Feed of trips created by OTHER users, with search, sort,
 * average ratings and comment counts.
 */
import { useState, useEffect } from 'react';
import API from '../services/api';
import ExploreTripCard from '../components/ExploreTripCard';
import Loader from '../components/Loader';
import { FaSearch, FaCompass } from 'react-icons/fa';

export default function Explore() {
  const [trips, setTrips] = useState([]);
  const [search, setSearch] = useState('');
  const [sort, setSort] = useState('recent');
  const [loading, setLoading] = useState(true);

  const load = async (term = search, sortBy = sort) => {
    setLoading(true);
    try {
      const params = { sort: sortBy };
      if (term.trim()) params.search = term.trim();
      const { data } = await API.get('/explore', { params });
      setTrips(data);
    } catch {
      setTrips([]);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    load('', 'recent');
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  return (
    <div className="page">
      <div className="page-header">
        <div>
          <h1>Explore Trips</h1>
          <p>Discover journeys shared by other travelers — rate and comment on their experiences.</p>
        </div>
      </div>

      {/* Search + sort */}
      <div className="explore-toolbar">
        <div className="search-bar">
          <FaSearch />
          <input
            type="text"
            placeholder="Search by trip name, destination or country…"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            onKeyDown={(e) => e.key === 'Enter' && load()}
          />
          <button className="btn btn-primary btn-sm" onClick={() => load()}>
            Search
          </button>
        </div>
        <select
          className="explore-sort"
          value={sort}
          onChange={(e) => {
            setSort(e.target.value);
            load(search, e.target.value);
          }}
        >
          <option value="recent">Most recent</option>
          <option value="top">Top rated</option>
        </select>
      </div>

      {loading ? (
        <Loader />
      ) : trips.length === 0 ? (
        <div className="empty-state">
          <span className="empty-icon">
            <FaCompass />
          </span>
          <h3>No trips to explore yet</h3>
          <p>When other travelers create trips, they'll show up here.</p>
        </div>
      ) : (
        <div className="trips-grid">
          {trips.map((trip) => (
            <ExploreTripCard key={trip._id} trip={trip} />
          ))}
        </div>
      )}
    </div>
  );
}
