import React, {Fragment,useEffect} from 'react';
import {BrowserRouter as Router, Route, Switch } from 'react-router-dom';
import Navbar from './components/layout/Navbar';
import Landing from './components/layout/Landing';
import Register from './components/auth/Register';
import Login from './components/auth/Login';
import Alert from './components/layout/Alert';
import './App.css';
import setAuthToken from './utils/setAuthToken';
import {loadUser} from './actions/auth.js';

// redux
import {Provider} from 'react-redux';
import store from './store';


if(!localStorage.token){
    setAuthToken(localStorage.token);    // just adds to x-auth-token=(token taken from localStorage
}

const App = () => {
  useEffect(() => {
      store.dispatch(loadUser());    //  loadUser() this checks if the user exists in the /api/auth route which contains user
  },[]);
  //  SWITCH section This below can have only routes
  return (
    <Provider store={store}>
      <Router>
        <Fragment>
          <Navbar/>
          <Route exact path = '/' component={Landing}/>

          <section className = "container">
            <Alert/>

            <Switch>
              <Route exact path = '/register' component={Register}/>
              <Route exact path = '/login' component={Login}/>
            </Switch>
          </section>
        </Fragment>
      </Router>
    </Provider>
  );

};

export default App;
