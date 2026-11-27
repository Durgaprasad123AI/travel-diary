/**
 * components/Modal.jsx — generic modal dialog (add/edit forms, user details…).
 * Clicking the dark overlay closes it; clicking inside does not.
 */
import { FaTimes } from 'react-icons/fa';

const Modal = ({ title, onClose, children, size = 'md' }) => (
  <div className="modal-overlay" onClick={onClose}>
    <div className={`modal modal-${size}`} onClick={(e) => e.stopPropagation()}>
      <div className="modal-header">
        <h3>{title}</h3>
        <button className="modal-close" onClick={onClose} aria-label="Close">
          <FaTimes />
        </button>
      </div>
      <div className="modal-body">{children}</div>
    </div>
  </div>
);

export default Modal;
