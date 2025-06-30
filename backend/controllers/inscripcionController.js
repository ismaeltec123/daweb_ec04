const Inscripcion = require('../models/inscripcion');
const Curso = require('../models/curso');
const Usuario = require('../models/usuario');

// Inscribir a un alumno en un curso (solo administradores)
exports.inscribirAlumno = async (req, res) => {
  try {
    const { cursoId, alumnoId } = req.body;
    
    // Verificar que el curso exista
    const curso = await Curso.findByPk(cursoId);
    if (!curso) {
      return res.status(404).json({ message: 'Curso no encontrado' });
    }
    
    // Verificar que el alumno exista y sea un alumno
    const alumno = await Usuario.findOne({ 
      where: { 
        id: alumnoId,
        rol: 'alumno'
      } 
    });
    
    if (!alumno) {
      return res.status(404).json({ message: 'Alumno no encontrado o el usuario no es un alumno' });
    }
    
    // Verificar si ya está inscrito
    const inscripcionExistente = await Inscripcion.findOne({
      where: {
        CursoId: cursoId,
        UsuarioId: alumnoId
      }
    });
    
    if (inscripcionExistente) {
      return res.status(400).json({ message: 'El alumno ya está inscrito en este curso' });
    }
    
    // Crear la inscripción
    const nuevaInscripcion = await Inscripcion.create({
      CursoId: cursoId,
      UsuarioId: alumnoId,
      estado: 'activo',
      progreso: 0
    });
    
    res.status(201).json({
      message: 'Alumno inscrito correctamente',
      inscripcion: nuevaInscripcion
    });
  } catch (error) {
    res.status(500).json({ message: 'Error al inscribir al alumno', error: error.message });
  }
};

// Actualizar el progreso de un alumno en un curso
exports.actualizarProgreso = async (req, res) => {
  try {
    const { inscripcionId } = req.params;
    const { progreso, estado } = req.body;
    
    const inscripcion = await Inscripcion.findByPk(inscripcionId);
    
    if (!inscripcion) {
      return res.status(404).json({ message: 'Inscripción no encontrada' });
    }
    
    // Verificar que el usuario sea el dueño de la inscripción o un admin
    if (req.usuario.rol !== 'admin' && inscripcion.UsuarioId !== req.usuario.id) {
      return res.status(403).json({ message: 'No tienes permiso para actualizar esta inscripción' });
    }
    
    // Actualizar la inscripción
    await inscripcion.update({
      progreso: progreso !== undefined ? progreso : inscripcion.progreso,
      estado: estado || inscripcion.estado
    });
    
    res.json({
      message: 'Progreso actualizado correctamente',
      inscripcion
    });
  } catch (error) {
    res.status(500).json({ message: 'Error al actualizar el progreso', error: error.message });
  }
};

// Cancelar inscripción (administrador o el propio alumno)
exports.cancelarInscripcion = async (req, res) => {
  try {
    const { inscripcionId } = req.params;
    
    const inscripcion = await Inscripcion.findByPk(inscripcionId);
    
    if (!inscripcion) {
      return res.status(404).json({ message: 'Inscripción no encontrada' });
    }
    
    // Verificar que el usuario sea el dueño de la inscripción o un admin
    if (req.usuario.rol !== 'admin' && inscripcion.UsuarioId !== req.usuario.id) {
      return res.status(403).json({ message: 'No tienes permiso para cancelar esta inscripción' });
    }
    
    // Actualizar el estado a cancelado
    await inscripcion.update({ estado: 'cancelado' });
    
    res.json({
      message: 'Inscripción cancelada correctamente',
      inscripcion
    });
  } catch (error) {
    res.status(500).json({ message: 'Error al cancelar la inscripción', error: error.message });
  }
};

// Obtener todas las inscripciones (admin)
exports.getAllInscripciones = async (req, res) => {
  try {
    const inscripciones = await Inscripcion.findAll({
      include: [
        { model: Usuario, attributes: ['id', 'email', 'nombre'] },
        { model: Curso, attributes: ['id', 'titulo', 'nivel'] }
      ]
    });
    
    res.json(inscripciones);
  } catch (error) {
    res.status(500).json({ message: 'Error al obtener las inscripciones', error: error.message });
  }
};

// Obtener inscripciones de un alumno específico
exports.getInscripcionesByAlumno = async (req, res) => {
  try {
    const { alumnoId } = req.params;
    
    // Verificar que el usuario sea el alumno o un admin
    if (req.usuario.rol !== 'admin' && req.usuario.id !== parseInt(alumnoId)) {
      return res.status(403).json({ message: 'No tienes permiso para ver estas inscripciones' });
    }
    
    const inscripciones = await Inscripcion.findAll({
      where: { UsuarioId: alumnoId },
      include: [{ model: Curso }]
    });
    
    res.json(inscripciones);
  } catch (error) {
    res.status(500).json({ message: 'Error al obtener las inscripciones', error: error.message });
  }
};
