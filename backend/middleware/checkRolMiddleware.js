// Middleware para verificar que el usuario tenga el rol adecuado
module.exports = (roles = []) => {
  if (typeof roles === 'string') {
    roles = [roles];
  }

  return (req, res, next) => {
    if (!req.usuario || !req.usuario.rol) {
      return res.status(401).json({ message: 'No autorizado' });
    }

    if (roles.length && !roles.includes(req.usuario.rol)) {
      return res.status(403).json({ message: 'Prohibido: no tienes permisos suficientes' });
    }

    next();
  };
};
