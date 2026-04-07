const express = require("express");
const controller = require("../controllers/usuarioController");

const router = express.Router();

router.get("/", controller.listarUsuarios);
router.get("/:id", controller.buscarUsuarioPorId);
router.post("/", controller.criarUsuario);
router.put("/:id", controller.atualizarUsuario);
router.delete("/:id", controller.removerUsuario);

module.exports = router;
