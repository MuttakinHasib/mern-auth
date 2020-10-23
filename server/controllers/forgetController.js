const express = require('express');
const { check, validationResult } = require('express-validator');
const jwt = require('jsonwebtoken');
const nodemailer = require('nodemailer');
// const { errorHandler } = require('../helpers/errorHandling');
const User = require('../models/User');
const router = express.Router();

router.post(
  '/',
  [check('email', 'Please include a valid email address').isEmail()],
  async (req, res) => {
    const errors = validationResult(req);
    const { email } = req.body;

    if (!errors.isEmpty())
      return res.status(400).json({ errors: errors.array() });

    try {
      const user = await User.findOne({ email });
      if (!user) return res.status(400).json({ msg: 'User does not exists' });

      const token = await jwt.sign({ _id: user._id }, 'Secret', {
        expiresIn: '10m',
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
        subject: 'Password rest link', // Subject line
        text: 'Hello world?', // plain text body
        html: `
        <h1>Please click to link to rest your password</h1>
          <p>${process.env.CLIENT_URL}/users/password/reset/${token}</p>
        `, // html body
      });

      res
        .status(200)
        .json({ msg: `Email has sent to ${email}, Please Check your email` });
    } catch (err) {
      console.error(err.message);
      return res.status(500).json({
        msg: 'Something went wrong',
      });
    }
  }
);

module.exports = router;
