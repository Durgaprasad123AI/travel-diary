/**
 * pages/NotFound.jsx — 404 page.
 */
import { Link } from 'react-router-dom';
import { FaCompass } from 'react-icons/fa';

const NotFound = () => (
  <div className="notfound">
    <FaCompass className="notfound-icon" />
    <h1>404</h1>
    <p>Looks like you've wandered off the map — this page doesn't exist.</p>
    <Link to="/" className="btn btn-primary">
      Back to Home
    </Link>
  </div>
);

export default NotFound;
