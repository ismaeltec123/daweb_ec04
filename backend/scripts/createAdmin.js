const bcrypt = require('bcryptjs');
const Usuario = require('../models/usuario');
const sequelize = require('../db');
require('dotenv').config();

// Admin credentials
const adminEmail = 'admin@ejemplo.com';
const adminPassword = 'admin123'; // You can change this password
const adminName = 'Administrator';

async function createAdminUser() {
  try {
    // Connect to the database
    await sequelize.authenticate();
    console.log('Conexión a la base de datos establecida.');

    // Check if admin already exists
    const existingAdmin = await Usuario.findOne({ where: { email: adminEmail } });
    
    if (existingAdmin) {
      // Update existing admin
      const hashedPassword = await bcrypt.hash(adminPassword, 10);
      await existingAdmin.update({ 
        password: hashedPassword,
        nombre: adminName,
        rol: 'admin'
      });
      console.log('Usuario admin actualizado.');
    } else {
      // Create new admin
      const hashedPassword = await bcrypt.hash(adminPassword, 10);
      await Usuario.create({
        email: adminEmail,
        password: hashedPassword,
        nombre: adminName,
        rol: 'admin'
      });
      console.log('Usuario admin creado.');
    }

    console.log('Credenciales de admin:');
    console.log(`Email: ${adminEmail}`);
    console.log(`Password: ${adminPassword}`);

  } catch (error) {
    console.error('Error:', error);
  } finally {
    // Close the connection
    await sequelize.close();
    process.exit(0);
  }
}

createAdminUser();
