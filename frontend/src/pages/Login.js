import { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import {
  Box, TextField, Button, Typography, Alert,
  InputAdornment, IconButton, CircularProgress
} from '@mui/material';
import EmailIcon from '@mui/icons-material/Email';
import LockIcon from '@mui/icons-material/Lock';
import VisibilityIcon from '@mui/icons-material/Visibility';
import VisibilityOffIcon from '@mui/icons-material/VisibilityOff';
import { useAuth } from '../context/AuthContext';

const inputSx = {
  '& .MuiOutlinedInput-root': {
    bgcolor: 'rgba(255,255,255,0.04)',
    borderRadius: '12px',
    fontFamily: '"JetBrains Mono", monospace',
    '& fieldset': { borderColor: 'rgba(0,212,255,0.2)' },
    '&:hover fieldset': { borderColor: 'rgba(0,212,255,0.4)' },
    '&.Mui-focused fieldset': { borderColor: '#00d4ff' },
  },
  '& .MuiInputLabel-root': { color: 'rgba(255,255,255,0.4)' },
  '& .MuiInputLabel-root.Mui-focused': { color: '#00d4ff' },
  '& input': { color: '#e2e8f0' },
};

const Login = () => {
  const { login } = useAuth();
  const navigate  = useNavigate();
  const [form, setForm]       = useState({ email: '', password: '' });
  const [error, setError]     = useState('');
  const [loading, setLoading] = useState(false);
  const [showPass, setShowPass] = useState(false);

  const handleChange = (e) => setForm({ ...form, [e.target.name]: e.target.value });

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError(''); setLoading(true);
    try {
      await login(form.email, form.password);
      navigate('/dashboard');
    } catch (err) {
      setError(err.response?.data?.message || 'Login failed');
    } finally { setLoading(false); }
  };

  return (
    <Box sx={{
      minHeight: '100vh', display: 'flex', alignItems: 'center', justifyContent: 'center',
      bgcolor: '#0a0e1a', position: 'relative', overflow: 'hidden',
      backgroundImage: 'linear-gradient(rgba(0,212,255,0.03) 1px, transparent 1px), linear-gradient(90deg, rgba(0,212,255,0.03) 1px, transparent 1px)',
      backgroundSize: '40px 40px',
    }}>
      {/* Glow */}
      <Box sx={{ position: 'absolute', width: 400, height: 400, borderRadius: '50%',
        background: 'radial-gradient(circle, rgba(0,212,255,0.08) 0%, transparent 70%)',
        top: '20%', left: '50%', transform: 'translateX(-50%)', pointerEvents: 'none' }} />

      <Box component="form" onSubmit={handleSubmit} sx={{
        width: '100%', maxWidth: 420, p: 4,
        background: 'rgba(20,27,45,0.9)',
        backdropFilter: 'blur(20px)',
        border: '1px solid rgba(0,212,255,0.15)',
        borderRadius: '24px',
        boxShadow: '0 25px 60px rgba(0,0,0,0.5)',
        position: 'relative', zIndex: 1,
      }}>
        {/* Header */}
        <Box sx={{ textAlign: 'center', mb: 4 }}>
          <Typography sx={{ fontSize: 40, mb: 1 }}>⚡</Typography>
          <Typography variant="h4" sx={{
            fontFamily: '"Syne", sans-serif', fontWeight: 800,
            background: 'linear-gradient(135deg, #fff, #00d4ff)',
            WebkitBackgroundClip: 'text', WebkitTextFillColor: 'transparent',
          }}>Welcome Back</Typography>
          <Typography sx={{ color: 'rgba(255,255,255,0.4)', mt: 1,
            fontFamily: '"JetBrains Mono", monospace', fontSize: 13 }}>
            // sign in to continue
          </Typography>
        </Box>

        {error && <Alert severity="error" sx={{ mb: 2, bgcolor: 'rgba(239,68,68,0.1)',
          color: '#ef4444', border: '1px solid rgba(239,68,68,0.3)', borderRadius: '10px' }}>
          {error}
        </Alert>}

        <TextField fullWidth label="Email" name="email" type="email"
          value={form.email} onChange={handleChange} required sx={{ ...inputSx, mb: 2 }}
          InputProps={{ startAdornment: <InputAdornment position="start">
            <EmailIcon sx={{ color: 'rgba(0,212,255,0.5)', fontSize: 18 }} />
          </InputAdornment> }} />

        <TextField fullWidth label="Password" name="password"
          type={showPass ? 'text' : 'password'}
          value={form.password} onChange={handleChange} required sx={{ ...inputSx, mb: 3 }}
          InputProps={{
            startAdornment: <InputAdornment position="start">
              <LockIcon sx={{ color: 'rgba(0,212,255,0.5)', fontSize: 18 }} />
            </InputAdornment>,
            endAdornment: <InputAdornment position="end">
              <IconButton onClick={() => setShowPass(!showPass)} edge="end" size="small"
                sx={{ color: 'rgba(255,255,255,0.4)' }}>
                {showPass ? <VisibilityOffIcon fontSize="small" /> : <VisibilityIcon fontSize="small" />}
              </IconButton>
            </InputAdornment>
          }} />

        <Button fullWidth type="submit" disabled={loading} sx={{
          py: 1.5, borderRadius: '12px', fontFamily: '"Syne", sans-serif',
          fontWeight: 700, fontSize: 15, textTransform: 'none',
          background: 'linear-gradient(135deg, #7c3aed, #00d4ff)',
          color: 'white', boxShadow: '0 4px 20px rgba(0,212,255,0.3)',
          '&:hover': { boxShadow: '0 6px 30px rgba(0,212,255,0.5)', transform: 'translateY(-1px)' },
          '&:disabled': { opacity: 0.7 }, transition: 'all 0.2s',
        }}>
          {loading ? <CircularProgress size={22} sx={{ color: 'white' }} /> : 'Sign In'}
        </Button>

        <Typography sx={{ textAlign: 'center', mt: 3, color: 'rgba(255,255,255,0.4)',
          fontFamily: '"JetBrains Mono", monospace', fontSize: 13 }}>
          No account?{' '}
          <Link to="/register" style={{ color: '#00d4ff', textDecoration: 'none', fontWeight: 600 }}>
            Register here
          </Link>
        </Typography>
      </Box>
    </Box>
  );
};

export default Login;
