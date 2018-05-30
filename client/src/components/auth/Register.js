import React from 'react';
import { Consumer } from '../../App';
import { withRouter } from 'react-router-dom';


class Register extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      name: "",
      email: "",
      password: ""
    };
  }

  componentWillMount() {
    if (this.props.store.currentUser.isAuthenticated) {
      this.props.history.push("/")
    }
  }

  handleChange = e => this.setState({[e.target.name]: e.target.value})
  handleSubmit = e => {
    e.preventDefault();
    const { name, email, password } = this.state;
    const newUser = { name, email, password }
    this.props.actions.registerUser(newUser);
  }

  render() {
    const { errors } = this.props.store;
    return (
      <div className="register">
        <div className="container">
          <div className="row">
            <div className="col-md-8 m-auto">
              <h1 className="display-4 text-center font-impact">Sign Up</h1>
              <p className="text-center">Create your DevConnector account</p>
              <form onSubmit={this.handleSubmit}>
                <div className="form-group">
                  <input
                    type="text"
                    className={`form-control form-control-lg ${errors.name ? "is-invalid" : ""}`}
                    placeholder="Name"
                    name="name"
                    value={this.state.name}
                    onChange={this.handleChange}
                  />
                  {errors.name && (<div className="invalid-feedback">{errors.name}</div>) }
                </div>
                <div className="form-group">
                  <input
                    type="email"
                    className={`form-control form-control-lg ${errors.name ? "is-invalid" : ""}`}
                    placeholder="Email Address"
                    name="email"
                    value={this.state.email}
                    onChange={this.handleChange}
                  />
                  {errors.email && (<div className="invalid-feedback">{errors.email}</div>) }
                  <small>Enter a Gravatar email if you have one</small>
                </div>
                <div className="form-group">
                  <input
                    type="password"
                    className={`form-control form-control-lg ${errors.name ? "is-invalid" : ""}`}
                    placeholder="Password"
                    name="password"
                    value={this.state.password}
                    onChange={this.handleChange}
                  />
                  {errors.password && (<div className="invalid-feedback">{errors.password}</div>) }
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
    {props => (<Register {...props} history={history}/>)}
  </Consumer>
));