const sequelize = require('../db');
const Usuario = require('../models/usuario');
const Curso = require('../models/curso');
const Inscripcion = require('../models/inscripcion');
require('dotenv').config();

async function testNeonConnection() {
  try {
    console.log('Intentando conectar a Neon PostgreSQL con la siguiente configuración:');
    console.log(`Host: ${process.env.DB_HOST}`);
    console.log(`Puerto: ${process.env.DB_PORT}`);
    console.log(`Nombre de BD: ${process.env.DB_NAME}`);
    console.log(`Usuario: ${process.env.DB_USER}`);
    console.log(`Dialecto: ${process.env.DB_DIALECT}`);
    console.log(`SSL Habilitado: ${process.env.SSL}`);
    
    // Intentar la conexión
    console.log('\nEstableciendo conexión...');
    await sequelize.authenticate();
    console.log('✅ Conexión a Neon PostgreSQL exitosa!');
    
    // Obtener la lista de tablas
    console.log('\nConsultando tablas existentes...');
    try {
      const [results] = await sequelize.query("SELECT table_name FROM information_schema.tables WHERE table_schema = 'public'");
      
      console.log('\nTablas en la base de datos:');
      if (!results || results.length === 0) {
        console.log('No se encontraron tablas. La base de datos parece estar vacía.');
      } else {
        results.forEach(table => {
          console.log(`- ${table.table_name}`);
        });
      }
    } catch (tableError) {
      console.log('Error al consultar tablas:', tableError.message);
      console.log('Continuando con la sincronización de modelos...');
    }
    
    // Sincronizar modelos para crear tablas
    console.log('\nSincronizando modelos con la base de datos...');
    await sequelize.sync({ alter: true });
    console.log('✅ Modelos sincronizados correctamente!');
    
    // Verificar tablas después de la sincronización
    try {
      const [tablesAfterSync] = await sequelize.query("SELECT table_name FROM information_schema.tables WHERE table_schema = 'public'");
      console.log('\nTablas después de la sincronización:');
      tablesAfterSync.forEach(table => {
        console.log(`- ${table.table_name}`);
      });
    } catch (tableError) {
      console.log('Error al consultar tablas después de sincronización:', tableError.message);
    }
    
    console.log('\nPrueba completada con éxito.');
  } catch (error) {
    console.error('❌ Error al conectar a Neon PostgreSQL:', error);
  } finally {
    await sequelize.close();
    process.exit(0);
  }
}

testNeonConnection();
