import axios from 'axios';
import {
  REGISTER_SUCCESS,
  REGISTER_FAIL,
  USER_LOADED,
  AUTH_ERROR,
  LOGIN_SUCCESS,
  LOGIN_FAIL,
  LOGOUT,
  CLEAR_PROFILE
} from './types';
import {setAlert} from './alert';
import setAuthToken from '../utils/setAuthToken';

// Load User
export const loadUser = () => async dispatch=> {
    if(typeof localStorage.token !== 'undefined'){
        setAuthToken(localStorage.token);    // adds x-auth-token = localstorage.token
      //  console.log("the token is added to x-auth-token of that page.... from loadUser() setAuthToken,, this is token",localStorage.token);
    }
    try{
        const res = await axios.get('/api/auth');     // if there is no token it return invalid res otherwise user from middleware/auth.js
        console.log("below is res of get /api/auth");
        console.log(res.data);
        dispatch({
          type : USER_LOADED,
          payload : res.data      // this contains total user
        });
    }catch(err)
    {
      dispatch({
        type : AUTH_ERROR
      });
    }
}

// Register user
export const register = ({ name, email, password }) => async dispatch => {
      const config = {
        headers: {
          'Content-Type': 'application/json'
        }
      };

      const body = JSON.stringify({ name, email, password });

      try {
        const res = await axios.post('/api/users', body, config);

        dispatch({
          type: REGISTER_SUCCESS,
          payload: res.data       // this contains only token
        });
        dispatch(loadUser());
        //alert("new User created successfully");

      //  loadUser();
      } catch (err) {
        const errors = err.response.data.errors;

        if (errors) {
          errors.forEach(error => dispatch(setAlert(error.msg, 'danger')));
        }

        dispatch({
          type: REGISTER_FAIL
        });
      }
};


// Login User
export const login = (email, password) => async dispatch => {
      const config = {
        headers: {
          'Content-Type': 'application/json'
        }
      };

      const body = JSON.stringify({email, password });

      try {
        const res = await axios.post('/api/auth', body, config);

        dispatch({
          type: LOGIN_SUCCESS,
          payload: res.data       // this contains only token
        });
        dispatch(loadUser());  // after that user should be loaded
        //alert("Logged in successfully");

        //loadUser();
      } catch (err) {
        const errors = err.response.data.errors;

        if (errors) {
          errors.forEach(error => dispatch(setAlert(error.msg, 'danger')));
        }

        dispatch({
          type: LOGIN_FAIL
        });
      }
};

// Logout / Clear profile
export const logout = () => dispatch =>{
  dispatch({
    type:CLEAR_PROFILE
  });
  dispatch({
    type:LOGOUT
  });

};
