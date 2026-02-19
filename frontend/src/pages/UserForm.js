import { useState, useEffect } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import {
  Box, Typography, TextField, Button, Alert,
  CircularProgress, InputAdornment
} from '@mui/material';
import PersonIcon from '@mui/icons-material/Person';
import EmailIcon from '@mui/icons-material/Email';
import CakeIcon from '@mui/icons-material/Cake';
import ArrowBackIcon from '@mui/icons-material/ArrowBack';
import SaveIcon from '@mui/icons-material/Save';
import { usersAPI } from '../api';
import Navbar from '../components/Navbar';

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

const UserForm = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const isEdit = Boolean(id);

  const [form, setForm]       = useState({ name: '', email: '', age: '' });
  const [loading, setLoading] = useState(false);
  const [fetching, setFetching] = useState(isEdit);
  const [error, setError]     = useState('');
  const [success, setSuccess] = useState('');

  useEffect(() => {
    if (isEdit) {
      usersAPI.getOne(id)
        .then(({ data }) => {
          const u = data.data;
          setForm({ name: u.name, email: u.email, age: u.age || '' });
        })
        .catch(() => setError('User not found'))
        .finally(() => setFetching(false));
    }
  }, [id, isEdit]);

  const handleChange = (e) => setForm({ ...form, [e.target.name]: e.target.value });

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError(''); setLoading(true);
    try {
      const payload = { ...form, age: form.age ? Number(form.age) : null };
      if (isEdit) {
        await usersAPI.update(id, payload);
        setSuccess('User updated successfully!');
      } else {
        await usersAPI.create(payload);
        setSuccess('User created successfully!');
      }
      setTimeout(() => navigate('/users'), 1200);
    } catch (err) {
      setError(err.response?.data?.message || 'Operation failed');
    } finally { setLoading(false); }
  };

  return (
    <Box sx={{ bgcolor: '#0a0e1a', minHeight: '100vh',
      backgroundImage: 'linear-gradient(rgba(0,212,255,0.02) 1px, transparent 1px), linear-gradient(90deg, rgba(0,212,255,0.02) 1px, transparent 1px)',
      backgroundSize: '40px 40px' }}>
      <Navbar />
      <Box sx={{ pt: 12, pb: 6, px: { xs: 2, md: 4 }, maxWidth: 600, mx: 'auto' }}>

        {/* Back button */}
        <Button onClick={() => navigate('/users')} startIcon={<ArrowBackIcon />}
          sx={{ mb: 3, color: 'rgba(255,255,255,0.5)', textTransform: 'none',
            fontFamily: '"Syne", sans-serif',
            '&:hover': { color: '#00d4ff', bgcolor: 'transparent' } }}>
          Back to Users
        </Button>

        {/* Header */}
        <Box sx={{ mb: 4 }}>
          <Typography sx={{ color: 'rgba(255,255,255,0.4)', fontFamily: '"JetBrains Mono", monospace',
            fontSize: 12, mb: 0.5 }}>// {isEdit ? 'edit record' : 'new record'}</Typography>
          <Typography variant="h4" sx={{ fontFamily: '"Syne", sans-serif', fontWeight: 800,
            background: `linear-gradient(135deg, #fff, ${isEdit ? '#f59e0b' : '#10b981'})`,
            WebkitBackgroundClip: 'text', WebkitTextFillColor: 'transparent' }}>
            {isEdit ? 'Edit User' : 'Add New User'}
          </Typography>
        </Box>

        {fetching ? (
          <Box sx={{ display: 'flex', justifyContent: 'center', py: 8 }}>
            <CircularProgress sx={{ color: '#00d4ff' }} />
          </Box>
        ) : (
          <Box component="form" onSubmit={handleSubmit} sx={{
            bgcolor: '#141b2d', border: `1px solid ${isEdit ? 'rgba(245,158,11,0.2)' : 'rgba(16,185,129,0.2)'}`,
            borderRadius: '20px', p: 4,
          }}>
            {error   && <Alert severity="error" sx={{ mb: 3, borderRadius: '10px',
              bgcolor: 'rgba(239,68,68,0.1)', color: '#ef4444' }} onClose={() => setError('')}>{error}</Alert>}
            {success && <Alert severity="success" sx={{ mb: 3, borderRadius: '10px',
              bgcolor: 'rgba(16,185,129,0.1)', color: '#10b981' }}>{success}</Alert>}

            <TextField fullWidth label="Full Name" name="name"
              value={form.name} onChange={handleChange} required sx={{ ...inputSx, mb: 3 }}
              InputProps={{ startAdornment: <InputAdornment position="start">
                <PersonIcon sx={{ color: 'rgba(0,212,255,0.5)', fontSize: 18 }} />
              </InputAdornment> }} />

            <TextField fullWidth label="Email" name="email" type="email"
              value={form.email} onChange={handleChange} required sx={{ ...inputSx, mb: 3 }}
              InputProps={{ startAdornment: <InputAdornment position="start">
                <EmailIcon sx={{ color: 'rgba(0,212,255,0.5)', fontSize: 18 }} />
              </InputAdornment> }} />

            <TextField fullWidth label="Age (optional)" name="age" type="number"
              value={form.age} onChange={handleChange} sx={{ ...inputSx, mb: 4 }}
              inputProps={{ min: 1, max: 120 }}
              InputProps={{ startAdornment: <InputAdornment position="start">
                <CakeIcon sx={{ color: 'rgba(0,212,255,0.5)', fontSize: 18 }} />
              </InputAdornment> }} />

            <Box sx={{ display: 'flex', gap: 2 }}>
              <Button onClick={() => navigate('/users')} fullWidth
                sx={{ py: 1.5, borderRadius: '12px', textTransform: 'none',
                  fontFamily: '"Syne", sans-serif', fontWeight: 600,
                  border: '1px solid rgba(255,255,255,0.1)', color: 'rgba(255,255,255,0.6)',
                  '&:hover': { bgcolor: 'rgba(255,255,255,0.05)' } }}>
                Cancel
              </Button>
              <Button type="submit" fullWidth disabled={loading} startIcon={!loading && <SaveIcon />}
                sx={{ py: 1.5, borderRadius: '12px', textTransform: 'none',
                  fontFamily: '"Syne", sans-serif', fontWeight: 700,
                  background: isEdit
                    ? 'linear-gradient(135deg, #f59e0b, #ef4444)'
                    : 'linear-gradient(135deg, #10b981, #00d4ff)',
                  color: 'white',
                  boxShadow: isEdit ? '0 4px 20px rgba(245,158,11,0.3)' : '0 4px 20px rgba(16,185,129,0.3)',
                  '&:hover': { transform: 'translateY(-1px)' },
                  '&:disabled': { opacity: 0.7 }, transition: 'all 0.2s' }}>
                {loading ? <CircularProgress size={22} sx={{ color: 'white' }} />
                  : isEdit ? 'Update User' : 'Create User'}
              </Button>
            </Box>
          </Box>
        )}
      </Box>
    </Box>
  );
};

export default UserForm;
