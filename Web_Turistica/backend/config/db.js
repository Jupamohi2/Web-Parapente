const mysql = require('mysql2');
const dotenv = require('dotenv');
dotenv.config();

// Crear un pool de conexiones en lugar de una sola conexión
const pool = mysql.createPool({
  host: process.env.DB_HOST,       // El host de la base de datos
  user: process.env.DB_USER,       // El usuario de la base de datos
  password: process.env.DB_PASSWORD, // La contraseña de la base de datos
  database: process.env.DB_NAME,   // El nombre de la base de datos
  waitForConnections: true,        // Esperar conexiones si hay muchas
  connectionLimit: 10,             // Limitar el número de conexiones simultáneas
  queueLimit: 0                    // Sin límite para las conexiones en espera
});

// Promisificar el pool para usar async/await
const promisePool = pool.promise();

// Test de conexión inicial
pool.getConnection((err, connection) => {
  if (err) {
    console.error("Error de conexión a MySQL:", err);
    process.exit(1); // Si la conexión falla, termina la aplicación
  }
  console.log("Conectado a la base de datos MySQL.");
  connection.release(); // Libera la conexión al pool
});

// Exportar el pool prometido para usarlo en otras partes
module.exports = promisePool;