import User from '../models/User.js';

// Récupérer tous les utilisateurs
export const getAllUsers = async (req, res) => {
  try {
    const users = await User.find().sort({ createdAt: -1 });
    res.json(users);
  } catch (error) {
    console.error('Erreur lors de la récupération des utilisateurs:', error);
    res.status(500).json({ error: 'Erreur serveur lors de la récupération des utilisateurs' });
  }
};

// Récupérer un utilisateur par ID
export const getUserById = async (req, res) => {
  try {
    const user = await User.findById(req.params.id);
    if (!user) {
      return res.status(404).json({ error: 'Utilisateur non trouvé' });
    }
    res.json(user);
  } catch (error) {
    console.error('Erreur lors de la récupération de l\'utilisateur:', error);
    res.status(500).json({ error: 'Erreur serveur lors de la récupération de l\'utilisateur' });
  }
};

// Créer un nouvel utilisateur
export const createUser = async (req, res) => {
  try {
    const { name, email, service, validityMonths, subscriptionDate } = req.body;

    // Validation des données
    if (!name || !email || !service || !validityMonths || !subscriptionDate) {
      return res.status(400).json({ error: 'Tous les champs sont requis' });
    }

    // Vérifier si l'email existe déjà
    const existingUser = await User.findOne({ email });
    if (existingUser) {
      return res.status(400).json({ error: 'Un utilisateur avec cet email existe déjà' });
    }

    const userData = {
      name,
      email,
      service,
      validityMonths,
      subscriptionDate: new Date(subscriptionDate)
    };

    const user = new User(userData);
    await user.save();

    res.status(201).json(user);
  } catch (error) {
    console.error('Erreur lors de la création de l\'utilisateur:', error);
    if (error.name === 'ValidationError') {
      return res.status(400).json({ error: 'Données invalides', details: error.message });
    }
    res.status(500).json({ error: 'Erreur serveur lors de la création de l\'utilisateur' });
  }
};

// Mettre à jour un utilisateur
export const updateUser = async (req, res) => {
  try {
    const { name, email, service, validityMonths, subscriptionDate } = req.body;
    const userId = req.params.id;

    // Vérifier si l'utilisateur existe
    const existingUser = await User.findById(userId);
    if (!existingUser) {
      return res.status(404).json({ error: 'Utilisateur non trouvé' });
    }

    // Vérifier si l'email est déjà utilisé par un autre utilisateur
    if (email && email !== existingUser.email) {
      const emailExists = await User.findOne({ email, _id: { $ne: userId } });
      if (emailExists) {
        return res.status(400).json({ error: 'Un utilisateur avec cet email existe déjà' });
      }
    }

    const updateData = {};
    if (name) updateData.name = name;
    if (email) updateData.email = email;
    if (service) updateData.service = service;
    if (validityMonths) updateData.validityMonths = validityMonths;
    if (subscriptionDate) updateData.subscriptionDate = new Date(subscriptionDate);

    const user = await User.findByIdAndUpdate(userId, updateData, { 
      new: true, 
      runValidators: true 
    });

    res.json(user);
  } catch (error) {
    console.error('Erreur lors de la mise à jour de l\'utilisateur:', error);
    if (error.name === 'ValidationError') {
      return res.status(400).json({ error: 'Données invalides', details: error.message });
    }
    res.status(500).json({ error: 'Erreur serveur lors de la mise à jour de l\'utilisateur' });
  }
};

// Supprimer un utilisateur
export const deleteUser = async (req, res) => {
  try {
    const user = await User.findByIdAndDelete(req.params.id);
    if (!user) {
      return res.status(404).json({ error: 'Utilisateur non trouvé' });
    }
    res.json({ message: 'Utilisateur supprimé avec succès' });
  } catch (error) {
    console.error('Erreur lors de la suppression de l\'utilisateur:', error);
    res.status(500).json({ error: 'Erreur serveur lors de la suppression de l\'utilisateur' });
  }
};

// Récupérer les statistiques
export const getUserStats = async (req, res) => {
  try {
    const stats = await User.aggregate([
      {
        $group: {
          _id: null,
          total: { $sum: 1 },
          active: {
            $sum: {
              $cond: [{ $eq: ['$status', 'Active'] }, 1, 0]
            }
          },
          expired: {
            $sum: {
              $cond: [{ $eq: ['$status', 'Expired'] }, 1, 0]
            }
          },
          netflix: {
            $sum: {
              $cond: [{ $eq: ['$service', 'Netflix'] }, 1, 0]
            }
          },
          primeVideo: {
            $sum: {
              $cond: [{ $eq: ['$service', 'PrimeVideo'] }, 1, 0]
            }
          }
        }
      }
    ]);

    // Calculer les abonnements qui expirent cette semaine
    const oneWeekFromNow = new Date();
    oneWeekFromNow.setDate(oneWeekFromNow.getDate() + 7);

    const expiringThisWeek = await User.countDocuments({
      status: 'Active',
      expirationDate: { $lte: oneWeekFromNow }
    });

    const result = stats[0] || {
      total: 0,
      active: 0,
      expired: 0,
      netflix: 0,
      primeVideo: 0
    };

    result.expiringThisWeek = expiringThisWeek;

    res.json(result);
  } catch (error) {
    console.error('Erreur lors de la récupération des statistiques:', error);
    res.status(500).json({ error: 'Erreur serveur lors de la récupération des statistiques' });
  }
};