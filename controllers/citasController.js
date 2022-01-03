const { response } = require("express");
const Cita = require("../models/Cita");
const Usuario = require("../models/User");
const Empleado = require("../models/Empleado");

exports.crearCita = async (req, res = response) => {
  const cita = new Cita(req.body);
  try {
    cita.cliente = req.id;
    const empleado = await Empleado.findById(req.id);
    if (empleado) {
      return res.status(401).json({
        ok: false,
        msg: "los empleado no pueden crear citas",
      });
    }
    const citaGuardada = await cita.save();
    res.json({
      ok: true,
      msg: "Cita enviada, espere a que el barbero la confirme",
    });
  } catch (error) {
    console.log(error);
    res.status(500).json({
      ok: false,
      msg: "error en el servidor",
    });
  }
};
exports.actualizarCita = async (req, res = response) => {
  const idCita = req.params.id;
  try {
    const cita = await Cita.findById(idCita);
    if (!cita) {
      return res.status(404).json({
        ok: false,
        msg: "La cita que intenta editar no existe",
      });
    }
    const cliente = await Usuario.findById(req.id);
    const empleado = await Empleado.findById(req.id);
    if (!cliente && !empleado) {
      return res.status(400).json({
        ok: false,
        msg: "No existe un cliente o empleado con el id identificado en le token",
      });
    }
    //en caso de que sea un cliente
    if (cliente) {
      if (cita.cliente.toString() !== req.id) {
        return res.status(401).json({
          ok: false,
          msg: "No tiene permiso de actualizar esta cita",
        });
      }
      if (req.body.estado !== undefined) {
        return res.status(401).json({
          ok: false,
          msg: "Los clientes no tienen permitido cambiar el estado de la cita",
        });
      }
      const nuevaCita = {
        ...req.body,
        cliente: req.id,
      };
      const citaActualizada = await Cita.findByIdAndUpdate(idCita, nuevaCita, {
        new: true,
      });
      res.json({
        ok: true,
        citaActualizada,
        msg: "Cita actualizada correctamente",
      });
    } else {
      //si es un empleado

      if (cita.barbero.toString() !== req.id) {
        return res.status(401).json({
          ok: false,
          msg: "No tiene permiso de actualizar esta cita",
        });
      }
      const citaActualizada = await Cita.findByIdAndUpdate(
        idCita,
        { estado: req.body.estado },
        {
          new: true,
        }
      );
      res.json({
        ok: true,
        citaActualizada,
        msg: "Cita actualizada correctamente",
      });
    }
  } catch (error) {
    console.log(error);
    res.status(500).json({
      ok: false,
      msg: "error en el servidor",
    });
  }
};
exports.eliminarCita = async (req, res = response) => {
  const idCita = req.params.id;
  try {
    const cita = await Cita.findById(idCita);
    if (!cita) {
      return res.status(404).json({
        ok: false,
        msg: "La cita que intenta eliminar no existe",
      });
    }
    let idDelSolicitante =
      cita.cliente.toString() === req.id
        ? cita.cliente.toString()
        : cita.barbero.toString();

    if (idDelSolicitante !== req.id) {
      return res.status(401).json({
        ok: false,
        msg: "No tiene permiso de eliminar esta cita",
      });
    }
    await Cita.findByIdAndDelete(idCita);
    res.json({
      ok: true,
      msg: "cita eliminada",
    });
  } catch (error) {
    console.log(error);
    res.status(500).json({
      ok: false,
      msg: "error en el servidor",
    });
  }
};
exports.obtenerCitas = async (req, res = response) => {
  idSolicitante = req.id;

  try {
    const user = await Usuario.findById(idSolicitante);
    const empleado = await Empleado.findById(idSolicitante);
    if (!user && !empleado) {
      return res.status(401).json({
        ok: false,
        msg: "Id del token no encontro usuario referente",
      });
    }

    const citas = empleado
      ? await Cita.find({ barbero: idSolicitante }).populate("cliente", {
          nombre: 1,
        })
      : await Cita.find({ cliente: idSolicitante }).populate("barbero", {
          nombre: 1,
        });
    res.json({
      ok: true,
      citas,
    });
  } catch (error) {
    console.log(error);
    res.status(500).json({
      ok: false,
      msg: "error en el servidor",
    });
  }
};
