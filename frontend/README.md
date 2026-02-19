# React CRUD App — Frontend

Dark & Modern React frontend connected to the Node.js MySQL CRUD API with JWT Auth.

## 🚀 Setup

```bash
npm install
npm start
```

App runs at: **http://localhost:3000**
Backend must be running at: **http://localhost:4000**

## 📁 Structure

```
src/
├── api/
│   └── index.js          ← axios instance + auto token refresh
├── context/
│   └── AuthContext.js    ← global auth state (login/logout/user)
├── components/
│   ├── Navbar.js         ← top navigation bar
│   └── ProtectedRoute.js ← redirects unauthenticated users
├── pages/
│   ├── Login.js          ← sign in page
│   ├── Register.js       ← create account page
│   ├── Dashboard.js      ← home with stats
│   ├── Users.js          ← users table with CRUD actions
│   ├── UserForm.js       ← add / edit user form
│   └── Profile.js        ← logged-in user profile
└── App.js                ← routes setup
```

## 🔐 Auth Flow

- Login → tokens saved to localStorage
- Every API request automatically gets the token (axios interceptor)
- Token expired? → auto-refreshed silently
- Logout → tokens cleared, redirected to login
