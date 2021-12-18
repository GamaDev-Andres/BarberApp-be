const bcryptjs = require("bcryptjs");
const { response } = require("express");
const { generarToken } = require("../helpers/jwt");

const Empleado = require("../models/Empleado");

exports.crearEmpleado = async (req, res = response) => {
  const { email, password } = req.body;

  try {
    //verificamos email repetido
    let empleado = await Empleado.findOne({ email });
    if (empleado) {
      return res.status(400).json({
        ok: false,
        msg: "Ya existe un empleado con este correo",
      });
    }
    //creamos user
    let NuevoEmpleado = new Empleado(req.body);
    //encriptamos contraseña
    const salt = await bcryptjs.genSalt(10);
    NuevoEmpleado.password = await bcryptjs.hash(password, salt);
    //guardamos en base de datos
    await NuevoEmpleado.save();
    const { id, nombre, cortes, perfil } = NuevoEmpleado;
    //generamos token
    const token = await generarToken(NuevoEmpleado.id, NuevoEmpleado.nombre);
    //respondemos
    res.status(201).json({
      ok: true,
      id: id,
      token,
      empleado: { nombre, cortes, perfil },
    });
  } catch (error) {
    console.log(error);
    res.status(500).json({
      ok: false,
      msg: "error en la peticion",
    });
  }
};

exports.updateEmpleado = async (req, res = response) => {
  const emplId = req.params.id;

  try {
    const empleado = await Empleado.findById(emplId);
    const id = req.id;
    if (!empleado) {
      return res.status(404).json({
        ok: false,
        msg: "No existe empleado con ese id",
      });
    }
    if (empleado.id !== id) {
      return res.status(401).json({
        ok: false,
        msg: "Este empleado no tiene permitido actualizar esta informacion",
      });
    }
    const newEmpleado = { ...req.body };
    const empleadoActualizado = await Empleado.findByIdAndUpdate(
      id,
      newEmpleado,
      {
        new: true,
      }
    );
    const { nombre, perfil, cortes } = empleadoActualizado;
    res.json({
      ok: true,
      newEmpleado: { nombre, perfil, cortes },
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
exports.loginEmpleado = async (req, res = response) => {
  const { email, password } = req.body;
  try {
    const empleado = await Empleado.findOne({ email });
    console.log(empleado);
    if (!empleado)
      return res.status(400).json({
        ok: false,
        msg: "credenciales incorrectas",
      });
    const { id, nombre, cortes, perfil } = empleado;
    const validPassword = bcryptjs.compareSync(password, empleado.password);
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
      id,
      empleado: { nombre, cortes, perfil },
    });
  } catch (error) {
    console.log(error);
    res.status(500).json({
      ok: false,
      msg: "error en el servidor",
    });
  }
};
