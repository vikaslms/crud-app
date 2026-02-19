import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import {
  Box, Typography, Button, Table, TableBody, TableCell,
  TableContainer, TableHead, TableRow, IconButton, Chip,
  CircularProgress, Dialog, DialogTitle, DialogContent,
  DialogActions, Alert, Tooltip, Avatar
} from '@mui/material';
import AddIcon from '@mui/icons-material/Add';
import EditIcon from '@mui/icons-material/Edit';
import DeleteIcon from '@mui/icons-material/Delete';
import RefreshIcon from '@mui/icons-material/Refresh';
import { usersAPI } from '../api';
import Navbar from '../components/Navbar';

const thSx = { color: 'rgba(255,255,255,0.4)', fontFamily: '"JetBrains Mono", monospace',
  fontSize: 11, textTransform: 'uppercase', letterSpacing: 2,
  borderBottom: '1px solid rgba(0,212,255,0.15)', bgcolor: '#0f1526' };

const tdSx = { color: '#e2e8f0', borderBottom: '1px solid rgba(255,255,255,0.04)',
  fontFamily: '"JetBrains Mono", monospace', fontSize: 13 };

const Users = () => {
  const navigate = useNavigate();
  const [users, setUsers]       = useState([]);
  const [loading, setLoading]   = useState(true);
  const [deleting, setDeleting] = useState(null);
  const [dialog, setDialog]     = useState(null); // user to delete
  const [error, setError]       = useState('');
  const [success, setSuccess]   = useState('');

  const fetchUsers = async () => {
    setLoading(true);
    try {
      const { data } = await usersAPI.getAll();
      setUsers(data.data || []);
    } catch { setError('Failed to load users'); }
    finally { setLoading(false); }
  };

  useEffect(() => { fetchUsers(); }, []);

  const handleDelete = async () => {
    setDeleting(dialog.id);
    try {
      await usersAPI.delete(dialog.id);
      setUsers(users.filter(u => u.id !== dialog.id));
      setSuccess('User deleted successfully');
      setTimeout(() => setSuccess(''), 3000);
    } catch { setError('Failed to delete user'); }
    finally { setDeleting(null); setDialog(null); }
  };

  const getInitials = (name) => name?.split(' ').map(n => n[0]).join('').toUpperCase() || '?';
  const colors = ['#00d4ff', '#7c3aed', '#10b981', '#f59e0b', '#ef4444'];
  const getColor = (id) => colors[id % colors.length];

  return (
    <Box sx={{ bgcolor: '#0a0e1a', minHeight: '100vh',
      backgroundImage: 'linear-gradient(rgba(0,212,255,0.02) 1px, transparent 1px), linear-gradient(90deg, rgba(0,212,255,0.02) 1px, transparent 1px)',
      backgroundSize: '40px 40px' }}>
      <Navbar />
      <Box sx={{ pt: 12, pb: 6, px: { xs: 2, md: 4 }, maxWidth: 1100, mx: 'auto' }}>

        {/* Header */}
        <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 4 }}>
          <Box>
            <Typography sx={{ color: 'rgba(255,255,255,0.4)', fontFamily: '"JetBrains Mono", monospace',
              fontSize: 12, mb: 0.5 }}>// manage</Typography>
            <Typography variant="h4" sx={{ fontFamily: '"Syne", sans-serif', fontWeight: 800,
              background: 'linear-gradient(135deg, #fff, #00d4ff)',
              WebkitBackgroundClip: 'text', WebkitTextFillColor: 'transparent' }}>
              Users
            </Typography>
          </Box>
          <Box sx={{ display: 'flex', gap: 2 }}>
            <Tooltip title="Refresh">
              <IconButton onClick={fetchUsers} sx={{ color: 'rgba(255,255,255,0.4)',
                border: '1px solid rgba(255,255,255,0.1)', borderRadius: '10px',
                '&:hover': { color: '#00d4ff', borderColor: 'rgba(0,212,255,0.3)' } }}>
                <RefreshIcon />
              </IconButton>
            </Tooltip>
            <Button onClick={() => navigate('/users/new')} startIcon={<AddIcon />}
              sx={{ borderRadius: '12px', px: 3, textTransform: 'none',
                fontFamily: '"Syne", sans-serif', fontWeight: 700,
                background: 'linear-gradient(135deg, #7c3aed, #00d4ff)', color: 'white',
                boxShadow: '0 4px 20px rgba(0,212,255,0.3)',
                '&:hover': { boxShadow: '0 6px 30px rgba(0,212,255,0.5)' } }}>
              Add User
            </Button>
          </Box>
        </Box>

        {error   && <Alert severity="error"   sx={{ mb: 2, borderRadius: '10px', bgcolor: 'rgba(239,68,68,0.1)', color: '#ef4444' }} onClose={() => setError('')}>{error}</Alert>}
        {success && <Alert severity="success" sx={{ mb: 2, borderRadius: '10px', bgcolor: 'rgba(16,185,129,0.1)', color: '#10b981' }}>{success}</Alert>}

        {/* Table */}
        <TableContainer sx={{ bgcolor: '#141b2d', borderRadius: '16px',
          border: '1px solid rgba(0,212,255,0.1)', overflow: 'hidden' }}>
          <Table>
            <TableHead>
              <TableRow>
                <TableCell sx={thSx}>User</TableCell>
                <TableCell sx={thSx}>Email</TableCell>
                <TableCell sx={thSx}>Age</TableCell>
                <TableCell sx={thSx}>Joined</TableCell>
                <TableCell sx={{ ...thSx, textAlign: 'right' }}>Actions</TableCell>
              </TableRow>
            </TableHead>
            <TableBody>
              {loading ? (
                <TableRow>
                  <TableCell colSpan={5} sx={{ textAlign: 'center', py: 6, borderBottom: 'none' }}>
                    <CircularProgress sx={{ color: '#00d4ff' }} />
                  </TableCell>
                </TableRow>
              ) : users.length === 0 ? (
                <TableRow>
                  <TableCell colSpan={5} sx={{ textAlign: 'center', py: 6, color: 'rgba(255,255,255,0.3)',
                    fontFamily: '"JetBrains Mono", monospace', borderBottom: 'none' }}>
                    No users found. Add one!
                  </TableCell>
                </TableRow>
              ) : users.map((user) => (
                <TableRow key={user.id} sx={{ '&:hover': { bgcolor: 'rgba(0,212,255,0.03)' } }}>
                  <TableCell sx={tdSx}>
                    <Box sx={{ display: 'flex', alignItems: 'center', gap: 2 }}>
                      <Avatar sx={{ width: 36, height: 36, bgcolor: getColor(user.id),
                        fontFamily: '"Syne", sans-serif', fontWeight: 700,
                        fontSize: 14, color: '#0a0e1a' }}>
                        {getInitials(user.name)}
                      </Avatar>
                      <Typography sx={{ color: '#e2e8f0', fontFamily: '"Syne", sans-serif',
                        fontWeight: 600, fontSize: 14 }}>{user.name}</Typography>
                    </Box>
                  </TableCell>
                  <TableCell sx={tdSx}>{user.email}</TableCell>
                  <TableCell sx={tdSx}>
                    {user.age ? <Chip label={user.age} size="small"
                      sx={{ bgcolor: 'rgba(0,212,255,0.1)', color: '#00d4ff',
                        border: '1px solid rgba(0,212,255,0.2)', fontFamily: '"JetBrains Mono", monospace' }} />
                      : <span style={{ color: 'rgba(255,255,255,0.2)' }}>—</span>}
                  </TableCell>
                  <TableCell sx={{ ...tdSx, color: 'rgba(255,255,255,0.4)', fontSize: 12 }}>
                    {new Date(user.created_at).toLocaleDateString()}
                  </TableCell>
                  <TableCell sx={{ ...tdSx, textAlign: 'right' }}>
                    <Tooltip title="Edit">
                      <IconButton onClick={() => navigate(`/users/edit/${user.id}`)}
                        sx={{ color: '#f59e0b', '&:hover': { bgcolor: 'rgba(245,158,11,0.1)' }, mr: 0.5 }}>
                        <EditIcon fontSize="small" />
                      </IconButton>
                    </Tooltip>
                    <Tooltip title="Delete">
                      <IconButton onClick={() => setDialog(user)}
                        disabled={deleting === user.id}
                        sx={{ color: '#ef4444', '&:hover': { bgcolor: 'rgba(239,68,68,0.1)' } }}>
                        {deleting === user.id
                          ? <CircularProgress size={18} sx={{ color: '#ef4444' }} />
                          : <DeleteIcon fontSize="small" />}
                      </IconButton>
                    </Tooltip>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </TableContainer>

        {/* Total count */}
        {!loading && users.length > 0 && (
          <Typography sx={{ mt: 2, color: 'rgba(255,255,255,0.3)', fontSize: 12,
            fontFamily: '"JetBrains Mono", monospace', textAlign: 'right' }}>
            {users.length} user{users.length !== 1 ? 's' : ''} total
          </Typography>
        )}
      </Box>

      {/* Delete Confirm Dialog */}
      <Dialog open={Boolean(dialog)} onClose={() => setDialog(null)}
        PaperProps={{ sx: { bgcolor: '#141b2d', border: '1px solid rgba(239,68,68,0.3)',
          borderRadius: '20px', p: 1 } }}>
        <DialogTitle sx={{ fontFamily: '"Syne", sans-serif', fontWeight: 700,
          color: '#e2e8f0', display: 'flex', alignItems: 'center', gap: 1 }}>
          🗑️ Delete User
        </DialogTitle>
        <DialogContent>
          <Typography sx={{ color: 'rgba(255,255,255,0.6)', fontFamily: '"JetBrains Mono", monospace',
            fontSize: 14 }}>
            Are you sure you want to delete <strong style={{ color: '#ef4444' }}>{dialog?.name}</strong>?
            This cannot be undone.
          </Typography>
        </DialogContent>
        <DialogActions sx={{ p: 2, gap: 1 }}>
          <Button onClick={() => setDialog(null)}
            sx={{ borderRadius: '10px', color: 'rgba(255,255,255,0.6)',
              border: '1px solid rgba(255,255,255,0.1)', textTransform: 'none',
              fontFamily: '"Syne", sans-serif', '&:hover': { bgcolor: 'rgba(255,255,255,0.05)' } }}>
            Cancel
          </Button>
          <Button onClick={handleDelete} variant="contained"
            sx={{ borderRadius: '10px', bgcolor: '#ef4444', textTransform: 'none',
              fontFamily: '"Syne", sans-serif', fontWeight: 700,
              '&:hover': { bgcolor: '#dc2626' } }}>
            Delete
          </Button>
        </DialogActions>
      </Dialog>
    </Box>
  );
};

export default Users;
