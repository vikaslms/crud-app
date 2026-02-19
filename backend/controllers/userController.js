const db = require('../config/db');

// POST /api/users
const createUser = async (req, res) => {
  try {
    const { name, email, age } = req.body;
    if (!name || !email)
      return res.status(400).json({ message: 'Name and email are required' });

    const [result] = await db.execute(
      'INSERT INTO users (name, email, age) VALUES (?, ?, ?)',
      [name, email, age || null]
    );
    res.status(201).json({ message: 'User created successfully', userId: result.insertId });
  } catch (error) {
    if (error.code === 'ER_DUP_ENTRY')
      return res.status(409).json({ message: 'Email already exists' });
    res.status(500).json({ message: 'Server error', error: error.message });
  }
};

// GET /api/users
const getAllUsers = async (req, res) => {
  try {
    const [rows] = await db.execute('SELECT * FROM users ORDER BY created_at DESC');
    res.status(200).json({ message: 'Users fetched successfully', count: rows.length, data: rows });
  } catch (error) {
    res.status(500).json({ message: 'Server error', error: error.message });
  }
};

// GET /api/users/:id
const getUserById = async (req, res) => {
  try {
    const [rows] = await db.execute('SELECT * FROM users WHERE id = ?', [req.params.id]);
    if (rows.length === 0)
      return res.status(404).json({ message: 'User not found' });
    res.status(200).json({ message: 'User fetched successfully', data: rows[0] });
  } catch (error) {
    res.status(500).json({ message: 'Server error', error: error.message });
  }
};

// PUT /api/users/:id
const updateUser = async (req, res) => {
  try {
    const { name, email, age } = req.body;
    const [existing] = await db.execute('SELECT id FROM users WHERE id = ?', [req.params.id]);
    if (existing.length === 0)
      return res.status(404).json({ message: 'User not found' });

    const [result] = await db.execute(
      'UPDATE users SET name = ?, email = ?, age = ? WHERE id = ?',
      [name, email, age || null, req.params.id]
    );
    res.status(200).json({ message: 'User updated successfully', affectedRows: result.affectedRows });
  } catch (error) {
    if (error.code === 'ER_DUP_ENTRY')
      return res.status(409).json({ message: 'Email already exists' });
    res.status(500).json({ message: 'Server error', error: error.message });
  }
};

// DELETE /api/users/:id
const deleteUser = async (req, res) => {
  try {
    const [result] = await db.execute('DELETE FROM users WHERE id = ?', [req.params.id]);
    if (result.affectedRows === 0)
      return res.status(404).json({ message: 'User not found' });
    res.status(200).json({ message: 'User deleted successfully' });
  } catch (error) {
    res.status(500).json({ message: 'Server error', error: error.message });
  }
};

module.exports = { createUser, getAllUsers, getUserById, updateUser, deleteUser };
