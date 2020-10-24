const express = require('express');
const jwt = require('jsonwebtoken');
const { OAuth2Client } = require('google-auth-library');
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
        const { _id, name, email } = user;
        return res.status(200).json({ token, user: { _id, name, email } });
      } else {
        const password = await hashPassword(email + process.env.SECRET);

        user = await new User({ name, email, password });

        const data = await user.save();

        if (data) {
          const { _id, name, email } = data;
          const token = await jwt.sign({ _id }, process.env.SECRET, {
            expiresIn: '7d',
          });
          return res.status(200).json({ token, user: { _id, name, email } });
        }
      }
    } else {
      return res.status(400).json({ msg: 'Google sign in failed' });
    }
  } catch (err) {
    console.log(err);
    return res.status(500).json({ msg: errorHandler(err) });
  }
});

module.exports = router;
