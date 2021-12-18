const express = require("express");
const { check } = require("express-validator");
const { validarAdmin } = require("../controllers/adminController");
const { validarCampos } = require("../middlewares/validar-campos");
const router = express.Router();

// /api/admin
router.post(
  "/",
  [
    check("password", "El password debe de ser de 6 caracteres").isLength({
      min: 6,
    }),
  ],
  validarCampos,
  validarAdmin
);

module.exports = router;
