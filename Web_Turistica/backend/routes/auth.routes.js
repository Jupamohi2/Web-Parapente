// routes/auth.routes.js

const express = require('express');
const router = express.Router();

// Controladores de autenticación
const { registerUser, loginUser } = require('../controllers/auth.controller');

// @route   POST /api/auth/register
// @desc    Registrar nuevo usuario
// @access  Público
router.post('/register', registerUser);

// @route   POST /api/auth/login
// @desc    Iniciar sesión de usuario
// @access  Público
router.post('/login', loginUser);

module.exports = router;

