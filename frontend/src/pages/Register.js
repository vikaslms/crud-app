import { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import {
  Box, TextField, Button, Typography, Alert,
  InputAdornment, IconButton, CircularProgress
} from '@mui/material';
import EmailIcon from '@mui/icons-material/Email';
import LockIcon from '@mui/icons-material/Lock';
import PersonIcon from '@mui/icons-material/Person';
import VisibilityIcon from '@mui/icons-material/Visibility';
import VisibilityOffIcon from '@mui/icons-material/VisibilityOff';
import { useAuth } from '../context/AuthContext';

const inputSx = {
  '& .MuiOutlinedInput-root': {
    bgcolor: 'rgba(255,255,255,0.04)', borderRadius: '12px',
    fontFamily: '"JetBrains Mono", monospace',
    '& fieldset': { borderColor: 'rgba(0,212,255,0.2)' },
    '&:hover fieldset': { borderColor: 'rgba(0,212,255,0.4)' },
    '&.Mui-focused fieldset': { borderColor: '#00d4ff' },
  },
  '& .MuiInputLabel-root': { color: 'rgba(255,255,255,0.4)' },
  '& .MuiInputLabel-root.Mui-focused': { color: '#00d4ff' },
  '& input': { color: '#e2e8f0' },
};

const Register = () => {
  const { register } = useAuth();
  const navigate = useNavigate();
  const [form, setForm]       = useState({ name: '', email: '', password: '' });
  const [error, setError]     = useState('');
  const [loading, setLoading] = useState(false);
  const [showPass, setShowPass] = useState(false);

  const handleChange = (e) => setForm({ ...form, [e.target.name]: e.target.value });

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (form.password.length < 6) return setError('Password must be at least 6 characters');
    setError(''); setLoading(true);
    try {
      await register(form.name, form.email, form.password);
      navigate('/dashboard');
    } catch (err) {
      setError(err.response?.data?.message || 'Registration failed');
    } finally { setLoading(false); }
  };

  return (
    <Box sx={{
      minHeight: '100vh', display: 'flex', alignItems: 'center', justifyContent: 'center',
      bgcolor: '#0a0e1a',
      backgroundImage: 'linear-gradient(rgba(0,212,255,0.03) 1px, transparent 1px), linear-gradient(90deg, rgba(0,212,255,0.03) 1px, transparent 1px)',
      backgroundSize: '40px 40px',
    }}>
      <Box sx={{ position: 'absolute', width: 400, height: 400, borderRadius: '50%',
        background: 'radial-gradient(circle, rgba(124,58,237,0.08) 0%, transparent 70%)',
        top: '20%', left: '50%', transform: 'translateX(-50%)', pointerEvents: 'none' }} />

      <Box component="form" onSubmit={handleSubmit} sx={{
        width: '100%', maxWidth: 420, p: 4,
        background: 'rgba(20,27,45,0.9)', backdropFilter: 'blur(20px)',
        border: '1px solid rgba(124,58,237,0.2)', borderRadius: '24px',
        boxShadow: '0 25px 60px rgba(0,0,0,0.5)', position: 'relative', zIndex: 1,
      }}>
        <Box sx={{ textAlign: 'center', mb: 4 }}>
          <Typography sx={{ fontSize: 40, mb: 1 }}>🚀</Typography>
          <Typography variant="h4" sx={{
            fontFamily: '"Syne", sans-serif', fontWeight: 800,
            background: 'linear-gradient(135deg, #fff, #7c3aed)',
            WebkitBackgroundClip: 'text', WebkitTextFillColor: 'transparent',
          }}>Create Account</Typography>
          <Typography sx={{ color: 'rgba(255,255,255,0.4)', mt: 1,
            fontFamily: '"JetBrains Mono", monospace', fontSize: 13 }}>
            // join the platform
          </Typography>
        </Box>

        {error && <Alert severity="error" sx={{ mb: 2, bgcolor: 'rgba(239,68,68,0.1)',
          color: '#ef4444', border: '1px solid rgba(239,68,68,0.3)', borderRadius: '10px' }}>
          {error}
        </Alert>}

        <TextField fullWidth label="Full Name" name="name"
          value={form.name} onChange={handleChange} required sx={{ ...inputSx, mb: 2 }}
          InputProps={{ startAdornment: <InputAdornment position="start">
            <PersonIcon sx={{ color: 'rgba(124,58,237,0.6)', fontSize: 18 }} />
          </InputAdornment> }} />

        <TextField fullWidth label="Email" name="email" type="email"
          value={form.email} onChange={handleChange} required sx={{ ...inputSx, mb: 2 }}
          InputProps={{ startAdornment: <InputAdornment position="start">
            <EmailIcon sx={{ color: 'rgba(124,58,237,0.6)', fontSize: 18 }} />
          </InputAdornment> }} />

        <TextField fullWidth label="Password" name="password"
          type={showPass ? 'text' : 'password'}
          value={form.password} onChange={handleChange} required sx={{ ...inputSx, mb: 3 }}
          InputProps={{
            startAdornment: <InputAdornment position="start">
              <LockIcon sx={{ color: 'rgba(124,58,237,0.6)', fontSize: 18 }} />
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
          background: 'linear-gradient(135deg, #00d4ff, #7c3aed)',
          color: 'white', boxShadow: '0 4px 20px rgba(124,58,237,0.3)',
          '&:hover': { boxShadow: '0 6px 30px rgba(124,58,237,0.5)', transform: 'translateY(-1px)' },
          '&:disabled': { opacity: 0.7 }, transition: 'all 0.2s',
        }}>
          {loading ? <CircularProgress size={22} sx={{ color: 'white' }} /> : 'Create Account'}
        </Button>

        <Typography sx={{ textAlign: 'center', mt: 3, color: 'rgba(255,255,255,0.4)',
          fontFamily: '"JetBrains Mono", monospace', fontSize: 13 }}>
          Already have an account?{' '}
          <Link to="/login" style={{ color: '#7c3aed', textDecoration: 'none', fontWeight: 600 }}>
            Sign in
          </Link>
        </Typography>
      </Box>
    </Box>
  );
};

export default Register;
