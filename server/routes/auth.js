const express = require('express');
const jwt = require('jsonwebtoken');
const bcrypt = require('bcrypt');
const nodemailer = require('nodemailer');
const { check, validationResult } = require('express-validator');
const User = require('../models/User');
const { hashPassword } = require('../helpers/hashPassword');
const router = express.Router();

router.post(
  '/register',
  [
    check('name', 'Name is required').not().isEmpty(),
    check('email', 'Please include a valid email address').isEmail(),
    check(
      'password',
      'Please enter a password with in 6 or more characters'
    ).isLength({ min: 6 }),
  ],
  async (req, res) => {
    const errors = validationResult(req);
    let { name, email, password } = req.body;

    if (!errors.isEmpty())
      return res.status(400).json({ errors: errors.array() });

    try {
      // const salt = await bcrypt.genSalt(10);
      // password = await bcrypt.hash(password, salt);
      password = await hashPassword(password);
      let user = await User.findOne({ email });

      if (user) return res.status(400).json({ msg: 'User already exists' });

      const token = jwt.sign({ name, email, password }, 'secret', {
        expiresIn: '15m',
      });

      let transporter = nodemailer.createTransport({
        service: 'gmail',
        auth: {
          user: 'hasibmolla325@gmail.com',
          pass: '12@#Islam',
        },
      });

      await transporter.sendMail({
        from: `"MERN Social Auth" <hasibmolla325@gmail.com>`, // sender address
        to: email, // list of receivers
        subject: 'Account activation link', // Subject line
        text: 'Hello world?', // plain text body
        html: `
        <h1>Please active your account</h1>
          <p>${process.env.CLIENT_URL}/users/active/${token}</p>
        `, // html body
      });

      res.status(200).json({ msg: `Email has sent to ${email}` });
    } catch (err) {
      console.error(err.message);
      return res.status(400).json({
        msg: errorHandler(err),
      });
    }
  }
);

router.post(
  '/login',
  [
    check('email', 'Please include a valid email address').isEmail(),
    check('password', 'Password is required').exists(),
  ],
  async (req, res) => {
    const errors = validationResult(req);
    const { email, password } = req.body;

    if (!errors.isEmpty())
      return res.status(400).json({ errors: errors.array() });

    try {
      let user = await User.findOne({ email });

      if (!user) return res.status(400).json({ msg: 'User not founded' });

      const isMatch = await bcrypt.compare(password, user.password);
      if (!isMatch) return res.status(400).json({ msg: 'Wrong password' });

      const payload = {
        user: {
          id: user.id,
        },
      };

      const token = await jwt.sign({ payload }, 'secret', { expiresIn: '7d' });

      const getUser = await User.findById(user._id).select('-password');

      return res.json({ token, user: getUser });
    } catch (err) {
      console.error(err.message);
      return res.status(400).json({
        msg: errorHandler(err),
      });
    }
  }
);

module.exports = router;
