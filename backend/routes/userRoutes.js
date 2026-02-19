const express = require('express');
const router = express.Router();
const {
  createUser,
  getAllUsers,
  getUserById,
  updateUser,
  deleteUser
} = require('../controllers/userController');
const { authenticate } = require('../middleware/authMiddleware');

// All CRUD routes are protected — require a valid JWT
router.use(authenticate);

router.post('/', createUser);        // CREATE
router.get('/', getAllUsers);         // READ ALL
router.get('/:id', getUserById);     // READ ONE
router.put('/:id', updateUser);      // UPDATE
router.delete('/:id', deleteUser);   // DELETE

module.exports = router;
