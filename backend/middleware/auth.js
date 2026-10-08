const jwt = require('jsonwebtoken');
const Admin = require('../models/Admin');

const protectAdmin = async (req, res, next) => {
  let token;

  if (
    req.headers.authorization &&
    req.headers.authorization.startsWith('Bearer')
  ) {
    token = req.headers.authorization.split(' ')[1];
  } else if (req.headers['x-auth-token']) {
    token = req.headers['x-auth-token'];
  }

  if (!token) {
    return res.status(401).json({
      success: false,
      message: 'Not authorized, no token provided'
    });
  }

  try {
    const decoded = jwt.verify(
      token,
      process.env.JWT_SECRET || 'fallback_secret_key'
    );
    req.admin = await Admin.findById(decoded.id).select('-password');
    if (!req.admin) {
      return res.status(401).json({
        success: false,
        message: 'Admin account no longer exists'
      });
    }
    next();
  } catch (error) {
    return res.status(401).json({
      success: false,
      message: 'Token verification failed or expired'
    });
  }
};

module.exports = { protectAdmin };
