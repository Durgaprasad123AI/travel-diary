# ✈️ Travel Diary Management System

> **"Every Journey Tells a Story."**

A complete full-stack **MERN** web application (MongoDB, Express, React, Node.js) for recording travel
experiences — plan trips, write diary memories, track expenses, save destinations, and manage everything
from a separate **Admin Panel**. Built as a professional B.Tech college project.

---

## 📋 Table of Contents

1. [Features](#-features)
2. [Tech Stack](#-tech-stack)
3. [Project Structure](#-project-structure)
4. [Prerequisites](#-prerequisites)
5. [Setup — MongoDB Atlas](#-setup--mongodb-atlas)
6. [Setup — Backend](#-setup--backend)
7. [Setup — Frontend](#-setup--frontend)
8. [Run the Project](#-run-the-project)
9. [Default Admin Account](#-default-admin-account)
10. [API Reference](#-api-reference)
11. [Testing Checklist](#-testing-checklist)
12. [Security Features](#-security-features)
13. [Troubleshooting](#-troubleshooting)

---

## ✨ Features

### User Side
- **Account** — register (name/email/password), login, JWT session, change password, edit profile
- **Dashboard** — welcome banner, total trips / destinations / expenses / memories, recent trips, quick actions
- **Trips** — create trips (name, destination, country, dates, description, travel type, budget, cover image),
  view, edit, delete (with confirmation), and a rich trip-details page
- **Trip Details** — overview, budget-vs-spent bar, plus tabs for **Expenses**, **Memories** and **Places**
  — everything can be added/edited/deleted right from the trip page
- **Travel Memories** — diary entries with title, date, description, mood (😊🤩🧭😌🙏😴🌙), location and photo
- **Expense Tracking** — record expenses (Food / Transport / Hotel / Shopping / Entertainment / Other),
  see total spent, category-wise breakdown bars, edit & delete
- **Destinations** — save places visited with location, date, description, ⭐ rating (1–5) and photo
- **Responsive UI** — desktop sidebar, mobile drawer navigation, cards, soft shadows, travel imagery

### Admin Panel (separate login at `/admin/login`)
- **Dashboard** — total users, trips, memories, destinations, total expenses + recent users
- **User Management** — search users, view full details (stats + their data), edit name/email/role, delete users
- **Trip Management** — view all trips, search, edit, delete
- **Memory Review** — view all memories, delete inappropriate content
- **Reports** — spending by category, trips per month, top destinations (pure-CSS charts)
- **Settings** — system info, security notes, bulk data management (danger zone)

---

## 🛠 Tech Stack

| Layer      | Technology |
|------------|------------|
| Frontend   | React 18, Vite, React Router v6, Axios, React Icons |
| Backend    | Node.js, Express.js |
| Database   | MongoDB (MongoDB Atlas), Mongoose ODM |
| Auth       | JSON Web Tokens (JWT), bcrypt password hashing |
| Uploads    | Multer (local storage in `backend/uploads/`) |

No unnecessary libraries — plain CSS (no Tailwind), plain context (no Redux).

---

## 📁 Project Structure

```
travel-diary/
│
├── backend/                     # Node.js + Express API
│   ├── config/
│   │   └── db.js                # MongoDB connection (Mongoose)
│   ├── controllers/             # Request handlers
│   │   ├── authController.js    # register / login / admin login
│   │   ├── userController.js    # profile, change password
│   │   ├── tripController.js    # trips CRUD
│   │   ├── memoryController.js  # memories CRUD
│   │   ├── expenseController.js # expenses CRUD + totals
│   │   ├── destinationController.js
│   │   ├── adminController.js   # admin stats/users/trips/reports
│   │   └── uploadController.js
│   ├── middleware/
│   │   ├── authMiddleware.js    # JWT protect + admin role check
│   │   ├── errorMiddleware.js   # 404 + error handler
│   │   └── uploadMiddleware.js  # multer image upload
│   ├── models/                  # Mongoose schemas
│   │   ├── User.js              # name, email, password(hash), role, profileImage
│   │   ├── Trip.js              # userId, tripName, destination, country, dates…
│   │   ├── Memory.js            # userId, tripId, title, mood, location, image…
│   │   ├── Expense.js           # userId, tripId, name, category, amount…
│   │   └── Destination.js       # userId, tripId, name, rating, image…
│   ├── routes/                  # REST route definitions
│   ├── scripts/
│   │   └── seedAdmin.js         # creates the default admin account
│   ├── uploads/                 # uploaded images (created automatically)
│   ├── .env                     # secrets — NEVER commit this
│   ├── .env.example
│   ├── package.json
│   └── server.js                # Express app entry point
│
├── frontend/                    # React + Vite SPA
│   ├── public/
│   │   └── favicon.svg
│   ├── src/
│   │   ├── components/          # Navbar, Sidebar, TripCard, MemoryCard, forms…
│   │   ├── pages/               # Home, Register, Login, Dashboard, MyTrips,
│   │   │                        # TripDetails, Memories, Expenses, Destinations,
│   │   │                        # Profile, AdminLogin, AdminDashboard, AdminUsers…
│   │   ├── layouts/             # UserLayout (sidebar shell), AdminLayout
│   │   ├── services/            # axios instance with JWT interceptor
│   │   ├── context/             # AuthContext (global auth state)
│   │   ├── constants/           # travel images, defaults
│   │   ├── utils/               # date & currency formatters
│   │   ├── styles/              # page-level CSS
│   │   ├── App.jsx              # router
│   │   └── main.jsx
│   ├── index.html
│   ├── package.json
│   └── vite.config.js           # dev proxy → http://localhost:5000
│
├── .gitignore
└── README.md
```

---

## ✅ Prerequisites

1. **Node.js** (v18 or newer) — check with `node -v`
2. **npm** — comes with Node.js; check with `npm -v`
3. **VS Code** (or any editor)
4. **MongoDB Atlas account** — free tier at https://www.mongodb.com/cloud/atlas

---

## 🍃 Setup — MongoDB Atlas

1. Go to [mongodb.com/atlas](https://www.mongodb.com/cloud/atlas) → sign up → **Create a cluster** (M0 Free is enough).
2. Click **Database Access** → **Add New Database User**:
   - Username: `traveladmin` (example)
   - Password: a strong password you'll remember
3. Click **Network Access** → **Add IP Address** → `0.0.0.0/0` → Confirm
   (this allows connections from anywhere — fine for a college project).
4. Click **Databases** → on your cluster click **Connect** → **Drivers** → **Node.js**.
5. Copy the connection string, e.g.:
   ```
   mongodb+srv://traveladmin:<password>@cluster0.xxxxx.mongodb.net/
   ```
   Replace `<password>` with the real password and append a database name:
   ```
   mongodb+srv://traveladmin:YOURPASSWORD@cluster0.xxxxx.mongodb.net/travel_diary
   ```
6. Paste this string into `backend/.env` as `MONGODB_URI`.

---

## ⚙️ Setup — Backend

```bash
# 1. Open a terminal and go into the backend folder
cd travel-diary/backend

# 2. Install dependencies
npm install

# 3. Create your .env file (already provided — edit the values)
#    backend/.env  →  set MONGODB_URI and JWT_SECRET

# 4. (Optional) create the default admin account
npm run seed:admin

# 5. Start the server (nodemon auto-restarts on changes)
npm run dev
```

Expected output:
```
✅ MongoDB connected: ...
✅ Travel Diary server running on http://localhost:5000
```

Test it in the browser: open `http://localhost:5000` → you should see the API welcome JSON.

> 🔁 First time only — in a **new terminal**, install the frontend too (next step), then keep
> **both terminals running** (backend on port 5000, frontend on port 5173).

---

## ⚛️ Setup — Frontend

```bash
# 1. New terminal → go into the frontend folder
cd travel-diary/frontend

# 2. Install dependencies
npm install

# 3. Start the Vite dev server
npm run dev
```

Expected output:
```
VITE v5.x  ready in 300 ms
➜  Local:   http://localhost:5173/
```

Open **http://localhost:5173** in your browser → you should see the Travel Diary landing page.
The Vite proxy (`vite.config.js`) forwards `/api` and `/uploads` requests to the backend on port 5000,
so no CORS issues in development.

---

## 🚀 Run the Project

| Terminal | Folder             | Command      | URL                    |
|----------|--------------------|--------------|------------------------|
| 1        | `travel-diary/backend`  | `npm run dev` | http://localhost:5000 |
| 2        | `travel-diary/frontend` | `npm run dev` | http://localhost:5173 |

### First-run flow
1. Open http://localhost:5173 → click **Register** → create an account.
2. You land on the **Dashboard**. Add a trip → open it → add expenses, memories and places.
3. For the admin panel: log out, go to **Admin Login** (link on the login page) and use the admin credentials.

---

## 👑 Default Admin Account

Created by `npm run seed:admin` (values from `backend/.env`):

| Field    | Value                   |
|----------|-------------------------|
| Email    | `admin@traveldiary.com` |
| Password | `admin123`              |

**Change these before presenting.** Admin accounts are separate from normal users:
they cannot log in via the normal login page, and normal users cannot access admin APIs.

---

## 📡 API Reference

Base URL: `http://localhost:5000/api`

| Method | Endpoint                   | Auth        | Description |
|--------|----------------------------|-------------|-------------|
| POST   | `/auth/register`           | public      | Register a user (bcrypt hash + JWT) |
| POST   | `/auth/login`              | public      | Login (users only) |
| POST   | `/auth/admin/login`        | public      | Login (admins only) |
| GET    | `/auth/me`                 | user        | Current user |
| GET    | `/users/profile`           | user        | Profile + dashboard stats |
| PUT    | `/users/profile`           | user        | Update name/email/profileImage |
| PUT    | `/users/password`          | user        | Change password |
| GET/POST | `/trips`                 | user        | List / create trips |
| GET/PUT/DELETE | `/trips/:id`      | user        | Trip detail / update / delete (cascades) |
| GET/POST | `/memories`             | user        | List (filter `?tripId=`) / create |
| PUT/DELETE | `/memories/:id`       | user        | Update / delete memory |
| GET/POST | `/expenses`             | user        | List + totals / create |
| PUT/DELETE | `/expenses/:id`       | user        | Update / delete expense |
| GET/POST | `/destinations`         | user        | List / create destination |
| PUT/DELETE | `/destinations/:id`   | user        | Update / delete destination |
| POST   | `/upload`                  | user        | Upload an image (multipart field `image`) |
| GET    | `/admin/stats`             | admin       | Platform totals |
| GET    | `/admin/users`             | admin       | List users (`?search=` works) |
| GET    | `/admin/users/:id`         | admin       | User details + their data |
| PUT/DELETE | `/admin/users/:id`     | admin       | Edit / delete user (cascades) |
| GET    | `/admin/trips`             | admin       | All trips (`?search=`) |
| PUT/DELETE | `/admin/trips/:id`     | admin       | Edit / delete any trip |
| GET    | `/admin/memories`          | admin       | All memories |
| DELETE | `/admin/memories/:id`      | admin       | Delete a memory |
| GET    | `/admin/expenses`          | admin       | All expenses |
| GET    | `/admin/destinations`      | admin       | All destinations |
| GET    | `/admin/reports`           | admin       | Category/month/top-destination aggregates |
| DELETE | `/admin/data/:collection`  | admin       | Bulk clear (memories/expenses/destinations/trips) |

All user-scoped queries filter by `req.user._id` — users can never read or modify another user's data.

---

## 🧪 Testing Checklist

- [ ] Register with an empty name → error "Name cannot be empty"
- [ ] Register with invalid email → error
- [ ] Register with 4-char password → error
- [ ] Register with mismatched confirm password → error (frontend)
- [ ] Register twice with same email → error "already exists"
- [ ] Login with unknown email → "No account found with this email"
- [ ] Login with wrong password → "Incorrect password"
- [ ] Create a trip → appears on My Trips with image/badge/budget
- [ ] Open trip → add memory ("Sunset at Vizag Beach"), expense, place
- [ ] Expenses page shows correct total + category bars
- [ ] Delete a trip → confirmation dialog → related data gone
- [ ] Edit profile name → dashboard shows the new name
- [ ] Change password → re-login with the new password
- [ ] Admin login → dashboard stats match the data you created
- [ ] Admin search user "durga" → finds the account
- [ ] Try opening `/admin` while logged in as a normal user → redirected

---

## 🔒 Security Features

- Passwords hashed with **bcrypt** (never stored in plain text)
- **JWT** authentication with 30-day expiry; token sent via `Authorization: Bearer`
- **Protected routes** — backend middleware + frontend route guards
- **Role-based authorization** — separate admin login, admin middleware on all `/api/admin/*`
- **Input validation** on both client and server
- **Secrets in `.env`** only — `backend/.env` is git-ignored, MongoDB credentials never reach the frontend
- Uploads restricted to image files (max 5 MB)

---

## 🛠 Troubleshooting

| Problem | Fix |
|---------|-----|
| `MongoParseError` / connection timeout | Check `MONGODB_URI` in `.env`; in Atlas: Network Access → allow `0.0.0.0/0`, and the DB user password has no special chars that break the URI |
| `Error: listen EADDRINUSE :5000` | Port busy — change `PORT` in `.env` |
| Frontend calls fail with CORS | Backend must run on port 5000 (the Vite proxy targets it); check `CLIENT_URL` in `.env` |
| Images not showing | The backend `/uploads` route must be reachable; images are stored in `backend/uploads/` |
| Token expired (401 loop) | Log out and log in again (tokens last 30 days) |
| `npm install` errors | Use Node 18+; delete `node_modules` and `package-lock.json`, retry |
| Admin login rejected | Run `npm run seed:admin` in `backend/`, or register via Atlas and set `role: 'admin'` in the `users` collection |

---

## 📦 Useful Commands

```bash
# Backend (inside travel-diary/backend)
npm run dev        # start with auto-restart
npm start          # start normally
npm run seed:admin # create the admin account

# Frontend (inside travel-diary/frontend)
npm run dev        # start dev server
npm run build      # production build (outputs to dist/)
npm run preview    # preview the production build
```

---

Made with ❤️ for every traveler. **Every Journey Tells a Story.**
