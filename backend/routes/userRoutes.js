const express = require('express');
const router = express.Router();
const authMiddleware = require('../middleware/authMiddleware');

// Ruta protegida que requiere autenticación
router.get('/perfil', authMiddleware, (req, res) => {
  // El middleware ha verificado el token y añadido el usuario al req
  res.json({
    message: 'Acceso autorizado',
    usuario: {
      id: req.usuario.id,
      email: req.usuario.email,
      nombre: req.usuario.nombre,
      rol: req.usuario.rol
    }
  });
});

module.exports = router;
