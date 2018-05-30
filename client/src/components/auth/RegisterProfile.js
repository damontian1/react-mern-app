import React from 'react';
import { Consumer } from '../../App';
import { withRouter } from 'react-router-dom';


class RegisterProfile extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      status: "",
      skills: "",
      location: "",
      github: ""
    };
  }

  handleChange = e => this.setState({ [e.target.name]:e.target.value })
  handleSubmit = e => {
    e.preventDefault();
    const { status, skills, location, github } = this.state;
    const newProfile = { status, skills, location, github };
    this.props.actions.createProfile(newProfile, this.props.history);
  }

  render() {
    return (
      <div className="register-profile">
        <div className="container">
          <div className="row">
            <div className="col-md-8 m-auto">
              <h1 className="display-4 text-center font-impact">Register Your Profile</h1>
              <form onSubmit={this.handleSubmit}>
                <div className="form-group">
                  <input
                    type="text"
                    className={`form-control form-control-lg`}
                    placeholder="Status"
                    name="status"
                    value={this.state.status}
                    onChange={this.handleChange}
                  />
                </div>
                <div className="form-group">
                  <input
                    type="text"
                    className={`form-control form-control-lg`}
                    placeholder="Skills"
                    name="skills"
                    value={this.state.skills}
                    onChange={this.handleChange}
                  />
                </div>
                <div className="form-group">
                  <input
                    type="text"
                    className={`form-control form-control-lg`}
                    placeholder="Location"
                    name="location"
                    value={this.state.location}
                    onChange={this.handleChange}
                  />
                </div>

                <div className="form-group">
                  <input
                    type="text"
                    className={`form-control form-control-lg`}
                    placeholder="GitHub"
                    name="github"
                    value={this.state.github}
                    onChange={this.handleChange}
                  />
                </div>
                <input type="submit" className="btn btn-warning btn-block mt-4" />
              </form>
            </div>
          </div>
        </div>
      </div>
    );
  }
}

export default withRouter(({history}) => (
  <Consumer>
    {props => (<RegisterProfile {...props} history={history}/>)}
  </Consumer>
));