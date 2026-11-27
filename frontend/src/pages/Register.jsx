/**
 * pages/Register.jsx — user registration with client-side validation.
 */
import { useState } from 'react';
import { Link, Navigate, useNavigate } from 'react-router-dom';
import { FaPlaneDeparture, FaUser, FaEnvelope, FaLock, FaEye, FaEyeSlash } from 'react-icons/fa';
import { useAuth } from '../context/AuthContext';
import { AUTH_IMAGE } from '../constants/images';

export default function Register() {
  const { user, register } = useAuth();
  const navigate = useNavigate();

  const [form, setForm] = useState({ name: '', email: '', password: '', confirmPassword: '' });
  const [errors, setErrors] = useState({});
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirm, setShowConfirm] = useState(false);
  const [submitting, setSubmitting] = useState(false);

  // Already logged in? Go to the dashboard.
  if (user) return <Navigate to={user.role === 'admin' ? '/admin' : '/dashboard'} replace />;

  const handleChange = (e) => setForm({ ...form, [e.target.name]: e.target.value });

  const validate = () => {
    const errs = {};
    if (!form.name.trim()) errs.name = 'Name cannot be empty';
    if (!form.email.trim()) errs.email = 'Email is required';
    else if (!/^\S+@\S+\.\S+$/.test(form.email)) errs.email = 'Please enter a valid email address';
    if (!form.password) errs.password = 'Password is required';
    else if (form.password.length < 6) errs.password = 'Password must be at least 6 characters';
    if (!form.confirmPassword) errs.confirmPassword = 'Please confirm your password';
    else if (form.password !== form.confirmPassword) errs.confirmPassword = 'Passwords do not match';
    return errs;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    const errs = validate();
    setErrors(errs);
    if (Object.keys(errs).length > 0) return;

    setSubmitting(true);
    try {
      const data = await register({ name: form.name, email: form.email, password: form.password });
      navigate(data.role === 'admin' ? '/admin' : '/dashboard');
    } catch (err) {
      setErrors({ form: err.response?.data?.message || 'Registration failed. Please try again.' });
      setSubmitting(false);
    }
  };

  return (
    <div className="auth-page">
      <div className="auth-aside" style={{ backgroundImage: `url(${AUTH_IMAGE})` }}>
        <div className="auth-aside-overlay" />
        <Link to="/" className="brand brand-light auth-brand">
          <span className="brand-icon"><FaPlaneDeparture /></span>
          <span className="brand-text">Travel <span>Diary</span></span>
        </Link>
        <div className="auth-aside-quote">
          <h2>Every Journey Tells a Story.</h2>
          <p>Join thousands of travelers preserving their adventures in one beautiful place.</p>
        </div>
      </div>

      <div className="auth-main">
        <div className="auth-card">
          <h1 className="auth-title">Create Account</h1>
          <p className="auth-subtitle">Start your travel diary today — it's free.</p>

          {errors.form && <div className="alert alert-error">{errors.form}</div>}

          <form onSubmit={handleSubmit} noValidate>
            <div className="form-group">
              <label htmlFor="r-name">Full Name</label>
              <div className="input-with-icon">
                <FaUser />
                <input
                  id="r-name"
                  name="name"
                  value={form.name}
                  onChange={handleChange}
                  placeholder="e.g. Durga Prasad"
                />
              </div>
              {errors.name && <p className="form-error">{errors.name}</p>}
            </div>

            <div className="form-group">
              <label htmlFor="r-email">Email</label>
              <div className="input-with-icon">
                <FaEnvelope />
                <input
                  id="r-email"
                  name="email"
                  type="email"
                  value={form.email}
                  onChange={handleChange}
                  placeholder="you@example.com"
                />
              </div>
              {errors.email && <p className="form-error">{errors.email}</p>}
            </div>

            <div className="form-group">
              <label htmlFor="r-password">Password</label>
              <div className="input-with-icon">
                <FaLock />
                <input
                  id="r-password"
                  name="password"
                  type={showPassword ? 'text' : 'password'}
                  value={form.password}
                  onChange={handleChange}
                  placeholder="At least 6 characters"
                />
                <button type="button" className="password-toggle" onClick={() => setShowPassword(!showPassword)}>
                  {showPassword ? <FaEyeSlash /> : <FaEye />}
                </button>
              </div>
              {errors.password && <p className="form-error">{errors.password}</p>}
            </div>

            <div className="form-group">
              <label htmlFor="r-confirm">Confirm Password</label>
              <div className="input-with-icon">
                <FaLock />
                <input
                  id="r-confirm"
                  name="confirmPassword"
                  type={showConfirm ? 'text' : 'password'}
                  value={form.confirmPassword}
                  onChange={handleChange}
                  placeholder="Repeat your password"
                />
                <button type="button" className="password-toggle" onClick={() => setShowConfirm(!showConfirm)}>
                  {showConfirm ? <FaEyeSlash /> : <FaEye />}
                </button>
              </div>
              {errors.confirmPassword && <p className="form-error">{errors.confirmPassword}</p>}
            </div>

            <button type="submit" className="btn btn-primary btn-block btn-lg" disabled={submitting}>
              {submitting ? 'Creating account…' : 'Register'}
            </button>
          </form>

          <p className="auth-switch">
            Already have an account? <Link to="/login">Login here</Link>
          </p>
          <p className="auth-admin-link">
            Are you an administrator? <Link to="/admin/login">Admin Login</Link>
          </p>
        </div>
      </div>
    </div>
  );
}
