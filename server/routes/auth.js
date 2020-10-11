const express = require('express');
const jwt = require('jsonwebtoken');
const bcrypt = require('bcrypt');
const nodemailer = require('nodemailer');
const { check, validationResult } = require('express-validator');
const User = require('../models/User');
const router = express.Router();

router.post(
  '/',
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
      const salt = await bcrypt.genSalt(10);
      password = await bcrypt.hash(password, salt);
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

module.exports = router;
