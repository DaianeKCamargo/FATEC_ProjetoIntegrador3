const express = require("express");
const controller = require("../controllers/admin-usersController");

const router = express.Router();

function requireAdminSession(req, res, next) {
    if (req.session?.logado && req.session?.admin) {
        return next();
    }

    return res.status(401).json({ message: "Autenticacao obrigatoria" });
}

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
