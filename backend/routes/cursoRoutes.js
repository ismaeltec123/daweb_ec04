const express = require('express');
const router = express.Router();
const cursoController = require('../controllers/cursoController');
const authMiddleware = require('../middleware/authMiddleware');
const checkRol = require('../middleware/checkRolMiddleware');

// Rutas públicas
router.get('/publicos', cursoController.getAllCursos); // Todos pueden ver los cursos disponibles

// Rutas protegidas para alumnos
router.get('/mis-cursos', authMiddleware, cursoController.getCursosAlumno);
router.get('/:id', authMiddleware, cursoController.getCursoById);

// Rutas solo para administradores
router.get('/', authMiddleware, checkRol('admin'), cursoController.getAllCursos);
router.post('/', authMiddleware, checkRol('admin'), cursoController.createCurso);
router.put('/:id', authMiddleware, checkRol('admin'), cursoController.updateCurso);
router.delete('/:id', authMiddleware, checkRol('admin'), cursoController.deleteCurso);

module.exports = router;
