const { response } = require("express");
const { generarToken } = require("../helpers/jwt");

const renovationToken = async (req, res = response) => {
  const { id, nombre } = req;
  try {
    const token = await generarToken(id, nombre);
    res.json({
      ok: true,
      token,
      id,
      nombre,
    });
  } catch (error) {
    console.log(error);
    res.status(500).json({
      ok: false,
      msg: "error server renovando token",
    });
  }
};
module.exports = { renovationToken };
