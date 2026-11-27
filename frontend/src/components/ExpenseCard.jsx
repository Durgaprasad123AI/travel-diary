/**
 * components/ExpenseCard.jsx — single expense record row.
 */
import { FaEdit, FaTrash, FaCalendarAlt, FaTag } from 'react-icons/fa';
import { formatDate, formatCurrency } from '../utils/format';

const ExpenseCard = ({ expense, onEdit, onDelete }) => (
  <div className="expense-row">
    <div className="expense-cat-icon">{expense.category.slice(0, 2).toUpperCase()}</div>
    <div className="expense-info">
      <p className="expense-name">{expense.name}</p>
      <p className="expense-meta">
        <FaTag /> {expense.category} · <FaCalendarAlt /> {formatDate(expense.date)}
        {expense.description ? ` · ${expense.description}` : ''}
      </p>
    </div>
    <p className="expense-amount">{formatCurrency(expense.amount)}</p>
    <div className="expense-actions">
      <button className="icon-btn" onClick={onEdit} title="Edit" aria-label="Edit">
        <FaEdit />
      </button>
      <button className="icon-btn danger" onClick={onDelete} title="Delete" aria-label="Delete">
        <FaTrash />
      </button>
    </div>
  </div>
);

export default ExpenseCard;
