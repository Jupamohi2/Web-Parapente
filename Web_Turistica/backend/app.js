// Importar dependencias
const express = require('express');
const cors = require('cors');
const dotenv = require('dotenv');
dotenv.config(); // Cargar variables de entorno desde .env

// Inicializar la app
const app = express();
const PORT = process.env.PORT || 5000; // Usar el puerto de las variables de entorno o 5000 por defecto

// Conexión a la base de datos
const db = require('./config/db'); // Aquí estamos asumiendo que tienes un archivo de configuración de la base de datos

// Rutas
const authRoutes = require('./routes/auth.routes');

// Middlewares globales
app.use(cors()); // Para permitir peticiones de diferentes orígenes
app.use(express.json()); // Para manejar el cuerpo de las solicitudes en formato JSON
app.use(express.urlencoded({ extended: true })); // Para manejar formularios de tipo urlencoded

// Rutas de la API
app.use('/api/auth', authRoutes); // Rutas para autenticación

// Ruta raíz (prueba)
app.get('/', (req, res) => {
  res.send('¡Bienvenido a la API de Deportes de Parapente!');
});

// Iniciar el servidor
app.listen(PORT, () => {
  console.log(`🚀 Servidor corriendo en http://localhost:${PORT}`);
});
