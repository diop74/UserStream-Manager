import express from 'express';
import cors from 'cors';
import dotenv from 'dotenv';
import connectDB from './config/database.js';
import userRoutes from './routes/userRoutes.js';
import authRoutes from './routes/authRoutes.js';

// Charger les variables d'environnement
dotenv.config();

const app = express();
const PORT = process.env.PORT || 3001;

// Middleware
app.use(cors({
  origin: process.env.FRONTEND_URL || 'http://localhost:5173',
  credentials: true
}));
app.use(express.json({ limit: '10mb' }));
app.use(express.urlencoded({ extended: true }));

// Middleware de logging
app.use((req, res, next) => {
  console.log(`${new Date().toISOString()} - ${req.method} ${req.path}`);
  next();
});

// Routes
app.use('/api', userRoutes);
app.use('/api/auth', authRoutes);

// Route de test
app.get('/api/health', (req, res) => {
  res.json({ 
    status: 'OK', 
    message: 'StreamAdmin API is running',
    timestamp: new Date().toISOString(),
    database: 'MongoDB Atlas'
  });
});

// Middleware de gestion des erreurs
app.use((err, req, res, next) => {
  console.error(' Erreur serveur:', err.stack);
  res.status(500).json({ 
    error: 'Erreur interne du serveur',
    message: process.env.NODE_ENV === 'development' ? err.message : 'Une erreur est survenue'
  });
});

// Route 404
app.use('*', (req, res) => {
  res.status(404).json({ error: 'Route non trouvée' });
});

// Fonction de démarrage du serveur
const startServer = async () => {
  try {
    // Connexion à MongoDB
    await connectDB();
    
    // Démarrage du serveur
    app.listen(PORT, () => {
      console.log(' ================================');
      console.log(` StreamAdmin API démarré!`);
      console.log(` Port: ${PORT}`);
      console.log(` Environment: ${process.env.NODE_ENV || 'development'}`);
      console.log(` Health Check: http://localhost:${PORT}/api/health`);
      console.log(' ================================');
    });
    
  } catch (error) {
    console.error(' Impossible de démarrer le serveur:', error);
    process.exit(1);
  }
};

// Gestion propre de l'arrêt
process.on('SIGINT', async () => {
  console.log('\n Arrêt du serveur...');
  process.exit(0);
});

process.on('SIGTERM', async () => {
  console.log('\n Arrêt du serveur...');
  process.exit(0);
});

// Démarrer le serveur
startServer();