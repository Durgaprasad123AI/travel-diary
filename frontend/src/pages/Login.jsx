/**
 * pages/Login.jsx — user login (users only; admins use /admin/login).
 */
import { useState } from 'react';
import { Link, Navigate, useNavigate } from 'react-router-dom';
import { FaPlaneDeparture, FaEnvelope, FaLock, FaEye, FaEyeSlash } from 'react-icons/fa';
import { useAuth } from '../context/AuthContext';
import { AUTH_IMAGE } from '../constants/images';

export default function Login() {
  const { user, login } = useAuth();
  const navigate = useNavigate();

  const [form, setForm] = useState({ email: '', password: '' });
  const [errors, setErrors] = useState({});
  const [showPassword, setShowPassword] = useState(false);
  const [submitting, setSubmitting] = useState(false);

  if (user) return <Navigate to={user.role === 'admin' ? '/admin' : '/dashboard'} replace />;

  const handleChange = (e) => setForm({ ...form, [e.target.name]: e.target.value });

  const handleSubmit = async (e) => {
    e.preventDefault();
    const errs = {};
    if (!form.email.trim()) errs.email = 'Email is required';
    if (!form.password) errs.password = 'Password is required';
    setErrors(errs);
    if (Object.keys(errs).length > 0) return;

    setSubmitting(true);
    try {
      const data = await login(form);
      navigate(data.role === 'admin' ? '/admin' : '/dashboard');
    } catch (err) {
      setErrors({ form: err.response?.data?.message || 'Login failed. Please try again.' });
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
          <h2>Welcome back, Explorer!</h2>
          <p>Your journeys, memories and expenses are waiting for you.</p>
        </div>
      </div>

      <div className="auth-main">
        <div className="auth-card">
          <h1 className="auth-title">Login</h1>
          <p className="auth-subtitle">Access your travel diary.</p>

          {errors.form && <div className="alert alert-error">{errors.form}</div>}

          <form onSubmit={handleSubmit} noValidate>
            <div className="form-group">
              <label htmlFor="l-email">Email</label>
              <div className="input-with-icon">
                <FaEnvelope />
                <input
                  id="l-email"
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
              <label htmlFor="l-password">Password</label>
              <div className="input-with-icon">
                <FaLock />
                <input
                  id="l-password"
                  name="password"
                  type={showPassword ? 'text' : 'password'}
                  value={form.password}
                  onChange={handleChange}
                  placeholder="Your password"
                />
                <button type="button" className="password-toggle" onClick={() => setShowPassword(!showPassword)}>
                  {showPassword ? <FaEyeSlash /> : <FaEye />}
                </button>
              </div>
              {errors.password && <p className="form-error">{errors.password}</p>}
            </div>

            <button type="submit" className="btn btn-primary btn-block btn-lg" disabled={submitting}>
              {submitting ? 'Logging in…' : 'Login'}
            </button>
          </form>

          <p className="auth-switch">
            Don't have an account? <Link to="/register">Create one</Link>
          </p>
          <p className="auth-admin-link">
            Are you an administrator? <Link to="/admin/login">Admin Login</Link>
          </p>
        </div>
      </div>
    </div>
  );
}
