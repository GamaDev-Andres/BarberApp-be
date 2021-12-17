const express = require("express");
const { crearUsuario } = require("../controllers/userController");
const router = express.Router();

router.post("/", crearUsuario);
module.exports = router;
