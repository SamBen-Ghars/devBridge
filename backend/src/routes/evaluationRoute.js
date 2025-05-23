const express = require("express");
const router = express.Router();
const evaluationController = require("../controllers/evaluationController");

router.post("/:id", evaluationController.createEvaluation);
router.get("/getev", evaluationController.getAllEvaluations);
router.get("/:id", evaluationController.getEvaluationById);
router.put("/:id", evaluationController.updateEvaluation);
router.delete("/:id", evaluationController.deleteEvaluation);

module.exports = router;
