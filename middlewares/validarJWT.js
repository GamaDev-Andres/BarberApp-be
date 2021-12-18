const { response } = require("express");
const jwt = require("jsonwebtoken");

const validarJWT = (req, res = response, next) => {
  const token = req.header("x-token");
  if (!token) {
    return res.status(401).json({
      ok: false,
      msg: "No hay token en la peticion",
    });
  }
  try {
    const payload = jwt.verify(token, process.env.FRASE_SECRETA);

    req.id = payload.id;
    req.nombre = payload.nombre;
  } catch (error) {
    console.log(error);
    res.status(401).json({
      ok: false,
      msg: "token no valido",
    });
  }

  next();
};

module.exports = { validarJWT };
