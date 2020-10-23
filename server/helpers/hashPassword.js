const bcrypt = require('bcrypt');

exports.hashPassword = async password => {
  try {
    const salt = await bcrypt.genSalt(10);
    const hashed = await bcrypt.hash(password, salt);
    return hashed;
  } catch (err) {
    console.log(err);
  }
};
