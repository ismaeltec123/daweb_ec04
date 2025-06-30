const express = require('express');
const cors = require('cors');
const sequelize = require('./db');
const authRoutes = require('./routes/authRoutes');
const userRoutes = require('./routes/userRoutes');
const cursoRoutes = require('./routes/cursoRoutes');
const inscripcionRoutes = require('./routes/inscripcionRoutes');
require('dotenv').config();

const app = express();
app.use(cors());
app.use(express.json());

// Rutas de la API
app.use('/api/auth', authRoutes);
app.use('/api/user', userRoutes);
app.use('/api/cursos', cursoRoutes);
app.use('/api/inscripciones', inscripcionRoutes);

// Sincronizar la base de datos y arrancar el servidor
sequelize.sync({ alter: true }).then(() => {
  console.log('DB sincronizada correctamente');
  app.listen(3001, () => {
    console.log('Servidor en http://localhost:3001');
  });
}).catch(err => {
  console.error('Error al conectar a la base de datos:', err);
});
