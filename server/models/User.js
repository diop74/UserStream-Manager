import mongoose from 'mongoose';

const userSchema = new mongoose.Schema({
  name: {
    type: String,
    required: [true, 'Le nom est requis'],
    trim: true,
    minlength: [2, 'Le nom doit contenir au moins 2 caractères'],
    maxlength: [100, 'Le nom ne peut pas dépasser 100 caractères']
  },
  email: {
    type: String,
    required: [true, 'L\'email est requis'],
    unique: true,
    trim: true,
    lowercase: true,
    match: [/^\w+([.-]?\w+)*@\w+([.-]?\w+)*(\.\w{2,3})+$/, 'Email invalide']
  },
  service: {
    type: String,
    required: [true, 'Le service est requis'],
    enum: {
      values: ['Netflix', 'PrimeVideo'],
      message: 'Le service doit être Netflix ou PrimeVideo'
    }
  },
  subscriptionDate: {
    type: Date,
    required: [true, 'La date d\'inscription est requise']
  },
  validityMonths: {
    type: Number,
    required: [true, 'La durée de validité est requise'],
    min: [1, 'La durée de validité doit être d\'au moins 1 mois'],
    max: [24, 'La durée de validité ne peut pas dépasser 24 mois']
  },
  expirationDate: {
    type: Date
  },
  status: {
    type: String,
    enum: ['Active', 'Expired'],
    default: 'Active'
  }
}, {
  timestamps: true
});

// Middleware pour calculer la date d'expiration et le statut avant la sauvegarde
userSchema.pre('save', function(next) {
  console.log('Pre-save middleware triggered');
  
  // Calculer la date d'expiration
  const subscriptionDate = this.subscriptionDate || new Date();
  const expirationDate = new Date(subscriptionDate);
  expirationDate.setMonth(expirationDate.getMonth() + this.validityMonths);
  this.expirationDate = expirationDate;
  
  console.log('Calculated expiration date:', this.expirationDate);

  // Calculer le statut
  const now = new Date();
  this.status = this.expirationDate > now ? 'Active' : 'Expired';
  
  console.log('Calculated status:', this.status);

  next();
});

// Middleware pour les mises à jour
userSchema.pre(['findOneAndUpdate', 'updateOne'], async function(next) {
  const update = this.getUpdate();
  
  if (update.$set && (update.$set.subscriptionDate || update.$set.validityMonths)) {
    // Récupérer le document actuel
    const doc = await this.model.findOne(this.getQuery());
    if (!doc) return next();
    
    const subscriptionDate = update.$set.subscriptionDate || doc.subscriptionDate;
    const validityMonths = update.$set.validityMonths || doc.validityMonths;
    
    // Calculer la nouvelle date d'expiration
    const expirationDate = new Date(subscriptionDate);
    expirationDate.setMonth(expirationDate.getMonth() + validityMonths);
    
    // Calculer le nouveau statut
    const now = new Date();
    const status = expirationDate > now ? 'Active' : 'Expired';
    
    // Ajouter à la mise à jour
    if (!update.$set) update.$set = {};
    update.$set.expirationDate = expirationDate;
    update.$set.status = status;
  } else if (update.subscriptionDate || update.validityMonths) {
    // Récupérer le document actuel
    const doc = await this.model.findOne(this.getQuery());
    if (!doc) return next();
    
    const subscriptionDate = update.subscriptionDate || doc.subscriptionDate;
    const validityMonths = update.validityMonths || doc.validityMonths;
    
    // Calculer la nouvelle date d'expiration
    const expirationDate = new Date(subscriptionDate);
    expirationDate.setMonth(expirationDate.getMonth() + validityMonths);
    
    // Calculer le nouveau statut
    const now = new Date();
    const status = expirationDate > now ? 'Active' : 'Expired';
    
    // Ajouter à la mise à jour
    update.expirationDate = expirationDate;
    update.status = status;
  }
  
  next();
});

// Index pour optimiser les performances
userSchema.index({ email: 1 });
userSchema.index({ service: 1 });
userSchema.index({ status: 1 });
userSchema.index({ expirationDate: 1 });

// Méthode virtuelle pour obtenir l'ID au format string
userSchema.virtual('id').get(function() {
  return this._id.toHexString();
});

// Assurer que les virtuels sont inclus dans JSON
userSchema.set('toJSON', {
  virtuals: true,
  transform: function(doc, ret) {
    delete ret._id;
    delete ret.__v;
    return ret;
  }
});

const User = mongoose.model('User', userSchema);

export default User;