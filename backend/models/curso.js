const { DataTypes } = require('sequelize');
const sequelize = require('../db');
const Usuario = require('./usuario');

const Curso = sequelize.define('Curso', {
  titulo: {
    type: DataTypes.STRING,
    allowNull: false
  },
  descripcion: {
    type: DataTypes.TEXT,
    allowNull: true
  },
  imagen: {
    type: DataTypes.STRING,
    allowNull: true
  },
  duracion: {
    type: DataTypes.INTEGER, // duración en horas
    allowNull: true
  },
  nivel: {
    type: DataTypes.ENUM('principiante', 'intermedio', 'avanzado'),
    defaultValue: 'principiante'
  },
  activo: {
    type: DataTypes.BOOLEAN,
    defaultValue: true
  }
}, {
  tableName: 'cursos',
  timestamps: true
});

module.exports = Curso;
