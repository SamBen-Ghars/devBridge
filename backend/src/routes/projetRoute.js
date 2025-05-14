const express = require('express');
const router = express.Router();
const projetController = require('../controllers/projetController');
const multer = require('multer');
const path = require('path');

// Configuration de multer pour le stockage des fichiers
const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, 'uploads/projets/');
  },
  filename: (req, file, cb) => {
    cb(null, Date.now() + path.extname(file.originalname));
  }
});

const upload = multer({ storage: storage });

// Routes
router.post('/create', upload.array('fichiers'), projetController.createProjet);
router.get('/:id', projetController.getProjet);
router.get('/', projetController.getAllProjets);
router.put('/update/:id', upload.array('fichiers'), projetController.updateProjet);
router.delete('/delete/:id', projetController.deleteProjet);

module.exports = router;
