const mongoose = require("mongoose");
const EmpleadoSchema = mongoose.Schema({
  nombre: {
    type: String,
    trim: true,
    required: true,
  },
  email: {
    type: String,
    trim: true,
    required: true,
    unique: true,
  },
  password: {
    type: String,
    required: true,
  },
  perfil: mongoose.Schema({
    experiencia: String,
    descripcion: String,
    foto: String,
  }),
  cortes: [String],
});
module.exports = mongoose.model("Empleado", EmpleadoSchema);
