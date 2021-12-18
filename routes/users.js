const express = require("express");
const { check } = require("express-validator");
const {
  crearUsuario,
  updateUserName,
  loginUser,
} = require("../controllers/userController");
const { validarCampos } = require("../middlewares/validar-campos");
const { validarJWT } = require("../middlewares/validarJWT");
const router = express.Router();

// /api/users
router.post(
  "/new",
  [
    check("nombre", "El nombre es obligatorio").not().isEmpty(),
    check("email", "El email es obligatorio").isEmail(),
    check("password", "la contraseña es requerida").not().isEmpty(),
    check("password", "la contraseña debe ser minimo de 6 caracteres").isLength(
      {
        min: 6,
        max: 50,
      }
    ),
  ],
  validarCampos,
  crearUsuario
);
//login user

router.post(
  "/",
  [
    check("email", "El email es obligatorio").isEmail(),
    check("password", "El password debe de ser de 6 caracteres").isLength({
      min: 6,
    }),
    validarCampos,
  ],
  loginUser
);
//update user
router.put(
  "/:id",
  [
    check("nombre", "el campo nombre es requerido").not().isEmpty(),
    check(["password", "email"], "estos campos no se pueden cambiar").isEmpty(),
  ],
  validarCampos,
  validarJWT,
  updateUserName
);
module.exports = router;
