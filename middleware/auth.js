const jwt = require('jsonwebtoken');
const User = require('../models/userModel');

const authenticate = async (req, res, next) => {
  try {
    const token = req.cookies.token; 
    if (!token) {
      return res.status(401).send('Access Denied');
    }

    const verified = jwt.verify(token, "asdfghj"); 
    req.user = await User.findOne({ email: verified.email });
    if (!req.user) {
      return res.status(401).send('User not found');
    }

    next(); 
  } catch (err) {
    res.status(400).send('Invalid Token');
  }
};

module.exports = authenticate;
