import React from 'react';
import { Consumer } from '../../App';
import { withRouter } from 'react-router-dom';


class Login extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
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
    const { email, password } = this.state;
    const user = { email, password }
    this.props.actions.loginUser(user, this.props.history);
  }

  render() {
    const { errors } = this.props.store;
    return (
      <div className="login">
        <div className="container">
          <div className="row">
            <div className="col-md-8 m-auto">
              <h1 className="display-4 text-center font-impact">Log In</h1>
              <p className="text-center">Sign in to your DevConnector account</p>
              <form noValidate onSubmit={this.handleSubmit}>
                <div className="form-group">
                  <input
                    type="email"
                    className={`form-control form-control-lg ${errors.email ? "is-invalid" : ""}`}
                    placeholder="Email Address"
                    name="email"
                    value={this.state.email}
                    onChange={this.handleChange}
                  />
                  {errors.email && (<div className="invalid-feedback">{errors.email}</div>)}
                </div>
                <div className="form-group">
                  <input
                    type="password"
                    className={`form-control form-control-lg ${errors.password ? "is-invalid" : ""}`}
                    placeholder="Password"
                    name="password"
                    value={this.state.password}
                    onChange={this.handleChange}
                  />
                  {errors.password && (<div className="invalid-feedback">{errors.password}</div>)}
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
    {props => (<Login {...props} history={history}/>)}
  </Consumer>
));