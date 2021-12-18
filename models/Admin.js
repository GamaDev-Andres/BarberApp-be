const mongoose = require("mongoose");

const AdminSchema = mongoose.Schema({
  password: {
    type: String,
    required: true,
  },
});
module.exports = mongoose.model("Administrador", AdminSchema);
