const express = require("express");
const controller = require("../controllers/autenticacaoController");

const router = express.Router();

router.get("/", controller.listar);
router.get("/:id", controller.buscarPorId);
router.post("/", controller.criar);
router.put("/:id", controller.atualizar);
router.delete("/:id", controller.remover);

router.post("/login", controller.login);

module.exports = router;