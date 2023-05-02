import jwt_decode from 'jwt-decode';
import axios from '../../axios';
import { LOGIN_SUCCESS, LOGIN_FAILURE, LOGOUT } from '../constants';

export const login = (userData, navigate) => dispatch => {
    
  axios.post('/api/auth', userData)
    .then(res => {
      const { token } = res.data;
      const decoded = jwt_decode(token);
      dispatch({
        type: LOGIN_SUCCESS,
        payload: {
          token,
          user: decoded
        }
      });
      navigate("/home");
    })
    .catch(err => {
      dispatch({
        type: LOGIN_FAILURE,
        payload: err.response.data
      });
    });
};

export const logout = () => dispatch => {
  dispatch({ type: LOGOUT });
};
