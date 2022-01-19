const express = require("express");
const { check } = require("express-validator");
const {
  updateEmpleado,
  loginEmpleado,
  crearEmpleado,
  obtenerEmpleados,
  deleteCortesEmpleado,
} = require("../controllers/EmpleadoController");
const { validarCampos } = require("../middlewares/validar-campos");
const { validarJWT } = require("../middlewares/validarJWT");
const router = express.Router();
//crear empleado
router.post(
  "/new",
  [
    check("nombre", "el nombre es obligatorio").not().isEmpty(),
    check("email", "email es obligatiorio").not().isEmpty(),
    check("password", "El password debe de ser de 6 caracteres").isLength({
      min: 6,
    }),
    check("cortes", "los cortes no son validos").custom((cortes) => {
      if (!cortes) return true;
      if (!Array.isArray(cortes)) {
        return false;
      }
      if (cortes.some((corte) => typeof corte !== "string")) {
        return false;
      }
      return true;
    }),
  ],
  validarCampos,
  crearEmpleado
);
//login empleado
router.post(
  "/",
  [
    check("email", "email es obligatiorio").not().isEmpty(),
    check("password", "El password debe de ser de 6 caracteres").isLength({
      min: 6,
    }),
  ],
  validarCampos,
  loginEmpleado
);
router.use(validarJWT);
//actualizar empleado
router.put(
  "/:id",
  [check(["password", "email"], "estos campos no se pueden cambiar").isEmpty()],
  validarCampos,
  updateEmpleado
);
//eliminar corte
router.put(
  "/deletecita/:id",
  [
    check(
      ["password", "email", "perfil", "calificacion", "nombre"],
      "estos campos no se pueden cambiar"
    ).isEmpty(),
  ],
  validarCampos,
  deleteCortesEmpleado
);
//obtener 1 empleado
router.get("/", obtenerEmpleados);
//obtener empleados
module.exports = router;
