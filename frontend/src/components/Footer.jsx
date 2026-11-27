/**
 * components/Footer.jsx — site footer (Home page).
 */
import { Link } from 'react-router-dom';
import { FaPlaneDeparture, FaMapMarkerAlt, FaEnvelope, FaHeart } from 'react-icons/fa';

const Footer = () => (
  <footer className="site-footer">
    <div className="container footer-grid">
      <div className="footer-col">
        <Link to="/" className="brand brand-light">
          <span className="brand-icon">
            <FaPlaneDeparture />
          </span>
          <span className="brand-text">
            Travel <span>Diary</span>
          </span>
        </Link>
        <p>
          Record your adventures, save your favorite places, track your travel expenses and preserve your
          unforgettable memories in one place.
        </p>
      </div>

      <div className="footer-col">
        <h4>Quick Links</h4>
        <Link to="/">Home</Link>
        <Link to="/register">Create Account</Link>
        <Link to="/login">Login</Link>
        <Link to="/admin/login">Admin Login</Link>
      </div>

      <div className="footer-col">
        <h4>Features</h4>
        <span>Trip Planning</span>
        <span>Travel Memories</span>
        <span>Expense Tracking</span>
        <span>Saved Destinations</span>
      </div>

      <div className="footer-col">
        <h4>Contact</h4>
        <span>
          <FaMapMarkerAlt /> India
        </span>
        <span>
          <FaEnvelope /> support@traveldiary.com
        </span>
      </div>
    </div>

    <div className="footer-bottom">
      <div className="container">
        <p>
          © {new Date().getFullYear()} Travel Diary. Built with <FaHeart /> for every traveler. Every Journey
          Tells a Story.
        </p>
      </div>
    </div>
  </footer>
);

export default Footer;
