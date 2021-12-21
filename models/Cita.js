const mongoose = require("mongoose");

const CitaSchema = mongoose.Schema({
  barbero: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "Empleado",
    required: true,
  },
  cliente: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "Usuario",
  },
  observaciones: String,
  estado: { type: Boolean, default: false },
  fecha: {
    type: Date,
    required: true,
  },
});
module.exports = mongoose.model("Cita", CitaSchema);
