const sequelize = require('../db');
const Usuario = require('../models/usuario');
const Curso = require('../models/curso');
const Inscripcion = require('../models/inscripcion');
const bcrypt = require('bcryptjs');
require('dotenv').config();

async function setupDatabase() {
  try {
    console.log('🔄 Connecting to PostgreSQL database...');
    await sequelize.authenticate();
    console.log('✅ Database connection successful');

    console.log('🔄 Syncing database models...');
    // This creates the tables if they don't exist
    await sequelize.sync({ alter: true });
    console.log('✅ Database models synchronized');

    // Create admin user if it doesn't exist
    const adminEmail = 'admin@ejemplo.com';
    const adminPassword = 'admin123';
    const adminName = 'Administrator';

    const existingAdmin = await Usuario.findOne({ where: { email: adminEmail } });
    
    if (existingAdmin) {
      console.log('ℹ️ Admin user already exists');
    } else {
      console.log('🔄 Creating admin user...');
      const hashedPassword = await bcrypt.hash(adminPassword, 10);
      await Usuario.create({
        email: adminEmail,
        password: hashedPassword,
        nombre: adminName,
        rol: 'admin'
      });
      console.log('✅ Admin user created successfully');
    }

    // Create some sample data if needed for testing
    const courseCount = await Curso.count();
    if (courseCount === 0) {
      console.log('🔄 Creating sample courses...');
      await Curso.bulkCreate([
        { 
          nombre: 'Desarrollo Web', 
          descripcion: 'Curso introductorio de desarrollo web con HTML, CSS y JavaScript', 
          imagen: 'https://placehold.co/600x400?text=Desarrollo+Web'
        },
        { 
          nombre: 'Programación en Python', 
          descripcion: 'Fundamentos de programación usando Python', 
          imagen: 'https://placehold.co/600x400?text=Python'
        },
        { 
          nombre: 'Base de Datos PostgreSQL', 
          descripcion: 'Introducción a bases de datos relacionales con PostgreSQL', 
          imagen: 'https://placehold.co/600x400?text=PostgreSQL'
        }
      ]);
      console.log('✅ Sample courses created');
    } else {
      console.log('ℹ️ Courses already exist in the database');
    }

    console.log('✅ Database setup completed successfully');
  } catch (error) {
    console.error('❌ Error setting up database:', error);
  } finally {
    await sequelize.close();
  }
}

setupDatabase();
