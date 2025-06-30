const jwt = require('jsonwebtoken');
require('dotenv').config();

module.exports = (req, res, next) => {
  try {
    // Obtener el token del encabezado de autorización
    const authHeader = req.headers.authorization;
    if (!authHeader || !authHeader.startsWith('Bearer ')) {
      return res.status(401).json({ message: 'No se proporcionó token de autenticación' });
    }

    // Extraer el token (formato: Bearer TOKEN)
    const token = authHeader.split(' ')[1];
    
    if (!token) {
      return res.status(401).json({ message: 'Token no encontrado' });
    }
    
    // Verificar que tenemos la clave secreta
    if (!process.env.JWT_SECRET) {
      console.error('JWT_SECRET no está definido en las variables de entorno');
      return res.status(500).json({ message: 'Error de configuración del servidor' });
    }
    
    try {
      // Verificar el token
      const decoded = jwt.verify(token, process.env.JWT_SECRET);
      
      // Agregar el usuario decodificado al objeto de solicitud
      req.usuario = decoded;
      
      next();
    } catch (jwtError) {
      console.error('Error al verificar JWT:', jwtError);
      return res.status(401).json({ 
        message: 'Token inválido o expirado',
        error: jwtError.message 
      });
    }
  } catch (error) {
    console.error('Error en middleware de autenticación:', error);
    return res.status(500).json({ 
      message: 'Error en el servidor durante la autenticación',
      error: error.message 
    });
  }
};
