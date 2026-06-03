const express = require("express");
const controller = require("../controllers/newsController");

const router = express.Router();

function requireAdminSession(req, res, next) {
    if (req.session?.logado && req.session?.admin) {
        return next();
    }

    return res.status(401).json({ message: "Autenticacao obrigatoria" });
}

router.get("/", controller.listar);
router.get("/:id", controller.buscarPorId);

router.use(requireAdminSession);
router.post("/", controller.criar);
router.put("/:id", controller.atualizar);
router.delete("/:id", controller.remover);

module.exports = router;
