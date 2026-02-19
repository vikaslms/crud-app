import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import { createTheme, ThemeProvider, CssBaseline } from '@mui/material';
import { AuthProvider } from './context/AuthContext';
import ProtectedRoute from './components/ProtectedRoute';
import Login      from './pages/Login';
import Register   from './pages/Register';
import Dashboard  from './pages/Dashboard';
import Users      from './pages/Users';
import UserForm   from './pages/UserForm';
import Profile    from './pages/Profile';

const theme = createTheme({
  palette: {
    mode: 'dark',
    primary:   { main: '#00d4ff' },
    secondary: { main: '#7c3aed' },
    background: { default: '#0a0e1a', paper: '#141b2d' },
  },
  typography: {
    fontFamily: '"Syne", sans-serif',
  },
});

const App = () => (
  <ThemeProvider theme={theme}>
    <CssBaseline />
    <AuthProvider>
      <BrowserRouter>
        <Routes>
          {/* Public */}
          <Route path="/login"    element={<Login />} />
          <Route path="/register" element={<Register />} />

          {/* Protected */}
          <Route path="/dashboard"      element={<ProtectedRoute><Dashboard /></ProtectedRoute>} />
          <Route path="/users"          element={<ProtectedRoute><Users /></ProtectedRoute>} />
          <Route path="/users/new"      element={<ProtectedRoute><UserForm /></ProtectedRoute>} />
          <Route path="/users/edit/:id" element={<ProtectedRoute><UserForm /></ProtectedRoute>} />
          <Route path="/profile"        element={<ProtectedRoute><Profile /></ProtectedRoute>} />

          {/* Redirect */}
          <Route path="/" element={<Navigate to="/dashboard" replace />} />
          <Route path="*" element={<Navigate to="/dashboard" replace />} />
        </Routes>
      </BrowserRouter>
    </AuthProvider>
  </ThemeProvider>
);

export default App;
