import { useState } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import {
  AppBar, Toolbar, Typography, Box, Button, Avatar,
  Menu, MenuItem, IconButton, Chip
} from '@mui/material';
import PeopleIcon from '@mui/icons-material/People';
import PersonIcon from '@mui/icons-material/Person';
import LogoutIcon from '@mui/icons-material/Logout';
import DashboardIcon from '@mui/icons-material/Dashboard';
import { useAuth } from '../context/AuthContext';

const Navbar = () => {
  const { user, logout } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();
  const [anchor, setAnchor] = useState(null);

  const handleLogout = async () => {
    await logout();
    navigate('/login');
  };

  const navLinks = [
    { label: 'Dashboard', path: '/dashboard', icon: <DashboardIcon fontSize="small" /> },
    { label: 'Users',     path: '/users',     icon: <PeopleIcon fontSize="small" /> },
    { label: 'Profile',   path: '/profile',   icon: <PersonIcon fontSize="small" /> },
  ];

  return (
    <AppBar position="fixed" sx={{
      background: 'rgba(10,14,26,0.95)',
      backdropFilter: 'blur(20px)',
      borderBottom: '1px solid rgba(0,212,255,0.15)',
      boxShadow: '0 4px 30px rgba(0,0,0,0.5)',
    }}>
      <Toolbar sx={{ justifyContent: 'space-between' }}>
        {/* Logo */}
        <Typography
          variant="h6"
          sx={{ fontFamily: '"Syne", sans-serif', fontWeight: 800, cursor: 'pointer',
            background: 'linear-gradient(135deg, #fff, #00d4ff)',
            WebkitBackgroundClip: 'text', WebkitTextFillColor: 'transparent' }}
          onClick={() => navigate('/dashboard')}
        >
          ⚡ CRUD<span style={{ color: '#00d4ff' }}>App</span>
        </Typography>

        {/* Nav Links */}
        <Box sx={{ display: 'flex', gap: 1 }}>
          {navLinks.map(({ label, path, icon }) => (
            <Button key={path} startIcon={icon} onClick={() => navigate(path)}
              sx={{
                color: location.pathname === path ? '#00d4ff' : 'rgba(255,255,255,0.6)',
                fontFamily: '"Syne", sans-serif', fontWeight: 600, fontSize: '13px',
                borderRadius: '10px', px: 2,
                background: location.pathname === path ? 'rgba(0,212,255,0.1)' : 'transparent',
                border: location.pathname === path ? '1px solid rgba(0,212,255,0.3)' : '1px solid transparent',
                '&:hover': { background: 'rgba(0,212,255,0.08)', color: '#00d4ff' },
              }}>
              {label}
            </Button>
          ))}
        </Box>

        {/* User Avatar Menu */}
        <Box sx={{ display: 'flex', alignItems: 'center', gap: 2 }}>
          <Chip label={user?.email} size="small"
            sx={{ color: 'rgba(255,255,255,0.5)', bgcolor: 'rgba(255,255,255,0.05)',
              fontFamily: '"JetBrains Mono", monospace', fontSize: '11px' }} />
          <IconButton onClick={(e) => setAnchor(e.currentTarget)} sx={{ p: 0 }}>
            <Avatar sx={{ bgcolor: '#00d4ff', color: '#0a0e1a', fontWeight: 700,
              fontFamily: '"Syne", sans-serif', width: 36, height: 36 }}>
              {user?.name?.[0]?.toUpperCase()}
            </Avatar>
          </IconButton>
          <Menu anchorEl={anchor} open={Boolean(anchor)} onClose={() => setAnchor(null)}
            PaperProps={{ sx: { bgcolor: '#141b2d', border: '1px solid rgba(0,212,255,0.2)',
              borderRadius: '12px', mt: 1 } }}>
            <MenuItem onClick={() => { navigate('/profile'); setAnchor(null); }}
              sx={{ color: '#e2e8f0', gap: 1, '&:hover': { bgcolor: 'rgba(0,212,255,0.1)' } }}>
              <PersonIcon fontSize="small" /> Profile
            </MenuItem>
            <MenuItem onClick={handleLogout}
              sx={{ color: '#ef4444', gap: 1, '&:hover': { bgcolor: 'rgba(239,68,68,0.1)' } }}>
              <LogoutIcon fontSize="small" /> Logout
            </MenuItem>
          </Menu>
        </Box>
      </Toolbar>
    </AppBar>
  );
};

export default Navbar;
