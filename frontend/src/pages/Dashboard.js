import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { Box, Typography, Grid, Card, CardContent, Button, CircularProgress } from '@mui/material';
import PeopleIcon from '@mui/icons-material/People';
import PersonAddIcon from '@mui/icons-material/PersonAdd';
import SecurityIcon from '@mui/icons-material/Security';
import TrendingUpIcon from '@mui/icons-material/TrendingUp';
import { useAuth } from '../context/AuthContext';
import { usersAPI } from '../api';
import Navbar from '../components/Navbar';

const StatCard = ({ icon, label, value, color, delay }) => (
  <Card sx={{
    bgcolor: '#141b2d', border: `1px solid ${color}30`,
    borderRadius: '16px', overflow: 'hidden', position: 'relative',
    animation: `fadeUp 0.5s ease ${delay}s both`,
    '@keyframes fadeUp': {
      from: { opacity: 0, transform: 'translateY(20px)' },
      to: { opacity: 1, transform: 'translateY(0)' },
    },
    '&:hover': { border: `1px solid ${color}60`, transform: 'translateY(-4px)',
      boxShadow: `0 12px 40px ${color}20` },
    transition: 'all 0.3s',
  }}>
    <Box sx={{ position: 'absolute', top: 0, left: 0, right: 0, height: 3, background: color }} />
    <CardContent sx={{ p: 3 }}>
      <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start' }}>
        <Box>
          <Typography sx={{ color: 'rgba(255,255,255,0.4)', fontSize: 12,
            fontFamily: '"JetBrains Mono", monospace', textTransform: 'uppercase',
            letterSpacing: 2, mb: 1 }}>{label}</Typography>
          <Typography variant="h3" sx={{ fontFamily: '"Syne", sans-serif',
            fontWeight: 800, color: '#e2e8f0' }}>{value}</Typography>
        </Box>
        <Box sx={{ p: 1.5, borderRadius: '12px', background: `${color}15`,
          border: `1px solid ${color}30` }}>
          {icon}
        </Box>
      </Box>
    </CardContent>
  </Card>
);

const Dashboard = () => {
  const { user } = useAuth();
  const navigate = useNavigate();
  const [users, setUsers]     = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    usersAPI.getAll()
      .then(({ data }) => setUsers(data.data || []))
      .catch(() => {})
      .finally(() => setLoading(false));
  }, []);

  const greeting = () => {
    const h = new Date().getHours();
    if (h < 12) return 'Good Morning';
    if (h < 18) return 'Good Afternoon';
    return 'Good Evening';
  };

  return (
    <Box sx={{ bgcolor: '#0a0e1a', minHeight: '100vh',
      backgroundImage: 'linear-gradient(rgba(0,212,255,0.02) 1px, transparent 1px), linear-gradient(90deg, rgba(0,212,255,0.02) 1px, transparent 1px)',
      backgroundSize: '40px 40px' }}>
      <Navbar />
      <Box sx={{ pt: 12, pb: 6, px: { xs: 2, md: 4 }, maxWidth: 1100, mx: 'auto' }}>

        {/* Welcome */}
        <Box sx={{ mb: 5, animation: 'fadeUp 0.4s ease both',
          '@keyframes fadeUp': { from: { opacity: 0, transform: 'translateY(16px)' }, to: { opacity: 1, transform: 'translateY(0)' } } }}>
          <Typography sx={{ color: 'rgba(255,255,255,0.4)', fontFamily: '"JetBrains Mono", monospace',
            fontSize: 13, mb: 1 }}>// {greeting()}</Typography>
          <Typography variant="h3" sx={{ fontFamily: '"Syne", sans-serif', fontWeight: 800,
            background: 'linear-gradient(135deg, #fff, #00d4ff)',
            WebkitBackgroundClip: 'text', WebkitTextFillColor: 'transparent' }}>
            {user?.name} 👋
          </Typography>
        </Box>

        {/* Stats */}
        <Grid container spacing={3} sx={{ mb: 5 }}>
          <Grid item xs={12} sm={6} md={3}>
            <StatCard label="Total Users" value={loading ? '...' : users.length}
              icon={<PeopleIcon sx={{ color: '#00d4ff' }} />} color="#00d4ff" delay={0} />
          </Grid>
          <Grid item xs={12} sm={6} md={3}>
            <StatCard label="New This Month" value={loading ? '...' :
              users.filter(u => new Date(u.created_at).getMonth() === new Date().getMonth()).length}
              icon={<PersonAddIcon sx={{ color: '#10b981' }} />} color="#10b981" delay={0.1} />
          </Grid>
          <Grid item xs={12} sm={6} md={3}>
            <StatCard label="Auth Status" value="Active"
              icon={<SecurityIcon sx={{ color: '#7c3aed' }} />} color="#7c3aed" delay={0.2} />
          </Grid>
          <Grid item xs={12} sm={6} md={3}>
            <StatCard label="API Status" value="Online"
              icon={<TrendingUpIcon sx={{ color: '#f59e0b' }} />} color="#f59e0b" delay={0.3} />
          </Grid>
        </Grid>

        {/* Quick Actions */}
        <Box sx={{ bgcolor: '#141b2d', border: '1px solid rgba(0,212,255,0.1)',
          borderRadius: '20px', p: 3,
          animation: 'fadeUp 0.5s ease 0.4s both',
          '@keyframes fadeUp': { from: { opacity: 0, transform: 'translateY(16px)' }, to: { opacity: 1, transform: 'translateY(0)' } } }}>
          <Typography sx={{ fontFamily: '"Syne", sans-serif', fontWeight: 700,
            color: '#e2e8f0', mb: 3, fontSize: 18 }}>Quick Actions</Typography>
          <Box sx={{ display: 'flex', gap: 2, flexWrap: 'wrap' }}>
            <Button onClick={() => navigate('/users')} startIcon={<PeopleIcon />}
              sx={{ borderRadius: '12px', px: 3, py: 1.2, textTransform: 'none',
                fontFamily: '"Syne", sans-serif', fontWeight: 600,
                background: 'rgba(0,212,255,0.1)', color: '#00d4ff',
                border: '1px solid rgba(0,212,255,0.3)',
                '&:hover': { background: 'rgba(0,212,255,0.2)' } }}>
              Manage Users
            </Button>
            <Button onClick={() => navigate('/users/new')} startIcon={<PersonAddIcon />}
              sx={{ borderRadius: '12px', px: 3, py: 1.2, textTransform: 'none',
                fontFamily: '"Syne", sans-serif', fontWeight: 600,
                background: 'rgba(16,185,129,0.1)', color: '#10b981',
                border: '1px solid rgba(16,185,129,0.3)',
                '&:hover': { background: 'rgba(16,185,129,0.2)' } }}>
              Add New User
            </Button>
          </Box>
        </Box>
      </Box>
    </Box>
  );
};

export default Dashboard;
