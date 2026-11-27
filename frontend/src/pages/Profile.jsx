/**
 * pages/Profile.jsx — user profile: avatar, stats, edit profile,
 * change password and logout.
 */
import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import API from '../services/api';
import { useAuth } from '../context/AuthContext';
import ImageUpload from '../components/ImageUpload';
import Loader from '../components/Loader';
import { formatCurrency, formatDate } from '../utils/format';
import {
  FaUserCircle,
  FaSuitcase,
  FaBookOpen,
  FaWallet,
  FaMapMarkerAlt,
  FaSignOutAlt,
  FaSave,
  FaKey,
} from 'react-icons/fa';

export default function Profile() {
  const { user, logout, updateUser } = useAuth();
  const navigate = useNavigate();

  const [profile, setProfile] = useState(null);
  const [editForm, setEditForm] = useState({ name: '', email: '', profileImage: '' });
  const [passwordForm, setPasswordForm] = useState({ currentPassword: '', newPassword: '', confirmPassword: '' });
  const [messages, setMessages] = useState({});
  const [errors, setErrors] = useState({});
  const [savingEdit, setSavingEdit] = useState(false);
  const [savingPassword, setSavingPassword] = useState(false);

  useEffect(() => {
    API.get('/users/profile')
      .then(({ data }) => {
        setProfile(data);
        setEditForm({ name: data.name, email: data.email, profileImage: data.profileImage || '' });
      })
      .catch(() => {});
  }, []);

  if (!profile) return <Loader />;

  const handleEditSubmit = async (e) => {
    e.preventDefault();
    const errs = {};
    if (!editForm.name.trim()) errs.name = 'Name cannot be empty';
    if (!/^\S+@\S+\.\S+$/.test(editForm.email)) errs.email = 'Please enter a valid email';
    setErrors(errs);
    if (Object.keys(errs).length > 0) return;

    setSavingEdit(true);
    try {
      const { data } = await API.put('/users/profile', editForm);
      updateUser(data);
      setMessages({ edit: 'Profile updated successfully ✅' });
      setTimeout(() => setMessages({}), 3000);
    } catch (err) {
      setErrors({ form: err.response?.data?.message || 'Update failed' });
    } finally {
      setSavingEdit(false);
    }
  };

  const handlePasswordSubmit = async (e) => {
    e.preventDefault();
    const errs = {};
    if (!passwordForm.currentPassword) errs.currentPassword = 'Current password is required';
    if (!passwordForm.newPassword || passwordForm.newPassword.length < 6) {
      errs.newPassword = 'New password must be at least 6 characters';
    }
    if (passwordForm.newPassword !== passwordForm.confirmPassword) {
      errs.confirmPassword = 'Passwords do not match';
    }
    setErrors(errs);
    if (Object.keys(errs).length > 0) return;

    setSavingPassword(true);
    try {
      await API.put('/users/password', {
        currentPassword: passwordForm.currentPassword,
        newPassword: passwordForm.newPassword,
      });
      setPasswordForm({ currentPassword: '', newPassword: '', confirmPassword: '' });
      setMessages({ password: 'Password changed successfully ✅' });
      setTimeout(() => setMessages({}), 3000);
    } catch (err) {
      setErrors({ passForm: err.response?.data?.message || 'Could not change password' });
    } finally {
      setSavingPassword(false);
    }
  };

  const handleLogout = () => {
    logout();
    navigate('/');
  };

  const stats = profile.stats || {};

  return (
    <div className="page">
      <div className="page-header">
        <div>
          <h1>My Profile</h1>
          <p>Manage your account details and security.</p>
        </div>
        <button className="btn btn-danger-outline" onClick={handleLogout}>
          <FaSignOutAlt /> Logout
        </button>
      </div>

      <div className="profile-layout">
        {/* Left: summary card */}
        <div className="card profile-card">
          <div className="profile-avatar-wrap">
            {editForm.profileImage ? (
              <img src={editForm.profileImage} alt={profile.name} className="profile-avatar" />
            ) : (
              <FaUserCircle className="profile-avatar-placeholder" />
            )}
          </div>
          <h2>{profile.name}</h2>
          <p className="profile-email">{profile.email}</p>
          <p className="profile-joined">Joined {formatDate(profile.createdAt)}</p>

          <div className="profile-stats">
            <div><strong>{stats.trips ?? 0}</strong><span>Trips</span></div>
            <div><strong>{stats.memories ?? 0}</strong><span>Memories</span></div>
            <div><strong>{formatCurrency(stats.totalExpense)}</strong><span>Spent</span></div>
            <div><strong>{stats.destinations ?? 0}</strong><span>Places</span></div>
          </div>

          <div className="profile-quick-icons">
            <span title="Trips"><FaSuitcase /></span>
            <span title="Memories"><FaBookOpen /></span>
            <span title="Expenses"><FaWallet /></span>
            <span title="Destinations"><FaMapMarkerAlt /></span>
          </div>
        </div>

        {/* Right: forms */}
        <div className="profile-forms">
          <form className="card form-card" onSubmit={handleEditSubmit} noValidate>
            <h2 className="form-title">✏️ Edit Profile</h2>
            {messages.edit && <div className="alert alert-success">{messages.edit}</div>}
            {errors.form && <div className="alert alert-error">{errors.form}</div>}

            <div className="form-group">
              <label htmlFor="p-name">Full Name</label>
              <input id="p-name" value={editForm.name} onChange={(e) => setEditForm({ ...editForm, name: e.target.value })} />
              {errors.name && <p className="form-error">{errors.name}</p>}
            </div>

            <div className="form-group">
              <label htmlFor="p-email">Email</label>
              <input id="p-email" type="email" value={editForm.email} onChange={(e) => setEditForm({ ...editForm, email: e.target.value })} />
              {errors.email && <p className="form-error">{errors.email}</p>}
            </div>

            <div className="form-group">
              <label>Profile Image</label>
              <ImageUpload value={editForm.profileImage} onChange={(url) => setEditForm({ ...editForm, profileImage: url })} label="profile image" />
            </div>

            <button type="submit" className="btn btn-primary" disabled={savingEdit}>
              <FaSave /> {savingEdit ? 'Saving…' : 'Save Changes'}
            </button>
          </form>

          <form className="card form-card" onSubmit={handlePasswordSubmit} noValidate>
            <h2 className="form-title">🔒 Change Password</h2>
            {messages.password && <div className="alert alert-success">{messages.password}</div>}
            {errors.passForm && <div className="alert alert-error">{errors.passForm}</div>}

            <div className="form-group">
              <label htmlFor="pw-current">Current Password</label>
              <input
                id="pw-current"
                type="password"
                value={passwordForm.currentPassword}
                onChange={(e) => setPasswordForm({ ...passwordForm, currentPassword: e.target.value })}
              />
              {errors.currentPassword && <p className="form-error">{errors.currentPassword}</p>}
            </div>

            <div className="form-group">
              <label htmlFor="pw-new">New Password</label>
              <input
                id="pw-new"
                type="password"
                value={passwordForm.newPassword}
                onChange={(e) => setPasswordForm({ ...passwordForm, newPassword: e.target.value })}
                placeholder="At least 6 characters"
              />
              {errors.newPassword && <p className="form-error">{errors.newPassword}</p>}
            </div>

            <div className="form-group">
              <label htmlFor="pw-confirm">Confirm New Password</label>
              <input
                id="pw-confirm"
                type="password"
                value={passwordForm.confirmPassword}
                onChange={(e) => setPasswordForm({ ...passwordForm, confirmPassword: e.target.value })}
              />
              {errors.confirmPassword && <p className="form-error">{errors.confirmPassword}</p>}
            </div>

            <button type="submit" className="btn btn-primary" disabled={savingPassword}>
              <FaKey /> {savingPassword ? 'Updating…' : 'Update Password'}
            </button>
          </form>
        </div>
      </div>
    </div>
  );
}
