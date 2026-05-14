const express = require("express");
const controller = require("../controllers/pontoColetaController");
const reviewController = require("../controllers/pontoColetaReviewController");

const router = express.Router();

router.post("/", controller.criarPontoColeta);
router.get("/", controller.listarPontosColeta);
router.get("/approved", controller.listarPontosAprovados);
router.patch("/:id/review", reviewController.revisarPontoColeta);
router.patch("/:id/status", controller.atualizarStatusPontoColeta);
router.get("/:id", controller.buscarPontoColetaPorId);
router.put("/:id", controller.atualizarPontoColeta);
router.delete("/:id", controller.removerPontoColeta);

module.exports = router;
