const { Sequelize } = require('sequelize');
require('dotenv').config();

let sequelize;

// Verificar si tenemos una URL de base de datos
if (process.env.DATABASE_URL) {
  console.log('Usando DATABASE_URL para la conexión');
  
  // Usar URL de conexión directamente
  sequelize = new Sequelize(process.env.DATABASE_URL, {
    dialect: 'postgres',
    protocol: 'postgres',
    dialectOptions: {
      ssl: {
        require: true,
        rejectUnauthorized: false
      },
      connectTimeout: 60000 // 60 segundos
    },
    logging: console.log,
    pool: {
      max: 5,
      min: 0,
      acquire: 60000, // Aumentado a 60 segundos
      idle: 10000
    },
    retry: {
      max: 3
    }
  });
} else {
  // Verificar que todas las variables de entorno necesarias están definidas
  if (!process.env.DB_NAME || !process.env.DB_HOST) {
    console.error('Las variables de entorno para la base de datos no están configuradas correctamente');
  }

  // Opciones de configuración
  const config = {
    host: process.env.DB_HOST,
    dialect: process.env.DB_DIALECT || 'postgres',
    port: process.env.DB_PORT || 5432,
    logging: console.log,
    pool: {
      max: 5,
      min: 0,
      acquire: 60000, // Aumentado a 60 segundos
      idle: 10000
    },
    retry: {
      max: 3
    }
  };

  // Agregar configuración SSL si está habilitada
  if (process.env.SSL === 'true') {
    config.dialectOptions = {
      ssl: {
        require: true,
        rejectUnauthorized: false
      },
      connectTimeout: 60000 // 60 segundos
    };
    console.log('SSL habilitado para la conexión a la base de datos');
  }

  // Conexión a la base de datos
  sequelize = new Sequelize(
    process.env.DB_NAME,
    process.env.DB_USER,
    process.env.DB_PASSWORD,
    config
  );
}

// Test the connection
sequelize.authenticate()
  .then(() => {
    console.log('Conexión a la base de datos establecida con éxito.');
  })
  .catch(err => {
    console.error('No se pudo conectar a la base de datos:', err);
  });

module.exports = sequelize;
