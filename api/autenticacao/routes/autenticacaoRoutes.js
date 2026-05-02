const express = require("express");
const controller = require("../controllers/autenticacaoController");

const router = express.Router();

// Rotas de administração
router.get("/", controller.listar);
router.get("/:idAdmin", controller.buscarPorId);
router.post("/", controller.criar);
router.put("/:idAdmin", controller.atualizar);
router.delete("/:idAdmin", controller.remover);

// Rotas de autenticação
router.post("/login", controller.login);
router.post("/logout", controller.logout);

// Rotas de recuperação de senha
router.post("/recuperacao/solicitar", controller.solicitarRecuperacao);
router.post("/recuperacao/validar", controller.validarToken);
router.post("/recuperacao/redefinir", controller.redefinirSenha);

module.exports = router;