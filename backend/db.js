const { Sequelize } = require('sequelize');
require('dotenv').config();

// Verificar que todas las variables de entorno necesarias están definidas
if (!process.env.DB_NAME || !process.env.DB_HOST) {
  console.error('Las variables de entorno para la base de datos no están configuradas correctamente');
}

const sequelize = new Sequelize(
  process.env.DB_NAME,
  process.env.DB_USER,
  process.env.DB_PASSWORD,
  {
    host: process.env.DB_HOST,
    dialect: 'mysql',
    logging: console.log,
    dialectOptions: {
      // For MySQL 8.0+
      charset: 'utf8mb4',
    },
    pool: {
      max: 5,
      min: 0,
      acquire: 30000,
      idle: 10000
    }
  }
);

// Test the connection
sequelize.authenticate()
  .then(() => {
    console.log('Conexión a la base de datos establecida con éxito.');
  })
  .catch(err => {
    console.error('No se pudo conectar a la base de datos:', err);
  });

module.exports = sequelize;
