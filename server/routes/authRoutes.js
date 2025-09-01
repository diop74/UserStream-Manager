import express from 'express';
import { 
  login, 
  logout, 
  getProfile, 
  createAdmin, 
  getAdmins 
} from '../controllers/authController.js';
import { authenticate, requireSuperAdmin } from '../middleware/auth.js';

const router = express.Router();

// Routes publiques
router.post('/login', login);
router.post('/logout', logout);

// Routes protégées
router.get('/profile', authenticate, getProfile);
router.post('/create-admin', authenticate, requireSuperAdmin, createAdmin);
router.get('/admins', authenticate, requireSuperAdmin, getAdmins);

export default router;