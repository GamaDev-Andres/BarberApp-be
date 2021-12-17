const { response } = require("express");

exports.crearUsuario = (req, res = response) => {
  console.log(req.body);
};
