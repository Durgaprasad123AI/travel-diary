/**
 * App.jsx — routing table for the whole application.
 *
 * Public routes   : / , /register , /login , /admin/login
 * User routes     : everything wrapped in ProtectedRoute + UserLayout (sidebar)
 * Admin routes    : everything wrapped in AdminRoute + AdminLayout (admin sidebar)
 */
import { BrowserRouter, Routes, Route } from 'react-router-dom';
import { AuthProvider } from './context/AuthContext';

import ProtectedRoute from './components/ProtectedRoute';
import AdminRoute from './components/AdminRoute';
import UserLayout from './layouts/UserLayout';
import AdminLayout from './layouts/AdminLayout';

// Public pages
import Home from './pages/Home';
import Register from './pages/Register';
import Login from './pages/Login';
import AdminLogin from './pages/AdminLogin';
import NotFound from './pages/NotFound';

// User pages
import Dashboard from './pages/Dashboard';
import MyTrips from './pages/MyTrips';
import AddTrip from './pages/AddTrip';
import TripDetails from './pages/TripDetails';
import Memories from './pages/Memories';
import AddMemory from './pages/AddMemory';
import Expenses from './pages/Expenses';
import Destinations from './pages/Destinations';
import Profile from './pages/Profile';
import Explore from './pages/Explore';
import ExploreTripDetails from './pages/ExploreTripDetails';

// Admin pages
import AdminDashboard from './pages/AdminDashboard';
import AdminUsers from './pages/AdminUsers';
import AdminTrips from './pages/AdminTrips';
import AdminMemories from './pages/AdminMemories';
import AdminReports from './pages/AdminReports';
import AdminSettings from './pages/AdminSettings';

export default function App() {
  return (
    <BrowserRouter>
      <AuthProvider>
        <Routes>
          {/* ---------- Public ---------- */}
          <Route path="/" element={<Home />} />
          <Route path="/register" element={<Register />} />
          <Route path="/login" element={<Login />} />
          <Route path="/admin/login" element={<AdminLogin />} />

          {/* ---------- Logged-in user (protected) ---------- */}
          <Route element={<ProtectedRoute />}>
            <Route element={<UserLayout />}>
              <Route path="/dashboard" element={<Dashboard />} />
              <Route path="/trips" element={<MyTrips />} />
              <Route path="/trips/add" element={<AddTrip />} />
              <Route path="/trips/edit/:id" element={<AddTrip />} />
              <Route path="/trips/:id" element={<TripDetails />} />
              <Route path="/memories" element={<Memories />} />
              <Route path="/memories/add" element={<AddMemory />} />
              <Route path="/memories/edit/:id" element={<AddMemory />} />
              <Route path="/expenses" element={<Expenses />} />
              <Route path="/destinations" element={<Destinations />} />
              <Route path="/explore" element={<Explore />} />
              <Route path="/explore/:id" element={<ExploreTripDetails />} />
              <Route path="/profile" element={<Profile />} />
            </Route>
          </Route>

          {/* ---------- Admin (protected + role check) ---------- */}
          <Route element={<AdminRoute />}>
            <Route element={<AdminLayout />}>
              <Route path="/admin" element={<AdminDashboard />} />
              <Route path="/admin/users" element={<AdminUsers />} />
              <Route path="/admin/trips" element={<AdminTrips />} />
              <Route path="/admin/memories" element={<AdminMemories />} />
              <Route path="/admin/reports" element={<AdminReports />} />
              <Route path="/admin/settings" element={<AdminSettings />} />
            </Route>
          </Route>

          {/* ---------- 404 ---------- */}
          <Route path="*" element={<NotFound />} />
        </Routes>
      </AuthProvider>
    </BrowserRouter>
  );
}
