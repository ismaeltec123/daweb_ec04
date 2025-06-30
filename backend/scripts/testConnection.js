const sequelize = require('../db');
require('dotenv').config();

async function testConnection() {
  try {
    console.log('Intentando conectar a la base de datos con la siguiente configuración:');
    if (process.env.DATABASE_URL) {
      console.log('Usando DATABASE_URL');
      // Ocultar contraseña para mayor seguridad en los logs
      const urlParts = process.env.DATABASE_URL.split('@');
      const maskedUrl = urlParts[0].split(':')[0] + ':****@' + urlParts[1];
      console.log(`URL: ${maskedUrl}`);
    } else {
      console.log(`Host: ${process.env.DB_HOST}`);
      console.log(`Puerto: ${process.env.DB_PORT}`);
      console.log(`Nombre de BD: ${process.env.DB_NAME}`);
      console.log(`Usuario: ${process.env.DB_USER}`);
      console.log(`Dialecto: ${process.env.DB_DIALECT}`);
    }
    
    // Intentar la conexión
    console.log('Estableciendo conexión...');
    await sequelize.authenticate();
    console.log('✅ PostgreSQL connection test successful!');
    
    // Get a list of all tables
    const [results] = await sequelize.query('SELECT table_name FROM information_schema.tables WHERE table_schema = \'public\'');
    console.log('\nDatabase tables:');
    if (results.length === 0) {
      console.log('No tables found. The database appears to be empty.');
    } else {
      results.forEach(table => {
        console.log(`- ${table.table_name}`);
      });
    }
  } catch (error) {
    console.error('❌ PostgreSQL connection test failed:', error);
  } finally {
    await sequelize.close();
  }
}

testConnection();
