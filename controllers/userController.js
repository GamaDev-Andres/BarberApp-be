const bcryptjs = require("bcryptjs");
const { response } = require("express");
const Usuario = require("../models/User");
const { generarToken } = require("../helpers/jwt");

exports.crearUsuario = async (req, res = response) => {
  const { email, password } = req.body;
  console.log(req.body);
  try {
    //verificamos email repetido
    let user = await Usuario.findOne({ email });
    if (user) {
      return res.status(400).json({
        ok: false,
        msg: "Ya existe un usuario con este correo",
      });
    }
    //creamos user
    user = new Usuario(req.body);
    //encriptamos contraseña
    const salt = await bcryptjs.genSalt(10);
    user.password = await bcryptjs.hash(password, salt);
    //guardamos en base de datos
    await user.save();
    //generamos token
    const token = await generarToken(user.id, user.nombre);
    //respondemos
    res.status(201).json({
      ok: true,
      token,
      user: {
        type: "user",
        id: user.id,
        nombre: user.nombre,
      },
    });
  } catch (error) {
    console.log(error);
    res.status(500).json({
      ok: false,
      msg: "error en la peticion",
    });
  }
};

exports.updateUserName = async (req, res = response) => {
  const userId = req.params.id;

  try {
    const user = await Usuario.findById(userId);
    const id = req.id;
    if (!user) {
      return res.status(404).json({
        ok: false,
        msg: "No existe user con ese id",
      });
    }
    if (user.id !== id) {
      return res.status(401).json({
        ok: false,
        msg: "Este usuario no tiene permitido actualizar esta informacion",
      });
    }
    const newUser = { ...req.body };
    await Usuario.findByIdAndUpdate(id, newUser, {
      new: true,
    });

    res.json({
      ok: true,
      newNombre: req.body.nombre,
      id,
    });
  } catch (error) {
    console.log(error);
    res.status(500).json({
      ok: false,
      msg: "error servidor",
    });
  }
};
exports.loginUser = async (req, res = response) => {
  const { email, password } = req.body;
  try {
    const user = await Usuario.findOne({ email });
    console.log(user);
    if (!user)
      return res.status(400).json({
        ok: false,
        msg: "credenciales incorrectas",
      });
    const { id, nombre } = user;
    const validPassword = bcryptjs.compareSync(password, user.password);
    if (!validPassword) {
      return res.status(400).json({
        ok: false,
        msg: "Password incorrecto",
      });
    }

    const token = await generarToken(id, nombre);
    res.json({
      ok: true,
      token,
      user: {
        id,
        nombre,
        type: "user",
      },
    });
  } catch (error) {
    console.log(error);
    res.status(500).json({
      ok: false,
      msg: "error en el servidor",
    });
  }
};
