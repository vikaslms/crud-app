import { Box, Typography, Avatar, Chip, Divider, Button } from '@mui/material';
import EmailIcon from '@mui/icons-material/Email';
import BadgeIcon from '@mui/icons-material/Badge';
import CalendarTodayIcon from '@mui/icons-material/CalendarToday';
import LogoutIcon from '@mui/icons-material/Logout';
import SecurityIcon from '@mui/icons-material/Security';
import { useAuth } from '../context/AuthContext';
import { useNavigate } from 'react-router-dom';
import Navbar from '../components/Navbar';

const InfoRow = ({ icon, label, value }) => (
  <Box sx={{ display: 'flex', alignItems: 'center', gap: 2, py: 2,
    borderBottom: '1px solid rgba(255,255,255,0.05)' }}>
    <Box sx={{ p: 1, borderRadius: '10px', bgcolor: 'rgba(0,212,255,0.1)',
      border: '1px solid rgba(0,212,255,0.2)', color: '#00d4ff', display: 'flex' }}>
      {icon}
    </Box>
    <Box>
      <Typography sx={{ fontSize: 11, color: 'rgba(255,255,255,0.3)',
        fontFamily: '"JetBrains Mono", monospace', textTransform: 'uppercase',
        letterSpacing: 1.5 }}>{label}</Typography>
      <Typography sx={{ color: '#e2e8f0', fontFamily: '"JetBrains Mono", monospace',
        fontSize: 14, mt: 0.3 }}>{value}</Typography>
    </Box>
  </Box>
);

const Profile = () => {
  const { user, logout } = useAuth();
  const navigate = useNavigate();

  const handleLogout = async () => {
    await logout();
    navigate('/login');
  };

  return (
    <Box sx={{ bgcolor: '#0a0e1a', minHeight: '100vh',
      backgroundImage: 'linear-gradient(rgba(0,212,255,0.02) 1px, transparent 1px), linear-gradient(90deg, rgba(0,212,255,0.02) 1px, transparent 1px)',
      backgroundSize: '40px 40px' }}>
      <Navbar />
      <Box sx={{ pt: 12, pb: 6, px: { xs: 2, md: 4 }, maxWidth: 600, mx: 'auto' }}>

        <Box sx={{ mb: 4 }}>
          <Typography sx={{ color: 'rgba(255,255,255,0.4)', fontFamily: '"JetBrains Mono", monospace',
            fontSize: 12, mb: 0.5 }}>// your account</Typography>
          <Typography variant="h4" sx={{ fontFamily: '"Syne", sans-serif', fontWeight: 800,
            background: 'linear-gradient(135deg, #fff, #7c3aed)',
            WebkitBackgroundClip: 'text', WebkitTextFillColor: 'transparent' }}>
            Profile
          </Typography>
        </Box>

        {/* Avatar Card */}
        <Box sx={{ bgcolor: '#141b2d', border: '1px solid rgba(124,58,237,0.2)',
          borderRadius: '20px', p: 4, mb: 3,
          background: 'linear-gradient(135deg, #141b2d 0%, #1a1040 100%)' }}>
          <Box sx={{ display: 'flex', alignItems: 'center', gap: 3, mb: 3 }}>
            <Avatar sx={{ width: 72, height: 72, bgcolor: '#7c3aed',
              fontFamily: '"Syne", sans-serif', fontWeight: 800, fontSize: 28,
              boxShadow: '0 0 30px rgba(124,58,237,0.4)' }}>
              {user?.name?.[0]?.toUpperCase()}
            </Avatar>
            <Box>
              <Typography variant="h5" sx={{ fontFamily: '"Syne", sans-serif',
                fontWeight: 800, color: '#e2e8f0' }}>{user?.name}</Typography>
              <Chip label="Authenticated" size="small" icon={<SecurityIcon sx={{ fontSize: 14 }} />}
                sx={{ mt: 0.5, bgcolor: 'rgba(16,185,129,0.1)', color: '#10b981',
                  border: '1px solid rgba(16,185,129,0.3)', fontFamily: '"JetBrains Mono", monospace',
                  fontSize: 11 }} />
            </Box>
          </Box>

          <Divider sx={{ borderColor: 'rgba(255,255,255,0.05)', mb: 1 }} />

          <InfoRow icon={<BadgeIcon fontSize="small" />} label="Full Name" value={user?.name} />
          <InfoRow icon={<EmailIcon fontSize="small" />} label="Email Address" value={user?.email} />
          <InfoRow icon={<CalendarTodayIcon fontSize="small" />} label="Member Since"
            value={user?.created_at ? new Date(user.created_at).toLocaleDateString('en-US', {
              year: 'numeric', month: 'long', day: 'numeric'
            }) : 'N/A'} />
        </Box>

        {/* Token Info */}
        <Box sx={{ bgcolor: '#141b2d', border: '1px solid rgba(0,212,255,0.1)',
          borderRadius: '16px', p: 3, mb: 3 }}>
          <Typography sx={{ fontFamily: '"Syne", sans-serif', fontWeight: 700,
            color: '#e2e8f0', mb: 2, fontSize: 15 }}>🔐 Session Info</Typography>
          <Box sx={{ display: 'flex', gap: 2, flexWrap: 'wrap' }}>
            <Chip label="Access Token: Active" size="small"
              sx={{ bgcolor: 'rgba(0,212,255,0.1)', color: '#00d4ff',
                border: '1px solid rgba(0,212,255,0.2)', fontFamily: '"JetBrains Mono", monospace', fontSize: 11 }} />
            <Chip label="Refresh Token: Active" size="small"
              sx={{ bgcolor: 'rgba(16,185,129,0.1)', color: '#10b981',
                border: '1px solid rgba(16,185,129,0.2)', fontFamily: '"JetBrains Mono", monospace', fontSize: 11 }} />
          </Box>
        </Box>

        {/* Logout */}
        <Button fullWidth onClick={handleLogout} startIcon={<LogoutIcon />}
          sx={{ py: 1.5, borderRadius: '12px', textTransform: 'none',
            fontFamily: '"Syne", sans-serif', fontWeight: 700, fontSize: 15,
            border: '1px solid rgba(239,68,68,0.3)', color: '#ef4444',
            '&:hover': { bgcolor: 'rgba(239,68,68,0.08)', borderColor: '#ef4444' } }}>
          Sign Out
        </Button>
      </Box>
    </Box>
  );
};

export default Profile;
