const express = require("express");
const controller = require("../controllers/admin-usersController");
const { requireAdminSession } = require("../authSession");

const router = express.Router();

router.post("/login", controller.login);
router.post("/logout", controller.logout);
router.post("/recuperacao/solicitar", controller.solicitarRecuperacao);
router.post("/recuperacao/validar", controller.validarToken);
router.post("/recuperacao/redefinir", controller.redefinirSenha);

router.use(requireAdminSession);
router.get("/", controller.listar);
router.get("/:idAdmin", controller.buscarPorId);
router.post("/", controller.criar);
router.put("/:idAdmin", controller.atualizar);
router.delete("/:idAdmin", controller.remover);

module.exports = router;
