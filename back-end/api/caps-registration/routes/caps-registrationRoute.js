const express = require("express");
const controller = require("../controllers/caps-registrationController");
const { requireAdminSession } = require("../../admin-users/authSession");

const router = express.Router();

router.get("/", controller.listar);
router.get("/:id", controller.buscarPorId);

router.use(requireAdminSession);
router.post("/", controller.criar);
router.put("/:id", controller.atualizar);
router.delete("/:id", controller.remover);

module.exports = router;
