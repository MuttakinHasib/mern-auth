const express = require('express');
const path = require('path');
const dotenv = require('dotenv');
const bodyParser = require('body-parser');
const cookieParser = require('cookie-parser');
const cors = require('cors');
const connectDB = require('./configs/db');
const morgan = require('morgan');

dotenv.config({
  path: path.resolve(__dirname, './configs/config.env'),
});

const app = express();

connectDB();
app.use(cors());
app.use(bodyParser.urlencoded({ extended: true }));
app.use(bodyParser.json());
app.use(cookieParser());

app.use('/api/user/', require('./routes/auth'));
app.use('/api/user/', require('./routes/auth'));
app.use('/api/user/activation', require('./controllers/activationController'));
app.use('/api/password/forget', require('./controllers/forgetController'));
app.use('/api/password/forget', require('./controllers/forgetController'));
app.use('/api/resetPassword', require('./controllers/resetController'));

app.use('/api/googleLogin', require('./controllers/googleLoginController'));
app.use('/api/facebookLogin', require('./controllers/facebookLoginController'));

const port = process.env.PORT || 9000;
app.listen(port, () => console.log(`Running on : ${port}`));
