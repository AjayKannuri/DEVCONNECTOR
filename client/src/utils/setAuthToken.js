import axios from 'axios';

const setAuthToken= token =>{
  if(typeof token !== 'undefined'){
    console.log("x-auth-token is initialised",token);
    axios.defaults.headers.common['x-auth-token'] = token;
  }else {
    console.log("x-auth-token is not initialised",token);
    delete axios.defaults.headers.common['x-auth-token'];
  }
}

export default setAuthToken;
