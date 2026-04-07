const express = require("express");
const controller = require("../controllers/noticiaController");

const router = express.Router();

router.get("/", controller.listarNoticias);
router.get("/:id", controller.buscarNoticiaPorId);
router.post("/", controller.criarNoticia);
router.put("/:id", controller.atualizarNoticia);
router.delete("/:id", controller.removerNoticia);

module.exports = router;
