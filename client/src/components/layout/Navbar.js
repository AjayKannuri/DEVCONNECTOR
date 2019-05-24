import React from 'react';
import {Link} from 'react-router-dom';
import {connect} from 'react-redux';
import {logout} from '../../actions/auth';

const Navbar = (props) => {

  const authLinks ={
    <ul>
      <li><Link to="/dashboard">Developers</Link></li>
      <li><Link to="/register">Register</Link></li>
      <li><Link to="/login">Login</Link></li>
    </ul>
  };

  const guestLinks ={
    <ul>
      <li><Link to="/dashboard">Developers</Link></li>
      <li><Link to="/register">Register</Link></li>
      <li><Link to="/login">Login</Link></li>
    </ul>
  };
  return (
    <nav className="navbar bg-dark">
      <h1>
        <Link to="/">
          <i className='fas fa-code' /> DevConnector
        </Link>
      </h1>
      <ul>
        <li><Link to="/dashboard">Developers</Link></li>
        <li><Link to="/register">Register</Link></li>
        <li><Link to="/login">Login</Link></li>
      </ul>
    </nav>
  );
}

const mapStateToProps = state => ({
      auth : state.auth
});

export default connect(mapStateToProps , {logout})(Navbar);

export default Navbar;
