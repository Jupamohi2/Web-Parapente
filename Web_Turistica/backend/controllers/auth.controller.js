const db = require('../config/db'); // Importar el pool prometido
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');
const dotenv = require('dotenv');

dotenv.config();
const saltRounds = 10;

// Registro de usuario


const registerUser = (req, res) => {
  console.log("Datos recibidos en el backend:", req.body); // Depuración
  const { nombre, apellido, correo, pais, prefijo, numero, contrasena } = req.body;

  if (!nombre || !apellido || !correo || !pais || !prefijo || !numero || !contrasena) {
    return res.status(400).json({ msg: "Faltan datos requeridos." });
  }

  bcrypt.hash(contrasena, saltRounds, async (err, hash) => {
    if (err) {
      console.error("Error al encriptar la contraseña:", err);
      return res.status(500).json({ msg: "Error al procesar la contraseña." });
    }

    try {
      const sql = `
        INSERT INTO usuarios (nombre, apellido, correo, pais, prefijo, numero, contrasena, rol)
        VALUES (?, ?, ?, ?, ?, ?, ?, ?)`;

      const [result] = await db.query(sql, [nombre, apellido, correo, pais, prefijo, numero, hash, 'publico']);
      console.log("Usuario registrado correctamente:", result);
      return res.status(200).json({ msg: "Registro exitoso" });
    } catch (error) {
      console.error("Error al insertar en la base de datos:", error);
      if (error.code === 'ER_DUP_ENTRY') {
        return res.status(400).json({ msg: "El correo ya está registrado." });
      }
      return res.status(500).json({ msg: "Error al registrar usuario." });
    }
  });
};

// Login de usuario
const loginUser = (req, res) => {
  console.log("Datos recibidos en el backend:", req.body);
  const { correo, contrasena } = req.body;

  const missingFields = [];
  if (!correo) missingFields.push("correo");
  if (!contrasena) missingFields.push("contraseña");

  if (missingFields.length > 0) {
    console.log("Faltan campos:", missingFields);
    return res.status(400).json({
      msg: `Faltan los siguientes datos: ${missingFields.join(", ")}.`,
    });
  }

  db.query("SELECT * FROM usuarios WHERE correo = ?", [correo], (err, results) => {
    if (err || results.length === 0) {
      console.error("Usuario no encontrado o error en la consulta:", err);
      return res.status(401).json({ msg: "Usuario no encontrado." });
    }

    const user = results[0];

    bcrypt.compare(contrasena, user.contrasena, (err, isMatch) => {
      if (err || !isMatch) {
        console.error("Contraseña incorrecta o error en bcrypt:", err);
        return res.status(401).json({ msg: "Contraseña incorrecta." });
      }

      const token = jwt.sign(
        { id: user.id, correo: user.correo, rol: user.rol },
        process.env.JWT_SECRET,
        { expiresIn: "1h" }
      );

      console.log("Inicio de sesión exitoso para el usuario:", correo);
      res.status(200).json({ msg: "Inicio de sesión exitoso", token, rol: user.rol });
    });
  });
};

module.exports = { registerUser, loginUser };
