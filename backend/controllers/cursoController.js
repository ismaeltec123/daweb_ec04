const Curso = require('../models/curso');
const Inscripcion = require('../models/inscripcion');
const Usuario = require('../models/usuario');
const { Op } = require('sequelize');

// Obtener todos los cursos (para administradores)
exports.getAllCursos = async (req, res) => {
  try {
    const cursos = await Curso.findAll();
    res.json(cursos);
  } catch (error) {
    res.status(500).json({ message: 'Error al obtener cursos', error: error.message });
  }
};

// Obtener un curso específico
exports.getCursoById = async (req, res) => {
  try {
    const curso = await Curso.findByPk(req.params.id);
    if (!curso) {
      return res.status(404).json({ message: 'Curso no encontrado' });
    }
    res.json(curso);
  } catch (error) {
    res.status(500).json({ message: 'Error al obtener el curso', error: error.message });
  }
};

// Crear un nuevo curso (solo para administradores)
exports.createCurso = async (req, res) => {
  try {
    const { titulo, descripcion, imagen, duracion, nivel } = req.body;
    
    if (!titulo) {
      return res.status(400).json({ message: 'El título es obligatorio' });
    }
    
    const nuevoCurso = await Curso.create({
      titulo,
      descripcion,
      imagen,
      duracion,
      nivel,
      activo: true
    });
    
    res.status(201).json(nuevoCurso);
  } catch (error) {
    res.status(500).json({ message: 'Error al crear el curso', error: error.message });
  }
};

// Actualizar un curso (solo para administradores)
exports.updateCurso = async (req, res) => {
  try {
    const { id } = req.params;
    const { titulo, descripcion, imagen, duracion, nivel, activo } = req.body;
    
    const curso = await Curso.findByPk(id);
    if (!curso) {
      return res.status(404).json({ message: 'Curso no encontrado' });
    }
    
    // Actualizar los campos
    await curso.update({
      titulo: titulo || curso.titulo,
      descripcion: descripcion !== undefined ? descripcion : curso.descripcion,
      imagen: imagen || curso.imagen,
      duracion: duracion || curso.duracion,
      nivel: nivel || curso.nivel,
      activo: activo !== undefined ? activo : curso.activo
    });
    
    res.json(curso);
  } catch (error) {
    res.status(500).json({ message: 'Error al actualizar el curso', error: error.message });
  }
};

// Eliminar un curso (solo para administradores)
exports.deleteCurso = async (req, res) => {
  try {
    const { id } = req.params;
    
    const curso = await Curso.findByPk(id);
    if (!curso) {
      return res.status(404).json({ message: 'Curso no encontrado' });
    }
    
    // Verificar si hay inscripciones
    const inscripciones = await Inscripcion.count({ where: { CursoId: id } });
    
    if (inscripciones > 0) {
      // En lugar de eliminar, marcamos como inactivo
      await curso.update({ activo: false });
      return res.json({ message: 'Curso desactivado porque tiene inscripciones' });
    }
    
    // Si no hay inscripciones, eliminamos
    await curso.destroy();
    res.json({ message: 'Curso eliminado correctamente' });
  } catch (error) {
    res.status(500).json({ message: 'Error al eliminar el curso', error: error.message });
  }
};

// Obtener los cursos en los que está inscrito un alumno
exports.getCursosAlumno = async (req, res) => {
  try {
    const usuarioId = req.usuario.id;
    
    const inscripciones = await Inscripcion.findAll({
      where: { UsuarioId: usuarioId },
      include: [
        {
          model: Curso,
          where: { activo: true }
        }
      ]
    });
    
    const cursos = inscripciones.map(inscripcion => ({
      ...inscripcion.Curso.dataValues,
      progreso: inscripcion.progreso,
      estado: inscripcion.estado,
      fechaInscripcion: inscripcion.fechaInscripcion
    }));
    
    res.json(cursos);
  } catch (error) {
    res.status(500).json({ message: 'Error al obtener los cursos del alumno', error: error.message });
  }
};
