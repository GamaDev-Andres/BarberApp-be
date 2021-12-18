const mongoose = require("mongoose");

const AdminSchema = mongoose.Schema({
  email: {
    type: String,
    unique: true,
    trim: true,
    required: true,
  },
  password: {
    type: String,
    required: true,
  },
});
module.exports = mongoose.model("Administrador", AdminSchema);
