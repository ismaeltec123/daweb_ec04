const express = require('express');
const router = express.Router();
const inscripcionController = require('../controllers/inscripcionController');
const authMiddleware = require('../middleware/authMiddleware');
const checkRol = require('../middleware/checkRolMiddleware');

// Rutas para alumnos
router.get('/mis-inscripciones', authMiddleware, (req, res) => {
  inscripcionController.getInscripcionesByAlumno(req, res, req.usuario.id);
});

router.put('/:inscripcionId/progreso', authMiddleware, inscripcionController.actualizarProgreso);
router.put('/:inscripcionId/cancelar', authMiddleware, inscripcionController.cancelarInscripcion);

// Rutas solo para administradores
router.post('/', authMiddleware, checkRol('admin'), inscripcionController.inscribirAlumno);
router.get('/', authMiddleware, checkRol('admin'), inscripcionController.getAllInscripciones);
router.get('/alumno/:alumnoId', authMiddleware, checkRol('admin'), inscripcionController.getInscripcionesByAlumno);

module.exports = router;
