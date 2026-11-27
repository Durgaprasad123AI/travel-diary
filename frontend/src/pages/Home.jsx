/**
 * pages/Home.jsx — public landing page.
 * Sections: Hero → Features → About → CTA → Footer
 */
import { Link } from 'react-router-dom';
import Navbar from '../components/Navbar';
import Footer from '../components/Footer';
import { useAuth } from '../context/AuthContext';
import { HERO_IMAGE, ABOUT_IMAGE } from '../constants/images';
import {
  FaCompass,
  FaBookOpen,
  FaWallet,
  FaMapMarkerAlt,
  FaCamera,
  FaShieldAlt,
  FaArrowRight,
  FaCheckCircle,
  FaQuoteLeft,
} from 'react-icons/fa';

const FEATURES = [
  {
    icon: <FaCompass />,
    color: '#008CBA',
    title: 'Trip Planning',
    text: 'Create trips with destinations, dates, travel type and a total budget — all in one place.',
  },
  {
    icon: <FaBookOpen />,
    color: '#8b5cf6',
    title: 'Travel Memories',
    text: 'Save diary entries with photos, moods and locations. Example: “Sunset at Vizag Beach”.',
  },
  {
    icon: <FaWallet />,
    color: '#10b981',
    title: 'Expense Tracking',
    text: 'Record every rupee spent and see category-wise totals: Food, Transport, Hotel, Shopping and more.',
  },
  {
    icon: <FaMapMarkerAlt />,
    color: '#f59e0b',
    title: 'Saved Destinations',
    text: 'Build your personal list of places visited, with star ratings and photos.',
  },
  {
    icon: <FaCamera />,
    color: '#ef4444',
    title: 'Photo Gallery',
    text: 'Attach cover images and photos to every trip and memory to relive the journey.',
  },
  {
    icon: <FaShieldAlt />,
    color: '#172033',
    title: 'Secure & Private',
    text: 'JWT authentication with hashed passwords keeps your travel diary safe and personal.',
  },
];

export default function Home() {
  const { user } = useAuth();
  const startUrl = user ? (user.role === 'admin' ? '/admin' : '/dashboard') : '/register';

  return (
    <>
      <Navbar />

      {/* ---------- HERO ---------- */}
      <section id="home" className="hero">
        <div className="hero-overlay" />
        <div className="container hero-content">
          <p className="hero-eyebrow">✈️ Your personal travel companion</p>
          <h1 className="hero-title">Every Journey<br />Tells a <span>Story.</span></h1>
          <p className="hero-subtitle">
            Record your adventures, save your favorite places, track your travel expenses and preserve
            your unforgettable memories in one place.
          </p>
          <div className="hero-actions">
            <Link to={startUrl} className="btn btn-primary btn-lg">
              Start Your Journey <FaArrowRight />
            </Link>
            <a href="#features" className="btn btn-outline-light btn-lg">
              Explore Features
            </a>
          </div>
          <div className="hero-stats">
            <div><strong>5</strong><span>Travel types</span></div>
            <div><strong>6</strong><span>Expense categories</span></div>
            <div><strong>100%</strong><span>Your private diary</span></div>
          </div>
        </div>
      </section>

      {/* ---------- FEATURES ---------- */}
      <section id="features" className="section features">
        <div className="container">
          <div className="section-head">
            <p className="section-eyebrow">Features</p>
            <h2 className="section-title">Everything a traveler needs</h2>
            <p className="section-subtitle">
              Plan trips, journal memories, track spending and save the places you loved — beautifully organized.
            </p>
          </div>
          <div className="features-grid">
            {FEATURES.map((f) => (
              <div className="feature-card" key={f.title}>
                <div className="feature-icon" style={{ backgroundColor: `${f.color}18`, color: f.color }}>
                  {f.icon}
                </div>
                <h3>{f.title}</h3>
                <p>{f.text}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ---------- ABOUT ---------- */}
      <section id="about" className="section about">
        <div className="container about-grid">
          <div className="about-img-wrap">
            <img src={ABOUT_IMAGE} alt="Traveler on a beach" className="about-img" />
            <div className="about-quote">
              <FaQuoteLeft />
              <p>“The world is a book, and those who do not travel read only one page.”</p>
              <span>— Saint Augustine</span>
            </div>
          </div>
          <div className="about-text">
            <p className="section-eyebrow">About</p>
            <h2 className="section-title">Why Travel Diary?</h2>
            <p>
              Travel Diary is a full-stack web application built with the MERN stack (MongoDB, Express,
              React, Node.js). It lets you organize every part of a journey — from planning and budgets
              to the tiny moments you never want to forget.
            </p>
            <ul className="about-list">
              <li><FaCheckCircle /> Create and manage trips with budgets & travel types</li>
              <li><FaCheckCircle /> Write diary memories with photos, moods & locations</li>
              <li><FaCheckCircle /> Track expenses and see category-wise summaries</li>
              <li><FaCheckCircle /> Save destinations with ratings and visit dates</li>
              <li><FaCheckCircle /> Separate admin panel to manage users & content</li>
              <li><FaCheckCircle /> Secure login with hashed passwords & JWT tokens</li>
            </ul>
            <Link to="/register" className="btn btn-primary">
              Create Free Account <FaArrowRight />
            </Link>
          </div>
        </div>
      </section>

      {/* ---------- CTA ---------- */}
      <section className="cta">
        <div className="container cta-inner">
          <h2>Ready to start your journey?</h2>
          <p>Join Travel Diary today and keep every adventure forever.</p>
          <div className="hero-actions">
            <Link to="/register" className="btn btn-primary btn-lg">
              Get Started — It's Free
            </Link>
            <Link to="/login" className="btn btn-outline-light btn-lg">
              I already have an account
            </Link>
          </div>
        </div>
      </section>

      <Footer />
    </>
  );
}
