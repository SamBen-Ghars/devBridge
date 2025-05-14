const Evaluation = require("../models/evaluation.schema");
const Rendu = require("../models/rendu.schema");
const { evaluateRendu } = require("./aiController");

// CREATE a new evaluation after evaluating a rendu
exports.createEvaluation = async (req, res) => {
  const { renduId } = req.params;
  const { scores, commentaires, utiliserIA = false } = req.body;

  try {
    console.log(`Création d'évaluation pour le rendu ${renduId}, mode IA: ${utiliserIA}`);
    
    const rendu = await Rendu.findById(renduId).populate('projet');
    if (!rendu) {
      return res.status(404).json({ message: "Rendu non trouvé" });
    }

    // Vérifier si une évaluation existe déjà
    const existingEvaluation = await Evaluation.findOne({ rendu: renduId });
    if (existingEvaluation) {
      return res.status(400).json({ 
        message: "Ce rendu a déjà été évalué. Utilisez la méthode PUT pour mettre à jour l'évaluation." 
      });
    }

    let evaluationData;

    if (utiliserIA) {
      console.log("Lancement de l'évaluation par IA...");
      // Récupérer le contenu des fichiers pour l'analyse
      let contenu = rendu.description || '';
      
      // Évaluation par IA
      const aiResponse = await evaluateRendu({
        contenu: contenu
      });

      console.log("Réponse de l'IA:", aiResponse);

      if (!aiResponse || !aiResponse.success) {
        return res.status(500).json({
          message: "Erreur d'évaluation IA",
          error: aiResponse?.error || "Erreur inconnue"
        });
      }
      
      evaluationData = aiResponse.data || aiResponse;
    } else {
      // Mode manuel
      if (!scores || !commentaires) {
        return res.status(400).json({
          message: "Scores et commentaires sont requis pour une évaluation manuelle."
        });
      }
      evaluationData = {
        scores,
        commentaires
      };
    }

    // Créer l'évaluation
    const evaluation = new Evaluation({
      rendu: renduId,
      projet: rendu.projet._id,
      scores: evaluationData.scores,
      commentaires: evaluationData.commentaires,
      dateEvaluation: new Date()
    });

    await evaluation.save();
    
    // Mettre à jour le statut du rendu
    rendu.statut = 'évalué';
    await rendu.save();

    return res.status(201).json({ 
      message: "Évaluation créée avec succès", 
      evaluation 
    });

  } catch (error) {
    console.error("Erreur lors de la création de l'évaluation", error);
    return res.status(500).json({
      message: "Erreur serveur",
      error: error.message
    });
  }
};


// GET all evaluations
exports.getAllEvaluations = async (req, res) => {
  try {
    const evaluations = await Evaluation.find().populate('rendu');

    res.status(200).json(evaluations);

  } catch (error) {
    
    res.status(500).json({ message: "Erreur lors de la récupération des évaluations", error: error.message });
  }
};

// GET a specific evaluation by ID
exports.getEvaluationById = async (req, res) => {
  const { id } = req.params;
  try {
    const evaluation = await Evaluation.findById(id).populate('rendu');
    if (!evaluation) {
      return res.status(404).json({ message: "Évaluation non trouvée" });
    }
    res.status(200).json(evaluation);
  } catch (error) {
    res.status(500).json({ message: "Erreur lors de la récupération de l'évaluation", error: error.message });
  }
};

// UPDATE an existing evaluation
exports.updateEvaluation = async (req, res) => {
  const { renduId } = req.params;
  const { scores, commentaires } = req.body;

  try {
    // Trouver l'évaluation existante
    const evaluation = await Evaluation.findOne({ rendu: renduId });
    if (!evaluation) {
      return res.status(404).json({ message: "Évaluation non trouvée" });
    }

    // Mettre à jour l'évaluation
    evaluation.scores = scores;
    evaluation.commentaires = commentaires;
    evaluation.dateEvaluation = new Date();

    await evaluation.save();

    return res.status(200).json({
      message: "Évaluation mise à jour avec succès",
      evaluation
    });
  } catch (error) {
    console.error("Erreur lors de la mise à jour de l'évaluation", error);
    return res.status(500).json({
      message: "Erreur serveur",
      error: error.message
    });
  }
};

// DELETE an evaluation
exports.deleteEvaluation = async (req, res) => {
  const { id } = req.params;

  try {
    const deleted = await Evaluation.findByIdAndDelete(id);
    if (!deleted) {
      return res.status(404).json({ message: "Évaluation non trouvée" });
    }
    res.status(200).json({ message: "Évaluation supprimée avec succès" });
  } catch (error) {
    res.status(500).json({ message: "Erreur lors de la suppression", error: error.message });
  }
};
