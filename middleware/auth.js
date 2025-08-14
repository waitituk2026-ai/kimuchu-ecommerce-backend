// backend/middleware/auth.js
// Simple HTTP Basic auth middleware for admin endpoints.
// Reads ADMIN_USER and ADMIN_PASS from .env

module.exports = function adminAuth(req, res, next) {
  const auth = req.headers.authorization;
  const ADMIN_USER = process.env.ADMIN_USER || 'admin';
  const ADMIN_PASS = process.env.ADMIN_PASS || 'changeme';

  if (!auth) {
    res.setHeader('WWW-Authenticate', 'Basic realm="Admin Area"');
    return res.status(401).json({ message: 'Authentication required' });
  }

  const [scheme, encoded] = auth.split(' ');
  if (!encoded || scheme !== 'Basic') {
    res.setHeader('WWW-Authenticate', 'Basic realm="Admin Area"');
    return res.status(401).json({ message: 'Invalid auth scheme' });
  }

  const decoded = Buffer.from(encoded, 'base64').toString('utf8');
  const idx = decoded.indexOf(':');
  if (idx === -1) {
    res.setHeader('WWW-Authenticate', 'Basic realm="Admin Area"');
    return res.status(401).json({ message: 'Invalid auth value' });
  }

  const user = decoded.slice(0, idx);
  const pass = decoded.slice(idx + 1);

  if (user === ADMIN_USER && pass === ADMIN_PASS) {
    return next();
  }

  res.setHeader('WWW-Authenticate', 'Basic realm="Admin Area"');
  return res.status(401).json({ message: 'Invalid credentials' });
};
