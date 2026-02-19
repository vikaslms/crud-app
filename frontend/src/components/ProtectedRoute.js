import { Navigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { Box, CircularProgress } from '@mui/material';

const ProtectedRoute = ({ children }) => {
  const { user, loading } = useAuth();

  if (loading) {
    return (
      <Box sx={{ display: 'flex', justifyContent: 'center', alignItems: 'center', height: '100vh', bgcolor: '#0a0e1a' }}>
        <CircularProgress sx={{ color: '#00d4ff' }} />
      </Box>
    );
  }

  return user ? children : <Navigate to="/login" replace />;
};

export default ProtectedRoute;
