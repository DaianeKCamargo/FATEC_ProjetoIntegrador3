const express = require("express");
const controller = require("../controllers/pontoColetaController");

const router = express.Router();

router.post("/requests", controller.criarSolicitacao);
router.get("/requests", controller.listarSolicitacoes);
router.get("/requests/:id", controller.buscarSolicitacaoPorId);
router.patch("/requests/:id", controller.atualizarSolicitacao);
router.patch("/requests/:id/review", controller.revisarSolicitacao);
router.get("/approved", controller.listarAprovados);

module.exports = router;
