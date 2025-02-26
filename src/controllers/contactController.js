const Contact = require("../models/Contact");
const { validationResult } = require("express-validator");
const sendMail = require("../config/mailer");

exports.createContact = async (req, res) => {
  try {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ errors: errors.array() });
    }

    const { nombre, correo, telefono, mensaje } = req.body;
    const nuevoContacto = new Contact({ nombre, correo, telefono, mensaje });
    await nuevoContacto.save();

    try {
      await sendMail(nombre, correo, telefono, mensaje);
    } catch (emailError) {
      console.error("Error al enviar el correo:", emailError);
    }

    return res.status(201).json({
      success: true,
      msg: "Contacto guardado correctamente",
      contact: nuevoContacto,
    });
  } catch (error) {
    console.error("Error en createContact:", error);
    return res.status(500).json({
      success: false,
      errors: [
        {
          msg: "Error en el servidor al procesar la solicitud",
          error: error.message,
        },
      ],
    });
  }
};
