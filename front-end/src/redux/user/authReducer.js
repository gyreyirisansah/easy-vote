import { LOGIN_SUCCESS, LOGIN_FAILURE, LOGOUT } from '../constants';

const initialState = {
  token: localStorage.getItem('token'),
  isAuthenticated: null,
  user: null
};

export const authReducer =(state = initialState, action) => {
  switch (action.type) {
    case LOGIN_SUCCESS:
      localStorage.setItem('token', action.payload.token);
      return {
        ...state,
        ...action.payload,
        isAuthenticated: true
      };
    case LOGIN_FAILURE:
    case LOGOUT:
      localStorage.removeItem('token');
      return {
        ...state,
        token: null,
        isAuthenticated: false,
        user: null
      };
    default:
      return state;
  }
}
