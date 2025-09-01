import express from 'express';
import { authenticate, requireAdmin } from '../middleware/auth.js';
import {
  getAllUsers,
  getUserById,
  createUser,
  updateUser,
  deleteUser,
  getUserStats
} from '../controllers/userController.js';

const router = express.Router();

// Routes protégées pour les utilisateurs
router.get('/users', authenticate, requireAdmin, getAllUsers);
router.get('/users/:id', authenticate, requireAdmin, getUserById);
router.post('/users', authenticate, requireAdmin, createUser);
router.put('/users/:id', authenticate, requireAdmin, updateUser);
router.delete('/users/:id', authenticate, requireAdmin, deleteUser);

// Route protégée pour les statistiques
router.get('/stats', authenticate, requireAdmin, getUserStats);

export default router;