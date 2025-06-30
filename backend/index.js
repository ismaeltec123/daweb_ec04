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

// Ruta principal para verificar que el servidor está funcionando
app.get('/', (req, res) => {
  res.json({ 
    message: 'API de gestión de cursos funcionando correctamente',
    time: new Date().toISOString(),
    environment: process.env.NODE_ENV || 'development'
  });
});

// Rutas de la API
app.use('/api/auth', authRoutes);
app.use('/api/user', userRoutes);
app.use('/api/cursos', cursoRoutes);
app.use('/api/inscripciones', inscripcionRoutes);

// Usar el puerto proporcionado por el entorno (Render) o 3001 como fallback
const PORT = process.env.PORT || 3001;

// Sincronizar la base de datos y arrancar el servidor
sequelize.sync({ alter: true })
  .then(() => {
    console.log('DB sincronizada correctamente');
    startServer();
  })
  .catch(err => {
    console.error('Error al conectar a la base de datos:', err);
    console.log('Iniciando servidor sin sincronizar la base de datos...');
    startServer();
  });

function startServer() {
  app.listen(PORT, () => {
    console.log(`Servidor en http://localhost:${PORT}`);
  });
}
