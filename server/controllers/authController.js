import jwt from 'jsonwebtoken';
import Admin from '../models/Admin.js';

const JWT_SECRET = process.env.JWT_SECRET || 'votre-secret-jwt-super-securise-changez-moi';
const JWT_EXPIRES_IN = process.env.JWT_EXPIRES_IN || '7d';

// Générer un token JWT
const generateToken = (adminId) => {
  return jwt.sign({ adminId }, JWT_SECRET, { expiresIn: JWT_EXPIRES_IN });
};

// Login
export const login = async (req, res) => {
  try {
    const { username, password } = req.body;

    // Validation des données
    if (!username || !password) {
      return res.status(400).json({ 
        error: 'Nom d\'utilisateur et mot de passe requis' 
      });
    }

    // Rechercher l'admin par username ou email
    const admin = await Admin.findOne({
      $or: [
        { username: username.toLowerCase() },
        { email: username.toLowerCase() }
      ],
      isActive: true
    });

    if (!admin) {
      return res.status(401).json({ 
        error: 'Identifiants invalides' 
      });
    }

    // Vérifier le mot de passe
    const isPasswordValid = await admin.comparePassword(password);
    if (!isPasswordValid) {
      return res.status(401).json({ 
        error: 'Identifiants invalides' 
      });
    }

    // Mettre à jour la dernière connexion
    admin.lastLogin = new Date();
    await admin.save();

    // Générer le token
    const token = generateToken(admin._id);

    res.json({
      message: 'Connexion réussie',
      token,
      admin: {
        id: admin._id,
        username: admin.username,
        email: admin.email,
        name: admin.name,
        role: admin.role,
        lastLogin: admin.lastLogin
      }
    });

  } catch (error) {
    console.error('Erreur lors de la connexion:', error);
    res.status(500).json({ 
      error: 'Erreur serveur lors de la connexion' 
    });
  }
};

// Logout (côté client principalement)
export const logout = async (req, res) => {
  try {
    res.json({ 
      message: 'Déconnexion réussie' 
    });
  } catch (error) {
    console.error('Erreur lors de la déconnexion:', error);
    res.status(500).json({ 
      error: 'Erreur serveur lors de la déconnexion' 
    });
  }
};

// Vérifier le token et obtenir les infos admin
export const getProfile = async (req, res) => {
  try {
    const admin = await Admin.findById(req.admin.adminId).select('-password');
    
    if (!admin || !admin.isActive) {
      return res.status(404).json({ 
        error: 'Administrateur non trouvé' 
      });
    }

    res.json({ admin });
  } catch (error) {
    console.error('Erreur lors de la récupération du profil:', error);
    res.status(500).json({ 
      error: 'Erreur serveur lors de la récupération du profil' 
    });
  }
};

// Créer un nouvel admin (réservé au SuperAdmin)
export const createAdmin = async (req, res) => {
  try {
    const { username, email, password, name } = req.body;

    // Vérifier que l'utilisateur actuel est SuperAdmin
    const currentAdmin = await Admin.findById(req.admin.adminId);
    if (currentAdmin.role !== 'SuperAdmin') {
      return res.status(403).json({ 
        error: 'Accès refusé. Seul le SuperAdmin peut créer des administrateurs' 
      });
    }

    // Validation des données
    if (!username || !email || !password || !name) {
      return res.status(400).json({ 
        error: 'Tous les champs sont requis' 
      });
    }

    // Vérifier si l'admin existe déjà
    const existingAdmin = await Admin.findOne({
      $or: [{ username }, { email }]
    });

    if (existingAdmin) {
      return res.status(400).json({ 
        error: 'Un administrateur avec ce nom d\'utilisateur ou email existe déjà' 
      });
    }

    // Créer le nouvel admin
    const newAdmin = new Admin({
      username,
      email,
      password,
      name,
      role: 'Admin',
      createdBy: req.admin.adminId
    });

    await newAdmin.save();

    res.status(201).json({
      message: 'Administrateur créé avec succès',
      admin: {
        id: newAdmin._id,
        username: newAdmin.username,
        email: newAdmin.email,
        name: newAdmin.name,
        role: newAdmin.role
      }
    });

  } catch (error) {
    console.error('Erreur lors de la création de l\'administrateur:', error);
    res.status(500).json({ 
      error: 'Erreur serveur lors de la création de l\'administrateur' 
    });
  }
};

// Lister les admins (réservé au SuperAdmin)
export const getAdmins = async (req, res) => {
  try {
    const currentAdmin = await Admin.findById(req.admin.adminId);
    if (currentAdmin.role !== 'SuperAdmin') {
      return res.status(403).json({ 
        error: 'Accès refusé. Seul le SuperAdmin peut voir la liste des administrateurs' 
      });
    }

    const admins = await Admin.find({ isActive: true })
      .select('-password')
      .populate('createdBy', 'username name')
      .sort({ createdAt: -1 });

    res.json({ admins });
  } catch (error) {
    console.error('Erreur lors de la récupération des administrateurs:', error);
    res.status(500).json({ 
      error: 'Erreur serveur lors de la récupération des administrateurs' 
    });
  }
};