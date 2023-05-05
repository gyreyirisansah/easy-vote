import React from 'react';
import { Navigate } from 'react-router-dom';
import { connect } from 'react-redux';
import jwtDecode from 'jwt-decode';
import { useSelector } from 'react-redux';

const PrivateRoute = ({children }) => {
  const token = localStorage.getItem('token');
  // const isAuthenticated = useSelector(state => state.auth.isAuthenticated)
  const isTokenExpired = () => {
    if (token) {
      const decodedToken = jwtDecode(token);
      const isExp = decodedToken.exp * 1000 < Date.now();
      return isExp
    }
    return true;
  };

  return !isTokenExpired() ? <>{children}</> : <Navigate to="/login" />;
};

// const mapStateToProps = state => ({
//   isAuthenticated: state.auth.isAuthenticated
// });

// export default connect(mapStateToProps)(PrivateRoute);
export default PrivateRoute;