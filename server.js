require("dotenv").config();
const express = require("express");
const cors = require("cors");
const helmet = require("helmet");
const connectDB = require("./src/config/db");

const app = express();

// Configuración de seguridad
app.use(helmet());
app.use(
  cors({
    origin: ["http://localhost:5173", "http://127.0.0.1:5173"], // Permite ambos orígenes
    methods: ["GET", "POST", "PUT", "DELETE", "OPTIONS"],
    allowedHeaders: ["Content-Type", "Authorization"],
    credentials: true,
    exposedHeaders: ["Content-Type", "Authorization"],
    preflightContinue: false,
    optionsSuccessStatus: 204,
  })
);
app.use(express.json());

// Conectar a la base de datos
connectDB();

// Importar rutas
const contactRoutes = require("./src/routes/contactRoutes");
app.use("/api/contact", contactRoutes);

// Iniciar servidor
const port = process.env.PORT || 5000;

const server = app
  .listen(port, () => {
    console.log(`Servidor corriendo en puerto ${port}`);
  })
  .on("error", (err) => {
    if (err.code === "EADDRINUSE") {
      console.log(`Puerto ${port} en uso, intentando con puerto ${port + 1}`);
      server.listen(port + 1);
    }
  });
