const { response } = require("express");
const { generarToken } = require("../helpers/jwt");
const Empleado = require("../models/Empleado");
const User = require("../models/User");

const renovationToken = async (req, res = response) => {
  try {
    const empleado = await Empleado.findById(req.id);
    const user = await User.findById(req.id);
    if (!empleado && !user) {
      return res.status(400).json({
        ok: false,
        msg: "El id de ese user no existe",
      });
    }
    if (empleado && user) {
      return res.status(400).json({
        ok: false,
        msg: "hay un user y empleado con el mismo id",
      });
    }
    if (user) {
      const token = await generarToken(req.id, user.nombre);
      res.json({
        ok: true,
        token,
        user: {
          type: "user",
          id: user.id,
          nombre: user.nombre,
        },
      });
    } else {
      const { id, nombre, cortes, calificacion, perfil } = empleado;
      const token = await generarToken(id, nombre);
      res.json({
        ok: true,
        token,
        user: {
          id,
          nombre,
          cortes: cortes || [],
          calificacion: calificacion || [],
          perfil: perfil || null,
          type: "empleado",
        },
      });
    }
  } catch (error) {
    console.log(error);
    res.status(500).json({
      ok: false,
      msg: "error server renovando token",
    });
  }
};
module.exports = { renovationToken };
