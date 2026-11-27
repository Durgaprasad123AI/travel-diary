/**
 * components/StatCard.jsx — dashboard metric card (icon + value + label).
 */
const StatCard = ({ icon, label, value, color = '#008CBA' }) => (
  <div className="stat-card">
    <div className="stat-icon" style={{ backgroundColor: `${color}18`, color }}>
      {icon}
    </div>
    <div className="stat-info">
      <p className="stat-value">{value}</p>
      <p className="stat-label">{label}</p>
    </div>
  </div>
);

export default StatCard;
