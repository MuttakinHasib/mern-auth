const express = require('express');
const jwt = require('jsonwebtoken');
const axios = require('axios');
const { errorHandler } = require('../helpers/errorHandling');
const User = require('../models/User');
const { hashPassword } = require('../helpers/hashPassword');
const router = express.Router();

router.post('/', async (req, res) => {
  const { userID, accessToken } = req.body;
  const url = `https://graph.facebook.com/v2.11/${userID}?fields=id,name,email&access_token=${accessToken}`;
  try {
    const { data } = await axios.get(url);
    const { email, name } = data;
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
  } catch (err) {
    console.error(err.message);
    return res.status(500).json({ msg: errorHandler(err) });
  }
});

module.exports = router;
