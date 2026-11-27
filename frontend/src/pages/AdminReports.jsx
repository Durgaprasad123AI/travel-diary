/**
 * pages/AdminReports.jsx — platform reports rendered with pure-CSS bar charts.
 */
import { useState, useEffect } from 'react';
import API from '../services/api';
import Loader from '../components/Loader';
import { formatCurrency } from '../utils/format';
import {
  FaUsers,
  FaSuitcase,
  FaBookOpen,
  FaWallet,
  FaMapMarkerAlt,
  FaChartBar,
  FaCalendarAlt,
  FaTrophy,
} from 'react-icons/fa';

export default function AdminReports() {
  const [report, setReport] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    API.get('/admin/reports')
      .then(({ data }) => setReport(data))
      .catch(() => {})
      .finally(() => setLoading(false));
  }, []);

  if (loading) return <Loader />;

  const categories = report?.expenseCategories || [];
  const maxCat = categories.reduce((m, c) => Math.max(m, c.total), 1);
  const months = report?.tripsByMonth || [];
  const maxMonth = months.reduce((m, t) => Math.max(m, t.count), 1);
  const totals = report?.totals || {};

  return (
    <div className="page">
      <div className="page-header">
        <div>
          <h1>Reports</h1>
          <p>Platform-wide analytics and insights.</p>
        </div>
      </div>

      <div className="stats-grid">
        <div className="stat-card">
          <div className="stat-icon" style={{ backgroundColor: '#008cba18', color: '#008CBA' }}><FaUsers /></div>
          <div className="stat-info"><p className="stat-value">{totals.users ?? 0}</p><p className="stat-label">Users</p></div>
        </div>
        <div className="stat-card">
          <div className="stat-icon" style={{ backgroundColor: '#8b5cf618', color: '#8b5cf6' }}><FaSuitcase /></div>
          <div className="stat-info"><p className="stat-value">{totals.trips ?? 0}</p><p className="stat-label">Trips</p></div>
        </div>
        <div className="stat-card">
          <div className="stat-icon" style={{ backgroundColor: '#10b98118', color: '#10b981' }}><FaBookOpen /></div>
          <div className="stat-info"><p className="stat-value">{totals.memories ?? 0}</p><p className="stat-label">Memories</p></div>
        </div>
        <div className="stat-card">
          <div className="stat-icon" style={{ backgroundColor: '#ef444418', color: '#ef4444' }}><FaWallet /></div>
          <div className="stat-info"><p className="stat-value">{totals.expenses ?? 0}</p><p className="stat-label">Expense records</p></div>
        </div>
        <div className="stat-card">
          <div className="stat-icon" style={{ backgroundColor: '#f59e0b18', color: '#f59e0b' }}><FaMapMarkerAlt /></div>
          <div className="stat-info"><p className="stat-value">{totals.destinations ?? 0}</p><p className="stat-label">Destinations</p></div>
        </div>
      </div>

      <div className="reports-grid">
        {/* Spending by category */}
        <div className="card">
          <h3 className="card-title"><FaChartBar /> Spending by Category</h3>
          {categories.length === 0 ? (
            <p className="muted">No expense data yet.</p>
          ) : (
            categories.map((c) => (
              <div className="category-bar" key={c._id}>
                <div className="category-bar-head">
                  <span className="category-name">{c._id}</span>
                  <span className="category-amount">{formatCurrency(c.total)} ({c.count})</span>
                </div>
                <div className="category-track">
                  <div className="category-fill" style={{ width: `${(c.total / maxCat) * 100}%`, backgroundColor: '#008CBA' }} />
                </div>
              </div>
            ))
          )}
        </div>

        {/* Trips per month */}
        <div className="card">
          <h3 className="card-title"><FaCalendarAlt /> Trips Created per Month</h3>
          {months.length === 0 ? (
            <p className="muted">No trips created yet.</p>
          ) : (
            months.map((m) => (
              <div className="category-bar" key={m.month}>
                <div className="category-bar-head">
                  <span className="category-name">{m.month}</span>
                  <span className="category-amount">{m.count}</span>
                </div>
                <div className="category-track">
                  <div className="category-fill" style={{ width: `${(m.count / maxMonth) * 100}%`, backgroundColor: '#8b5cf6' }} />
                </div>
              </div>
            ))
          )}
        </div>

        {/* Top destinations */}
        <div className="card">
          <h3 className="card-title"><FaTrophy /> Top Destinations</h3>
          {report?.topDestinations?.length === 0 ? (
            <p className="muted">No destinations yet.</p>
          ) : (
            report?.topDestinations?.map((d, i) => (
              <div className="rank-row" key={d._id}>
                <span className="rank-number">#{i + 1}</span>
                <span className="rank-name">{d._id}</span>
                <span className="rank-count">{d.count} trip{d.count === 1 ? '' : 's'}</span>
              </div>
            ))
          )}
        </div>
      </div>
    </div>
  );
}
