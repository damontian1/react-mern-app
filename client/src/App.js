import React, { Component, createContext } from 'react';
import Navbar from './components/layout/Navbar';
import Home from './components/layout/Home';
import Login from './components/auth/Login';
import Register from './components/auth/Register';
import Profile from './components/auth/Profile';
import jwtDecode from 'jwt-decode';
import { BrowserRouter, Route } from 'react-router-dom';
import './App.css';
import axios from 'axios';
import PrivateRoute from './components/auth/PrivateRoute';
import RegisterProfile from './components/auth/RegisterProfile';

const Context = createContext();
export const { Provider, Consumer } = Context;

class App extends Component {
  constructor() {
    super();
    this.state = {
      errors: {},
      currentUser: {
        isAuthenticated: false,
        user: {}
      },
      profile: {}
    }
  }

  componentWillMount() {
    if (localStorage.token) {
      // axios.defaults.headers.common['Authorization'] = localStorage.token;
      const decoded = jwtDecode(localStorage.token);
      this.setState({currentUser: {...this.state.currentUser, isAuthenticated: true, user: decoded}})
    }
  }

  render() {
    return (
      <Provider value={{
        store: this.state,
        actions: {
          registerUser: (newUser) => {
            axios.post("/api/users/register", newUser)
              .then(res => {
                window.location.href = "/login"
              })
              .catch(err => this.setState({errors: err.response.data}))
          },
          loginUser: (user, history) => {
            axios.post("/api/users/login", user)
              .then(res => {
                const { token } = res.data;
                localStorage.setItem("token", token);
                const decoded = jwtDecode(token);
                if (decoded) this.setState({currentUser: {...this.state.currentUser, isAuthenticated: true, user: decoded}})
                history.push("/profile")
              })
              .catch(err => this.setState({errors: err.response.data}))
          },
          logoutUser: () => {
            localStorage.removeItem("token");
            window.location.href = "/login"
          },
          getCurrentProfile: () => {
            if (localStorage.token) {
              axios.get("/api/profile", { headers: {"Authorization" : localStorage.token} })
                .then(res => this.setState({profile: res.data}))
                .catch(err => console.log(err.response.data))
            }
            else {
              window.location.href = "/login";
            }
          },
          createProfile: (newProfile, history) => {
            axios.post("/api/profile", newProfile, { headers: {"Authorization" : localStorage.token}})
              .then(profile => console.log(profile))
            history.push("/profile")
          }
        }
      }}>
        <BrowserRouter>
          <div className="App">
            <Navbar />
            <div className="container">
              <Route exact path="/" component={Home}/>
              <Route exact path="/login" component={Login}/>
              <Route exact path="/register" component={Register}/>
              <PrivateRoute exact path="/profile" component={Profile} authed={this.state.currentUser.isAuthenticated} />
              <PrivateRoute exact path="/register-profile" component={RegisterProfile} authed={this.state.currentUser.isAuthenticated} />
            </div>
          </div>
        </BrowserRouter>
      </Provider>
    );
  }
}

export default App;
