const express = require('express');
const cors = require('cors');
const app = express();

// Middlewares
app.use(cors());
app.use(express.json());

// Endpoint de login
app.post('/login', (req, res) => {
  const { correo, contrasena } = req.body;

  // Lógica de validación (ejemplo simple)
  if (correo === 'admin@example.com' && contrasena === '1234') {
    return res.json({
      token: 'token-de-ejemplo',
      role: 'admin',
    });
  } else {
    return res.status(401).json({
      error: 'Credenciales inválidas',
    });
  }
});

// Iniciar el servidor
const PORT = 8080;
app.listen(PORT, () => {
  console.log(`Servidor escuchando en http://localhost:${PORT}`);
});