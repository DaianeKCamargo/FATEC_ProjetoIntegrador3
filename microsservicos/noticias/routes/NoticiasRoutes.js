const express = require('express');
const router = express.Router();
const controller = require('../controllers/NoticiasControllers');

router.get('/noticias', controller.listar);
router.post('/noticias', controller.criar);

module.exports = router;