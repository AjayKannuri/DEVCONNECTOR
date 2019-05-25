import React,{Fragment, useEffect} from 'react';
import {connect } from 'react-redux';
import {Link} from 'react-router-dom';
import {getCurrentProfile , deleteAccount} from '../../actions/profile';
import Spinner from '../layout/Spinner';
import DashBoardActions from './DashBoardActions';
import Experience from './Experience';
import Education from './Education';

const Dashboard = props =>{

  useEffect(() =>{
    props.getCurrentProfile();        // have to think to remove or add props here
    console.log("this getCurrentProfile is called from Dashboard.js");
  },[props.profile.loading,props.getCurrentProfile]);

  return props.auth.loading && props.profile.profile===null ? <Spinner /> :
  (
    <Fragment>
        <h1 className='large text-primary'>Dashboard</h1>
        <p className='lead'>
          <i className='fas fa-user' /> Welcome {props.auth.user && props.auth.user.name}
        </p>
        { props.profile.profile !== null ? (
            <Fragment>
              <DashBoardActions/>
              <Experience experience={props.profile.profile.experience} />
              <Education education={props.profile.profile.education} />
              <div className='my-2'>
                <button className='btn btn-danger' onClick={() => props.deleteAccount()}>
                  <i className='fas fa-user-minus' /> Delete My Account
                </button>
              </div>
            </Fragment>
          ) : (
            <Fragment>
                <p>You have not yet setup a profile, please add some info</p>
                <Link to='/create-profile' className='btn btn-primary my-1'>
                  Create Profile
                </Link>
                <div className='my-2'>
                  <button className='btn btn-danger' onClick={() => props.deleteAccount()}>
                    <i className='fas fa-user-minus' /> Delete My Account
                  </button>
                </div>
            </Fragment>
          )
        }

    </Fragment>

  );
};

const mapStateToProps = state => ({
      auth : state.auth,
      profile : state.profile
});
export default connect(mapStateToProps, {getCurrentProfile, deleteAccount}) (Dashboard);
