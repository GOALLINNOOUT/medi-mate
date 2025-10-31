// Lightweight RBAC helper used by server code examples
function authorizeRoles(...roles) {
  return (req, res, next) => {
    const user = req.user;
    if (!user || !roles.includes(user.role)) {
      return res.status(403).json({ message: 'Access Denied' });
    }
    next();
  };
}

module.exports = { authorizeRoles };
