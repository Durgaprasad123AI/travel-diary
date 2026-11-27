/**
 * controllers/expenseController.js
 * CRUD for expenses + total and per-category summaries.
 */
const Expense = require('../models/Expense');

const CATEGORIES = ['Food', 'Transport', 'Hotel', 'Shopping', 'Entertainment', 'Other'];

/**
 * GET /api/expenses?tripId=<id>
 * Returns expenses plus computed totals and category breakdown.
 */
const getExpenses = async (req, res) => {
  const filter = { userId: req.user._id };
  if (req.query.tripId) filter.tripId = req.query.tripId;

  const expenses = await Expense.find(filter).sort({ date: -1 });

  const total = expenses.reduce((sum, e) => sum + e.amount, 0);
  const categoryTotals = CATEGORIES.map((category) => ({
    category,
    total: expenses.filter((e) => e.category === category).reduce((sum, e) => sum + e.amount, 0),
  })).filter((c) => c.total > 0);

  res.json({ expenses, total, categoryTotals });
};

/**
 * POST /api/expenses
 */
const createExpense = async (req, res) => {
  const { name, category, amount, date, description, tripId } = req.body;

  if (!name || !name.trim()) return res.status(400).json({ message: 'Expense name is required' });
  if (amount === undefined || amount === '' || Number(amount) < 0) {
    return res.status(400).json({ message: 'Please enter a valid amount' });
  }

  const expense = await Expense.create({
    userId: req.user._id,
    tripId: tripId || null,
    name: name.trim(),
    category: category || 'Other',
    amount: Number(amount),
    date: date || Date.now(),
    description: description || '',
  });

  res.status(201).json(expense);
};

/**
 * PUT /api/expenses/:id
 */
const updateExpense = async (req, res) => {
  const expense = await Expense.findOne({ _id: req.params.id, userId: req.user._id });
  if (!expense) return res.status(404).json({ message: 'Expense not found' });

  const { name, category, amount, date, description, tripId } = req.body;
  if (name !== undefined) expense.name = name.trim();
  if (category !== undefined) expense.category = category;
  if (amount !== undefined) expense.amount = Number(amount);
  if (date !== undefined) expense.date = date;
  if (description !== undefined) expense.description = description;
  if (tripId !== undefined) expense.tripId = tripId || null;

  await expense.save();
  res.json(expense);
};

/**
 * DELETE /api/expenses/:id
 */
const deleteExpense = async (req, res) => {
  const expense = await Expense.findOne({ _id: req.params.id, userId: req.user._id });
  if (!expense) return res.status(404).json({ message: 'Expense not found' });

  await expense.deleteOne();
  res.json({ message: 'Expense deleted' });
};

module.exports = { getExpenses, createExpense, updateExpense, deleteExpense };
