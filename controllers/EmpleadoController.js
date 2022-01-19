const bcryptjs = require("bcryptjs");
const { response } = require("express");
const { generarToken } = require("../helpers/jwt");

const Empleado = require("../models/Empleado");
const Usuario = require("../models/User");

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
    const { id, nombre, cortes, calificacion, perfil } = NuevoEmpleado;
    //generamos token
    const token = await generarToken(NuevoEmpleado.id, NuevoEmpleado.nombre);
    //respondemos
    res.status(201).json({
      ok: true,
      token,
      id: id,
      user: {
        id,
        nombre,
        cortes,
        calificacion,
        perfil,
        type: "empleado",
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
exports.deleteCortesEmpleado = async (req, res = response) => {
  const emplId = req.params.id;
  const corteToDelete = req.body.cortes;

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
    const newCortes = empleado.cortes.filter(
      (corte) => corte !== corteToDelete
    );
    const empleadoActualizado = await Empleado.findByIdAndUpdate(
      emplId,
      { cortes: newCortes },
      {
        new: true,
      }
    );
    const { nombre, perfil, cortes, calificacion } = empleadoActualizado;
    res.json({
      ok: true,
      user: {
        id,
        nombre,
        perfil,
        cortes,
        calificacion,
        type: "empleado",
      },
    });
  } catch (error) {
    console.log(error);
    res.status(500).json({
      ok: false,
      msg: "error servidor",
    });
  }
};
exports.updateEmpleado = async (req, res = response) => {
  const emplId = req.params.id;
  const calificacion = req.body.calificacion;
  try {
    const empleado = await Empleado.findById(emplId);
    const id = req.id;
    if (calificacion) {
      const usuario = await Usuario.findById(id);
      if (!usuario) {
        return res.status(404).json({
          ok: false,
          msg: "No existe usuario con ese id",
        });
      }
      await actualizandoEmpleado();
      return;
    }
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
    await actualizandoEmpleado();

    async function actualizandoEmpleado() {
      const newEmpleado = { ...req.body };
      const { cortes: newCortes, calificacion: newCalificacion } = newEmpleado;
      delete newEmpleado.cortes;
      delete newEmpleado.calificacion;
      const empleadoActualizado = await Empleado.findByIdAndUpdate(
        emplId,
        {
          $set: { ...newEmpleado },
          $push: {
            cortes: newCortes,
            calificacion: newCalificacion,
          },
        },
        {
          new: true,
        }
      );

      const { nombre, perfil, cortes, calificacion } = empleadoActualizado;
      res.json({
        ok: true,
        user: { id, nombre, perfil, cortes, calificacion, type: "empleado" },
      });
    }
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
    if (!empleado)
      return res.status(400).json({
        ok: false,
        msg: "credenciales incorrectas",
      });
    const { id, nombre, cortes, calificacion, perfil } = empleado;
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
      user: {
        id,
        nombre,
        cortes,
        calificacion,
        perfil,
        type: "empleado",
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
exports.obtenerEmpleados = async (req, res = response) => {
  try {
    const empleado = await Empleado.findById(req.id);
    const cliente = await Usuario.findById(req.id);
    if (empleado) {
      return res.status(401).json({
        ok: false,
        msg: "un empleado no puede solicitar estos datos",
      });
    }
    if (!cliente) {
      return res.status(404).json({
        ok: false,
        msg: "id en el token invalido",
      });
    }
    const empleados = await Empleado.find().select("-email -password -__v");
    res.json({
      ok: true,
      empleados,
    });
  } catch (error) {
    console.log(error);
    res.status(500).json({
      ok: false,
      msg: "error en el servidor",
    });
  }
};
