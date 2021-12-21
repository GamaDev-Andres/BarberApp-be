const express = require("express");
const { check } = require("express-validator");
const {
  crearCita,
  actualizarCita,
  eliminarCita,
} = require("../controllers/citasController");
const { validarCampos } = require("../middlewares/validar-campos");
const { validarJWT } = require("../middlewares/validarJWT");
const router = express.Router();
//validamos el jwt en todas las peticiones
router.use(validarJWT);
// /api/cita/
//crear cita
router.post(
  "/new",
  [
    check(["barbero", "fecha"], "Hay campos que no se han especificado")
      .not()
      .isEmpty(),
  ],
  validarCampos,
  crearCita
);
//actualizar cita
router.put("/update/:id", actualizarCita);
//eliminar cita
router.delete("/delete/:id", eliminarCita);
module.exports = router;
