/**
 * pages/AdminLogin.jsx — separate admin login page.
 * Regular user accounts are rejected here by the backend.
 */
import { useState } from 'react';
import { Link, Navigate, useNavigate } from 'react-router-dom';
import { FaShieldAlt, FaEnvelope, FaLock, FaEye, FaEyeSlash, FaArrowLeft } from 'react-icons/fa';
import { useAuth } from '../context/AuthContext';

export default function AdminLogin() {
  const { user, adminLogin } = useAuth();
  const navigate = useNavigate();

  const [form, setForm] = useState({ email: '', password: '' });
  const [errors, setErrors] = useState({});
  const [showPassword, setShowPassword] = useState(false);
  const [submitting, setSubmitting] = useState(false);

  if (user) return <Navigate to={user.role === 'admin' ? '/admin' : '/dashboard'} replace />;

  const handleSubmit = async (e) => {
    e.preventDefault();
    const errs = {};
    if (!form.email.trim()) errs.email = 'Admin email is required';
    if (!form.password) errs.password = 'Password is required';
    setErrors(errs);
    if (Object.keys(errs).length > 0) return;

    setSubmitting(true);
    try {
      await adminLogin(form);
      navigate('/admin');
    } catch (err) {
      setErrors({ form: err.response?.data?.message || 'Admin login failed' });
      setSubmitting(false);
    }
  };

  return (
    <div className="admin-login-page">
      <div className="admin-login-card">
        <div className="admin-login-logo">
          <FaShieldAlt />
        </div>
        <h1>Admin Login</h1>
        <p className="auth-subtitle">Restricted area — administrators only.</p>

        {errors.form && <div className="alert alert-error">{errors.form}</div>}

        <form onSubmit={handleSubmit} noValidate>
          <div className="form-group">
            <label htmlFor="ad-email">Admin Email</label>
            <div className="input-with-icon">
              <FaEnvelope />
              <input
                id="ad-email"
                type="email"
                value={form.email}
                onChange={(e) => setForm({ ...form, email: e.target.value })}
                placeholder="admin@traveldiary.com"
              />
            </div>
            {errors.email && <p className="form-error">{errors.email}</p>}
          </div>

          <div className="form-group">
            <label htmlFor="ad-password">Admin Password</label>
            <div className="input-with-icon">
              <FaLock />
              <input
                id="ad-password"
                type={showPassword ? 'text' : 'password'}
                value={form.password}
                onChange={(e) => setForm({ ...form, password: e.target.value })}
                placeholder="Your admin password"
              />
              <button type="button" className="password-toggle" onClick={() => setShowPassword(!showPassword)}>
                {showPassword ? <FaEyeSlash /> : <FaEye />}
              </button>
            </div>
            {errors.password && <p className="form-error">{errors.password}</p>}
          </div>

          <button type="submit" className="btn btn-primary btn-block btn-lg" disabled={submitting}>
            {submitting ? 'Verifying…' : 'Login to Admin Panel'}
          </button>
        </form>

        <Link to="/login" className="back-link center">
          <FaArrowLeft /> Back to User Login
        </Link>
      </div>
    </div>
  );
}
