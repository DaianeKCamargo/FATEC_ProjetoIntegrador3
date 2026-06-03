const express = require("express");
const controller = require("../controllers/collection-pointController");
const { requireAdminSession } = require("../../admin-users/authSession");

const router = express.Router();

router.post("/", controller.criarPontoColeta);
router.get("/approved", controller.listarPontosAprovados);

router.use(requireAdminSession);
router.get("/", controller.listarPontosColeta);
router.get("/:id", controller.buscarPontoColetaPorId);
router.put("/:id", controller.atualizarPontoColeta);
router.delete("/:id", controller.removerPontoColeta);
router.patch("/:id/status", controller.atualizarStatusPontoColeta);

module.exports = router;
