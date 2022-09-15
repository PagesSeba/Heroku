const express = require('express');
const router = express.Router();
let apiController = require ("../controllers/apiController.js");
// let forkRandoms = require ("../controllers/forkController.js")

router.get('/productos-test', apiController.listar);
// router.get("/randoms", forkRandoms);

module.exports = router;