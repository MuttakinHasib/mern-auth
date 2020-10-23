import React from 'react';
import ReactDOM from 'react-dom';
// import './index.css';
import { BrowserRouter as Router, Route, Switch } from 'react-router-dom';

import App from './App';
import 'tailwindcss/dist/tailwind.min.css'
import 'react-toastify/dist/ReactToastify.css'
import Register from './screens/Register/Register';
import Activation from './screens/Activation/Activation';
import Login from './screens/Login/Login';
import ForgetPassword from './screens/ForgetPassword/ForgetPassword';
import ResetPassword from './screens/ResetPassword/ResetPassword';

ReactDOM.render(
  <Router>
    <Switch>
      <Route path='/' exact render={props => <App {...props} />} />
      <Route path='/register' exact render={props => <Register {...props} />} />
      <Route path='/login' exact render={props => <Login {...props} />} />
      <Route path='/users/password/forget' exact render={props => <ForgetPassword {...props} />} />
      <Route path='/users/active/:token' exact render={props => <Activation {...props} />} />
      <Route path='/users/password/reset/:token' exact render={props => <ResetPassword {...props} />} />
    </Switch>
  </Router>,
  document.getElementById('root')
);
