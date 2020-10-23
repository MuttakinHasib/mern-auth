const express = require('express');
const jwt = require('jsonwebtoken');
const nodemailer = require('nodemailer');
const { OAuth2Client } = require('google-auth-library');
const { check, validationResult } = require('express-validator');
const { errorHandler } = require('../helpers/errorHandling');
const User = require('../models/User');
const { hashPassword } = require('../helpers/hashPassword');
const router = express.Router();
const client = new OAuth2Client(process.env.GOOGLE_CLIENT);

router.post('/', async (req, res) => {
  try {
    const { idToken } = await req.body;

    const {
      payload: { email_verified, name, email },
    } = await client.verifyIdToken({
      idToken,
      audience: process.env.GOOGLE_CLIENT,
    });

    if (email_verified) {
      let user = await User.findOne({ email });

      if (user) {
        const token = await jwt.sign({ _id: user._id }, process.env.SECRET, {
          expiresIn: '7d',
        });

        return res.status(200).json({ token, user });
      } else {
        const password = await hashPassword(email + process.env.SECRET);

        user = await new User({ name, email, password });

        const data = await user.save();

        const token = await jwt.sign({ _id: data._id }, process.env.SECRET, {
          expiresIn: '7d',
        });
        return res.status(200).json({ token, user: data });
      }
    } else {
      return res.status(400).json({ msg: 'Google sign in failed' });
    }
  } catch (err) {
    console.log(err);
    return res.status(500).json({ msg: err.message });
  }
});

module.exports = router;
