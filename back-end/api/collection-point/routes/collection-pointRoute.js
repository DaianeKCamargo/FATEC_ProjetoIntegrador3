const express = require("express");
const controller = require("../controllers/collection-pointController");

const router = express.Router();

function requireAdminSession(req, res, next) {
    if (req.session?.logado && req.session?.admin) {
        return next();
    }

    return res.status(401).json({ message: "Autenticacao obrigatoria" });
}

router.post("/", controller.criarPontoColeta);
router.get("/approved", controller.listarPontosAprovados);

router.use(requireAdminSession);
router.get("/", controller.listarPontosColeta);
router.get("/:id", controller.buscarPontoColetaPorId);
router.put("/:id", controller.atualizarPontoColeta);
router.delete("/:id", controller.removerPontoColeta);
router.patch("/:id/status", controller.atualizarStatusPontoColeta);

module.exports = router;
