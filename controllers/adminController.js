const { response } = require("express");

exports.validarAdmin = (req, res = response) => {
  const { password } = req.body;
  try {
    if (password !== process.env.PAS_AD) {
      return res.status(400).json({
        ok: false,
        msg: "La contraseña es incorrecta",
      });
    }
    res.json({
      ok: true,
      msg: "admin autorizado",
    });
  } catch (error) {
    console.log(error);
    res.status(500).json({
      ok: false,
      msg: "error en el servidor",
    });
  }
};
