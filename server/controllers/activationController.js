const express = require('express');
const jwt = require('jsonwebtoken');
const { errorHandler } = require('../helpers/errorHandling');
const User = require('../models/User');
const router = express.Router();

router.post('/', async (req, res) => {
  const { token } = req.body;
  if (!token)
    return res.status(401).json({ msg: 'No token, authorization denied' });

  try {
    const decoded = await jwt.verify(token, 'secret');
    const { name, email, password } = decoded;

    const user = new User({
      name,
      email,
      password,
    });
    await user.save();

    return res.json({ success: true, msg: 'Signup success', user });
  } catch (err) {
    console.error(err.message);
    return res.status(400).json({
      msg: errorHandler(err),
    });
  }
});

module.exports = router;
