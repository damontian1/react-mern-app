import { Redirect, Route } from 'react-router-dom';
import React from 'react';


function PrivateRoute ({component: Component, authed, ...rest}) {
  return (
    <Route
      {...rest}
      render={(props) => authed === true
        ? <Component {...props} />
        : <Redirect to={{pathname: '/login'}} />}
    />
  )
}

export default PrivateRoute;