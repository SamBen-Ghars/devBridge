const mongoose = require('mongoose');

const renduSchema = new mongoose.Schema({
  projet: { 
    type: mongoose.Schema.Types.ObjectId, 
    ref: 'Projet', 
    required: true 
  },
  etudiant: { 
    type: mongoose.Schema.Types.ObjectId, 
    ref: 'User',  // Référence au modèle User
    required: true 
  },
  fichiers: [String],
  dateSoumission: { type: Date, default: Date.now },
  statut: { 
    type: String, 
    enum: ['soumis', 'en évaluation', 'évalué'], 
    default: 'soumis' 
  },
  description: String,
}, {

  timestamps: true
  
});

module.exports = mongoose.model('Rendu', renduSchema);
