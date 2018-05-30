import React from 'react';
import { Link } from 'react-router-dom';
import { Consumer } from '../../App';

class Navbar extends React.Component {
  constructor(props) {
    super(props);
    this.state = {  };
  }

  render() {
    const { isAuthenticated } = this.props.store.currentUser;

    let navLinks;
    if (isAuthenticated) {
      navLinks = (
        <ul className="navbar-nav ml-auto">
          <li className="nav-item">
            <a className="nav-link" href="" onClick={this.props.actions.logoutUser}>Logout</a>
          </li>
        </ul>
      )
    }
    else {
      navLinks = (
        <ul className="navbar-nav ml-auto">
          <li className="nav-item">
            <Link className="nav-link" to="/register">Sign Up</Link>
          </li>
          <li className="nav-item">
            <Link className="nav-link" to="/login">Login</Link>
          </li>
        </ul>
      )
    }

    return (
      <nav className="navbar navbar-expand-sm navbar-dark bg-info mb-4">
        <div className="container">
          <Link className="navbar-brand font-impact" style={{fontSize: "1.6rem"}} to="/">User Dashboard</Link>
          <button className="navbar-toggler" type="button" data-toggle="collapse" data-target="#mobile-nav">
            <span className="navbar-toggler-icon"></span>
          </button>
          <div className="collapse navbar-collapse" id="mobile-nav">
            {navLinks}
          </div>
        </div>
      </nav>
    );
  }
}

export default () => (
  <Consumer>
    {props => (<Navbar {...props} />)}
  </Consumer>
);