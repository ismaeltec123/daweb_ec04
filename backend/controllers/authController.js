const Usuario = require('../models/usuario');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');

exports.register = async (req, res) => {
  try {
    const { email, password, nombre, rol } = req.body;

    if (!email || !password) {
      return res.status(400).json({ message: 'El email y la contraseña son obligatorios' });
    }

    // Verificar que JWT_SECRET está definido
    if (!process.env.JWT_SECRET) {
      console.error('JWT_SECRET no está definido en las variables de entorno');
      return res.status(500).json({ message: 'Error de configuración del servidor' });
    }

    const existe = await Usuario.findOne({ where: { email } });
    if (existe) return res.status(400).json({ message: 'Ya existe un usuario con este email' });

    const hashedPassword = await bcrypt.hash(password, 10);
    
    // Por defecto los usuarios registrados son alumnos, solo el admin puede crear otros admin
    const rolUsuario = rol === 'admin' ? 'admin' : 'alumno';
    
    const nuevo = await Usuario.create({ 
      email, 
      password: hashedPassword,
      nombre: nombre || email.split('@')[0], // Si no hay nombre, usamos parte del email
      rol: rolUsuario
    });    // Crear un token para el usuario recién registrado
    const token = jwt.sign({ 
      id: nuevo.id, 
      email: nuevo.email,
      nombre: nuevo.nombre,
      rol: nuevo.rol 
    }, process.env.JWT_SECRET, {
      expiresIn: '7d'
    });

    res.status(201).json({ 
      message: 'Usuario registrado', 
      token,
      usuario: {
        id: nuevo.id,
        email: nuevo.email,
        nombre: nuevo.nombre,
        rol: nuevo.rol
      }
    });
  } catch (err) {
    console.error('Error en el registro:', err);
    res.status(500).json({ message: 'Error al registrar usuario', error: err.message });
  }
};

exports.login = async (req, res) => {
  try {
    const { email, password } = req.body;

    if (!email || !password) {
      return res.status(400).json({ message: 'El email y la contraseña son obligatorios' });
    }

    // Verificar que JWT_SECRET está definido
    if (!process.env.JWT_SECRET) {
      console.error('JWT_SECRET no está definido en las variables de entorno');
      return res.status(500).json({ message: 'Error de configuración del servidor' });
    }

    const usuario = await Usuario.findOne({ where: { email } });
    if (!usuario) return res.status(404).json({ message: 'Usuario no encontrado' });

    const match = await bcrypt.compare(password, usuario.password);
    if (!match) return res.status(401).json({ message: 'Contraseña incorrecta' });

    // Verificar que el usuario tenga rol (por si acaso)
    if (!usuario.rol) {
      usuario.rol = 'alumno'; // Valor por defecto
      await usuario.save();
    }const token = jwt.sign({ 
      id: usuario.id, 
      email: usuario.email,
      nombre: usuario.nombre,
      rol: usuario.rol 
    }, process.env.JWT_SECRET, {
      expiresIn: '7d' // Aumentamos el tiempo de expiración a 7 días
    });

    res.json({ 
      message: 'Login exitoso', 
      token,
      usuario: {
        id: usuario.id,
        email: usuario.email,
        nombre: usuario.nombre,
        rol: usuario.rol
      }
    });
  } catch (err) {
    console.error('Error en el login:', err);
    res.status(500).json({ message: 'Error al iniciar sesión', error: err.message });
  }
};
