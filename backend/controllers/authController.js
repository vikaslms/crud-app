const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const db = require('../config/db');

const generateAccessToken = (user) => {
  return jwt.sign(
    { id: user.id, email: user.email },
    process.env.JWT_SECRET,
    { expiresIn: process.env.JWT_EXPIRES_IN || '15m' }
  );
};

const generateRefreshToken = (user) => {
  return jwt.sign(
    { id: user.id },
    process.env.JWT_REFRESH_SECRET,
    { expiresIn: process.env.JWT_REFRESH_EXPIRES_IN || '7d' }
  );
};

const saveRefreshToken = async (userId, token) => {
  const expiresAt = new Date();
  expiresAt.setDate(expiresAt.getDate() + 7);
  await db.execute(
    'INSERT INTO refresh_tokens (user_id, token, expires_at) VALUES (?, ?, ?)',
    [userId, token, expiresAt]
  );
};

// POST /api/auth/register
const register = async (req, res) => {
  try {
    const { name, email, password } = req.body;

    if (!name || !email || !password)
      return res.status(400).json({ message: 'Name, email, and password are required' });

    if (password.length < 6)
      return res.status(400).json({ message: 'Password must be at least 6 characters' });

    const [existing] = await db.execute('SELECT id FROM auth_users WHERE email = ?', [email]);
    if (existing.length > 0)
      return res.status(409).json({ message: 'Email already registered' });

    const hashedPassword = await bcrypt.hash(password, 12);
    const [result] = await db.execute(
      'INSERT INTO auth_users (name, email, password) VALUES (?, ?, ?)',
      [name, email, hashedPassword]
    );

    const user = { id: result.insertId, email };
    const accessToken = generateAccessToken(user);
    const refreshToken = generateRefreshToken(user);
    await saveRefreshToken(user.id, refreshToken);

    res.status(201).json({
      message: 'User registered successfully',
      accessToken,
      refreshToken,
      user: { id: result.insertId, name, email }
    });
  } catch (error) {
    res.status(500).json({ message: 'Server error', error: error.message });
  }
};

// POST /api/auth/login
const login = async (req, res) => {
  try {
    const { email, password } = req.body;

    if (!email || !password)
      return res.status(400).json({ message: 'Email and password are required' });

    const [rows] = await db.execute('SELECT * FROM auth_users WHERE email = ?', [email]);
    if (rows.length === 0)
      return res.status(401).json({ message: 'Invalid email or password' });

    const user = rows[0];
    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch)
      return res.status(401).json({ message: 'Invalid email or password' });

    const accessToken = generateAccessToken(user);
    const refreshToken = generateRefreshToken(user);
    await saveRefreshToken(user.id, refreshToken);

    res.status(200).json({
      message: 'Login successful',
      accessToken,
      refreshToken,
      user: { id: user.id, name: user.name, email: user.email }
    });
  } catch (error) {
    res.status(500).json({ message: 'Server error', error: error.message });
  }
};

// POST /api/auth/refresh
const refreshToken = async (req, res) => {
  try {
    const { refreshToken } = req.body;
    if (!refreshToken)
      return res.status(400).json({ message: 'Refresh token is required' });

    let decoded;
    try {
      decoded = jwt.verify(refreshToken, process.env.JWT_REFRESH_SECRET);
    } catch {
      return res.status(401).json({ message: 'Invalid or expired refresh token' });
    }

    const [rows] = await db.execute(
      'SELECT * FROM refresh_tokens WHERE token = ? AND expires_at > NOW()',
      [refreshToken]
    );
    if (rows.length === 0)
      return res.status(401).json({ message: 'Refresh token not found or expired' });

    const [users] = await db.execute(
      'SELECT id, name, email FROM auth_users WHERE id = ?', [decoded.id]
    );
    if (users.length === 0)
      return res.status(401).json({ message: 'User not found' });

    const user = users[0];
    await db.execute('DELETE FROM refresh_tokens WHERE token = ?', [refreshToken]);

    const newAccessToken = generateAccessToken(user);
    const newRefreshToken = generateRefreshToken(user);
    await saveRefreshToken(user.id, newRefreshToken);

    res.status(200).json({
      message: 'Token refreshed successfully',
      accessToken: newAccessToken,
      refreshToken: newRefreshToken
    });
  } catch (error) {
    res.status(500).json({ message: 'Server error', error: error.message });
  }
};

// POST /api/auth/logout
const logout = async (req, res) => {
  try {
    const { refreshToken } = req.body;
    if (!refreshToken)
      return res.status(400).json({ message: 'Refresh token is required' });

    await db.execute('DELETE FROM refresh_tokens WHERE token = ?', [refreshToken]);
    res.status(200).json({ message: 'Logged out successfully' });
  } catch (error) {
    res.status(500).json({ message: 'Server error', error: error.message });
  }
};

// GET /api/auth/me  (protected)
const getProfile = async (req, res) => {
  try {
    const [rows] = await db.execute(
      'SELECT id, name, email, created_at FROM auth_users WHERE id = ?',
      [req.user.id]
    );
    if (rows.length === 0)
      return res.status(404).json({ message: 'User not found' });

    res.status(200).json({ data: rows[0] });
  } catch (error) {
    res.status(500).json({ message: 'Server error', error: error.message });
  }
};

module.exports = { register, login, refreshToken, logout, getProfile };
