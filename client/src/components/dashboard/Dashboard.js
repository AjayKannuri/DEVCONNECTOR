import React,{Fragment, useEffect} from 'react';
import {connect } from 'react-redux';
import {getCurrentProfile} from '../../actions/profile';
import Spinner from '../layout/Spinner';

const Dashboard = props =>{

  useEffect(() =>{
    props.getCurrentProfile();        // have to think to remove or add props here
  },[]);

  return props.auth.loading && props.profile.profile===null ? <Spinner /> :
  (
    <Fragment>
        <h1 className='large text-primary'>Dashboard</h1>
        <p className='lead'>
          <i className='fas fa-user' /> Welcome {props.auth.user && props.auth.user.name}
        </p>
        { props.profile.profile !== null ? (
            <Fragment>
              has
            </Fragment>
          ) : (
            <Fragment>
              has not
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
export default connect(mapStateToProps, {getCurrentProfile}) (Dashboard);
