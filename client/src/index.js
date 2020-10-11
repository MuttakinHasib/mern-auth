import React from 'react';
import ReactDOM from 'react-dom';
// import './index.css';
import { BrowserRouter as Router, Route, Switch } from 'react-router-dom';

import App from './App';
import 'tailwindcss/dist/tailwind.min.css'
import 'react-toastify/dist/ReactToastify.css'
import Register from './screens/Register/Register';
import Activation from './screens/Activation/Activation';

ReactDOM.render(
  <Router>
    <Switch>
      <Route path='/' exact render={props => <App {...props} />} />
      <Route path='/register' exact render={props => <Register {...props} />} />
      <Route path='/users/active/:token' exact render={props => <Activation {...props} />} />
    </Switch>
  </Router>,
  document.getElementById('root')
);
