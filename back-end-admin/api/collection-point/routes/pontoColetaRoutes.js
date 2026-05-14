const express = require("express");
const controller = require("../controllers/pontoColetaController");

const router = express.Router();

router.post("/", controller.criarPontoColeta);
router.get("/", controller.listarPontosColeta);
router.get("/approved", controller.listarPontosAprovados);
router.get("/:id", controller.buscarPontoColetaPorId);
router.put("/:id", controller.atualizarPontoColeta);
router.delete("/:id", controller.removerPontoColeta);
router.patch("/:id/status", controller.atualizarStatusPontoColeta);

module.exports = router;
