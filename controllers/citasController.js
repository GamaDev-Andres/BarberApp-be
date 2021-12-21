const { response } = require("express");
const Cita = require("../models/Cita");

exports.crearCita = async (req, res = response) => {
  const cita = new Cita(req.body);
  try {
    cita.cliente = req.id;
    const citaGuardada = await cita.save();
    console.log(citaGuardada);
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
    if (cita.cliente.toString() !== req.id) {
      return res.status(401).json({
        ok: false,
        msg: "No tiene permiso de actualizar esta cita",
      });
    }
    //recordemos que el body puede que no nos traiga el id del cliente
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
    if (cita.cliente.toString() !== req.id) {
      return res.status(401).json({
        ok: false,
        msg: "No tiene permiso de eliminar esta cita",
      });
    }
    await Cita.findByIdAndDelete(idCita);
  } catch (error) {
    console.log(error);
    console.log(error);
    res.status(500).json({
      ok: false,
      msg: "error en el servidor",
    });
  }
};
