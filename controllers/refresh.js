const { response } = require("express");
const { generarToken } = require("../helpers/jwt");
const Empleado = require("../models/Empleado");
const User = require("../models/User");

const renovationToken = async (req, res = response) => {
  const { id, nombre } = req;

  try {
    const empleado = await Empleado.findById(id);
    const user = await User.findById(id);
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
    const token = await generarToken(id, nombre);
    if (user) {
      res.json({
        ok: true,
        token,
        user: {
          type: "user",
          id,
          nombre,
        },
      });
    } else {
      const { id, nombre, cortes, perfil } = empleado;
      res.json({
        ok: true,
        token,
        user: {
          id,
          nombre,
          cortes: cortes || [],
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
