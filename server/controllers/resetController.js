const express = require('express');
const _ = require('lodash');
const jwt = require('jsonwebtoken');
const { errorHandler } = require('../helpers/errorHandling');
const { hashPassword } = require('../helpers/hashPassword');
const User = require('../models/User');
const router = express.Router();

router.put('/', async (req, res) => {
  const { resetPasswordLink, newPassword } = req.body;
  if (!resetPasswordLink)
    return res.status(401).json({ msg: 'Expired Link, try again' });

  try {
    const decoded = await jwt.verify(resetPasswordLink, 'Secret');
    if (!decoded)
      return res.status(400).json({ msg: 'Expired Link, try again' });

    const { _id } = decoded;
    console.log(_id);
    let user = await User.findOne({ _id });
    if (!user) return res.status(400).json({ msg: 'Something went wrong' });
    const password = await hashPassword(newPassword);

    user = await _.extend(user, { password });

    await user.save();

    res.status(200).json({ msg: 'Great! Now you can login with new password' });
  } catch (err) {
    console.error(err.message);
    return res.status(400).json({
      msg: err.message,
    });
  }
});

module.exports = router;
