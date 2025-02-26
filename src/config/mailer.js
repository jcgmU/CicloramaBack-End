const nodemailer = require("nodemailer");

// Crear el transportador con configuración más específica
const transporter = nodemailer.createTransport({
  host: "smtp.gmail.com",
  port: 465,
  secure: true, // true para 465, false para otros puertos
  auth: {
    user: process.env.EMAIL_USER,
    pass: process.env.EMAIL_PASS,
  },
  debug: true, // Habilitar logs para debugging
});

// Verificar la conexión
transporter.verify(function (error, success) {
  if (error) {
    console.error("Error en la configuración del email:", error);
  } else {
    console.log("Servidor de correo listo para enviar mensajes");
  }
});

const sendMail = async (nombre, correo, telefono, mensaje) => {
  const mailOptions = {
    from: `"Ciclorama Contact" <${process.env.EMAIL_USER}>`,
    to: process.env.ADMIN_EMAIL || "admin@ciclorama.com",
    subject: "✨ Nuevo contacto recibido - Ciclorama",
    html: `
      <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto; padding: 20px; border: 1px solid #e0e0e0; border-radius: 5px;">
        <div style="text-align: center; margin-bottom: 20px;">
          <h2 style="color: #3b82f6; margin-bottom: 5px;">Nuevo mensaje de contacto</h2>
          <p style="color: #6b7280; font-size: 14px;">Un potencial cliente se ha puesto en contacto</p>
        </div>
        
        <div style="background-color: #f9fafb; padding: 15px; border-radius: 4px; margin-bottom: 20px;">
          <p style="margin: 8px 0;"><strong>Nombre:</strong> ${nombre}</p>
          <p style="margin: 8px 0;"><strong>Correo:</strong> ${correo}</p>
          <p style="margin: 8px 0;"><strong>Teléfono:</strong> ${telefono}</p>
        </div>
        
        <div style="margin-bottom: 20px;">
          <h3 style="color: #4b5563; margin-bottom: 10px;">Mensaje:</h3>
          <p style="color: #4b5563; background-color: #f9fafb; padding: 15px; border-radius: 4px; line-height: 1.5;">${mensaje}</p>
        </div>
        
        <div style="text-align: center; color: #6b7280; font-size: 12px; margin-top: 30px;">
          <p>Este es un correo automático, por favor no responder a esta dirección.</p>
          <p>&copy; ${new Date().getFullYear()} Ciclorama. Todos los derechos reservados.</p>
        </div>
      </div>
    `,
    // Agregar la configuración de prioridad y confirmación
    priority: "high",
    headers: {
      "X-Priority": "1",
      "X-MSMail-Priority": "High",
    },
  };

  try {
    const info = await transporter.sendMail(mailOptions);
    console.log("Correo enviado exitosamente. ID:", info.messageId);

    // Enviar correo de confirmación al cliente
    const confirmacionCliente = {
      from: `"Ciclorama" <${process.env.EMAIL_USER}>`,
      to: correo,
      subject: "Gracias por contactarnos - Ciclorama",
      html: `
        <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto; padding: 20px; border: 1px solid #e0e0e0; border-radius: 5px;">
          <h2 style="color: #3b82f6; text-align: center;">¡Gracias por contactarnos!</h2>
          <p>Hola ${nombre},</p>
          <p>Hemos recibido tu mensaje y nos pondremos en contacto contigo lo antes posible.</p>
          <p>Mientras tanto, puedes revisar nuestro sitio web para más información.</p>
          <div style="text-align: center; margin-top: 20px;">
            <p style="color: #6b7280; font-size: 12px;">© ${new Date().getFullYear()} Ciclorama</p>
          </div>
        </div>
      `,
    };

    await transporter.sendMail(confirmacionCliente);
    console.log("Correo de confirmación enviado al cliente");

    return true;
  } catch (error) {
    console.error("Error detallado al enviar correo:", error);
    throw error; // Propagar el error para mejor manejo
  }
};

module.exports = sendMail;
