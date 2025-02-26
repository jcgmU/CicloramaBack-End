const { body } = require("express-validator");

exports.validateContact = [
  body("nombre").notEmpty().withMessage("El nombre es obligatorio"),
  body("correo").isEmail().withMessage("Debe ser un correo válido"),
  body("telefono").isNumeric().withMessage("El teléfono debe ser numérico"),
  body("mensaje").notEmpty().withMessage("El mensaje no puede estar vacío"),
];
