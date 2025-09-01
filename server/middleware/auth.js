import jwt from 'jsonwebtoken';
import Admin from '../models/Admin.js';

const JWT_SECRET = process.env.JWT_SECRET || 'votre-secret-jwt-super-securise-changez-moi';

// Middleware d'authentification
export const authenticate = async (req, res, next) => {
  try {
    const token = req.header('Authorization')?.replace('Bearer ', '');

    if (!token) {
      return res.status(401).json({ 
        error: 'Accès refusé. Token manquant.' 
      });
    }

    // Vérifier le token
    const decoded = jwt.verify(token, JWT_SECRET);
    
    // Vérifier que l'admin existe et est actif
    const admin = await Admin.findById(decoded.adminId);
    if (!admin || !admin.isActive) {
      return res.status(401).json({ 
        error: 'Token invalide ou administrateur inactif' 
      });
    }

    req.admin = decoded;
    next();
  } catch (error) {
    console.error('Erreur d\'authentification:', error);
    res.status(401).json({ 
      error: 'Token invalide' 
    });
  }
};

// Middleware pour vérifier le rôle SuperAdmin
export const requireSuperAdmin = async (req, res, next) => {
  try {
    const admin = await Admin.findById(req.admin.adminId);
    
    if (admin.role !== 'SuperAdmin') {
      return res.status(403).json({ 
        error: 'Accès refusé. Privilèges SuperAdmin requis.' 
      });
    }

    next();
  } catch (error) {
    console.error('Erreur de vérification des privilèges:', error);
    res.status(500).json({ 
      error: 'Erreur serveur lors de la vérification des privilèges' 
    });
  }
};

// Middleware pour vérifier le rôle Admin ou SuperAdmin
export const requireAdmin = async (req, res, next) => {
  try {
    const admin = await Admin.findById(req.admin.adminId);
    
    if (!['Admin', 'SuperAdmin'].includes(admin.role)) {
      return res.status(403).json({ 
        error: 'Accès refusé. Privilèges administrateur requis.' 
      });
    }

    next();
  } catch (error) {
    console.error('Erreur de vérification des privilèges:', error);
    res.status(500).json({ 
      error: 'Erreur serveur lors de la vérification des privilèges' 
    });
  }
};