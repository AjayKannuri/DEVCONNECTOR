import React,{Fragment} from 'react';
import {Link} from 'react-router-dom';
import {connect} from 'react-redux';
import {logout} from '../../actions/auth';

const Navbar = (props) => {

  const authLinks =(
    <ul>
      <li>
          <Link to="/Profiles">
              Developers
          </Link>
      </li>
      <li>
          <Link to="/dashboard">
              <i className='fas fa-user' />{' '}
              <span className="hide-sm">Dashboard</span>
          </Link>
      </li>
      <li>
        <a onClick = {props.logout} href="/dashboard">
          <i className='fas fa-sign-out-alt' />{' '}
          <span className="hide-sm">Logout</span>
        </a>
      </li>
    </ul>
  );

  const guestLinks =(
    <ul>
    <li><Link to="/Profiles">Developers</Link></li>
      <li><Link to="/register">Register</Link></li>
      <li><Link to="/login">Login</Link></li>
    </ul>
  );
  return (
    <nav className="navbar bg-dark">
      <h1>
        <Link to="/">
          <i className='fas fa-code' /> DevConnector
        </Link>
      </h1>
      {!props.auth.loading && (<Fragment> { props.auth.isAuthenticated ? authLinks : guestLinks}</Fragment>)}
    </nav>
  );
};

const mapStateToProps = state => ({
      auth : state.auth
});

export default connect(mapStateToProps , {logout})(Navbar);
