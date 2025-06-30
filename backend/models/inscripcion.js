const { DataTypes } = require('sequelize');
const sequelize = require('../db');
const Usuario = require('./usuario');
const Curso = require('./curso');

const Inscripcion = sequelize.define('Inscripcion', {
  fechaInscripcion: {
    type: DataTypes.DATE,
    defaultValue: DataTypes.NOW
  },
  estado: {
    type: DataTypes.ENUM('activo', 'completado', 'cancelado'),
    defaultValue: 'activo'
  },
  progreso: {
    type: DataTypes.INTEGER, // porcentaje de avance
    defaultValue: 0
  }
}, {
  tableName: 'inscripciones',
  timestamps: true
});

// Establecer las relaciones
Usuario.hasMany(Inscripcion);
Inscripcion.belongsTo(Usuario);

Curso.hasMany(Inscripcion);
Inscripcion.belongsTo(Curso);

module.exports = Inscripcion;
