const { DataTypes } = require('sequelize');
const sequelize = require('../db');

const Usuario = sequelize.define('Usuario', {
  email: {
    type: DataTypes.STRING,
    allowNull: false,
    unique: true
  },
  password: {
    type: DataTypes.STRING,
    allowNull: false
  },
  rol: {
    type: DataTypes.ENUM('admin', 'alumno'),
    defaultValue: 'alumno',
    allowNull: false
  },
  nombre: {
    type: DataTypes.STRING,
    allowNull: true
  }
}, {
  tableName: 'usuarios',
  timestamps: false
});

module.exports = Usuario;
