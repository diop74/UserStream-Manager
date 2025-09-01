import mongoose from 'mongoose';
import dotenv from 'dotenv';

dotenv.config();

const connectDB = async () => {
  try {
    const mongoURI = process.env.MONGODB_URI || 'mongodb://localhost:27017/streamadmin';
    
    console.log(' Tentative de connexion à MongoDB...');
    console.log(' URI:', mongoURI.replace(/\/\/([^:]+):([^@]+)@/, '//***:***@')); // Masque les credentials
    
    const conn = await mongoose.connect(mongoURI, {
      useNewUrlParser: true,
      useUnifiedTopology: true,
      serverSelectionTimeoutMS: 10000, // 10 secondes timeout
      socketTimeoutMS: 45000 // 45 secondes socket timeout
    });

    console.log('✅ MongoDB connecté avec succès!');
    console.log(`🏠 Host: ${conn.connection.host}`);
    console.log(`📊 Database: ${conn.connection.name}`);
    
    // Gestion des événements de connexion
    mongoose.connection.on('error', (err) => {
      console.error(' Erreur MongoDB:', err);
    });

    mongoose.connection.on('disconnected', () => {
      console.log('⚠️ MongoDB déconnecté');
    });

    mongoose.connection.on('reconnected', () => {
      console.log('🔄 MongoDB reconnecté');
    });

  } catch (error) {
    console.error(' Erreur de connexion MongoDB:', error.message);
    
    if (error.name === 'MongoServerSelectionError') {
      console.error(' Vérifiez:');
      console.error('   - Votre URI MongoDB dans le fichier .env');
      console.error('   - Que votre IP est autorisée dans MongoDB Atlas');
      console.error('   - Que vos identifiants sont corrects');
      console.error('   - Que votre cluster est actif');
    }
    
    process.exit(1);
  }
};

export default connectDB;