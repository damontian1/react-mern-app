import React from 'react';
import { Consumer } from '../../App';
import { Link } from 'react-router-dom';


class Profile extends React.Component {
  componentDidMount() {
    this.props.actions.getCurrentProfile();
  }
  render() {
    const { isAuthenticated } = this.props.store.currentUser;
    const { profile } = this.props.store;
    let profileContent;
    if (profile) {
      profileContent = (
        <React.Fragment>
          <div className="pricing-header px-3 py-3 pb-md-4 mx-auto text-center">
            <img src={profile.user &&  profile.user.avatar} style={{borderRadius: "100%"}}/>
            <h1 className="display-4">{profile.user && profile.user.name}</h1>
            <p className="lead">Lorem ipsum dolor sit amet consectetur adipisicing elit. Enim praesentium itaque doloribus? Laboriosam, cupiditate? Obcaecati quo enim sapiente aliquam reprehenderit quis. Amet dicta minima consectetur eaque deserunt rerum ipsum illum.</p>
          </div>
          <div className="card-deck mb-3 text-center">
            <div className="card mb-auto box-shadow">
              <div className="card-header">
                <h4 className="my-0 font-weight-normal">Skills</h4>
              </div>
              <div className="card-body">
                <ul className="list-unstyled mt-3 mb-4">
                  {profile.skills}
                </ul>
              </div>
            </div>
            <div className="card mb-auto box-shadow">
              <div className="card-header">
                <h4 className="my-0 font-weight-normal">Location</h4>
              </div>
              <div className="card-body">
                <ul className="list-unstyled mt-3 mb-4">
                  <li>{profile.location}</li>
                </ul>
              </div>
            </div>
            <div className="card mb-auto box-shadow">
              <div className="card-header">
                <h4 className="my-0 font-weight-normal">Status</h4>
              </div>
              <div className="card-body">
                <ul className="list-unstyled mt-3 mb-4">
                  <li>{profile.status}</li>
                </ul>
              </div>
            </div>
          </div>
        </React.Fragment>
      )
    }
    else {
      profileContent = (
        <React.Fragment>
          <h4>Profile doesn't exist</h4>
          <Link className="btn btn-warning btn-lg" to="/register-profile">Set up your profile now</Link>
        </React.Fragment>
      )
    }

    return (
      <React.Fragment>
        {profileContent}
      </React.Fragment>
    );

  }
}

export default () => (
  <Consumer>
    {props => (<Profile {...props} />)}
  </Consumer>
);