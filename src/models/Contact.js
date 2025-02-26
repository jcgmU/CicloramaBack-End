const mongoose = require("mongoose");

const ContactSchema = new mongoose.Schema({
  nombre: { type: String, required: true },
  correo: { type: String, required: true },
  telefono: { type: String, required: true },
  mensaje: { type: String, required: true },
  fecha: { type: Date, default: Date.now },
});

// Eliminar índices existentes
ContactSchema.index({ correo: 1 }, { unique: false });

module.exports = mongoose.model("Contact", ContactSchema);
