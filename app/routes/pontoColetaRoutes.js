const express = require("express");
const controller = require("../controllers/pontoColetaController");

const router = express.Router();

router.get("/", controller.listarPontosColeta);
router.get("/:id", controller.buscarPontoColetaPorId);
router.post("/", controller.criarPontoColeta);
router.put("/:id", controller.atualizarPontoColeta);
router.delete("/:id", controller.removerPontoColeta);

module.exports = router;
