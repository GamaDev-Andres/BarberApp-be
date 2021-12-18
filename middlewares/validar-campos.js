const { validationResult } = require("express-validator");

const validarCampos = (req, res = response, next) => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    return res.status(400).json({
      ok: false,
      errors: errors.mapped(),
    });
  }
  // SI NO HAY NINGUN ERROR LLAMAMOS EL NEXT
  next();
};

module.exports = {
  validarCampos,
};
