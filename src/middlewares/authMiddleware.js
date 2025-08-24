const jwt = require('jsonwebtoken');
require('dotenv').config();

module.exports = (req, res, next) => {
  const token = req.header('Authorization')?.replace('Bearer ', '');
  console.log('Authorization Header:', req.header('Authorization')); // Log header
  console.log('Token:', token); // Log token
  if (!token) {
    return res.status(401).json({ message: 'No token, authorization denied' });
  }
  try {
    console.log('JWT_SECRET:', process.env.JWT_SECRET); // Log JWT_SECRET
    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    console.log('Decoded Token:', decoded); // Log decoded token
    if (!decoded.id) {
      return res.status(401).json({ message: 'Invalid token payload: missing id' });
    }
    req.user = { userId: decoded.id };
    console.log('req.user:', req.user); // Log req.user
    next();
  } catch (err) {
    console.error('Token verification error:', err.message); // Log lỗi
    res.status(401).json({ message: 'Invalid token' });
  }
};